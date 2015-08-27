module.exports = {
    genRandomNo: function () {
        return parseInt((Math.random() * 100000) + 1);
    },
    errorcode: function (errorCode) {
        switch(errorCode) {
            case T200:
                return 'T200 : Success;';
                break;
            case T201:
                return 'T201 : user already exists;';
                break;
            case T202:
                return 'T202 : Failure;';
                break;
            case T203:
                return 'T203 : Error;';
                break;
            case T203:
                return 'T204 : Auth Error;';
                break;
         
        }
    }
}