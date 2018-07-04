var app = new Vue({
    el: '#assignStageApp',
    data: {
        users: null,
        courses: null
    },
    components: {
        'assign-course': AssignCourse
    },
    created: function () {
        var self = this;

        fetch('/lms/api/users?trainees=true')
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