(function () {

var template = [
    '<div :class="[\'courseCreator\', {wasValidated: wasValidated}]">',
        '<h3>Course Creator</h3>',
        '<div class="courseCreator-form">',
            '<div class="form-group">',
                '<label>Course Title</label>',
                '<input type="text" v-model="course.title" :class="[\'form-control\', {\'is-invalid\': wasValidated && !courseValidation.title}]"/>',
                '<div class="invalid-feedback">Course Title is required</div>',
            '</div>',
            '<div class="courseCreator-stages">',
                '<ul class="nav nav-tabs courseCreator-stages-tabs">',
                    '<li class="nav-item" v-for="stages, stageIndex in course.stages">',
                        '<a :class="[\'nav-link\', (stageIndex === currentStageId? \'active\' : \'\')]" @click="changeStage(stageIndex)">Stage {{stageIndex + 1}}</a>',
                    '</li>',
                    '<li><button class="btn btn-primary" @click="addStage">Add a Stage  <i class="fas fa-plus-circle"></i></button></li>',
                '</ul>',
                '<div class="courseCreator-stages-tabContent">',
                    '<div v-for="stage, stageIndex in course.stages" v-if="stageIndex === currentStageId">',
                        '<div class="form-group">',
                            '<label>Stage Title</label>',
                            '<input type="text" v-model="stage.title" :class="[\'form-control\', {\'is-invalid\': wasValidated && !courseValidation.stages[stageIndex].title}]" />',
                            '<div class="invalid-feedback">Stage Title is required</div>',
                        '</div>',
                        '<div class="form-group">',
                            '<label>Video URL</label>',
                            '<input type="text" v-model="stage.videoUrl" :class="[\'form-control\', {\'is-invalid\': wasValidated && !courseValidation.stages[stageIndex].videoUrl}]" />',
                            '<div class="invalid-feedback">Video URL is required</div>',
                        '</div>',
                        '<div class="courseCreator-questions">',
                            '<ul class="nav nav-tabs">',
                                '<li class="nav-item" v-for="question, questionIndex in stage.questions">',
                                    '<a :class="[\'nav-link\', (stage.currentQuestionId === questionIndex? \'active\' : \'\')]" @click="changeQuestion(stageIndex, questionIndex)">Question {{questionIndex + 1}}</a>',
                                '</li>',
                                '<li><button class="btn btn-secondary" @click="addQuestion(stageIndex)">Add Question  <i class="fas fa-plus-circle"></i></button></li>',
                            '</ul>',
                            '<div class="courseCreator-questions-tabContent">',
                                '<div class="courseCreator-questions-tabInner" v-for="question, questionIndex in stage.questions" v-if="stage.currentQuestionId === questionIndex">',
                                    '<div class="form-group">',
                                        '<label>Question</label>',
                                        '<input type="text" v-model="question.question" :class="[\'form-control\', {\'is-invalid\': wasValidated && !courseValidation.stages[stageIndex].questions[questionIndex].question}]" />',
                                        '<div class="invalid-feedback">Question is required</div>',
                                    '</div>',
                                    '<div class="courseCreator-questions-options">',
                                        '<h4>Options</h4>',
                                        '<div class="form-group row" v-for="option, optionIndex in question.options">',
                                            '<label class="col-sm-2 col-form-label">Option {{optionIndex + 1}}</label>',
                                            '<div class="col-sm-8">',
                                                '<input type="text" v-model="option.text" :class="[\'form-control\', {\'is-invalid\': wasValidated && !courseValidation.stages[stageIndex].questions[questionIndex].options[optionIndex].text}]" />',
                                                '<div class="invalid-feedback">Option text must be provided</div>',
                                            '</div>',
                                            '<div class="col-sm-2">',
                                                '<div class="form-check">',
                                                    '<input class="form-check-input" type="checkbox" :id="\'chbx-questionoption\' + stageIndex + \'-\' + questionIndex + \'-\' + optionIndex" v-model="option.isCorrect"><label class="form-check-label" :for="\'chbx-questionoption\' + stageIndex + \'-\' + questionIndex + \'-\' + optionIndex"><i class="fas fa-check-circle"></i></label>',
                                                '</div>',
                                            '</div>',
                                        '</div>',
                                        '<button class="btn btn-light" @click="addOption(stageIndex, questionIndex)">Add Option  <i class="fas fa-plus-circle"></i></button>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="courseCreator-actions">',
                '<button @click="saveCourse" class="btn btn-primary">Save</button>',
                '<button @click="clearForm" class="btn btn-secondary">Clear Form</button>',
            '</div>',
        '</div>',
    '</div>',
].join('');

Vue.component('course-creator', {
    template: template,
    data: function () {
        return {
            currentStageId: null,
            course: {
                title: '',
                stages: []
            },
            wasValidated: false,
            courseValidation: {
                title: true,
                stages: []
            }
        }
    },
    methods: {
        saveCourse: function () {
            if (this.validateCourses()) {
                this.$store.commit('saveCourse', this.course);
            }
        },
        validateCourses: function () {
            var isValid = false;
            this.wasValidated = true;
            this.courseValidation.title = false;

            if (this.course.title.length === 0) this.courseValidation.title = false;

            for (var i = 0; i < this.course.stages.length; i++) {
                var stage = this.course.stages[i];
                var stageValidation = this.courseValidation.stages[i];

                stageValidation.title = (stage.title.length === 0? false : true);
                stageValidation.videoUrl = (stage.videoUrl.length === 0? false : true);

                for (var j = 0; j < stage.questions.length; j++) {
                    var question = stage.questions[j];
                    var questionValidation = stageValidation.questions[j];

                    questionValidation.question = (question.question.length === 0? false : true);

                    for (var k = 0; k < question.options.length; k++) {
                        questionValidation.options[k].text = (question.options[k].text.length === 0? false : true);
                    }
                }
            }

            return isValid;
        },
        clearForm: function () {
            this.course = {
                title: '',
                stages: []
            }
            this.courseValidation = {
                title: true,
                stages: []
            }
        },
        addStage: function () {
            this.course.stages.push({title: '', videoUrl: '', questions: [], currentQuestionId: null}),
            this.courseValidation.stages.push({title: true, videoUrl: true, questions: []});

            this.currentStageId = (this.currentStageId === null? 0 : this.course.stages.length - 1 );
        },
        changeStage: function (stageIndex) {
            this.currentStageId = stageIndex
        },
        addQuestion: function (stageIndex) {
            var stage = this.course.stages[stageIndex];
            var stageValidation = this.courseValidation.stages[stageIndex];

            stage.questions.push({question: '', explanation: '', options: []});
            stageValidation.questions.push({question: true, explanation: true, options: []});

            stage.currentQuestionId =  (stage.currentQuestionId  == null ? 0 : stage.questions.length - 1);
        },
        changeQuestion: function (stageIndex, questionIndex) {
            this.course.stages[stageIndex].currentQuestionId = questionIndex;
        },
        addOption: function (stageIndex, questionIndex) {
            var question = this.course.stages[stageIndex].questions[questionIndex];
            var questionValidation = this.courseValidation.stages[stageIndex].questions[questionIndex];

            question.options.push({text: '', isCorrect: false});
            questionValidation.options.push({text: true});
        }
    },
    store: store
});

})();