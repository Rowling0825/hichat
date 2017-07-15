require('express');
require('socket.io');

var express = require('express'),
	//var socket = require('socket.io'),
	//创建一个服务器
	app = express(),
	server = require('http').createServer(app);
io = require('socket.io').listen(server);
users = []; //保存所有在线用户的昵称
app.use('/', express.static(__dirname + '/www'));
//res.write('<h1>hello world!</h1>');
//res.end();

//监听80端口
server.listen(80);
//console.log('server started');
//socket部分
io.on('connection', function(socket) {

	//接收并处理客户端发送的foo事件
	socket.on('foo', function(data) {
			//将消息输出到控制台
			console.log(data);
		})
		/* Act on the event */


	//昵称设置
	socket.on('login', function(nickname) {

		//event.preventDefault();
		/* Act on the event */
		if (users.indexOf(nickname) > -1) {
			socket.emit('nickExisted');
		} else {
			socket.userIndex = users.length;
			socket.nickname = nickname;
			users.push(nickname);
			socket.emit('loginSuccess');
			io.sockets.emit('system', nickname, users.length, 'login');
		};
	});

	//断开连接的事件：
	socket.on('disconnect', function() {
		//event.preventDefault();
		/* Act on the event */
		//将断开用户从users中删除
		users.splice(socket.userIndex, 1);
		//通知除自己以外的所有人;
		socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
	});

	//接收新消息
	socket.on('postMsg', function(msg, color) {
		//将消息发送到除自己以外的所有用户
		socket.broadcast.emit('newMsg', socket.nickname, msg, color);
	});
	//接收图片
	socket.on('img', function(imgData) {
		//通过一个NewImg事件分发到除了自己之外的每个用户
		socket.broadcast.emit('newImg', socket.nickname, imgData);
	})
});