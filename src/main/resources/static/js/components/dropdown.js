var Dropdown = (function () {

var template = [
    '<span class="dropdown hasDropdown" v-click-outside="dropdownBlur">',
        '<span v-on:click="toggleDropdown" class="dropdown-button"><slot name="dropdown-button"></slot></span>',
        '<div v-bind:class="[{isOpen: isOpen}, dropdownSize, \'dropdown-content\', alignmentClass]" >',
            '<slot name="dropdown-body"></slot>',
        '</div>',
    '</span>'
].join('');

//Vue.component('dropdown', {
return {
    props: ['size', 'alignment'],
    template: template,
    data: function () {
        return {
            isOpen: false,
        }
    },
    computed: {
        dropdownSize: function () {
            return 'dropdown-' + this.size;
        },
        alignmentClass: function () {
            if (this.alignment !== undefined) {
                return 'align' + this.alignment.charAt(0).toUpperCase() +  this.alignment.toLowerCase().slice(1);
            } else {
                return 'alignLeft';
            }
        }
    },
    methods: {
        toggleDropdown: function () {
            this.isOpen = !this.isOpen;
        },
        dropdownBlur: function () {
            this.isOpen = false;
        }
    },
    store: store
};

})();