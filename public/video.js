const myVideo = document.createElement('video');
const socket = io('/');
myVideo.muted = true;
const videoContainer = document.getElementById('video-container');
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

navigator.mediaDevices.getUserMedia({
    video: true,
    audio:true
}).then((stream) => {
    addVideoStreamToUi(myVideo, stream);
    peer.on('call', (call) => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
            addVideoStreamToUi(video, userVideoStream);
        });
    });

    socket.on('user-connected',(userId) => {
        connectToNewUser(userId, stream);
    });
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
        addVideoStreamToUi(video, userVideoStream);
    });
};

// Add video stream to UI.
const addVideoStreamToUi = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
         video.play();
    });
    videoContainer.append(video);
};