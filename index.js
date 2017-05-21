var express = require('express')

var bodyParser = require('body-parser')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)

var options = {
	host: 'localhost',
	port: 3306,
	user: 'rtoews',
	password: '153846',
	database: 'memorize'
}

var sessionStore = new MySQLStore(options)

var RefParser = require('./helpers/ref-parser')
var Passage = require('./helpers/passage')

var app = express()
app.use(bodyParser.json())
app.use(session({
	key: 'memorize_app',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: true,
	saveUninitialized: true
}))

app.get('/', function(req, res) {
	res.send('<h1>Hey there!</h1>')
})

app.get('/passage/:ref', function(req, res) {
	var ref = RefParser.parse(req.params.ref)
	Passage.get(ref).then(function(response) {
		res.send(response)
	})
})

app.put('/saveresult', function(req, res) {
	var data = req.body
	data.sessionID = req.sessionID

	res.send(data)
})

app.listen(3000, function() {
	console.log('Listening on port 3000.')
})
