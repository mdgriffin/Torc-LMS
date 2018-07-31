var ManagerHomeApp = (function () {

    var template = `
        <article class="card">
            <div class="card-body">
        
                <div class="lockedAssignments">
                    <h3>Locked Assignments</h3>
                    
                    <loading-status v-if="lockedAssignmentsLoading"></loading-status>
                    
                    <h4 v-if="!lockedAssignmentsLoading && lockedAssignments.length === 0" class="muted">No Locked User Assignments Found</h4>
                    
                    <div :class="['lockedAssignments-single', isUnlocking(assignment.userAssignmentId) ? 'lockedAssignments-single-unlocking' : '']" v-for="(assignment, assignmentIndex) in lockedAssignments">
                        <h4>User: {{assignment.assignedUser.firstname}} {{assignment.assignedUser.surname}}</h4>
                        <p>Course: {{assignment.assignedCourse.title}}</p>
                        <button class="btn btn-outline-secondary" @click="unlockAssignment(assignment.userAssignmentId)">Unlock</button>
                    </div>
                </div>
            </div>
        </article>
    `;

    return {
        template: template,
        data: function () {
            return {
                lockedAssignments: [],
                lockedAssignmentsLoading: true,
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
                    self.lockedAssignments = self.lockedAssignments.filter(assignment => assignment.userAssignmentId != updatedAssignment.userAssignmentId);
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

            fetch(Config.assignmentsByStatusApiUrl + '/LOCKED', {
                credentials: "include"
            })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                self.lockedAssignmentsLoading = false;
            })
            .catch(error => {
                console.error('Error', error);
                self.lockedAssignmentsLoading = false;
            })
            .then(function (json) {
                console.log(json);
                if (json) {
                    self.lockedAssignments = json;
                    self.lockedAssignmentsLoading = false;
                }
            });
        }
    }

})();


new Vue(ManagerHomeApp).$mount('#managerHomeApp');