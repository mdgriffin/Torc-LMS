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
        .error(error => {
            console.error(error);
            alert("An error has occurred, please try again");
        });
    }
});