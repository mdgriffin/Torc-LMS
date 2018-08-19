const AssignmentsApi = {
    getAssignments: function (courseId) {
        return fetch(Config.assignmentsdApiUrl, {
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