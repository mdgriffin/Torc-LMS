var app = new Vue({
    el: '#assignStageApp',
    data: {
        users: [],
        courses: []
    },
    components: {
        'assign-course': AssignCourse
    },
    created: function () {
        var self = this;

        fetch('/lms/api/users')
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                self.users = json;
            });

        fetch('/lms/api/courses')
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                self.courses = json;
            });
    }
});