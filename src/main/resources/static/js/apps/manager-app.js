var LockedAssignments = (function () {

    var template = `
        <div class="lockedUsers">
            <h3>Locked Assignments</h3>
            
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
                alert("An error has occured, please try again");
                self.lockedUsersLoading = false;
            });
        }
    }

})();

const BarChart = (function () {
    return {
        extends: VueChartJs.Bar,
        props: ['chartData'],
        data: function () {
            return {
                options: {}
            }
        },
        mounted () {
            this.renderChart(this.chartData, this.options)
        }
    }
})();

const ManagerStats = (function () {

    const  template = `
        <div>
            <bar-chart :chart-data="chartData"></bar-chart>
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
        <div>
            <loading-status v-if="traineeUsersLoading"></loading-status>
            <div v-if="!traineeUsersLoading">
                 <h3>Users</h3>
                <user-list :users="traineeUsers"></user-list>
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
                    alert('An error has occured, please reload and try again');
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
        { path: '/statistics', component: ManagerStats}
    ]

    const router = new VueRouter({
        routes: routes
    })

    template = `
        <div class="managerApp">
            <article class="card">
                <div class="card-body">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <router-link to="/locked" class="nav-link" :active-class="'active'">Assignment Unlock</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/users" class="nav-link" :active-class="'active'">Users</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/statistics" class="nav-link" :active-class="'active'">Statistics</router-link>
                        </li>
                    </ul>
                    <div class="mt-3 mb-3">
                        <router-view></router-view>
                    </div>
                </div>
            </article>
        </div>
    `

    return {
        template: template,
        router: router
    }

})();

new Vue(ManagerApp).$mount('#managerApp');