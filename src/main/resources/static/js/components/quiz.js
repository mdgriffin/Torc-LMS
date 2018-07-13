var Quiz = (function ()  {

var template = `
    <div class="quiz">
        <div class="quiz-questions" v-if="!quizCompleted">
            <h2>Knowledge Check</h2>
            <div class="quiz-question">
                <h3>{{question.question}}</h3>
                <div class="quiz-question-wrongAnswer" v-if="questionAnswered && !answerCorrect">
                    <p>Wrong Answer!</p>
                </div>
                <div class="quiz-question-correctAnswer" v-if="questionAnswered && answerCorrect">
                    <p>Right Answer!</p>
                </div>
                <div v-for="option, index in question.options" class="quiz-question-option">
                    <label v-if="multipleChoice"><input type="checkbox" :value="index" :name="\'quiz_option\' + uniqueFieldId" v-model="selectedOptions" :disabled="questionAnswered"/> {{option.text}}</label>
                    <label v-else><input type="radio" :value="index" :name="\'quiz_option\' + uniqueFieldId" v-model="selectedOptions" :disabled="questionAnswered"/> {{option.text}}</label>
                </div>
                <div class="quiz-question-explanation" v-if="questionAnswered">
                    <h4>Explanation:</h4>
                    <p>{{question.explanation}}</p>
                </div>
            </div>
            <button @click="submitAnswer" :disabled="!canSubmit">Submit</button>
            <button @click="nextQuestion" v-if="canClickNext">Next Question</button>
            <button @click="seeResults" v-if="allQuestionsAnswered">Finish</button>
        </div>
        <div class="quiz-overview" v-if="quizCompleted">
            <h3>Quiz Over</h3>
            <h4>You got {{numRight}} / {{numQuestions}} Questions Right</h4>
        </div>
    </div>
`;

return {
    template: template,
    props: ['questions'],
    data: function () {
        console.log(this.questions);
        return {
            //duration: this.countdownduration,
            questionIndex: 0,
            numRight: 0,
            numWrong: 0,
            quizCompleted: false,
            selectedOptions: [],
            questionAnswered: false,
            //answerCorrect: false,
            uniqueFieldId: Math.floor(Math.random() * 1000)
        }
    },
    computed: {
        answerCorrect: function () {
            var numCorrect = 0;

            if (Array.isArray(this.selectedOptions)) {
                this.selectedOptions.forEach(index => {
                    numCorrect += this.question.options[index].isCorrect? 1 : 0;
                })
            } else {
                return this.question.options[this.selectedOptions].isCorrect;
            }

            return numCorrect === this.selectedOptions.length;
        },
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
        quizPassed: function () {
            return this.numRight == this.numQuestions;
        }
    },
    methods: {
        nextQuestion: function () {
            if (this.canClickNext) {
                this.questionIndex++;

                // reset state
                this.selectedOptions = [];
                this.questionAnswered = false;
                //this.answerCorrect = false;
            }
        },
        submitAnswer: function () {
            this.questionAnswered = true;

            if (this.answerCorrect) {
                this.numRight++;
            } else {
                this.numWrong++;
            }
        },
        seeResults: function () {
            if (this.allQuestionsAnswered) {
                if (this.quizPassed) {
                    this.$emit("quiz-pass");
                } else {
                    this.$emit("quiz-fail")
                }
                this.quizCompleted = true;
            }
            return true;
        },
        reset: function () {
            Object.assign(this.$data, this.$options.data.apply(this))
        }
    }
};

})();