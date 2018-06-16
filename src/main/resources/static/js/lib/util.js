var Util = (function () {
    const CURRENCY_API_URL = "https://exchangeratesapi.io/api/latest";

    return {
        escapeRegExp: function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },
        guid: function () {
            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
                this.s4() + '-' + this.s4() + this.s4() + this.s4();
        },
        s4: function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        },
        httpGet: function (url, successCb) {
            var xmlhttp = new XMLHttpRequest();
            var successCb = null;
            var errorCb = null;

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        successCb(xmlhttp);
                    } else {
                        errorCb(xmlhttp.status)
                    }
                }
            };

            xmlhttp.open("GET", url, true);
            xmlhttp.send();

            return  {
                then: function (cb) {
                    successCb = cb;
                    return this;
                },
                catch: function (cb) {
                    errorCb = cb;
                    return this;
                }
            }
        },
        toDecimalPlaces: function (val, numPlaces) {
            return parseFloat(val).toFixed(numPlaces);
        },
        getDollarToEuroRate: function (successCb) {
            this.httpGet(CURRENCY_API_URL)
                .then(function (response) {
                    var json = JSON.parse(response.responseText);
                    successCb((1 / parseFloat(json.rates['USD'])).toFixed(4))
                })
                .catch(function () {
                    console.log("Failed to fetch currency info");
                });
        },
        getBusinessDaysInRange2: function (startDate, endDate) {
            var start = moment(startDate);
            var end = moment(endDate);

            if (start.isAfter(end, 'day')) {
                return 0;
            } else if (start.isSame(end, 'day') && start.isoWeekday() !== 6 && start.isoWeekday() !== 7) {
                return 1;
            } else {
                var numDays = 0;

                while (start.isSameOrBefore(end, 'day')) {
                    if (start.isoWeekday() !== 6 && start.isoWeekday() !== 7) {
                        numDays++;
                    }

                    start.add(1, 'days');
                }

                return numDays
            }
        },
        getBusinessDaysInRange: function (startDate, startTime, endDate, endTime) {
            var start = moment(startDate);
            var current = moment(startDate);
            var end = moment(endDate);

            if (start.isAfter(end, 'day')) {
                return 0;
            } else if (start.isSame(end, 'day') && start.isoWeekday() !== 6 && start.isoWeekday() !== 7) {
                return (Validator.isBeforeNoon(startTime) && Validator.isAfterNoon(endTime)? 1 : 0.5);
            } else {
                var numDays = 0;

                while (current.isSameOrBefore(end, 'day')) {

                    if (current.isoWeekday() !== 6 && current.isoWeekday() !== 7) {
                        if (current.isSame(start, 'day') && Validator.isAfterNoon(startTime)) {
                            numDays += 0.5;
                        } else if (current.isSame(end, 'day') && Validator.isBeforeNoon(endTime)) {
                            numDays += 0.5;
                        } else {
                            numDays++;
                        }
                    }

                    current.add(1, 'days');
                }

                return numDays;
            }
        },
        clone: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        escapeRegExp: function (text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }
    }
})();