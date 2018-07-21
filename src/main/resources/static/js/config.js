var Config = (function () {
    var contextRoot = '/teamtorc-lms';

    return {
        contextRoot: contextRoot,
        coursesApiUrl: contextRoot + '/api/courses',
        assignedCoursesApiUrl: contextRoot + '/api/courses/assigned'
        usersApiUrl: contextRoot + '/api/users',
        traineesApiUrl: contextRoot + '/api/users?trainees=true',
        cdnUrl: 'https://storage.googleapis.com/torc-lms.appspot.com'
    }
})();