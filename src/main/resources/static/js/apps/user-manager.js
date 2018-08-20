var UserManagerApp = (function () {

    var template = `
        <div class="courseManager">
            <div class="alert alert-danger" v-if="!loadingUsers && loadingError">An error has occured while loading courses</div>
            <div class="alert alert-info" v-if="!loadingUsers && !loadingError && users.length === 0">No Users Found</div>
            <loading-status v-if="loadingUsers"></loading-status>
            <data-table v-if="!loadingUsers" :headings="headings" :rows="users">
                <template slot="after-data" slot-scope="slotProps">
                    <td class="p-1">
                        <a class="btn btn-outline-info" :href="usersUrl + '/' + slotProps.rowData.userId">Edit</a>
                        <button class="btn btn-outline-danger" v-on:click="disableUser(slotProps.rowData.userId)"><i class="fas fa-minus-circle"></i></button>
                    </td>
                </template>
            </data-table>
        </div>
    `

    return {
        template: template,
        data: {
            users: [],
            loadingUsers: true,
            loadingError: false,
            headings: ['#ID', 'Firstname', 'Surname', 'Email', 'Date Registered', 'Role', 'Actions'],
        },
        components: {
            'user-list': UserList,
            'loading-status': LoadingStatus,
            'data-table': TableComponents.DataTable
        },
        methods: {
            disableUser: function (userId) {
                alert("Disabling user...")
            }
        },
        computed: {
            usersUrl: function () {
                return Config.adminUsersUrl;
            }
        },
        created: function () {
            var self = this;

            fetch(Config.usersApiUrl, {
                credentials: 'include'
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
                .then(json => {
                    self.loadingUsers = false;
                    self.users = Util.filterUserInfo(json);
                })
                .catch(error => {
                    console.error(error);
                    self.loadingError = true;
                });
        }
    }
})();

new Vue(UserManagerApp).$mount('#userManagerApp');