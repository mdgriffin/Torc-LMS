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
        getTrainee: function (state) {
            return function (userId) {
                let user = state.traineeUsers.filter(user => user.userId === userId);
                return user.length > 0 ? user[0] : null;
            }
        },
        traineeUsers: function (state) {
            return state.traineeUsers;
        },
        courses: function (state) {
            return state.courses;
        }
    },
    actions: {
        retrieveTraineeUsers: function (context) {
            if (context.state.traineeUsers.length === 0) {
                return UserApi.getTraineeUsers()
                    .then(function (traineeUsers) {
                        context.commit('setTraineeUsers', traineeUsers)
                    });
            } else {
                return Promise.resolve();
            }

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