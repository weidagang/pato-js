var pato;
(function (pato) {
    function match() {
        var _ = { args: arguments, chain: null, result: null };

        _.chain = {
            value: function (value, result) {
                if (null != _.result) {
                    return _.chain;
                }

                if (_.args[0] == value) {
                    _.result = result;
                }

                return _.chain;
            },
            type: function (type, result) {
                if (null != _.result) {
                    return _.chain;
                }

                if (type == typeof (_.args[0]) || ('array' == type && _.args[0] instanceof Array)) {
                    _.result = result;
                }

                return _.chain;
            },
            instance_of: function (construct, result) {
                if (null != _.result) {
                    return _.chain;
                }

                if (_.args[0] instanceof construct) {
                    _.result = result;
                }

                return _.chain;
            },
            default: function (result) {
                if (null != _.result) {
                    return _.chain;
                }

                _.result = result;

                return _.chain;
            },
            done: function () {
                if ('function' == typeof (_.result)) {
                    return _.result.apply(null, _.args);
                } else {
                    return _.result;
                }
            }
        };

        return _.chain;
    }
    pato.match = match;
})(pato || (pato = {}));

module.exports = pato;
