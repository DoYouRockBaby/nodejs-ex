module.exports = function(app, db)
{
	var bookRepository = require('../repository/BookRepository')(db);
	
	//GET a list of all the books
	app.get('/book/list', function(req, res)
	{
		bookRepository.findAll(function(err, books) {
			res.render('list', {books : books});
		});
	});

	//GET a single book page
	app.get('/book/:bookId', function(req, res)
	{
		bookRepository.findByIsbn(req.params.bookId, function(err, book) {
			res.render('detail', {book : book});
		});
	});

	//GET the add book form
	app.get('/book/add', function(req, res)
	{
		res.render('add');
	});

	//POST a new book
	app.post('/book/add', function(req, res)
	{
		var book = {
			isbn : req.body.isbn,
			title : req.body.title,
			author : req.body.author,
			buyingDate : req.body.buyingDate,
			state : req.body.state,
			thematics : req.body.thematics.trim().split(',')
		};
		
		bookRepository.insert(book, function(err, res) {
			if(res) {
				res.redirect('/book/list');
			} else {
				res.render('add', {book : book});
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
		if(typeOf(borrowName) == 'undefined' || !borrowName) {
			err.push(Error('Missing argument : borrowName'));
		}
	
		if(typeof borrowDate === 'string' || borrowDate instanceof String) {
			var date = Date.parse(borrowDate);
			if(date == NaN) {
				err.push(Error('Incorrect argument : borrowDate has wrong date format'));
			} else {
				borrowDate = date;
			}
		}
	
		if(!borrowDate instanceof Date) {
			err.push(Error('Incorrect argument : borrowDate, should be a date'));
		}
		
		if(typeOf(borrowDate) == 'undefined' || !borrowDate) {
			err.push(Error('Missing argument : borrowDate'));
		}
		
		if(err.length > 0) {
			res.redirect('/book/' + req.params.bookId);
		} else {
			bookRepository.update(req.params.bookId, {borrow : {name : borrowName, date : borrowDate}}, function(err, res) {
				res.redirect('/book/' + req.params.bookId);
			});
		}
	});

	//POST unborrow a book
	app.post('/book/:bookId/unborrow', function(req, res)
	{
		bookRepository.unset(req.params.bookId, {borrow : ""}, function(err, res) {
			res.redirect('/book/' + req.params.bookId);
		});
	});
}
