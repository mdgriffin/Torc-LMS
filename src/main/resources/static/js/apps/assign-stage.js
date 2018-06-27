var app = new Vue({
    el: '#assignStageApp',
    data: {
        users: [],
        userEmails: [],
        selectedUserEmail: '',
        userHeadings: ['First Name', 'Surname', 'Email']
    },
    watch: {
        selectedUserEmail: function (oldVal, newVal) {
            console.log('Selected User Email Change to ' + newVal);
        }
    },
    components: {
        'data-table': TableComponents.DataTable,
        'auto-complete': AutoCompleteInput
    },
    created: function () {
        var self = this;

        fetch('/lms/api/users')
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                const allowed = ['firstname', 'lastname', 'email'];

                var reducedJson = [];

                json.forEach(row => {
                    var obj = {};
                    Object.keys(row)
                        .filter(key => allowed.includes(key))
                        .forEach(key => obj[key] = row[key])
                    reducedJson.push(obj)
                });

                self.users = reducedJson;


                var emails =  [];

                json.forEach(row => {
                    emails.push(row['email'])
                });

                self.userEmails = emails;
            });
    }
});