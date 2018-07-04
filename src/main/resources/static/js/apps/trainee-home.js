var traineeHomeApp =  new Vue({
    el: '#traineeHomeApp',
    data: {
        assignedCourses: null
    },
    components: {},
    created: function () {
        var self = this;

        fetch('/lms/api/courses/assigned', {
            credentials: "include"
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                self.assignedCourses = json;
            });
    }
});