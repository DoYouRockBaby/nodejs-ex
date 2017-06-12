function BookRepository(db) {
	this.db = db;
}

BookRepository.prototype.findAll = function(callback) {
	db.collection('book').find().toArray(callback);
};

BookRepository.prototype.findByIsbn = function(isbn, callback) {
	db.collection('book').findOne({"isbn" : isbn}).toArray(callback);
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
	
	if(typeOf(book.isbn) == 'undefined' || !book.isbn) {
		errors.push(Error('Missing argument : isbn'));
	} else if(isNaN(book.isbn) || book.isbn.toString().length != 13) {
		errors.push(Error('Incorrect argument : isbn, should be a number with 13 characters'));
	}
	
	if(typeOf(book.title) == 'undefined' || !book.title) {
		errors.push(Error('Missing argument : title'));
	}
	
	if(typeOf(book.author) == 'undefined' || !book.author) {
		errors.push(Error('Missing argument : author'));
	}
	
	if(typeof book.buyingDate === 'string' || book.buyingDate instanceof String) {
		date = Date.parse(book.buyingDate);
		if(date == NaN) {
			errors.push(Error('Incorrect argument : buyingDate has wrong date format'));
		} else {
			book.buyingDate = date;
		}
	}
	
	if(!book.buyingDate instanceof Date) {
		errors.push(Error('Incorrect argument : buyingDate, should be a date'));
	}
	
	if(typeOf(book.state) == 'undefined' || !book.state) {
		errors.push(Error('Missing argument : state'));
	} else if(book.state != 0 && book.state != 1 && book.state != 2) {
		errors.push(Error('Incorrect argument : state, should be 0, 1 or 2'));
	}
	
	if(!(typeOf(book.thematics) == 'undefined' || !book.thematics) && !isStringArray(book.thematics)) {
		errors.push(Error('Incorrect argument : thematics, should be a string array'));
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

module.exports = BookRepository;