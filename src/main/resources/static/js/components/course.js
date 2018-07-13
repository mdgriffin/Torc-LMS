var CourseStageFSM = function () {
    return new StateMachine({
        init: 'video',
        transitions: [
            { name: 'watchVideo',         from: 'video',                              to: 'confirmQuiz' },
            { name: 'quizConfirmed',      from: 'confirmQuiz',                        to: 'takeQuiz'  },
            { name: 'quizFailed',         from: 'takeQuiz',                           to: 'quizFail'    },
            { name: 'quizPassed',         from: 'takeQuiz',                           to: 'quizPass' },
            { name: 'nextStageConfirmed', from: 'quizPass',                           to: 'nextStage' },
            { name: 'rewatchVideo',       from: 'quizFailed',                         to: 'watchVideo'},
            { name: 'retakeTest',         from: 'quizFailed',                         to: 'takeQuiz'},
            { names: 'timesUp',           from: ['video', 'confirmQuiz', 'takeQuiz'], to: 'timesUp' },
        ],
        methods: {
            onWatchVideo: function() {
                console.log('FSM: Video Watched')
            },
            onQuizConfirmed: function() {
                console.log('FSM: Video Confirmed')
            },
            onQuizFailed: function() {
                console.log('FSM: Quiz Failed')
            },
            onQuizPassed: function() {
                console.log('FSM: Quiz Passed')
            },
            onNextStageConfirmed: function() {
                console.log('FSM: Next Stage Confirmed')
            },
            onRewatchVideo: function() {
                console.log('FSM: Rewatch Video')
            },
            onRetakeQuiz: function() {
                console.log('FSM: Retake Quiz')
            },
            onTimesUp: function () {
                console.log('FSM: Times Up');
            }
        }
    });
};

/*
var stageStates = {
    0: 'watchVideo',
    1: 'confirmProceed',
    2: 'takeQuiz',
    3: 'quizFail',
    4: 'quizPass'
};
*/

var CourseStage = (function () {

    var template = `
        <div class="course-stage">
            <p>Time Remaining: {{timeRemaining | formatTime}}</p>
            <h3>{{stage.title}}</h3>
            <div class="course-stage-video" v-if="!videoFinished">
                <!--<video-player :video-url="'https://storage.googleapis.com/torc-lms.appspot.com/videos/' + stage.videoUrl" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>-->
                <video-player :video-url="'/lms/videos/video3.mp4'" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>
            </div>
            <div class="course-stage-quizProceed" v-if="videoFinished && !quizProceedConfirmed">
                <button class="btn btn-primary btn-lg" v-on:click="confirmQuizProceed">Process to Quiz</button>
            </div>
            <div class="course-stage-quiz" v-if="this.videoFinished && this.quizProceedConfirmed">
                <quiz :questions="stage.questions" v-on:quiz-pass="onQuizPass" v-on:quiz-fail="onQuizFail"></quiz>
            </div>
            <div class="course-stage-completed" v-if="quizCompleted">
                <button class="btn btn-primary btn-lg" v-if="!quizPassed" v-on:click="rewatchVideo">Rewatch Video</button>
                <button class="btn btn-primary btn-lg" v-if="!quizPassed" v-on:click="retakeQuiz">Retake Quiz</button>
                <button class="btn btn-primary btn-lg" v-if="quizPassed" v-on:click="nextStage">Process to next stage</button>
            </div>
        </div>
    `

    return {
        props: ['stage', 'stageDuration'],
        template: template,
        data: function () {
            return {
                timeRemaining: this.stageDuration,
                videoFinished: false,
                quizProceedConfirmed: false,
                quizCompleted: false,
                quizPassed: false
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
            confirmQuizProceed: function () {
                this.quizProceedConfirmed = true;
            },
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
                this.quizCompleted = true;
                this.quizPassed = true;
            },
            onQuizFail: function () {
                console.log('Parent: Quiz Fail!');
                this.quizCompleted = true;
            },
            rewatchVideo: function () {
                console.log('On Rewatch Video');
            },
            retakeQuiz: function () {
                console.log('On Retake Video');
            },
            nextStage: function () {
                console.log('On Proceed to Next Stage');
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