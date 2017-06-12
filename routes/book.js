module.exports = function(app, db)
{
	var bookRepository = require('../repository/BookRepository')(db);
	
	//GET a list of all the books
	app.get('/book/list', common.isLoggedIn, function(req, res)
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

	//GET the add book form
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

	//DELETE a book
	app.delete('/book/:bookId', common.isLoggedIn, function(req, res)
	{
		bookRepository.removeByIsbn(req.params.bookId, function(err, book) {
			res.redirect('/book/list');
		});
	});
}
