var UserManagerApp = (function () {

    var template = `
        <div class="courseManager">
            <div class="alert alert-danger" v-if="!loadingUsers && loadingError">An error has occured while loading courses</div>
            <div class="alert alert-info" v-if="!loadingUsers && !loadingError && users.length === 0">No Users Found</div>
            <loading-status v-if="loadingUsers"></loading-status>
            <user-list v-if="users.length > 0" :users="users">
                <template slot="actions" slot-scope="slotProps">
                    <a class="btn btn-outline-info" :href="usersUrl + '/' + slotProps.user.userId">Edit</a>
                    <button class="btn btn-outline-danger" v-on:click="disableUser(slotProps.user.userId)"><i class="fas fa-minus-circle"></i></button>
                </template>
                
            </user-list>
        </div>
    `

    return {
        template: template,
        data: {
            users: [],
            loadingUsers: true,
            loadingError: false
        },
        components: {
            'user-list': UserList,
            'loading-status': LoadingStatus
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
                    self.users = json;
                })
                .catch(error => {
                    console.error(error);
                    self.loadingError = true;
                });
        }
    }
})();

new Vue(UserManagerApp).$mount('#userManagerApp');