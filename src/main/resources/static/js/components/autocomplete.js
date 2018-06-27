var AutoCompleteInput = (function () {

var template = [
    '<div class="selectableInput" v-click-outside="dropdownBlur">',
            '<input type="text" @keydown="keyClick" :class="[\'selectableInput-input\', inputClass]" ref="selectableInput" :value="searchInput" @input="updateModel" autocomplete="off"/>',
            '<div ref="selectableInputDropdown" v-bind:class="[{isOpen: dropdownOpen}, \'selectableInput-result\']">',
                '<ul class="list-reset list-stacked">',
                    '<li v-for="item, itemIndex in filteredItems" :class="{selected: selectedIndex === itemIndex}"><button class="btn btn-medium btn-clear btn-fullWidth btn-alignLeft" v-on:click="selectItem">{{item}}</button></li>',
                '</ul>',
            '</div>',
    '</div>'
].join('');

return {
    template: template,
    props: ['value', 'items', 'inputClass'],
    data: function () {
        return {
            searchInput: this.value,
            filteredItems: [],
            dropdownOpen: false,
            itemSelected: false,
            selectedIndex: null
        }
    },
    watch: {
        searchInput: function (inputText) {
            if (!this.itemSelected) {
                this.filteredItems.length = 0;
                this.dropdownOpen = true;
            
                if (inputText.length > 0) {
                    for (var i = 0; i < this.items.length; i++) {
                        if (this.items[i].toLowerCase().search(Util.escapeRegExp(inputText.toLowerCase())) !== -1) {
                            this.filteredItems.push(this.items[i]);
                        }
                    }
                }
            }
            this.itemSelected = false;

            if (this.filteredItems.length === 1 && this.filteredItems[0] === this.searchInput) {
                this.dropdownOpen = false;
            }

            // set the selected index to null if the selected index is out of range
            if (this.selectedIndex > this.filteredItems.length - 1) {
                this.selectedIndex = null;
            }
        }
    },
    methods: {
        updateModel: function () {
            this.searchInput = this.$refs.selectableInput.value;
            this.$emit('input', this.searchInput);
        },
        selectItem: function (e) {
            this.searchInput = e.target.innerText;
            this.dropdownOpen = false;
            this.itemSelected = true;

            this.$emit('input', this.searchInput);
        },
        dropdownBlur: function () {
            this.dropdownOpen = false;
        },
        keyClick: function (e) {

            switch (e.key) {
                case 'Down':
                case 'ArrowDown':
                    if (this.selectedIndex !== null) {
                        if (this.selectedIndex < this.filteredItems.length - 1) {
                            this.selectedIndex++
                        }
                    } else {
                        this.selectedIndex = 0;
                    }
                    break;
                case 'Up':
                case 'ArrowUp':
                    if (this.selectedIndex !== null) {
                        if (this.selectedIndex > 0) {
                            this.selectedIndex--;
                        }
                    } else {
                        this.selectedIndex = 0;
                    }
                    break;
                case 'Enter':
                    this.searchInput = this.filteredItems[this.selectedIndex];
                    this.selectedIndex = null;
                    break;
                default:
                    break;
            }

            if (this.$refs.selectableInputDropdown) {
                var listItemEl = this.$refs.selectableInputDropdown.querySelector('.selectableInput-result li');

                if (listItemEl) {
                    var dropdownHeight = this.$refs.selectableInputDropdown.clientHeight;
                    var btnHeight = listItemEl.clientHeight;
        
                    if (btnHeight * this.selectedIndex > dropdownHeight || this.$refs.selectableInputDropdown.scrollTop !== 0) {
                        this.$refs.selectableInputDropdown.scrollTop = btnHeight * this.selectedIndex;
                    }
                }
            }
        }
    }
};

})();