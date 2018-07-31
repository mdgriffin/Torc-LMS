var Config = (function () {
    var contextRoot = '/teamtorc-lms';

    return {
        contextRoot: contextRoot,
        coursesApiUrl: contextRoot + '/api/courses',
        assignmentsdApiUrl: contextRoot + '/api/assignments',
        assignmentsByStatusApiUrl: contextRoot + '/api/assignments/status',
        assignmentsUnlockApiUrl: contextRoot + '/api/assignments/unlock',
        assignedCoursesApiUrl: contextRoot + '/api/assignments/active-user',
        usersApiUrl: contextRoot + '/api/users',
        traineesApiUrl: contextRoot + '/api/users?trainees=true',
        cdnUrl: 'https://storage.googleapis.com/torc-lms.appspot.com',
        attemptStageUrl: contextRoot + '/api/assignments/attempt-stage'
    }

})();