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
                    <slot name="actions" :user="user"></slot>
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
        }
    }

})();