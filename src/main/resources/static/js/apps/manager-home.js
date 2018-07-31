var ManagerHomeApp = (function () {

    var template = `
        <article class="card">
            <div class="card-body">
        
                <div class="lockedAssignments">
                    <h3>Locked Assignments</h3>
                    
                    <loading-status v-if="lockedAssignmentsLoading"></loading-status>
                    
                    <div class="lockedAssignments-single" v-for="(assignment, assignmentIndex) in lockedAssignments">
                        <h4>User: {{assignment.assignedUser.firstname}} {{assignment.assignedUser.surname}}</h4>
                        <p>Course: {{assignment.assignedCourse.title}}</p>
                        <button class="btn btn-outline-secondary">Unlock</button>
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
                lockedAssignmentsLoading: true
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