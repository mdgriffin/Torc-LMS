var AssignCourse = (function () {

    var template = `
        <div class="stage-selector">
            <div class="row no-gutters ">
                <div class="col-sm stage-selector-section stage-selector-user">
                    <h3>Select User <i class="fas fa-check" v-if="selectedUserIndex !== null"></i></h3>
                    <div class="selectorList scroller">
                        <div :class="[{'is-selected': userIndex === selectedUserIndex, 'is-busy': !userAvailable(userIndex)},'selectorList-single']" v-for="(user, userIndex) in users" v-on:click="selectUser(userIndex)">
                            <div class="selectorList-single-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <p>{{user.firstname}} {{user.surname}}</p>
                            <div>
                                <p v-if="userAvailable(userIndex)" class="is-available">Available</p>
                                <p v-else class="is-busy">Busy</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="col-sm stage-selector-section stage-selector-course">
                    <h3>Select Course <i class="fas fa-check" v-if="selectedCourseIndex !== null"></i></h3>
                    <div class="selectorList scroller">
                        <div :class="[{'is-selected': courseIndex === selectedCourseIndex},'selectorList-single']" v-for="(course, courseIndex) in courses" v-on:click="selectCourse(courseIndex)">
                            <p>{{course.title}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end section">
                <button class="btn btn-outline-secondary" v-on:click="save" :disabled="!canSave">Assign</button>
            </div>
        </div>
    `

    return {
        props: ['users', 'courses'],
        template: template,
        data: function () {
            return {
                selectedUserIndex: null,
                selectedCourseIndex: null
            }
        },
        computed: {
            canSave: function () {
                return this.selectedUserIndex !== null && this.selectedCourseIndex !== null;
            },
            selectedCourse: function () {
                if (this.selectedCourseIndex != null && this.selectedCourseIndex < this.courses.length) {
                    return this.courses[this.selectedCourseIndex];
                }
                return null;
            },
            selectedUser: function () {
                if (this.selectedUserIndex != null && this.selectedUserIndex < this.users.length) {
                    return this.users[this.selectedUserIndex];
                }
                return null;
            }
        },
        methods: {
            selectUser: function (userIndex) {
                if (this.userAvailable(userIndex)) {
                    this.selectedUserIndex = userIndex;
                }
            },
            selectCourse: function (courseIndex) {
                this.selectedCourseIndex = courseIndex;
                this.selectedStageIndex = null;
            },
            userAvailable: function (userIndex) {
                return this.users[userIndex].assignedCourses.filter(function (assignment) {
                    var startDate = moment(assignment.assignedOn);
                    var deadline = moment(assignment.deadline);

                    return startDate.isBefore() && deadline.isAfter()
                }).length === 0;
            },
            save: function () {
                var self = this;

                if (self.canSave) {
                    fetch('/lms/api/courses/assign', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({'userId': self.selectedUser.userId, 'courseId': self.selectedCourse.courseId})
                    }).then(function (response) {
                        console.log(response);
                        // TODO: Replace with nicer alert
                        alert("Course Assigned Successfully");
                        return response.json();
                    })
                    .then(function (json) {
                        var userIndex = self.users.findIndex(function (user) {
                            return user.userId === json.userId;
                        });

                        if (userIndex !== -1) {
                            Vue.set(self.users, userIndex, json);
                        }

                        if (userIndex  == self.selectedUserIndex) {
                            self.selectedUserIndex = null;
                        }
                    }).catch(function () {
                        alert("An error has occured, please try again");
                    });
                }
            }
        }
    }

})();