const http = require('http').createServer(function(req, res) {
  res.end("I hope you've voted instead of staying here ;)");  
}).listen(1865, '0.0.0.0');
const io = require('socket.io').listen(http);
const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp-date-unix')

mongoose.connect('mongodb://localhost/bpvoteslegends', {useNewUrlParser: true});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const Connect = new Schema({
	username: String,
});

Connect.plugin(timestamps, {
	createdAt: 'created_at',
	updatedAt: 'updated_at'
});
 
const Use = new Schema({
	username: String,
});

Use.plugin(timestamps, {
	createdAt: 'created_at',
	updatedAt: 'updated_at'
});

const ConnectModel = mongoose.model('Connect', Connect);
const UseModel = mongoose.model('Use', Use);

io.on('connection', (socket) => {
	socket.on('start', (username) => {
		console.log(username + " has started to votes !");
		const m = new ConnectModel({username: username});
		m.save(function (err) {
			if (err) console.log(err);
		});
	});
  
	socket.on('use', (username) => {
		console.log(username + " has voted !");
		const m = new UseModel({username: username});
		m.save(function (err) {
			if (err) console.log(err);
		});
	});
	
	socket.on('version', (version) => {
		if(version != "1.0.1"){
			socket.emit("alert", "outdated version, please visit https://bp-vote-legends.eu/install to get the new version");
		}
	});
});