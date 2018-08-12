var TraineeHomeApp = (function () {

    var template = `
        <article class="card">
            <div class="card-body">
        
                <loading-status v-if="assignmentsLoading"></loading-status>
        
                <div class="userAssignments" v-if="!assignmentsLoading">
                
                    <div class="userAssignments-section">
                
                        <h3>Assigned Course</h3>
                        <div v-for="(assignment, assignmentIndex) in incompleteAssignments" class="userAssignments-single">
                            <img v-if="assignment.assignedCourse.imageName !== null" :src="cdnUrl + '/images/' + assignment.assignedCourse.imageName" alt="">
                            <img v-else :src="contextRoot + '/images/placeholder.jpeg'" alt="">
                            <div class="userAssignments-single-body">
                                <h4>{{ assignment.assignedCourse.title }}</h4>
                                <h4>Deadline: {{ assignment.deadline | dateFormat }}</h4>
                                <p>{{ getPercentageCompleted(assignmentIndex)}} completed</p>
                                <a :href="'assignment/' + assignment.userAssignmentId">{{getCurrentStageIndex(assignmentIndex) === 0 ? 'Start' : 'Resume'}} Course</a>
                            </div>
                        </div>

                        <div class="alert alert-info" v-if="incompleteAssignments.length === 0">You are currently not assigned any course</div>

                    </div>
                    
                    <div class="userAssignments-section">
                    
                        <h3>Completed Assignments</h3>
                    
                        <div v-for="(assignment, assignmentIndex) in completedAssignments" class="userAssignments-single">
                            <img v-if="assignment.assignedCourse.imageName !== null" :src="cdnUrl + '/images/' + assignment.assignedCourse.imageName" alt="">
                            <img v-else :src="contextRoot + '/images/placeholder.jpeg'" alt="">
                            <div class="userAssignments-single-body">
                                <h4>{{ assignment.assignedCourse.title }}</h4>
                            </div>
                        </div>
                        
                        <div class="alert alert-info" v-if="completedAssignments.length === 0">You have not completed any courses</div>
                    
                    </div>
                    
                    <div class="userAssignments-section" v-if="lockedAssignments.length > 0">
                    
                         <h3>Locked Assignments</h3>
                        
                        <div v-for="(assignment, assignmentIndex) in lockedAssignments" class="userAssignments-single">
                            <img v-if="assignment.assignedCourse.imageName !== null" :src="cdnUrl + '/images/' + assignment.assignedCourse.imageName" alt="">
                            <img v-else :src="contextRoot + '/images/placeholder.jpeg'" alt="">
                            <div class="userAssignments-single-body">
                                <h3>{{ assignment.assignedCourse.title }}</h3>
                            </div>
                        </div>

                    </div>
                
                </div>
                
                
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
        computed: {
            incompleteAssignments: function () {
                return this.userAssignments.filter(assignment => assignment.status === 'INCOMPLETE');
            },
            completedAssignments: function () {
                return this.userAssignments.filter(assignment => assignment.status === 'COMPLETED');
            },
            lockedAssignments: function () {
                return this.userAssignments.filter(assignment => assignment.status === 'LOCKED');
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