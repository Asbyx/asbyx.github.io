var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});
// Chargement de socket.io
var io = require('socket.io').listen(server);


var clients = [];
var isDueling = false;

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    socket.on("setPseudo", function(p){ 
    	//on met le pseudo et l'id du joueur dans la socket
    	//et on enregistre le pseudo dans la liste des joueurs
    	socket.pseudo = p;
    	clients.push([p, "spec"]);
    	socket.id = clients.length-1;
    	console.log("Nouveau joueur: "+socket.pseudo+", id: "+socket.id);
    	//on initie la boucle
    	socket.emit("draw");
    });

    //sert aussi de main
    socket.on("update", function(p){
    	if (!isDueling && clients.length > 1){
    		console.log("Duel Time!")
    		socket.broadcast.emit("duelTime", clients[0][0], clients[1][0]);
    		isDueling = true;
    		clients[0][1] = clients[1][1] = "play";
    	}

    	socket.emit("draw");
    });

});


server.listen(80);