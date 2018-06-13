var app = new Vue({
    el: '#app',
    data: {
        quizTimeRemaining: 1000 * 60,// * 5
        quizQuestions: globData.quizQuestions
    },
    methods: {},
    created: function () {
        console.log('Vue App Created');
    }
});