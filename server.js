const express = require('express');
const app = express();
const server = require('http').Server(app);
const {v4: uuidv4} = require('uuid');
const io = require('socket.io')(server);
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug:true
});
var PORT = process.env.PORT || 443; 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    //res.redirect(`/${uuidv4()}`);
    res.redirect('/chattynimish');
});

app.get('/:room', (req, res) => {
    res.render('chatRoom', {roomId : req.params.room});
});

io.on('connection', socket => {
    socket.on('join-room',(roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    });
});
server.listen(PORT);