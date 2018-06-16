var store = new Vuex.Store({
    state: {
        course: {
            title: '',
            stages: {},
            wasValidated: false,
            currentStageId: null
        }
    },
    mutations: {
        removeCourse: function (state) {
            Vue.set(state, 'course', {title: '', stages: {}, wasValidated: false});
            Vue.set(state.course, 'currentStageId', null);
        },
        setWasValidated: function (state, wasValidated) {
            Vue.set(state.course, 'wasValidated', wasValidated);
        },
        addStage: function (state, stageObj) {
            Vue.set(state.course.stages, stageObj.stageid, stageObj);
            Vue.set(state.course, 'currentStageId', stageObj.stageid);
        },
        removeStage: function (state, stageid) {
            Vue.delete(state.course.stages, stageid);

            if (stageid === state.course.currentStageId && Object.keys(state.course.stages).length > 0) {
                Vue.set(state.course, 'currentStageId', Object.keys(state.course.stages)[0]);
            }
        },
        setCurrentStageId: function (state, currentStageId) {
            Vue.set(state.course, 'currentStageId', currentStageId);
        },
        setCourseTitle: function (state, courseTitle) {
            Vue.set(state.course, 'title', courseTitle);
        },
        setStageTitle: function (state, data) {
            Vue.set(state.course.stages[data.stageid], 'title', data.title);
        },
        setStageVideoUrl: function (state, data) {
            Vue.set(state.course.stages[data.stageid], 'videoUrl', data.videoUrl);
        },
        setQuestionTitle: function (state, data) {
            Vue.set(state.course.stages[data.stageid].questions[data.questionid], 'question', data.title);
        },
        setQuestionAudio: function (state, data) {
            Vue.set(state.course.stages[data.stageid].questions[data.questionid], 'audio', data.audio);
        },
        addQuestionToStage: function (state, questionData) {
            var questions = state.course.stages[questionData.stageid].questions;
            Vue.set(questions, questionData.question.questionid, questionData.question);
            Vue.set(state.course.stages[questionData.stageid], 'currentQuestionId', questionData.question.questionid);
        },
        removeQuestionFromStage: function (state, data) {
            var stage = state.course.stages[data.stageid];
            Vue.delete(stage.questions, data.questionid);

            if (data.questionid === stage.currentQuestionId && Object.keys(stage.questions).length > 0) {
                Vue.set(stage, 'currentQuestionId', Object.keys(stage.questions)[0]);
            }
        },
        setCurrentQuestionid: function (state, data) {
            Vue.set(state.course.stages[data.stageid], 'currentQuestionId', data.currentQuestionId);
        },
        addQuestionOption: function (state, data) {
            var questionOptions = state.course.stages[data.stageid].questions[data.questionid].options;
            Vue.set(questionOptions, data.option.optionid, data.option);
        },
        setOptionText: function (state, data) {
            Vue.set(state.course.stages[data.stageid].questions[data.questionid].options[data.optionid], 'text', data.text);
        },
        setOptionIsCorrect: function (state, data) {
            Vue.set(state.course.stages[data.stageid].questions[data.questionid].options[data.optionid], 'isCorrect', data.isCorrect);
        },
        removeOption: function (state, data) {
            Vue.delete(state.course.stages[data.stageid].questions[data.questionid].options, data.optionid);
        }
    },
    getters: {
        courseWasValidated: function (state) {
            return state.course.wasValidated;
        },
        courseTitle: function (state) {
            return state.course.title;
        },
        /*
        getQuestionTitle: function (state) {
            return function (stageid, questionid) {
                return state.course.stages[stageid].questions[questionid].question;
            }
        },
        */
        stages: function (state) {
            return state.course.stages;
        },
        currentStageId: function (state) {
            return state.course.currentStageId;
        },
        /*
        getStageById: function (state) {
            return function (stageid) {
                if (stageid < state.course.stages.lenght) {
                    return state.course.stages[stageid];
                }
            }
        },
        */
        getQuestionsForStage: function (state) {
            return function (stageid) {
                return state.course.stages[stageid].questions;
            }
        },
        getCurrentQuestionIdForStage: function (state) {
            return function (stageid) {
                return state.course.stages[stageid].currentQuestionId;
            }
        },
        getQuestionOptions: function (state) {
            return function (stageid, questionid) {
                return state.course.stages[stageid].questions[questionid].options;
            }
        },
        /*
        getOptionText: function (state) {
            return function (stageid, questionid, optionid) {
                return state.course.stages[stageid].questions[questionid].options[optionid].text;
            }
        },
        optionIsCorrect: function (state) {
            return function (stageid, questionid, optionid) {
                return state.course.stages[stageid].questions[questionid].options[optionid].isCorrect;
            }
        }
        */
    },
    actions: {
        saveCourse: function (context) {
            var course = {};

            course.title = context.state.course.title;
            course.enabled = true;
            course.stages = [];

            for (var stageKey in context.state.course.stages) {
                var stage = Util.clone(context.state.course.stages[stageKey]);

                delete stage.currentQuestionId
                delete stage.questions;
                delete stage.stageid;

                course.stages.push(stage);

            }

            // TODO: Place context root in config
            fetch('/lms/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(course)
            }).then(function (response) {
                console.log(response);
            });
        },
    }
});