var store = new Vuex.Store({
    state: {
        traineeUsers: [],
        courses: []
    },
    mutations: {
        setTraineeUsers: function (state, traineeUsers) {
            state.traineeUsers = traineeUsers
        },
        setCourses: function (state, courses) {
            state.courses = courses;
        }
    },
    getters: {
        /*
        getQuestionTitle: function (state) {
            return function (stageid, questionid) {
                return state.course.stages[stageid].questions[questionid].question;
            }
        },
        */
        getTraineeUsers: function (state) {
            return state.traineeUsers;
        },
        getCourses: function (state) {
            return state.courses;
        }
    },
    actions: {
        retrieveTraineeUsers: function (context) {
            return fetch(Config.traineesApiUrl, {
                credentials: 'same-origin'
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(traineeUsers => {
                context.commit('setTraineeUsers', traineeUsers)
            });
        },
        retrieveCourses: function (context) {
            return fetch(Config.coursesApiUrl, {
                credentials: 'same-origin'
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
                .then(courses => {
                    context.commit('setCourses', courses)
                });
        }
    }
});