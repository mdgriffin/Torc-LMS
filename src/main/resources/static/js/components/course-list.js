var CourseList = (function () {

    var template = `
    <div class="itemList courseList" >
        <div :class="['itemList-single', {'is-deleting': course.isDeleting }]" v-for="course, courseIndex in courseList">
            <div class="row">
                <div class="itemList-single-body col-sm-10">
                    <p>{{course.title}}</p>
                </div>
                <div class="itemList-single-actions col-sm-2">
                    <a class="btn btn-outline-secondary" :href="coursesUrl + course.courseId">Edit Course</a>
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
        computed: {
            coursesUrl: function () {
                return Config.adminCoursesUrl + '/'
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
                }).then(response => {
                    if (response.ok) {
                        alert("Course Deleted Successfully");

                        self.courseList = self.courseList.filter(course => {
                            return course.courseId != courseId;
                        });
                    } else {
                        throw Error(response.statusText);
                    }
                }).catch(error => {
                    console.error(error);
                    alert("An error has occurred, please try again");
                });
            }
        }
    }

})();