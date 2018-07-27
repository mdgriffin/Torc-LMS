var CourseStageFSM = function () {
    var fsm = new StateMachine({
        init: 'video',
        transitions: [
            {name: 'watchVideo', from: 'video', to: 'confirmQuiz'},
            {name: 'quizConfirmed', from: 'confirmQuiz', to: 'takeQuiz'},
            {name: 'quizFailed', from: 'takeQuiz', to: 'quizFail'},
            {name: 'quizPassed', from: 'takeQuiz', to: 'quizPass'},
            {name: 'nextStageConfirmed', from: 'quizPass', to: 'nextStage'},
            {name: 'rewatchVideo', from: 'quizFail', to: 'video'},
            {name: 'retakeTest', from: 'quizFail', to: 'takeQuiz'},
            {name: 'countdownComplete', from: ['video', 'confirmQuiz', 'takeQuiz'], to: 'timesUp'},
        ],
        methods: {}
    });

    return fsm;
};

var CourseStage = (function () {

    var template = `
        <div class="course-stage">
            <p>Time Remaining: {{timeRemaining | formatTime}}</p>
            <h3>{{stage.title}}</h3>
            <div class="course-stage-video" v-if="fsm.state === 'video'">
                <video-player :video-url="'https://storage.googleapis.com/torc-lms.appspot.com/videos/' + stage.videoUrl" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>
                <!--<video-player :video-url="'/teamtorc-lms/videos/video3.mp4'" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>-->
            </div>
            <div class="course-stage-quizProceed" v-if="fsm.state === 'confirmQuiz'">
                <button class="btn btn-primary btn-lg" v-on:click="confirmQuizProceed">Process to Quiz</button>
            </div>
            <div class="course-stage-quiz" v-if="fsm.state === 'takeQuiz' || fsm.state == 'quizFail' || fsm.state == 'quizPass'">
                <quiz ref="quiz" :questions="stage.questions" v-on:quiz-pass="onQuizPass" v-on:quiz-fail="onQuizFail"></quiz>
            </div>
            <div class="course-stage-completed" v-if="fsm.state == 'quizFail' || fsm.state == 'quizPass'">
                <button class="btn btn-primary btn-lg" v-if="fsm.state === 'quizFail'" v-on:click="rewatchVideo">Rewatch Video</button>
                <button class="btn btn-primary btn-lg" v-if="fsm.state === 'quizFail'" v-on:click="retakeQuiz">Retake Quiz</button>
                <button class="btn btn-primary btn-lg" v-if="fsm.state === 'quizPass'" v-on:click="nextStage">{{lastStage? 'Complete Stage' : 'Process to next stage'}}</button>
            </div>
            <div class="course-state-timesUp" v-if="fsm.state === 'timesUp'">
                <h3>Times Up!</h3>
                <p>You have not completed this stage in the allotted time</p>
            </div>
        </div>
    `

    return {
        props: ['courseId', 'stage', 'stageDuration', 'lastStage'],
        template: template,
        data: function () {
            return {
                timeRemaining: this.stageDuration,
                fsm: CourseStageFSM()
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
                this.fsm.quizConfirmed();
            },
            onVideoEnded: function () {
                this.fsm.watchVideo();
            },
            onVideoPlay: function () {
                console.log('Parent: On Video Play');
            },
            onCountdownComplete: function () {
                this.fsm.countdownComplete();
                notifyStageAttempt(this.courseId, this.stage.stageId, false);
                this.$emit('fail');
            },
            onQuizPass: function () {
                notifyStageAttempt(this.courseId, this.stage.stageId, true);
                this.fsm.quizPassed();
            },
            onQuizFail: function () {
                notifyStageAttempt(this.courseId, this.stage.stageId, false);
                this.fsm.quizFailed();
            },
            rewatchVideo: function () {
                this.fsm.rewatchVideo();
                this.timeRemaining = this.stageDuration;
            },
            retakeQuiz: function () {
                this.fsm.retakeTest();
                // TODO: Should be total duration - video duration
                this.timeRemaining = this.stageDuration / 2;
                this.$refs.quiz.reset();
            },
            nextStage: function () {
                this.$emit('complete');
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

    function notifyStageAttempt (courseId, stageId, completed) {
        fetch(Config.attemptStageUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"courseId": courseId, "stageId": stageId, "completed": completed})
        }).then(function (response) {
            console.log(response);
        }).catch(function () {
            alert("An error has occured, please try again");
        });
    }

})();

var Course = (function () {

    const STAGE_DURATION = 1000 * 60 * 15;

    var template = `
        <div class="course">
            <h2 class="pageTitle">{{course.title}}</h2>
            
            <div class="card">
                <div class="card-body">
                    <course-stage v-for="(stage, stageIndex) in course.stages" v-if="stageIndex === currentStageIndex" :key="stageIndex" :course-id="course.courseId" :stage="stage" :stage-duration="stageDuration" v-on:fail="stageFail" v-on:complete="stageComplete" :last-stage="isLastStage(stageIndex)"></course-stage>
                
                    <div class="course-completed" v-if="courseCompleted">
                        <h3>Congratulations! You Have Completed This Course</h3>
                    </div>
                </div>
            </div>
            
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
        computed: {
            courseCompleted: function () {
                return this.currentStageIndex >= this.course.stages.length
            }
        },
        methods: {
            stageFail: function () {
                alert("Fail!");
            },
            stageComplete: function () {
                this.currentStageIndex++;
            },
            isLastStage: function (stageIndex) {
                return stageIndex === this.course.stages.length - 1;
            }
        },
        components: {
            'course-stage': CourseStage,
            'loading-status': LoadingStatus
        }
    }

})();