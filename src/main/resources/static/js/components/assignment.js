var AssignmentStageFSM = function () {
    return new StateMachine({
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
};

var AssignmentStage = (function () {

    var template = `
        <div class="assignment-stage">
            <div class="assignment-stage-header">
                <h3 class="assignment-stage-title">
                    {{stage.title}}
                    <audio-player v-if="stage.titleAudio" :audioUrl="'https://storage.googleapis.com/torc-lms.appspot.com/audio/' + stage.titleAudio"></audio-player>
                </h3>
                <p class="assignment-stage-countdown">Time Remaining: {{timeRemaining | formatTime}}</p>
            </div>
            <div class="assignment-stage-video" v-if="fsm.state === 'video'">
                <video-player :video-url="'https://storage.googleapis.com/torc-lms.appspot.com/videos/' + stage.videoUrl" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>
                <!--<video-player :video-url="'/teamtorc-lms/videos/video3.mp4'" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>-->
                <div class="assignment-stage-transcript" v-if="stage.transcript">
                    <h3>Transcript</h3>
                    <span v-html="transcriptAsHtml"></span>
                </div>
            </div>
            <div class="assignment-stage-quizProceed" v-if="fsm.state === 'confirmQuiz'">
                <button class="btn btn-primary btn-lg" v-on:click="confirmQuizProceed">Proceed to Knowledge Check</button>
            </div>
            <div class="assignment-stage-quiz" v-if="fsm.state === 'takeQuiz' || fsm.state == 'quizFail' || fsm.state == 'quizPass'">
                <quiz ref="quiz" :questions="stage.questions" v-on:quiz-pass="onQuizPass" v-on:quiz-fail="onQuizFail"></quiz>
            </div>
            <div class="assignment-stage-completed" v-if="fsm.state == 'quizFail' || fsm.state == 'quizPass'">
                <button class="btn btn-primary btn-lg" v-if="fsm.state === 'quizFail'" v-on:click="rewatchVideo">Rewatch Video</button>
                <button class="btn btn-primary btn-lg" v-if="fsm.state === 'quizFail'" v-on:click="retakeQuiz">Retake Knowledge Check</button>
                <button class="btn btn-primary btn-lg" v-if="fsm.state === 'quizPass'" v-on:click="nextStage">{{lastStage? 'Complete Stage' : 'Proceed to next stage'}}</button>
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
                fsm: AssignmentStageFSM()
            }
        },
        computed: {
            transcriptAsHtml: function () {
                const converter = new showdown.Converter();
                return converter.makeHtml(this.stage.transcript);
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
                this.$emit('fail', this.stage.stageId, 0);
            },
            onQuizPass: function (numCorrect) {
                this.fsm.quizPassed();
                this.$emit('pass', this.stage.stageId, numCorrect);
                this.stopTimer();
            },
            onQuizFail: function (numCorrect) {
                this.fsm.quizFailed();
                this.$emit('fail', this.stage.stageId, numCorrect);
                this.stopTimer();
            },
            rewatchVideo: function () {
                this.fsm.rewatchVideo();
                this.timeRemaining = this.stageDuration;
                this.startTimer();
            },
            retakeQuiz: function () {
                this.fsm.retakeTest();
                this.timeRemaining = this.stageDuration / 2;
                this.timeRemaining = this.stageDuration;
                this.$refs.quiz.reset();
            },
            nextStage: function () {
                this.$emit('complete');
            },
            startTimer: function () {
                if (!this._timer) {
                    this._timer = setInterval((function () {
                        this.timeRemaining -= 1000;

                        if (this.timeRemaining <= 0) {
                            this.stopTimer();
                            this.onCountdownComplete();
                        }
                    }).bind(this), 1000);
                }
            },
            stopTimer: function () {
                clearInterval(this._timer);
                this._timer = null;
            }
        },
        components: {
            'audio-player': AudioPlayer,
            'video-player': VideoPlayer,
            'quiz': Quiz
        },
        created: function () {
            this.startTimer();
        }
    }


})();

var Assignment = (function () {

    const STAGE_DURATION = 1000 * 60 * 15;

    var template = `
        <div class="assignment ">
            <h2 class="assignment-title">
                {{course.title}}
                <audio-player v-if="course.titleAudio" :audioUrl="'https://storage.googleapis.com/torc-lms.appspot.com/audio/' + course.titleAudio"></audio-player>
            </h2>
            
            <div class="card-body">
                <div class="assignment-stageContainer" v-if="courseIncomplete">
                    <assignment-stage v-for="(stage, stageIndex) in course.stages" v-if="stageIndex === currentStageIndex" :key="stageIndex" :course-id="course.courseId" :stage="stage" :stage-duration="stageDuration" v-on:fail="stageFail" v-on:pass="stagePass" v-on:complete="stageComplete" :last-stage="isLastStage(stageIndex)"></assignment-stage>
                </div>
    
                <div class="assignment-completed" v-if="courseCompleted">
                    <h3>Congratulations! You Have Completed This Course</h3>
                </div>
    
                <div class="assignment-locked" v-if="courseLocked">
                    <h3>Course Locked: Too Many Failed Attempts</h3>
                </div>
            
            </div>
        </div>
    `

    return {
        props: {
            assignment: Object,
            stageIndex: {
                type: Number,
                default: 0
            }
        },
        template: template,
        data: function () {
            return {
                stageDuration: STAGE_DURATION,
                currentStageIndex: this.stageIndex
            }
        },
        computed: {
            course: function () {
                return this.assignment.assignedCourse;
            },
            courseLocked: function () {
                return this.assignment.status === 'LOCKED';
            },
            courseIncomplete: function () {
                return this.assignment.status === 'INCOMPLETE' && this.currentStageIndex < this.course.stages.length
            },
            courseCompleted: function () {
                return this.assignment.status == 'COMPLETED' || this.currentStageIndex >= this.course.stages.length
            },
            numAttemptsRemaining: function () {
                if (this.currentStageIndex >= this.course.stages.length) {
                    return 0;
                }

                let stage = this.course.stages[this.currentStageIndex];

                return 2 - this.assignment.stageAttempts
                    .filter(attempt => {
                        return attempt.stage.stageId === stage.stageId &&
                            moment(attempt.dateAttempted).isSameOrAfter(this.assignment.lastUpdated) &&
                            !attempt.completed;
                    }).length;
            },
            numStages: function () {
                return this.course.stages.length;
            }
        },
        methods: {
            stageFail: function (stageId, numCorrect) {
                let stage = this.course.stages.find(stage => stage.stageId === stageId);
                this.notifyStageAttempt(this.assignment.userAssignmentId, stageId, false, stage.questions.length, numCorrect);
            },
            stagePass: function (stageId, numCorrect) {
                let stage = this.course.stages.find(stage => stage.stageId === stageId);
                this.notifyStageAttempt(this.assignment.userAssignmentId, stageId, true, stage.questions.length, numCorrect);
            },
            stageComplete: function () {
                this.currentStageIndex++;
            },
            isLastStage: function (stageIndex) {
                return stageIndex === this.course.stages.length - 1;
            }
        },
        components: {
            'audio-player': AudioPlayer,
            'assignment-stage': AssignmentStage,
            'loading-status': LoadingStatus
        },
        created: function () {
            var self = this;

            self.notifyStageAttempt = function (userAssignmentId, stageId, completed, numQuestions, numCorrect) {
                fetch(Config.attemptStageUrl, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "userAssignmentId": userAssignmentId,
                        "stageId": stageId,
                        "completed": completed,
                        "numQuestions": numQuestions,
                        "numCorrect": numCorrect
                    })
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw Error(response.statusText);
                    }
                }).then(assignment => {
                    Vue.set(self.assignment, 'status', assignment.status);
                    Vue.set(self.assignment, 'stageAttempts', assignment.stageAttempts);
                }).catch(error => {
                    console.error(error);
                    alert("An error has occured, please try again");
                });
            }
        }
    }

})();