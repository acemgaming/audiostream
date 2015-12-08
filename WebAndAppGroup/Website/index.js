//Load modules
var express = require('express');
var colors = require('colors');
var jquery = require('jquery');
var mysql = require('mysql');
var http = require('http');

var app = express();
var port = 8000;

var pool = mysql.createPool({
    host     : 'rei.cs.ndsu.nodak.edu',
    user     : 'csci413f15_1',
    password : 'F9UnP31c',
    database : 'csci413f15_1',
    debug    :  false
});


console.log("Grabbing public resources...");
//Where html documents grab stuff for the site
app.use(express.static('public'));

console.log("Adding view directories...");
//Defining url directories
//Default Directory
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
//Login Directory
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/views/login.html');
    var userName, password; //No idea how this will work yet.
});
//Player Debug Directory
app.get('/playerDebug', function(req, res) {
    res.sendFile(__dirname + '/views/playerDebug.html');
});

var server = app.listen(port);
console.log(colors.magenta('Success! Audio site listening on port ' + port));
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    //socket.emit('message', {'message': 'hello world'});
	
	socket.on('message', function(data){
		console.log("Got your message");
		var query = 'SELECT * FROM SONGS, ALBUMS, ARTISTS, GENRES WHERE (SONGS.albumID = ALBUMS.albumID AND ALBUMS.artistID = ARTISTS.artistID AND SONGS.genreID = GENRES.genreID) AND (title = "' + data.message + '" OR artist = "' + data.message + '" OR album = "' + data.message + '" OR genre = "' + data.message + '")';
		console.log(query);
		handle_database(socket, query);
		
    });
});

function handle_database(socket, query) {
    pool.getConnection(function(error,connection){
        if (error) {
		  console.log("error connecting to the database");
        }   

		//"select * from SONGS"
		connection.query(query, function(error,results,fields){
			//connection.end();
            if(!error) {
				console.log(results);
				//socket.emit('message', {'message': results[0].songID});
				//socket.emit('message', {'message': results[0].title});
				socket.emit('message', {'message': results[0]});
            }
        });
	});
}