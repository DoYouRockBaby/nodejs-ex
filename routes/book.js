module.exports = function(app, db)
{
	BookRepository = require('../repository/BookRepository.js')
	var bookRepository = new BookRepository(db);
	
	//GET a list of all the books
	app.get('/book/list', function(req, res)
	{
		bookRepository.findAll(function(err, books) {
			res.render('list', {books : books});
		});
	});

	//GET the add book form
	app.get('/book/add', function(req, res)
	{
		res.render('add');
	});

	//GET a single book page
	app.get('/book/:bookId', function(req, res)
	{
		bookRepository.findByIsbn(req.params.bookId, function(err, book) {
			res.render('detail', {book : book});
		});
	});

	//POST a new book
	app.post('/book/add', function(req, res)
	{
		var book = {};
		
		if(typeof req.body.isbn !== 'undefined' && req.body.isbn) book.isbn = req.body.isbn;
		if(typeof req.body.title !== 'undefined' && req.body.title) book.title = req.body.title;
		if(typeof req.body.author !== 'undefined' && req.body.author) book.author = req.body.author;
		if(typeof req.body.buyingDate !== 'undefined' && req.body.buyingDate) book.buyingDate = req.body.buyingDate;
		if(typeof req.body.state !== 'undefined' && req.body.state) book.state = req.body.state;
		if(typeof req.body.thematics !== 'undefined' && req.body.thematics) book.thematics = req.body.thematics.trim().split(',');
		
		bookRepository.insert(book, function(err, item) {
			if(item) {
				res.redirect('/book/list');
			} else {
				res.render('add', {err : err, book : book});
			}
		});
	});
	
	//POST remove a book
	app.post('/book/:bookId/delete', function(req, res)
	{
		bookRepository.removeByIsbn(req.params.bookId, function(err, book) {
			res.redirect('/book/list');
		});
	});

	//POST borrow a book
	app.post('/book/:bookId/borrow', function(req, res)
	{
		var borrowName = req.body.borrowName;
		var borrowDate = req.body.borrowDate;
		
		var err = [];
		if(typeof borrowName == 'undefined' || !borrowName) {
			err.push(Error('Missing argument : borrowName'));
		}
	
		if(typeof borrowDate === 'string' || borrowDate instanceof String) {
			date = Date.parse(borrowDate);
			if(date == NaN) {
				errors.push('Incorrect argument : borrowDate has wrong date format');
			}
		} else {
			errors.push('Missing argument : borrowDate');
		}
	
		if(!borrowDate instanceof Date) {
			err.push(Error('Incorrect argument : borrowDate, should be a date'));
		}
		
		if(typeof borrowDate == 'undefined' || !borrowDate) {
			err.push(Error('Missing argument : borrowDate'));
		}
		
		if(err.length > 0) {
			res.redirect('/book/' + req.params.bookId);
		} else {
			bookRepository.update(req.params.bookId, {borrow : {name : borrowName, date : borrowDate}}, function(err, ret) {
				res.redirect('/book/' + req.params.bookId);
			});
		}
	});

	//POST unborrow a book
	app.post('/book/:bookId/unborrow', function(req, res)
	{
		bookRepository.unset(req.params.bookId, {borrow : ""}, function(err, ret) {
			res.redirect('/book/' + req.params.bookId);
		});
	});
}
