var store = new Vuex.Store({
    state: {
        users: [],
        traineeUsers: [],
        courses: [],
        assignments: [],
        stageAttempts: []
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
        },
        setAssignments: function (state, assignments) {
            state.assignments = assignments;
        },
        setStageAttempts: function (state, stageAttempts) {
            state.stageAttempts = stageAttempts;
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
        },
        assignments: function (state) {
            return state.assignments;
        },
        stageAttempts: function (state) {
            return state.stageAttempts;
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
        },
        retrieveAssignments: function (context) {
            if (context.state.assignments.length === 0) {
                return AssignmentsApi.getAssignments()
                    .then(function (assignments) {
                        context.commit('setAssignments', assignments)
                    });
            } else {
                return Promise.resolve();
            }
        },
        retrieveStageAttempts: function (context) {
            if (context.state.stageAttempts.length === 0) {
                return StageAttemptsApi.getAll()
                    .then(function (stageAttempts) {
                        context.commit('setStageAttempts', stageAttempts)
                    });
            } else {
                return Promise.resolve();
            }
        }
    }
});