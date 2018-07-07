var CourseApp = (function () {

    var template =  `
        <div class="courseApp">
            <loading-status v-if="course === null"></loading-status>
            <div class="course-stageContainer" v-if="course !== null">
                <course :course="course"></course>
            </div>
        </div>
    `;

    return {
        template: template,
        data: function () {
            return {
                course: null
            }
        },
        components: {
            'course': Course,
            'loading-status': LoadingStatus
        },
        created: function () {
            var self = this;
            // get the course from the rest service
            var courseId = parseInt(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
            fetch('/lms/api/courses/' + courseId, {
                credentials: 'include'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (course) {
                    self.course = course;
                });
        }
    }

})();

new Vue(CourseApp).$mount('#courseApp');