var AssignCourse = (function () {

    var template = `
        <div class="row no-gutters stage-selector">
            <div class="col-sm stage-selector-section stage-selector-user">
                <h3>Select User <i class="fas fa-check" v-if="selectedUserIndex !== null"></i></h3>
                <div class="selectorList scroller">
                    <div :class="[{'is-selected': userIndex === selectedUserIndex},'selectorList-single']" v-for="(user, userIndex) in users" v-on:click="selectUser(userIndex)">
                        <div class="selectorList-single-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <p>{{user.firstname}} {{user.surname}}</p>
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
        methods: {
            selectUser: function (userIndex) {
                this.selectedUserIndex = userIndex;
            },
            selectCourse: function (courseIndex) {
                this.selectedCourseIndex = courseIndex;
                this.selectedStageIndex = null;
            }
        }
    }

})();