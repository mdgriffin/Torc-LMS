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

        fetch(Config.traineesApiUrl, {
            credentials: 'same-origin'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                self.users = json;
            });

        fetch(Config.coursesApiUrl, {
            credentials: 'same-origin'
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                self.courses = json;
            });
    }
});