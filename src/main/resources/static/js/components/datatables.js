var TableComponents = (function () {

var baseTableTemplate = [
'<div class="datatable">',
    '<header v-if="pagination || search"  :class="{\'text-right\': !pagination && search}">',
        '<div v-if="pagination"  class="datatable-options alignMiddle-half">',
            '<label>Show ',
            '<select v-model="paginationLength">',
                '<option>10</option>',
                '<option>25</option>',
                '<option>50</option>',
                '<option>100</option>',
            '</select>',
            ' Entries</label>',
        '</div>', // datatable-options
        '<div v-if="search" class="datatable-search alignMiddle-half">',
            '<label>Search</label>',
            '<input type="text" class="form-control" v-model="searchInput"/>',
        '</div>', // datatable-search
    '</header>',
    '<table class="table table-bordered">',
        '<thead class="thead-light">',
        '<tr>',
            '<slot name="before-headings"></slot>',
            '<th v-for="item, itemIndex in headings">{{item}} <button v-if="columnSorting" class="btn btn-clear" @click="sortColumn(itemIndex)"><i :class="[\'fas\', sortButtonClass(itemIndex)]"></i></button></th>',
            '<slot name="after-headings"></slot>',
        '</tr>',
        '</thead>',
        '<tbody>',
            '<slot name="table-body" v-bind:rows="currentRows">' +
                '<tr v-for="(row, rowIndex) in currentRows">',
                    '<slot name="before-data" v-bind:rowIndex="rowIndex"></slot>',
                    '<td v-for="item in row">{{item}}</td>',
                    '<slot name="after-data" v-bind:rowIndex="rowIndex"></slot>',
                '</tr>',
            '</slot>',
        '</tbody>',
        '<tfoot v-if="tableFooter">',
            '<tr>',
                '<slot name="before-footer-headings"></slot>',
                '<th v-for="item, itemIndex in headings">{{item}}</th>',
                '<slot name="after-footer-headings"></slot>',
            '</tr>',
        '</tfoot>',
    '</table>',
    '<footer>',
        '<div class="datatable-indicator alignMiddle-half">',
            '<p>Showing {{currentRows.length}} of {{filteredRows.length}} entries</p>',
        '</div>', // datatable-indicators
        '<div v-if="pagination" class="datatable-pagination alignMiddle-half">',
            '<ul class="pagination">',
                '<li :class="[{disabled: currentPage === 0}, \'page-item\']"><a @click="changePage(currentPage - 1)" class="page-link" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>',
                '<li v-for="page in numPages" :class="[{active: currentPage === (page - 1)}, \'page-item\']"><a @click="changePage(page - 1)" class="page-link">{{page}}</a></li>',
                '<li :class="[{disabled: currentPage === numPages - 1}, \'page-item\']"><a @click="changePage(currentPage + 1)" class="page-link" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>',
            '</ul>',
        '</div>', // datatable-pagination
    '</footer>',
'</div>'
].join('');

var dataTableTemplate = [
    '<basetable :headings="headings" :rows="rows">',
        '<template slot="after-headings"><slot name="after-headings"></slot></template>',
        '<template slot="table-body" slot-scope="scope">',
            '<tr v-for="(row, rowIndex) in scope.rows">',
                '<slot name="before-data" v-bind:rowIndex="rowIndex" v-bind:rowData="row"></slot>',
                '<td v-for="item in row">{{item}}</td>',
                '<slot name="after-data" v-bind:rowIndex="rowIndex" v-bind:rowData="row"></slot>',
            '</tr>',
        '</template>',
    '</basetable>',
].join('');

var tableMixin = {
    props: {
        headings: {
            type: [Array, Object],
            required: true
        },
        rows: {
            type: [Array, Object],
            required: true
        },
        search: {
            type: Boolean,
            default: true
        },
        columnSorting: {
            type: Boolean,
            default: true
        },
        pagination: {
            type: Boolean,
            default: true
        },
        defaultPaginationLength: {
            type: Number,
            default: 10,
            validator: function (value) {
                return value > 0;
            }
        },
        tableFooter: {
            type: Boolean,
            default: false
        },
    }
};

var components = {};

//Vue.component('roottable', {
components.BaseTable = {
    mixins: [tableMixin],
    template: baseTableTemplate,
    data: function () {
        return {
            currentPageIndex: 0,
            searchInput: '',
            sortedBy: null,
            sortAscending: null,
            paginationLength: this.defaultPaginationLength
        }
    },
    methods: {
        changePage: function (page) {
            if (page >= 0 && page < this.currentRows.length) {
                this.currentPageIndex = page;
            }
        },
        sortColumn: function (colIndex) {
            this.sortedBy = colIndex;
            
            if (this.sortAscending === true) {
                this.sortAscending = false;
            } else if (this.sortAscending === false) {
                this.sortAscending = null;
            } else {
                this.sortAscending = true
            }
        },
        filterRows: function (rows) {
            if (this.searchInput.length > 0) {
                var escapedInputText = Util.escapeRegExp(this.searchInput.toLowerCase());
                return rows.filter(function (row) {
                    return Object.keys(row).filter(function (key) {
                        var colVal = String(row[key]);
                        return colVal.toLowerCase().search(escapedInputText) !== -1;
                    }).length > 0;
                });
            }

            return this.rows.slice();
        },
        paginateRows: function (rows) {
            if (this.pagination) {
                var startIndex = 1 * this.currentPage * this.paginationLength;
                var endIndex = this.paginationLength * (this.currentPage + 1);

                return rows.slice(startIndex, endIndex);
            } else {
                return rows.slice();
            }
        },
        sortButtonClass: function (colIndex) {
            if (this.sortAscending === null || this.sortedBy === null || colIndex !== this.sortedBy) {
                return 'fa-sort';
            } else if (this.sortAscending) {
                return 'fa-sort-up'
            } else {
                return 'fa-sort-down';
            }
        },
    },
    computed: {
        filteredRows: function () {
            if (this.search) {
                return this.filterRows(this.rows);
            } else {
                return this.rows.slice();
            }
        },
        currentPage: function () {
            return this.currentPageIndex > this.numPages? 0 : this.currentPageIndex;
        },
        currentRows: function () {
            var currentRows = this.filterRows(this.rows);
            
            var self = this;

            if (this.columnSorting && this.sortedBy !== null && this.sortAscending !== null) {
                currentRows.sort(function (a, b) {
                    if (a[self.sortedBy] > b[self.sortedBy]) {
                        return self.sortAscending? 1 : -1;
                    } else if (a[self.sortedBy] < b[self.sortedBy]) {
                        return  self.sortAscending? -1 : 1;
                    } else {
                        return 0
                    }
                });
            }

            return this.paginateRows(currentRows);
        },
        numPages: function () {
            return Math.ceil(this.filteredRows.length / this.paginationLength);
        }
    }
};

//Vue.component('datatable', {
components.DataTable = { 
    mixins: [tableMixin],
    template: dataTableTemplate,
    components: {
        'basetable': components.BaseTable
    }
};

return components;

})();