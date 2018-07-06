var CourseApp = (function () {

    var template =  `
        <div class="courseApp">
            <course></course>
        </div>
    `;

    return {
        template: template,

        components: {
            'course': Course
        }
    }

})();

new Vue(CourseApp).$mount('#courseApp');