var CourseStage = (function () {

    var template = `
        <div class="course-stage">
            <p>Time Remaining: {{timeRemaining | formatTime}}</p>
            <h3>{{stage.title}}</h3>
            <div class="course-stage-video" v-if="!videoFinished">
                <!--<video-player :video-url="'https://storage.googleapis.com/torc-lms.appspot.com/videos/' + stage.videoUrl" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>-->
                <video-player :video-url="'/lms/videos/video2.mp4'" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>
            </div>
            <div class="course-stage-quiz" v-if="videoFinished">
                <h3>Show Quiz</h3>
                <quiz :questions="stage.questions" v-on:quiz-pass="onQuizPass" v-on:quiz-fail="onQuizFail"></quiz>
            </div>
        </div>
    `

    return {
        props: ['stage', 'stageDuration'],
        template: template,
        data: function () {
            return {
                timeRemaining: this.stageDuration,
                videoFinished: false
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
                this.videoFinished = true;
            },
            onVideoPlay: function () {
                console.log('Parent: On Video Play');
            },
            onCountdownComplete: function () {
                alert('You have run out of time!');
                this.$emit('stageFail');
            },
            onQuizPass: function () {
                console.log('Parent: Quiz Pass!');
            },
            onQuizFail: function () {
                console.log('Parent: Quiz Fail!');
            }
        },
        components: {
            'video-player': VideoPlayer,
            'quiz': Quiz
        },
        created: function () {
            var self = this;
            var timer = setInterval(function () {
                self.timeRemaining -= 1000;

                if (self.timeRemaining <= 0) {
                    clearInterval(timer);
                    self.onCountdownComplete();
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
            <course-stage v-for="(stage, stageIndex) in course.stages" v-if="stageIndex === currentStageIndex" :key="stageIndex" :stage="stage" :stage-duration="stageDuration" v-on:stage-fail="stageFail" v-on:pass="stagePass"></course-stage>
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
        methods: {
            stageFail: function () {
                alert("Fail!");
            },
            stagePass: function () {
                alert("Pass!");
            }
        },
        components: {
            'course-stage': CourseStage,
            'loading-status': LoadingStatus
        }
    }

})();