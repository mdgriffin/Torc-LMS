const LockedAssignments = (function () {

    var template = `
        <div class="lockedUsers container">
            <div class="section">

                <h2 class="pageTitle">Locked Assignments</h2>
            
                <div class="card">
                    <div class="card-body">
                        
                        <loading-status v-if="lockedUsersLoading"></loading-status>
                    
                        <h4 v-if="!lockedUsersLoading && lockedUsers.length === 0" class="muted">No Locked User Assignments Found</h4>
                
                        <div class="lockedUsers-single" v-for="(user, userIndex) in lockedUsers">
                            <h4>{{user.firstname}} {{user.surname}}</h4>
                            
                            <div :class="['lockedUsers-assignment', isUnlocking(assignment.userAssignmentId) ? 'lockedUsers-assignment-unlocking' : '']" v-for="(assignment, assignmentIndex) in user.assignedCourses" v-if="assignment.status === 'LOCKED'">
                                <p>Course: {{assignment.assignedCourse.title}}</p>
                                <button class="btn btn-outline-secondary" @click="unlockAssignment(assignment.userAssignmentId)">Unlock</button>
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
            
        </div>
    `;

    return {
        template: template,
        data: function () {
            return {
                lockedUsers: [],
                lockedUsersLoading: true,
                unlocking: []
            }
        },
        methods: {
            unlockAssignment: function (userAssignmentId) {
                let self = this;

                self.unlocking.push(userAssignmentId);

                fetch(Config.assignmentsUnlockApiUrl + '/' + userAssignmentId, {
                    method: 'POST',
                    credentials: 'same-origin'
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw Error(response.statusText);
                    }
                })
                .then(updatedAssignment => {
                    self.lockedUsers = self.lockedUsers.filter(user => {
                        user.assignedCourses = user.assignedCourses.filter(assignment => assignment.userAssignmentId != updatedAssignment.userAssignmentId)
                        return user.assignedCourses.length > 0;
                    });
                })
                .catch(error => {
                    console.error(error);
                    alert("An error has occurred, please try again");
                })
            },
            isUnlocking: function (userAssignmentId) {
                return this.unlocking.indexOf(userAssignmentId) != -1;
            }
        },
        components: {
            'loading-status': LoadingStatus
        },
        created: function () {
            var self = this;

            fetch(Config.usersWithLockedAssignmentsApiUrl, {
                credentials: "include"
            }) .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(json => {
                if (json) {
                    self.lockedUsers = json;
                }
                self.lockedUsersLoading = false;
            })
            .catch(error => {
                console.error(error);
                alert("An error has occurred, please try again");
                self.lockedUsersLoading = false;
            });
        }
    }

})();

const ManagerStats = (function () {

    const  template = `
        <div class="managerStats container">
            <div class="section">
                <h2 class="pageTitle">Statistics</h2>
                <div class="card">
                    <div class="card-body"></div>
                        <bar-chart :chart-data="chartData"></bar-chart>
                    </div>
                </div>
        </div>
    `

    return {
        template: template,
        data: function () {
            return {
                chartData: {
                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [
                        {
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                        }
                    ]
                }
            }
        },
        components: {
            'bar-chart': BarChart
        }
    }

})();

