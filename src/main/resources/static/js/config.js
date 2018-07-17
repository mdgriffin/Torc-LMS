var Config = (function () {
    var contextRoot = '/teamtorc-lms';

    return {
        contextRoot: contextRoot,
        coursesApiUrl: contextRoot + '/api/courses',
        assignedCoursesApiUrl: contextRoot + '/api/courses/assigned',
        assignCourseApiUrl: contextRoot + '/api/courses/assign',
        usersApiUrl: contextRoot + '/api/users',
        traineesApiUrl: contextRoot + '/api/users?trainees=true'
    }
})();