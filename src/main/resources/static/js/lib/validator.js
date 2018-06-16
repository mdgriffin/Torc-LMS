var Validator = (function () {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var moneyRegex = /^\d+(?:\.\d{0,2})?$/;

    return {
        empty: function (val) {
            return val !== null && val.length !== undefined && val.length === 0;
        },
        notEmpty: function (val) {
            return val !== null && val.length !== undefined  && val.length > 0;
        },
        minLength: function (val, length) {
            return val !== null && val.length !== undefined && val.length >= length;
        },
        isNumeric: function (val) {
            return !isNaN(parseFloat(val)) && isFinite(val);
        },
        isPositiveInt: function (val) {
            var n = Math.floor(Number(val));
            return (typeof val === 'string' || typeof val === 'number') && n !== Infinity && n >= 0;
        },
        isMonetaryValue: function (val) {
            return this.isNumeric(val) && moneyRegex.test(val);
        },
        isEmail: function (val) {
            return emailRegex.test(String(val).toLowerCase());
        },
        isDate: function (val) {
            return moment(val).isValid();
        },
        isSameDayOrAfter: function (startDate, endDate) {
            var start = moment(startDate);
            var end = moment(endDate);

            return start.isValid() && end.isValid() && end.isSameOrAfter(start, 'day');
        },
        isBeforeNoon: function (timeStr) {
            var hour = parseInt(timeStr.substring(0,2));
            return hour < 12;
        },
        isAfterNoon: function (timeStr) {
            var hour = parseInt(timeStr.substring(0,2));
            return hour >= 12;
        }
    }
})();