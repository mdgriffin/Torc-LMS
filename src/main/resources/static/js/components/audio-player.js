var AudioPlayer = (function () {

    let template = `
        <div class="audioPlayer">
            <audio ref="audioEl" controls :src="audioUrl">Your browser does not support the <code>audio</code> element.</audio>
            <button v-on:click="playAudio"><i class="fas fa-volume-up"></i></button>
        </div>
    `

    return {
        props: ['audioUrl'],
        template: template,
        methods: {
            playAudio: function () {
                this.$refs.audioEl.play();
            }
        }
    }

})();