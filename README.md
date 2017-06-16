TP No-SQL

To run the app with Docker Containers:

1. Install Docker for Windows or Docker for Mac (If you're on Windows 7 install Docker Toolbox: http://docker.com/toolbox).

2. Open a command prompt at the root of the application's folder.

3. Run `docker-compose build`

4. Run `docker-compose up`

5. Navigate to http://localhost:3000/book/list (http://192.168.99.100:3000/book/list if using Docker Toolbox) in your browser to view the site. This assumes that's the IP assigned to VirtualBox - change if needed.

To run the app with Node.js and MongoDB (without Docker):

1. Install and start MongoDB (https://docs.mongodb.org/manual/installation).

2. Install Node.js (http://nodejs.org).

3. Open `config/config.development.json` and adjust the host name to your MongoDB server name (`localhost` normally works if you're running locally). 

4. Run `npm install`.

5. Run `node server.js` to start the server.

6. Navigate to http://localhost:3000/book/list in your browser.

About the code, there are tree files:

1. The configuration of express and the access to the database is defined into server.js

2. The routes for the book pages are defined into routes/book.js

3. The function of database operations are defined into repository/BookRepository.js

Have fun !!!