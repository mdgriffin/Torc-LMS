const CoursesApi = {
    getCourseById: function (courseId) {
        return fetch(Config.coursesApiUrl + '/' + courseId, {
            credentials: 'same-origin'
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        });
    }
}