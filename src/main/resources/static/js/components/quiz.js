(function ()  {

var template = [
    '<div class="quiz">',
        '<div class="quiz-questions" v-if="!quizCompleted">',
            '<h4>Time Remaining {{timeRemaining}}</h4>',
            '<div class="quiz-question">',
                '<h3>{{question.question}}</h3>',
                '<div class="quiz-question-wrongAnswer" v-if="questionAnswered && !answerCorrect">',
                    '<p>Wrong Answer!</p>',
                '</div>',
                '<div class="quiz-question-correctAnswer" v-if="questionAnswered && answerCorrect">',
                    '<p>Right Answer!</p>',
                '</div>',
                '<div v-for="option, index in question.options" class="quiz-question-option">',
                    '<label v-if="multipleChoice"><input type="checkbox" :value="index" :name="\'quiz_option\' + uniqueFieldId" v-model="selectedOptions" :disabled="questionAnswered"/> {{option.text}}</label>',
                    '<label v-else><input type="radio" :value="index" :name="\'quiz_option\' + uniqueFieldId" v-model="selectedOptions" :disabled="questionAnswered"/> {{option.text}}</label>',
                '</div>',
                '<div class="quiz-question-explanation" v-if="questionAnswered">',
                    '<h4>Explanation:</h4>',
                    '<p>{{question.explanation}}</p>',
                '</div>',
            '</div>',
            '<button @click="submitAnswer" :disabled="!canSubmit">Submit</button>',
            '<button @click="nextQuestion" v-if="canClickNext">Next Question</button>',
            '<button @click="seeResults" v-if="allQuestionsAnswered">Finish</button>',
        '</div>',
        '<div class="quiz-overview" v-if="quizCompleted">',
            '<h3>Quiz Over</h3>',
            '<p v-if="ranOutOfTime">Sorry, you ran out of time to complete this quiz</p>',
            '<h4>You got {{numRight}} / {{numQuestions}} Questions Right</h4>',
        '</div>',
    '</div>'
].join('');

Vue.component('quiz', {
    template: template,
    props: ['questions', 'countdownduration'],
    data: function () {
        return {
            duration: this.countdownduration,
            questionIndex: 0,
            numRight: 0,
            numWrong: 0,
            quizCompleted: false,
            selectedOptions: [],
            questionAnswered: false,
            answerCorrect: false,
            uniqueFieldId: Math.floor(Math.random() * 1000)
        }
    },
    computed: {
        question: function () {
            return this.questions[this.questionIndex];
        },
        canClickNext: function () {
            return this.questions.length - 1 > this.questionIndex && this.questionAnswered;
        },
        canSubmit: function () {
            return this.numSelectedOptions > 0 && !this.questionAnswered;
        },
        allQuestionsAnswered: function () {
            return (this.numRight + this.numWrong) === this.questions.length;
        },
        numQuestions: function () {
            return this.questions.length;
        },
        numRightOptions: function () {
            return this.question.options.reduce(function (numRight, currentOption) {
                return numRight + (currentOption.isCorrect? 1 : 0);
            }, 0);
        },
        numSelectedOptions: function () {
            var numSelected = 0;

            if (this.multipleChoice) {
                numSelected = this.selectedOptions.length
            } else if (!Array.isArray(this.selectedOptions)) {
                numSelected = 1;
            }

            return numSelected;
        },
        multipleChoice: function () {
            return this.numRightOptions > 1;
        },
        timeRemaining: function () {
            var duration = this.duration;

            var seconds = parseInt((duration / 1000) % 60)
            var minutes = parseInt((duration / (1000 * 60)) % 60)

            return ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
        },
        ranOutOfTime: function () {
            return this.duration === 0 && !this.allQuestionsAnswered
        }
    },
    methods: {
        nextQuestion: function () {
            if (this.canClickNext) {
                this.questionIndex++;

                // reset state
                this.selectedOptions = [];
                this.questionAnswered = false;
                this.answerCorrect = false;
            }
        },
        submitAnswer: function () {
            var numSelected = this.numSelectedOptions;
            
            if (numSelected > 0) {
                this.questionAnswered = true;
                var numSelectedRight = 0;
                
                if (this.multipleChoice) {
                    for (var i = 0; i < numSelected; i++) {
                        if (this.question.options[this.selectedOptions[i]].isCorrect) {
                            numSelectedRight++;
                        }
                    }
                } else {
                    if (this.question.options[this.selectedOptions].isCorrect) {
                        numSelectedRight++;
                    }
                }

                if (numSelectedRight === numSelected && numSelectedRight === this.numRightOptions) {
                    this.answerCorrect = true;
                    this.numRight++;
                } else {
                    this.answerCorrect = false;
                    this.numWrong++;
                }
            }
        },
        seeResults: function () {
            if (this.allQuestionsAnswered) {
                this.quizCompleted = true;
            }
            return true;
        }
    },
    created: function () {
        var self = this;
        var timer = setInterval(function () {
            self.duration -= 1000;

            if (self.duration === 0) {
                clearInterval(timer);
                self.quizCompleted = true;
            }
        }, 1000);
    }
});

})();