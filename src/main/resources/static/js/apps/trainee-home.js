var TraineeHomeApp = (function () {

    var template = `
        <article class="card">
            <div class="card-body">
                <h3>Assigned Courses</h3>
        
                <div v-for="assignment in userAssignments">
                    <h3>{{ assignment.assignedCourse.title }}</h3>
        
                    <a :href="'course/' + assignment.assignedCourse.courseId">Start</a>
                </div>
            </div>
        </article>
    `

    return {
        template: template,
        data: function () {
            return {
                userAssignments: []
            }
        },
        components: {},
        created: function () {
            var self = this;

            fetch(Config.assignedCoursesApiUrl, {
                credentials: "include"
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    self.userAssignments = json;
                });
        }
    };

})();

new Vue(TraineeHomeApp).$mount('#traineeHomeApp');