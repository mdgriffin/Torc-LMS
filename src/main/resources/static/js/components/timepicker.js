var TimePicker = (function () {

var template = [
    '<select class="form-control" @change="optionSelected" v-model="selectedOption">',
        '<option v-for="hour in hours">{{hour}}</option>',
    '</select>',
].join('');

//Vue.component('timepicker', {
return {
    props: ['value'],
    template: template,
    data: function () {
        return {
            selectedOption: this.value
        }
    },
    computed: {
        hours: function () {
            var hours = [];

            for (var i = 0; i < 24; i++) {
                if (i < 10) {
                    i = '0' + i;
                }
                hours.push(i + ':00');
            }

            return hours;
        }
    },
    methods: {
        optionSelected: function () {
            this.$emit('input', this.selectedOption);
        }
    }
};

})();