var CourseStage = (function () {

    var template = `
        <div class="course-stage">
            <p>Time Remaining: {{timeRemaining | formatTime}}</p>
            <video-player :video-url="'https://storage.googleapis.com/torc-lms.appspot.com/videos/video1.mp4'" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>
        </div>
    `

    return {
        props: ['stageDuration'],
        template: template,
        data: function () {
            return {
                timeRemaining: this.stageDuration
            }
        },
        filters: {
            formatTime: function (val) {
                var seconds = parseInt((val / 1000) % 60)
                var minutes = parseInt((val / (1000 * 60)) % 60)

                return ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
            }
        },
        methods: {
            onVideoEnded: function () {
                console.log('Parent: On Video Ended');
            },
            onVideoPlay: function () {
                console.log('Parent: On Video Play');
            }
        },
        components: {
            'video-player': VideoPlayer
        },
        created: function () {
            var self = this;
            var timer = setInterval(function () {
                self.timeRemaining -= 1000;

                if (self.timeRemaining <= 0) {
                    clearInterval(timer);
                }
            }, 1000)
        }
    }

})();

var Course = (function () {

    const STAGE_DURATION = 1000 * 60 * 15;

    var template = `
        <div class="course">
            <h3>{{course.title}}</h3>
            <course-stage v-for="(stage, stageIndex) in course.stages" v-if="stageIndex === currentStageIndex"  :key="stageIndex" :stage="stage" :stage-duration="stageDuration" ></course-stage>
        </div>
    `

    return {
        props: ['course'],
        template: template,
        data: function () {
            return {
                stageDuration: STAGE_DURATION,
                currentStageIndex: 0
            }
        },
        components: {
            'course-stage': CourseStage,
            'loading-status': LoadingStatus
        }
    }

})();