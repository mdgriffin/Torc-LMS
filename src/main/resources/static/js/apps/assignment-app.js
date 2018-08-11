var AssignmentApp = (function () {

    var template =  `
        <div class="courseApp">
            <loading-status v-if="assignment === null"></loading-status>
            <div class="course-stageContainer" v-if="assignment !== null">
                <assignment :assignment="assignment" :stage-index="currentStageIndex"></assignment>
            </div>
        </div>
    `;

    return {
        template: template,
        data: function () {
            return {
                assignment: null,
                course: null
            }
        },
        components: {
            'assignment': Assignment,
            'loading-status': LoadingStatus
        },
        computed: {
            currentStageIndex: function () {
                if (this.assignment.currentStageId) {
                    let currentStageIndex = -1;
                    this.assignment.assignedCourse.stages.forEach((stage, stageIndex) => {
                        if (stage.stageId === this.assignment.currentStageId) {
                            currentStageIndex = stageIndex;
                        }
                    });
                    if (currentStageIndex !== -1) {
                        return currentStageIndex;
                    }
                }
                return 0;
            }
        },
        created: function () {
            var self = this;
            var assignmentId = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
            fetch(Config.assignmentsdApiUrl + '/' + assignmentId, {
                credentials: 'include'
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(assignment => {
                self.assignment = assignment;
            })
            .catch(error => {
                console.error(error);
                alert("An error has occurred, please try again");
            })
        }
    }

})();

new Vue(AssignmentApp).$mount('#assignmentApp');