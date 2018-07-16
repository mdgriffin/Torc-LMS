var app = new Vue({
    el: '#courseManageApp',
    data: {
        courses: [],
        loadingCourses: true
    },
    components: {
        'course-list': CourseList,
        'loading-status': LoadingStatus
    },
    created: function () {
        var self = this;

        fetch(Config.coursesApiUrl, {
            credentials: 'include'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            self.loadingCourses = false;
            self.courses = json;
        });
    }
});