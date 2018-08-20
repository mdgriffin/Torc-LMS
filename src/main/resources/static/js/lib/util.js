var Util = (function () {

    return {
        escapeRegExp: function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        guid: function () {
            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                this.s4() + '-' + this.s4() + this.s4() + this.s4();
        },
        s4: function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        },
        toDecimalPlaces: function (val, numPlaces) {
            return parseFloat(val).toFixed(numPlaces);
        },
        clone: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        escapeRegExp: function (text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        },
        setCourseUid: function (course) {
            let self = this;
            course.stages.forEach(stage => {
                stage.uid = self.guid();
                stage.questions.forEach(question => {
                    question.uid = self.guid();
                    question.options.forEach(option => option.uid = self.guid());
                });
            });
        },
        getNumAssignmentsByStatus (users) {
            let result = {
                'LOCEKD': 0,
                'INCOMPLETE': 0,
                'COMPLETED': 0
            }

            users.forEach(user => {
                user.assignedCourses.forEach(assignment => {
                    result[assignment.status]++;
                })
            })

            return result;
        },
        formatDate: function (date) {
            return moment(date).format('h:mmA D/MM/YYYY')
        },
        filterUserInfo: function (users) {
            let result = [];

            users.forEach(user => {
                let obj = {};

                obj.userId = user.userId;
                obj.firstname = user.firstname;
                obj.surname = user.surname;
                obj.email = user.email;
                obj.registeredOn = this.formatDate(user.registeredOn);
                obj.role = user.roles[0].role;

                result.push(obj);
            });

            return result;
        }
    }
})();