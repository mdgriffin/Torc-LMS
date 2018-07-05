var ViewCourse = (function () {

    var template =  `
        <video-player :video-url="'https://storage.googleapis.com/torc-lms.appspot.com/video1.mp4'"></video-player>
    `;

    return {
        template: template,
        components: {
            'video-player': VideoPlayer
        }
    }

})();

new Vue(ViewCourse).$mount('#courseApp');