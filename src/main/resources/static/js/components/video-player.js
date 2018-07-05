var VideoPlayer = (function () {

    var template = `
        <video ref="videoNode" id="my-video" class="video-js" controls preload="auto" width="640" height="264"  :data-setup="JSON.stringify(defaultOptions)">
            <source :src="videoUrl" type='video/mp4'>
            <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that
                <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
            </p>
        </video>
    `;

    return {
        props: ['videoUrl'],
        template: template,
        data: function () {
            return {
                defaultOptions: {
                    "fluid": true
                },
                player: null
            }
        },
        mounted: function () {
            this.player = videojs(this.$refs.videoNode, this.defaultOptions, function onPlayerReady() {
                console.log('onPlayerReady', this)
            });
        }
    }

})();