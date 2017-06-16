function BookRepository(db) {
	this.db = db;
}

//Return all books presents in the database
BookRepository.prototype.findAll = function(callback) {
	db.collection('book').find().toArray(callback);
};

//Return a single book using isbn
BookRepository.prototype.findByIsbn = function(isbn, callback) {
	db.collection('book').findOne({"isbn" : isbn}, callback);
};

//Return a single book using isbn
BookRepository.prototype.removeByIsbn = function(isbn, callback) {
	db.collection('book').remove({"isbn" : isbn}, {safe: true}, callback);
};

//Return true if the parameter is an array of string
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

//Do verifications on a book object, return true if everithing is ok, return an array of string containing the error messages otherwise 
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

//Insert a book object into the database
BookRepository.prototype.insert = function(book, callback) {
	var error = verifyBook(book);
	if(error != true) {
		callback(error, null);
	} else {
		db.collection('book').insert(book, callback);
	}
};

//Update a book object, add somme values into the object, identify it by using isbn
BookRepository.prototype.update = function(isbn, values, callback) {
	db.collection('book').update({"isbn" : isbn}, {$set: values}, callback);
};

//Update a book object, remove somme values into the object, identify it by using isbn
BookRepository.prototype.unset = function(isbn, values, callback) {
	db.collection('book').update({"isbn" : isbn}, {$unset: values}, callback);
};

module.exports = BookRepository;