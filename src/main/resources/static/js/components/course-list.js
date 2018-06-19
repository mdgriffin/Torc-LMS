var CourseList = (function () {

    var template = `
    <div class="courseList" >
        <div class="courseList" v-for="course in courses">
            {{course.title}}
        </div>
    </div>
    `;

    return {
        props: ['courses'],
        template: template,
    }

})();