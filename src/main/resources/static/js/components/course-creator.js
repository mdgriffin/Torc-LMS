(function () {

var commonMixin = {
    computed: {
        wasValidated: function () {
            return this.$store.getters.courseWasValidated;
        }
    },
    store: store
}

var optionTemplate = [
    '<div class="form-group row">',
        '<label class="col-sm-2 col-form-label">Option {{index + 1}}</label>',
        '<div class="col-sm-7">',
            '<input type="text" v-model="optionText" :class="[\'form-control\', {\'is-invalid\': wasValidated && !validOptionText}]" />',
            '<div class="invalid-feedback">Option text must be provided</div>',
        '</div>',
        '<div class="col-sm-2">',
            '<div class="form-check">',
                '<input class="form-check-input" type="checkbox" :id="\'chbx-questionoption-\' + option.optionid" v-model="isCorrect"><label class="form-check-label" :for="\'chbx-questionoption-\' + option.optionid"><i class="fas fa-check-circle"></i></label>',
            '</div>',
        '</div>',
        '<div class="col-sm-1 text-right">',
            '<button class="btn btn-medium btn-light" @click="removeOption"><i class="fas fa-trash-alt"></i></button>',
        '</div>',
    '</div>',
].join('');

Vue.component('course-creator-option', {
    props: ['stageid', 'questionid', 'option', 'index'],
    mixins: [commonMixin],
    template: optionTemplate,
    data: function () {
        return {
            optionText: this.option.text,
            isCorrect: this.option.isCorrect
        }
    },
    methods: {
        removeOption: function () {
            this.$store.commit('removeOption', {stageid: this.stageid, questionid: this.questionid, optionid: this.option.optionid});
        }
    },
    watch: {
        optionText: function (newVal) {
            this.$store.commit('setOptionText', {stageid: this.stageid, questionid: this.questionid, optionid: this.option.optionid, text: newVal});
        },
        isCorrect: function (newVal) {
            this.$store.commit('setOptionIsCorrect', {stageid: this.stageid, questionid: this.questionid, optionid: this.option.optionid, isCorrect: newVal});
        }
    },
    computed: {
        validOptionText: function () {
            return this.optionText.length > 0;
        },
        validOptionText: function () {
            return this.optionText.length > 0;
        }
    }
});

var questionTemplate = [
'<div class="courseCreator-questions-tabInner">',
    '<div class="form-group">',
        '<label>Question</label>',
        '<input type="text" v-model="questionTitle" :class="[\'form-control\', {\'is-invalid\': wasValidated && !validQuestionTitle}]" />',
        '<div class="invalid-feedback">Question is required</div>',
    '</div>',
    '<div class="form-group">',
        '<label>Audio</label>',
        '<input type="text" v-model="questionAudio" class="form-control" />',
    '</div>',
    '<div class="courseCreator-questions-options">',
        '<h4>Options</h4>',
        '<course-creator-option v-for="(option, optionKey, optionIndex) in options" :stageid="stageid" :questionid="question.questionid" :option="option" :index="optionIndex" :key="optionKey"></course-creator-option>',
        '<button class="btn btn-light" @click="addOption">Add Option  <i class="fas fa-plus-circle"></i></button>',
    '</div>',
'</div>',
].join("");




Vue.component('course-creator-question', {
    props: ['stageid', 'question'],
    mixins: [commonMixin],
    template: questionTemplate,
    data: function () {
        return  {
            questionTitle: this.question.question,
            questionAudio: this.question.audio
        }
    },
    methods: {
        addOption: function () {
            this.$store.commit('addQuestionOption', {stageid: this.stageid, questionid: this.question.questionid, option: {optionid: Util.guid(), text: '', isCorrect: false}});
        }
    },
    watch: {
        questionTitle: function () {
            this.$store.commit('setQuestionTitle', {stageid: this.stageid, questionid: this.question.questionid, title: this.questionTitle});
        },
        questionAudio: function () {
            this.$store.commit('setQuestionAudio', {stageid: this.stageid, questionid: this.question.questionid, audio: this.questionAudio});
        }
    },
    computed: {
        validQuestionTitle: function () {
            return this.questionTitle.length > 0;
        },
        options: function () {
            return this.$store.getters.getQuestionOptions(this.stageid, this.question.questionid);
        }
    }
});

var stageTemplate = [
'<div class="courseCreator-stageSingle">',
    '<div class="form-group">',
        '<label>Stage Title</label>',
        '<input type="text" v-model="title" :class="[\'form-control\', {\'is-invalid\': wasValidated && !validQuestionTitle}]" />',
        '<div class="invalid-feedback" >Stage Title is required</div>',
    '</div>',
    '<div class="form-group">',
        '<label>Video URL</label>',
        '<input type="text" v-model="videoUrl" :class="[\'form-control\', {\'is-invalid\': wasValidated && !validVideoUrl}]" />',
        '<div class="invalid-feedback">Video URL is required</div>',
    '</div>',
    '<div class="courseCreator-questions">',
        '<ul class="nav nav-tabs">',
            '<li class="nav-item" v-for="(question, questionKey, questionIndex) in questions">',
                '<a :class="[\'nav-link\', {active: currentQuestionId === questionKey}]" @click="changeQuestion(questionKey)">Question {{questionIndex + 1}} <button class="btn btn-clear" @click.stop="removeQuestion(questionKey)"><i class="fas fa-trash-alt"></i></button></a>',
            '</li>',
            '<li class="nav-item nav-buttonContainer"><button class="btn btn-secondary" @click="addQuestion">Add Question  <i class="fas fa-plus-circle"></i></button></li>',
        '</ul>',
        // v-if="stage.currentQuestionId === questionIndex
        '<course-creator-question v-for="(question, questionKey, questionIndex) in questions" :stageid="stageid" :question="question" :key="questionKey" v-if="currentQuestionId === questionKey"></course-creator-question>',
    '</div>',
'</div>'
].join("");



Vue.component('course-creator-stage', {
    props: ['stageid', 'stage'],
    mixins: [commonMixin],
    template: stageTemplate,
    data: function () {
        return {
            title: this.stage.title,
            videoUrl: this.stage.videoUrl
        };
    },
    methods: {
        addQuestion: function () {
            // TODO: Move blank question and stage data to constants
            this.$store.commit('addQuestionToStage', {stageid: this.stageid, question: {questionid: Util.guid(),question: '', explanation: '', options: {}}});
        },
        removeQuestion: function (questionid) {
            this.$store.commit('removeQuestionFromStage', {stageid: this.stageid, questionid: questionid});
        },
        changeQuestion: function (questionid) {
            this.$store.commit('setCurrentQuestionid', {stageid: this.stageid, currentQuestionId: questionid});
        }
    },
    computed: {
        questions: function () {
            return this.$store.getters.getQuestionsForStage(this.stageid);
        },
        currentQuestionId: function () {
            return this.$store.getters.getCurrentQuestionIdForStage(this.stageid);
        },
        validQuestionTitle: function () {
            return this.title.length > 0;
        },
        validVideoUrl: function () {
            return this.videoUrl.length > 0;
        }
    },
    watch: {
        title: function (newVal) {
            this.$store.commit('setStageTitle', {title: newVal, stageid: this.stageid});
        },
        videoUrl: function (newVal) {
            this.$store.commit('setStageVideoUrl', {videoUrl: newVal, stageid: this.stageid});
        }
    }
});

var template = [
    '<div :class="[\'courseCreator\', {wasValidated: wasValidated}]">',
        '<div class="courseCreator-form">',
            '<div class="form-group">',
                '<label>Course Title</label>',
                '<input type="text" v-model="courseTitle" :class="[\'form-control\', {\'is-invalid\': wasValidated && !validCourseTitle}]"/>',
                '<div class="invalid-feedback" >Course Title is required</div>',
            '</div>',
            '<div class="courseCreator-stages">',
                '<ul class="nav nav-tabs courseCreator-stages-tabs">',
                    '<li class="nav-item" v-for="(stage, stageKey, stageIndex) in stages">',
                        '<a :class="[\'nav-link\', {active: stageKey === currentStageId}]" @click="changeStage(stageKey)">Stage {{stageIndex + 1}} <button class="btn btn-clear" @click.stop="removeStage(stageKey)"><i class="fas fa-trash-alt"></i></button></a>',
                    '</li>',
                    '<li class="nav-item nav-buttonContainer"><button class="btn btn-primary" @click="addStage">Add a Stage  <i class="fas fa-plus-circle"></i></button></li>',
                '</ul>',
                '<course-creator-stage v-for="(stage, stageKey, stageIndex) in stages" v-if="stageKey === currentStageId" :stage="stage" :stageid="stageKey" :key="stageKey"></course-creator-stage>',
            '</div>', // courseCreator-stages
            '<div class="courseCreator-actions">',
                '<button @click="saveCourse" class="btn btn-primary">Save</button>',
                '<button @click="clearForm" class="btn btn-secondary">Clear Form</button>',
            '</div>', // courseCreator-actions
        '</div>', // courseCreator-form
    '</div>', // courseCreator
].join('');

Vue.component('course-creator', {
    template: template,
    mixins: [commonMixin],
    data: function () {
        return {
            // TODO: This should be passed in a prop
            courseTitle: this.$store.getters.courseTitle
        }
    },
    computed: {
        stages: function () {
            return this.$store.getters.stages;
        },
        currentStageId: function () {
            return this.$store.getters.currentStageId;
        },
        validCourseTitle: function () {
            return this.courseTitle.length > 0;
        }
    },
    watch: {
        courseTitle: function () {
            this.$store.commit('setCourseTitle', this.courseTitle);
        }
    },
    methods: {
        saveCourse: function () {
            this.$store.commit('setWasValidated', true);

            // TODO: Need to validate entire is valid
            //if (this.validateCourses()) {
                //this.$store.commit('saveCourse', this.course);
                this.$store.dispatch('saveCourse');
            //}
        },
        clearForm: function () {
            console.log('Clearing Form');
            this.$store.commit('removeCourse');
        },
        addStage: function () {
            this.$store.commit('addStage', {stageid: Util.guid(), title: '', videoUrl: '', questions: {}, currentQuestionId: null});
        },
        removeStage: function (stageid) {
            this.$store.commit('removeStage', stageid);
        },
        changeStage: function (stageIndex) {
            this.$store.commit('setCurrentStageId', stageIndex);
        },
    }
});



})();