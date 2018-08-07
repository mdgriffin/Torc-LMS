var AudioPlayer = (function () {

    let template = `
        <audio ref="audioEl" controls :src="audioUrl"></audio>
    `

    return {
        props: ['audioUrl'],
        template: template,
    }

})();