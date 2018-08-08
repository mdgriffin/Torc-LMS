var CourseManageApp = (function () {

    var template = `
        <div class="courseManager">
            <div class="alert alert-danger" v-if="!loadingCourses && loadingError">An error has occured while loading courses</div>
            <div class="alert alert-info" v-if="!loadingCourses && !loadingError && courses.length === 0">No Courses Found</div>
            <loading-status v-if="loadingCourses"></loading-status>
            <course-list v-if="courses.length > 0" :courses="courses"></course-list>
        </div>
    `

    return {
        template: template,
        data: {
            courses: [],
            loadingCourses: true,
            loadingError: false
        },
        components: {
            'course-list': CourseList,
                'loading-status': LoadingStatus
        },
        created: function () {
            var self = this;

            fetch(Config.coursesApiUrl, {
                credentials: 'include'
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
                .then(json => {
                    self.loadingCourses = false;
                    self.courses = json;
                })
                .catch(error => {
                    console.error(error);
                    self.loadingError = true;
                });
        }
    }
})();

new Vue(CourseManageApp).$mount('#courseManageApp');