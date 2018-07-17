var CourseList = (function () {

    var template = `
    <div class="courseList" >
        <div :class="['courseList-single', {'is-deleting': course.isDeleting }]" v-for="course, courseIndex in courseList">
            <div class="row">
                <div class="courseList-single-body col-sm-10">
                    <p>{{course.title}}</p>
                </div>
                <div class="courseList-single-actions col-sm-2">
                    <button class="btn btn-outline-danger" v-on:click="deleteCourse(courseIndex)"><i class="fas fa-minus-circle"></i></button>
                </div>
            </div>
        </div>
    </div>
    `;

    return {
        props: ['courses'],
        template: template,
        data: function () {
            return {
                courseList: this.courses
            }
        },
        methods: {
            deleteCourse: function (courseIndex) {
                var self = this;
                var courseId = this.courseList[courseIndex].courseId;

                Vue.set(this.courseList[courseIndex], 'isDeleting', true);

                fetch(Config.coursesApiUrl + '/' + courseId, {
                    method: 'DELETE',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    console.log(response);
                    alert("Course Deleted Successfully");

                    self.courseList = self.courseList.filter(course => {
                        return course.courseId != courseId;
                    });
                }).catch(function () {
                    alert("An error has occurred, please try again");
                });
            }
        }
    }

})();