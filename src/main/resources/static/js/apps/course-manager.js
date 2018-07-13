var app = new Vue({
    el: '#courseManageApp',
    data: {
        courses: []
    },
    components: {
        'course-list': CourseList
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
                self.courses = json;
            });
    }
});