const UserPage = (function () {

    let template = `
        <div class="userPage container">
            <div class="section">
                <h2 class="pageTitle">Users</h2>
                <div class="card">
                    <div class="card-body">
                        <loading-status v-if="traineeUsersLoading"></loading-status>
                        <div v-if="!traineeUsersLoading">
                            <user-list :users="traineeUsers">
                                <template slot="actions" slot-scope="slotProps">
                                    <router-link :to="'/users/' + slotProps.user.userId" class="btn btn-outline-secondary">View</router-link>
                                </template>
                            </user-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return {
        template: template,
        data: function () {
            return {
                traineeUsersLoading: true
            }
        },
        computed: {
            traineeUsers: function () {
                console.log(this.$store.state.traineeUsers);
                return this.$store.state.traineeUsers;
            }
        },
        components: {
            'loading-status': LoadingStatus,
            'user-list': UserList
        },
        created: function () {
            this.$store.dispatch('retrieveTraineeUsers')
                .then(() => {
                    this.traineeUsersLoading = false;
                })
                .catch(err => {
                    console.error(err);
                    this.traineeUsersLoading = false;
                    alert('An error has occurred, please reload and try again');
                })
        },
        store: store
    };

})();

const UserSinglePage = (function () {

    const template = `
        <div class="p-userSingle container">
            <div class="section">
                <loading-status v-if="traineeLoading"></loading-status>
                <h2 class="pageTitle" v-if="!traineeLoading">{{user.firstname}} {{user.surname}}</h2>
                <div class="card"  v-if="!traineeLoading">
                    <div class="card-body">
                            <h3>Course History</h3>
                            <div class="itemList">
                                <div class="itemList-single" v-for="assignment in user.assignedCourses">
                                    <h4>{{assignment.assignedCourse.title}}</h4>
                                    <p>Current Status: {{ assignment.status}}</p>
                                    <p>Assigned On {{assignment.assignedOn | formatDate }}</p>
                                    <p v-if="assignment.status === 'INCOMPLETE'">Due On {{assignment.deadline | formatDate }}</p>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    `

    return {
        template: template,
        data: function () {
            return {
                traineeLoading: true
            }
        },
        computed: {
            user: function () {
                return this.$store.getters.getTrainee(parseInt(this.$route.params.id));
            }
        },
        filters: {
            formatDate: function (date) {
                return moment(date).format('h:mmA D/MM/YYYY')
            }
        },
        components: {
            'loading-status': LoadingStatus
        },
        created: function () {
            this.$store.dispatch('retrieveTraineeUsers')
                .then(() => {
                    this.traineeLoading = false;
                })
                .catch(err => {
                    console.error(err);
                    this.traineeLoading = false;
                    alert('An error has occurred, please reload and try again');
                });
        },
        store: store
    }

})();

const AssignCoursePage = (function () {

    const template = `
        <div class="assignStagePage container">
            <div class="section">
                <h2 class="pageTitle">Course Assign</h2>
                <div class="card">
                    <div class="card-body">
                        <assign-course :users="traineeUsers" :courses="courses"></assign-course>
                    </div>
                </div>
            </div>
        </div>
    `;

    return {
        template: template,
        data: function () {
            return {
                traineeUsersLoading: true,
                coursesLoading: true
            }
        },
        computed: {
            traineeUsers: function () {
                return this.traineeUsersLoading? null : this.$store.state.traineeUsers;
            },
            courses: function () {
                return this.coursesLoading? null : this.$store.state.courses;
            },
            isloading: function () {
                return this.traineeUsersLoading && this.coursesLoading;
            }
        },
        components: {
            'assign-course': AssignCourse
        },
        created: function () {
            this.$store.dispatch('retrieveTraineeUsers')
                .then(() => {
                    this.traineeUsersLoading = false;
                })
                .catch(err => {
                    console.error(err);
                    this.traineeUsersLoading = false;
                    alert('An error has occurred, please reload and try again');
                });

            this.$store.dispatch('retrieveCourses')
                .then(() => {
                    this.coursesLoading = false;
                })
                .catch(err => {
                    console.error(err);
                    this.coursesLoading = false;
                    alert('An error has occurred, please reload and try again');
                })
        },
        store: store
    };
})();

const ManagerApp = (function () {

    const routes = [
        { path: '/', redirect: '/locked' },
        { path: '/locked', component: LockedAssignments },
        { path: '/users', component: UserPage },
        { path: '/users/:id', component: UserSinglePage },
        { path: '/statistics', component: ManagerStats },
        { path: '/assign-course', component: AssignCoursePage }
    ]

    const router = new VueRouter({
        routes: routes
    })

    template = `
        <div class="managerApp">
            <main-nav></main-nav>
            <router-view></router-view>
        </div>
    `

    return {
        template: template,
        components: {
            'main-nav': MainNav
        },
        router: router
    }

})();

new Vue(ManagerApp).$mount('#managerApp');