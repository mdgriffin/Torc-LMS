const AdminHome = (function () {

    const template = `
        <div class="p-adminHome row">
            <div class="col-sm-6">
                <article class="card">
                    <h4 class="card-header">Users</h4>
                    <div class="card-body">
                        <loading-status v-if="usersLoading"></loading-status>
                        <div v-if="!usersLoading">
                            <h4>User By Role:</h4>
                            <pie-chart :chart-data="chartUserRolesData"></pie-chart>
                            <p>Number of Users: {{users.length}}</p>
                        </div>
                    </div>
                </article>
            </div>
            <div class="col-sm-6">
                <article class="card">
                    <h4 class="card-header">Courses</h4>
                    <div class="card-body">
                        <loading-status v-if="coursesLoading"></loading-status>
                        <p v-if="!coursesLoading">Number of Courses: {{courses.length}}</p>
                    </div>
                </article>
            </div>
        </div>
    `;

    return {
        template: template,
        data: function () {
            return {
                usersLoading: true,
                coursesLoading: true,
                chartData: this.chartUserRolesData
            }
        },
        computed: {
            users: function () {
                return this.$store.state.users;
            },
            courses: function () {
                return this.$store.state.courses;
            },
            numAdminUsers: function () {
                return this.users.filter(user => user.roles[0].role === 'ADMIN').length;
            },
            numTraineeUsers: function () {
                return this.users.filter(user => user.roles[0].role === 'TRAINEE').length;
            },
            numManagerUsers: function () {
                return this.users.filter(user => user.roles[0].role === 'MANAGER').length;
            },
            chartUserRolesData: function () {
                return {
                    datasets: [{
                        backgroundColor: ['#cc0d00', '#1676cc', '#4fcc00'],
                        data: [this.numAdminUsers, this.numManagerUsers, this.numTraineeUsers]
                    }],
                    labels: ['Admin', 'Manager', 'Trainee']
                }
            }
        },
        components: {
            'loading-status': LoadingStatus,
            'bar-chart': BarChart,
            'pie-chart': PieChart
        },
        created: function () {
            this.$store.dispatch('retrieveUsers')
                .then(() => {
                    this.usersLoading = false;
                })
                .catch(err => {
                    console.error(err);
                    this.usersLoading = false;
                    alert('An error has occurred, please reload and try again');
                })

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
    }

})();

new Vue(AdminHome).$mount('#adminHomeApp');