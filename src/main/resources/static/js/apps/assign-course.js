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
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(json => {
            self.users = json;
        })
        .catch(error => {
            console.error(error);
            alert("An error has occured, please try again");
        })

        fetch(Config.coursesApiUrl, {
            credentials: 'same-origin'
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(json => {
            self.courses = json;
        })
        .catch(error => {
            console.error(error);
            alert("An error has occurred, please try again");
        })
    }
});