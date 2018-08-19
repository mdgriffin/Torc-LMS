const AdminHome = (function () {

    const template = `
        <article class="card">
                <div class="card-header">
                    <p>Hello From Admin App</p>
                </div>
                <div class="card-body">
                </div>
        </article>
    `;

    return {
        template: template,
        components: {
            'bar-chart': BarChart
        }
    }

})();

new Vue(AdminHome).$mount('#adminHomeApp');