var UserList = (function () {

    var template = `
    <div class="itemList userList" >
        <div :class="['itemList-single', {'is-deleting': user.isDeleting }]" v-for="user, userIndex in userList">
            <div class="row">
                <div class="itemList-single-body col-sm-10">
                    <p>{{user.firstname}} {{user.surname}}</p>
                    <p>{{user.roles[0].role}}</p>
                </div>
                <div class="itemList-single-actions col-sm-2">
                    <a class="btn btn-outline-info" :href="usersUrl + '/' + user.userId">Edit</a>
                    <button class="btn btn-outline-danger" v-on:click="disableUser(user.userId)"><i class="fas fa-minus-circle"></i></button>
                </div>
            </div>
        </div>
    </div>
    `;

    return {
        props: ['users'],
        template: template,
        data: function () {
            return {
                userList: this.users
            }
        },
        computed: {
            usersUrl: function () {
                return Config.adminUsersUrl;
            }
        },
        methods: {
            disableUser: function (userId) {
                alert("Disabling user...")
                /*
                var self = this;
                var courseId = this.itemList[courseIndex].courseId;

                Vue.set(this.itemList[courseIndex], 'isDeleting', true);

                fetch(Config.coursesApiUrl + '/' + courseId, {
                    method: 'DELETE',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        alert("Course Deleted Successfully");

                        self.itemList = self.itemList.filter(course => {
                            return course.courseId != courseId;
                        });
                    } else {
                        throw Error(response.statusText);
                    }
                }).catch(error => {
                    console.error(error);
                    alert("An error has occurred, please try again");
                });
                */
            }
        }
    }

})();