const UserApi = {
    getTraineeUsers: function () {
        return fetch(Config.traineesApiUrl, {
            credentials: 'same-origin'
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        });
    }
}