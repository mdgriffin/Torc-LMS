var TraineeHomeApp = (function () {

    var template = `
        <article class="card">
            <div class="card-body">
                <h3>Assigned Course</h3>
        
                <loading-status v-if="assignmentsLoading"></loading-status>
        
                <div class="userAssignments">
                    <div v-for="(assignment, assignmentIndex) in userAssignments" class="userAssignments-single" v-if="assignment.status === 'INCOMPLETE'">
                        <img v-if="assignment.assignedCourse.imageName !== null" :src="cdnUrl + '/images/' + assignment.assignedCourse.imageName" alt="">
                        <img v-else :src="contextRoot + '/images/placeholder.jpeg'" alt="">
                        <div class="userAssignments-single-body">
                            <h3>{{ assignment.assignedCourse.title }}</h3>
                            <h4>Deadline: {{ assignment.deadline | dateFormat }}</h4>
                            <p>{{ getPercentageCompleted(assignmentIndex)}} completed</p>
                            <a :href="'assignment/' + assignment.userAssignmentId">{{getCurrentStageIndex(assignmentIndex) === 0 ? 'Start' : 'Resume'}} Course</a>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-info" v-if="!assignmentsLoading && userAssignments.length === 0">There are currently no assigned courses</div>
            </div>
        </article>
    `

    return {
        template: template,
        data: function () {
            return {
                assignmentsLoading: true,
                userAssignments: [],
                contextRoot: Config.contextRoot,
                cdnUrl: Config.cdnUrl
            }
        },
        methods: {
            getCurrentStageIndex: function (assignmentIndex) {
                let assignment = this.userAssignments[assignmentIndex];

                if (assignment.currentStageId) {
                    let currentStageIndex = -1;
                    assignment.assignedCourse.stages.forEach((stage, stageIndex) => {
                        if (stage.stageId === assignment.currentStageId) {
                            currentStageIndex = stageIndex;
                        }
                    });
                    if (currentStageIndex !== -1) {
                        return currentStageIndex;
                    }
                }
                return 0;
            },
            getPercentageCompleted (assignmentIndex) {
                let currentStageIndex = this.getCurrentStageIndex(assignmentIndex);
                let numStages  = this.userAssignments[assignmentIndex].assignedCourse.stages.length;

                return (numStages > 0 ? (currentStageIndex / numStages) * 100 : 0) + '%';
            }
        },
        components: {
            'loading-status': LoadingStatus
        },
        filters: {
            dateFormat: function (date) {
                return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");
            }
        },
        created: function () {
            var self = this;

            fetch(Config.assignedCoursesApiUrl, {
                credentials: "include"
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            }) .then(json => {
                if (json) {
                    self.userAssignments = json;
                }
                self.assignmentsLoading = false;
            }).catch(error => {
                console.error('Error', error);
                self.assignmentsLoading = false;
                alert("An error has occurred, please try again");
            })
        }
    };

})();

new Vue(TraineeHomeApp).$mount('#traineeHomeApp');