var store = new Vuex.Store({
    state: {
        traineeUsers: []
    },
    mutations: {
        setTraineeUsers: function (state, traineeUsers) {
            state.traineeUsers = traineeUsers
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
        }
    }
});