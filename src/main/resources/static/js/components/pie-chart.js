var PieChart = (function () {
    return {
        extends: VueChartJs.Pie,
        props: ['chartData'],
        mixins: [VueChartJs.mixins.reactiveProp],
        data: function () {
            return {
                options: {}
            }
        },
        mounted () {
            this.renderChart(this.chartData, this.options)
        },
        watch: {
            chartData: function (newVal) {
                console.log('Chart Data changing: ');
                console.log(newVal);
            }
        }
    }
})();