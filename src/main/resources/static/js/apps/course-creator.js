const CourseCreatorApp = (function () {

    const template = `
        <div>
            <loading-status v-if="courseLoading"></loading-status>
            <course-creator v-if="!courseLoading" :course-data="course"></course-creator>
        </div>
    `;

    return {
        template: template,
        data: function () {
            return {
                courseLoading: true,
                course: {
                    title: '',
                    imageName: '',
                    stages: [],
                    wasValidated: false
                }
            }
        },
        components: {
            'loading-status': LoadingStatus
        },
        created: function () {
            let self = this;
            if (pathVariables.courseId >= 0) {
                CoursesApi.getCourseById(pathVariables.courseId)
                    .then(course => {
                        self.course = course;
                        self.courseLoading = false;
                    });

            } else {
                self.courseLoading = false;
            }
        }
    }

})();

new Vue(CourseCreatorApp).$mount('#courseCreatorApp');
