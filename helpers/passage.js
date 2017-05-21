var Query = require('./query')

function passageLookup(refObj) {
	return Query.getPassage(refObj.book, refObj.chapter).then(function(response) {
		return response
	})
}

exports.get = function(refObj) {
	return passageLookup(refObj).then(function(response) {
		return response
	})
}
