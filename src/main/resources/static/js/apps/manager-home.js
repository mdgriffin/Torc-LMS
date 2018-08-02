var ManagerHomeApp = (function () {

    var template = `
        <article class="card">
            <div class="card-body">
        
                <div class="lockedUsers">
                    <h3>Locked Assignments</h3>
                    
                    <loading-status v-if="lockedUsersLoading"></loading-status>
                    
                    <h4 v-if="!lockedUsersLoading && lockedUsers.length === 0" class="muted">No Locked User Assignments Found</h4>
                    
                    <div class="lockedUsers-single" v-for="(user, userIndex) in lockedUsers">
                        <h4>User: {{user.firstname}} {{user.surname}}</h4>
                        
                        <div :class="['lockedUsers-assignment', isUnlocking(assignment.userAssignmentId) ? 'lockedUsers-assignment-unlocking' : '']" v-for="(assignment, assignmentIndex) in user.assignedCourses" v-if="assignment.status === 'LOCKED'">
                            <p>Course: {{assignment.assignedCourse.title}}</p>
                            <button class="btn btn-outline-secondary" @click="unlockAssignment(assignment.userAssignmentId)">Unlock</button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
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
                    return response.json();
                })
                .then(updatedAssignment => {
                    self.lockedUsers = self.lockedUsers.filter(user => {
                        user.assignedCourses = user.assignedCourses.filter(assignment => assignment.userAssignmentId != updatedAssignment.userAssignmentId)

                        return user.assignedCourses.length > 0;
                    });
                })
                .catch(error => {
                    console.error(error);
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
            })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                self.lockedUsersLoading = false;
            })
            .catch(error => {
                console.error('Error', error);
                self.lockedUsersLoading = false;
            })
            .then(function (json) {
                console.log(json);
                if (json) {
                    self.lockedUsers = json;
                    self.lockedUsersLoading = false;
                }
            });
        }
    }

})();


new Vue(ManagerHomeApp).$mount('#managerHomeApp');