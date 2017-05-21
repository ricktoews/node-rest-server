var refPattern = /^(.+)-(\d+)$/

function formatBookName(bookName) {
	bookName = bookName.replace('-', ' ')
	return bookName
}

exports.parse = function(ref) {
	var result = refPattern.exec(ref)
	var refObj = {}

	if (result) {
		refObj.book = formatBookName(result[1])
		refObj.chapter = result[2]
	}
	else {
		console.log('No match', ref)
	}

	return refObj
}
