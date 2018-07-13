var VideoPlayer = (function () {

    var template = `
        <video ref="videoNode" controls class="video-fullWidth"  preload="auto" autoplay="true" v-on:play="onPlay" v-on:ended="onVideoEnded">
            <source :src="videoUrl" type='video/mp4'>
            <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video</a></p>
        </video>
    `;

    return {
        props: ['videoUrl'],
        template: template,
        methods: {
            onVideoEnded: function () {
                this.$emit('end');
            },
            onPlay: function () {
                this.$emit('play')
            }
        }
    }
})();