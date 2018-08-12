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
            <p>Time Remaining: {{timeRemaining | formatTime}}</p>
            <h3>
                {{stage.title}}
                <audio-player v-if="stage.titleAudio" :audioUrl="'https://storage.googleapis.com/torc-lms.appspot.com/audio/' + stage.titleAudio"></audio-player>
            </h3>
            <div class="assignment-stage-video" v-if="fsm.state === 'video'">
                <video-player :video-url="'https://storage.googleapis.com/torc-lms.appspot.com/videos/' + stage.videoUrl" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>
                <!--<video-player :video-url="'/teamtorc-lms/videos/video3.mp4'" v-on:play="onVideoPlay" v-on:end="onVideoEnded"></video-player>-->
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
                fsm: AssignmentStageFSM()
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
                this.$emit('fail', this.stage.stageId);
            },
            onQuizPass: function () {
                this.fsm.quizPassed();
                this.$emit('pass', this.stage.stageId);
                this.stopTimer();
            },
            onQuizFail: function () {
                this.fsm.quizFailed();
                this.$emit('fail', this.stage.stageId);
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
        <div class="course">
            <h2 class="pageTitle">
                {{course.title}}
                <audio-player v-if="course.titleAudio" :audioUrl="'https://storage.googleapis.com/torc-lms.appspot.com/audio/' + course.titleAudio"></audio-player>
            </h2>
            
            <div class="card">
                <div class="card-body">
                    <p><i class="fas fa-heart" v-for="i in numAttemptsRemaining"></i></p>
                    
                    <div class="assignment-stageContainer" v-if="assignment.status === 'INCOMPLETE'">
                        <assignment-stage v-for="(stage, stageIndex) in course.stages" v-if="stageIndex === currentStageIndex" :key="stageIndex" :course-id="course.courseId" :stage="stage" :stage-duration="stageDuration" v-on:fail="stageFail" v-on:pass="stagePass" v-on:complete="stageComplete" :last-stage="isLastStage(stageIndex)"></assignment-stage>
                    </div>
                
                    <div class="assignment-completed" v-if="courseCompleted">
                        <h3>Congratulations! You Have Completed This Course</h3>
                    </div>
                    
                    <div class="assignment-locked" v-if="assignment.status === 'LOCKED'">
                        <h3>Course Locked: Too Many Failed Attempts</h3>
                    </div>
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
            courseCompleted: function () {
                return this.currentStageIndex >= this.course.stages.length
            },
            numAttemptsRemaining: function () {
                var stage = this.course.stages[this.currentStageIndex];

                // loop over the attempts
                // check that the date is greater than the last updated date of the assignment
                return 2 - this.assignment.stageAttempts
                    .filter(attempt => {
                        return attempt.stage.stageId === stage.stageId &&
                            moment(attempt.dateAttempted).isSameOrAfter(this.assignment.lastUpdated) &&
                            !attempt.completed;
                    }).length;

                //return numRemaining >= 0? numRemaining : 0;
            }
        },
        methods: {
            stageFail: function (stageId) {
                this.notifyStageAttempt(this.course.courseId, stageId, false);
            },
            stagePass: function (stageId) {
                this.notifyStageAttempt(this.course.courseId, stageId, true);
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

            self.notifyStageAttempt = function (courseId, stageId, completed) {
                fetch(Config.attemptStageUrl, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"courseId": courseId, "stageId": stageId, "completed": completed})
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