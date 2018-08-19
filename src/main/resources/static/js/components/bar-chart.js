const BarChart = (function () {
    return {
        extends: VueChartJs.Bar,
        props: ['chartData'],
        data: function () {
            return {
                options: {}
            }
        },
        mounted () {
            this.renderChart(this.chartData, this.options)
        }
    }
})();