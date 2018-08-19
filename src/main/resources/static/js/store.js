var store = new Vuex.Store({
    state: {
        users: [],
        traineeUsers: [],
        courses: []
    },
    mutations: {
        setUsers: function (state, users) {
            state.users = users;
        },
        setTraineeUsers: function (state, traineeUsers) {
            state.traineeUsers = traineeUsers
        },
        setCourses: function (state, courses) {
            state.courses = courses;
        }
    },
    getters: {
        users: function (state) {
            return state.users;
        },
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
        retrieveUsers: function (context) {
            if (context.state.users.length === 0) {
                return UserApi.getAllUsers()
                    .then(function (users) {
                        context.commit('setUsers', users)
                    });
            } else {
                return Promise.resolve();
            }
        },
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