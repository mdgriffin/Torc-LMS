var TraineeHomeApp = (function () {

    var template = `
        <article class="card">
            <div class="card-body">
                <h3>Assigned Courses</h3>
        
                <div v-for="course in assignedCourses">
                    <h3>{{ course.title }}</h3>
        
                    <a :href="'course/' + course.courseId">Start</a>
                </div>
            </div>
        </article>
    `

    return {
        template: template,
        data: function () {
            return {
                assignedCourses: []
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
                    self.assignedCourses = json;
                });
        }
    };

})();

new Vue(TraineeHomeApp).$mount('#traineeHomeApp');