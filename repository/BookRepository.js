function BookRepository(db) {
	this.db = db;
}

BookRepository.prototype.findAll = function(callback) {
	db.collection('book').find().toArray(callback);
};

BookRepository.prototype.findByIsbn = function(isbn, callback) {
	db.collection('book').findOne({"isbn" : isbn}, callback);
};

BookRepository.prototype.removeByIsbn = function(isbn, callback) {
	db.collection('book').remove({"isbn" : isbn}, {safe: true}, callback);
};

var isStringArray = function(array) {
	if(!array instanceof Array) {
		return false;
	}
	
	array.forEach(function(element) {
		if(!typeof element === 'string' && !element instanceof String)  {
			return false;
		}
	});
	
	return true;
}

var verifyBook = function(book, callback) {
	var errors = [];
	
	console.log(book);
	
	if(typeof book.isbn == 'undefined' || !book.isbn) {
		errors.push('Missing argument : isbn');
	} else if(isNaN(book.isbn) || book.isbn.toString().length != 13) {
		errors.push('Incorrect argument : isbn, should be a number with 13 characters');
	}
	
	if(typeof book.title == 'undefined' || !book.title) {
		errors.push('Missing argument : title');
	}
	
	if(typeof book.author == 'undefined' || !book.author) {
		errors.push('Missing argument : author');
	}
	
	if(typeof book.buyingDate === 'string' || book.buyingDate instanceof String) {
		date = Date.parse(book.buyingDate);
		if(date == NaN) {
			errors.push('Incorrect argument : buyingDate has wrong date format');
		}
	} else {
		errors.push('Missing argument : buyingDate');
	}
	
	if(typeof book.state == 'undefined' || !book.state) {
		errors.push('Missing argument : state');
	} else if(book.state != 0 && book.state != 1 && book.state != 2) {
		errors.push('Incorrect argument : state, should be 0, 1 or 2');
	}
	
	if(!(typeof book.thematics == 'undefined' || !book.thematics) && !isStringArray(book.thematics)) {
		errors.push('Incorrect argument : thematics, should be a string array');
	}
	
	if(errors.length > 0) {
		return errors;
	} else {
		return true
	}
};

BookRepository.prototype.insert = function(book, callback) {
	var error = verifyBook(book);
	if(error != true) {
		callback(error, null);
	} else {
		db.collection('book').insert(book, callback);
	}
};

BookRepository.prototype.update = function(isbn, values, callback) {
	db.collection('book').update({"isbn" : isbn}, {$set: values}, callback);
};

BookRepository.prototype.unset = function(isbn, values, callback) {
	db.collection('book').update({"isbn" : isbn}, {$unset: values}, callback);
};

module.exports = BookRepository;