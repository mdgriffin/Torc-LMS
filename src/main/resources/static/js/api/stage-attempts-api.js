const StageAttemptsApi = {
    getAll: function () {
        return fetch(Config.attemptStageUrl, {
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