var Collapsible = (function () {

var template = [
'<div class="collapsible">',
    '<div class="collapsible-header clearfix">',
        '<h3 v-if="heading">{{heading}}</h3>',
        '<button class="btn btn-medium btn-secondary" v-on:click="toggleVisiblity"><i v-bind:class="[{fas: true}, toggleIcon]"></i></button>',
    '</div>',
    '<div class="collapsible-body" v-bind:class="{isOpen: isOpen}" v-bind:style="collapsibleBodyStyles" ref="collapsibleBody">',
        '<div class="collapsible-body-inner" ref="collapsibleBodyInner">',
            '<slot></slot>',
        '</div>',
    '</div>',
'</div>'
].join('');

return {
    props: ['heading'],
    template: template,
    data: function () {
        return {
            isOpen: true,
            toggleIcon: "fa-angle-double-down",
            collapsibleBodyStyles: {},
            openHeight: null
        }
    },
    methods: {
        toggleVisiblity: function () {
            var self = this;
            self.setOpenHeight();
            
            if (self.isOpen) {
                self.toggleIcon = "fa-angle-double-up";
                Vue.set(self.collapsibleBodyStyles, 'max-height', self.openHeight);
                Vue.set(self.collapsibleBodyStyles, 'overflow', 'hidden');
                
                setTimeout(function () {
                    Vue.set(self.collapsibleBodyStyles, 'max-height', "0px"); 
                }, 50);
            } else {
                self.toggleIcon = "fa-angle-double-down";
                Vue.set(self.collapsibleBodyStyles, 'max-height', self.openHeight);

                // Fired after the element has transitioned to the open state
                setTimeout(function () {
                    Vue.set(self.collapsibleBodyStyles, 'max-height', '');
                    Vue.set(self.collapsibleBodyStyles, 'overflow', '');
                }, 250)
            }
            self.isOpen = !self.isOpen;
        },
        setOpenHeight: function () {
            this.openHeight = this.$refs.collapsibleBodyInner.clientHeight + 'px';
        }
    }
};

});