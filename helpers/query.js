var mysql = require('mysql')

var connectObj = {
	host: 'localhost',
	user: 'rtoews',
	password: '153846',
	database: 'memorize'
}

var queries = {
	bookId: 'SELECT book_id, book_name FROM bible_books WHERE book_name=?',

	passage: 'SELECT * FROM bible_niv WHERE bible_bookid=? AND bible_chapter=?',

	getDrill: 
		'SELECT id, tally, session_id FROM drill_results ' +
		'WHERE user_id=:user_id ' +
		'  AND text_table=:text_table ' +
		'  AND verse_id=:verse_id ' +
   		'  AND position_wrong=:position_wrong ',

	updateResult:
		'UPDATE drill_results ' +
		'SET tally=:tally, ' +
		'    date=:date, ' +
		'    session_id=:session_id ' +
		'WHERE id=:id ',

	addResult:
		'INSERT INTO drill_results (user_id, text_table, verse_id, position_wrong, tally, date, session_id) ' +
        'VALUES (:user_id, :text_table, :verse_id, :position_wrong, 1, :date, :session_id)'

}

var connection = mysql.createConnection(connectObj)

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function getDrillById(data) {
	return new Promise(function(resolve, reject) {
		var vals = []
		vals.push(data.user_id)
		vals.push(data.text_table)
		vals.push(data.verse_id)
		vals.push(data.position_wrong)
		connection.query(queries.getDrill, [vals], function(err, results) {
			if (err) reject(err)

			else {
				var payload = {
					id: results.id || -1,
					tally: results.tally,
					session_id: data.sessionID
				}
				resolve(payload)
			}
		})
	})
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function updateResult(data) {
	return new Promise(function(resolve, reject) {
	})
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function addResult(data) {
	return new Promise(function(resolve, reject) {
	})
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
exports.saveResult = function(data) {
	var p = getDrillById(data).then(function(response) {
		if (response.id !== -1) {
			if (response.session_id !== data.sessionID) {
				updateResult(data).then(function(response) {
				})
			}
		}
		else {
		}
	})
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function getBookId(book) {
	return new Promise(function(resolve, reject) {

		connection.query(queries.bookId, [book], function(err, results) {

			if (err) reject(err)

			else
				resolve(results[0])

		})
	})
}


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
exports.getPassage = function(book, chapter) {

	return getBookId(book).then(function(response) {

		var book_id = response.book_id

		return new Promise(function(resolve, reject) {
			connection.query(queries.passage, [book_id, chapter], function(err, results) {

				if (err) reject(err)

				else
					resolve(results.map(function(item) {
						item.bible_text = item.bible_text.toString('utf8')
						return item
					}))

			})
		})
	})

}
