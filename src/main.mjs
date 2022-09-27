import Hls from 'hls.js';

const videos = document.querySelectorAll('video');

class Video {
    constructor(element, index) {
        this.element = element;
        this.index = index;
    }

    load() {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(this.element.dataset.src);
            hls.attachMedia(this.element);
        } else if (this.element.canPlayType('application/vnd.apple.mpegurl')) {
            this.element.src = this.element.dataset.src;
        }
    }

    play() {
        this.element.play();
    }

    pause() {
        this.element.pause();
    }

    isBuffering() {
        return this.element.readyState < this.element.HAVE_FUTURE_DATA;
    }

    isBuffered() {
        return this.element.readyState > this.element.HAVE_CURRENT_DATA;
    }

    onWaiting(callback) {
        this.element.addEventListener('waiting', callback);
    }

    onCanPlayThrough(callback) {
        this.element.addEventListener('canplaythrough', callback);
    }
}

const players = [];

Array.from(videos).forEach((video, i) => {
    const videoPlayer = new Video(video, i);

    players.push(videoPlayer);

    videoPlayer.load();
});

const startVideos = () => {
    const isBuffered = players.every((player) => player.isBuffered());

    if (isBuffered) {
        return players.forEach((player) => player.play());
    }

    console.log('buffering');

    setTimeout(startVideos, 200);
};

setTimeout(startVideos, 200);

const playbackUpdate = () => {
    console.log('playback update');
    const isBuffering = players.some((player) => player.isBuffering());
    console.log(isBuffering);

    if (isBuffering) {
        players.forEach((player) => player.pause());
    } else {
        players.forEach((player) => player.play());
    }
};

players.forEach((player) => player.onWaiting(playbackUpdate));
players.forEach((player) => player.onCanPlayThrough(playbackUpdate));
