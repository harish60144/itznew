var mysql = require('mysql');
var util = require('../Business/util');

var pool = mysql.createPool({
    connectionLimit: 10, //important
    host: '127.0.0.1',
    user: 'root',
    password: 'harish',
    database: 'itz',
    debug: true
});


exports.wines = function (req, res) {
    res.send([{ name: 'wine1' }, { name: 'wine2' }, { name: 'wine3' }]);
};
function encryptpwd(pwd) {
    //need to encrypt pwd
    pwd.concat('itz');
    return pwd;
}

exports.test = function (req, res) {

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from tbluser", function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });

        connection.on('error', function (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });
}

function transaction(req, res, querytxt) {
    console.log(req.body);
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }
        console.log('connected as id ' + connection.threadId);
        connection.query(querytxt, function (err, rows) {
            //console.log("CALL sp_signup(" + _name + "," + _email + "," + _mobNo + "," + _pwd + "," + _sessValidDays + ")");
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });
        connection.on('error', function (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });
};
function transactionResponse(req, querytxt, callback) {
    //console.log(req.body);
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return json({ "code": 100, "status": "Error in connection database" });
        }
        //console.log('connected as id ' + connection.threadId);
        connection.query(querytxt, function (err, rows) {
            //console.log("CALL sp_signup(" + _name + "," + _email + "," + _mobNo + "," + _pwd + "," + _sessValidDays + ")");
            connection.release();
            if (!err) {
                callback(rows);
            }
            else {
                throw err;
            }
        });
        connection.on('error', function (err) {
            //return json({ "code": 100, "status": "Error in connection database" });
            console.log(err.code);
            console.log(err.fatal);
        });
    });
};
//pool.end(function (err) {
//    if (err) console.error("An error occurred: " + err);
//    else console.log("My app terminated");
//});
//this is for testing.
exports.snp = function (req, res) {
    var _name = "'" + req.body.name + "'";
    var _email = "'" + req.body.email + "'";
    var _mobNo = req.body.mobno;
    var _pwd = "'" + req.body.pwd + "'";
    var _sessValidDays = req.body.sessDays;
    //var query = "CALL sp_signup(" + _name + "," + _email + "," + _mobNo + "," + _pwd + "," + _sessValidDays + ");";
    var query = "CALL sp_testsp()";
    transaction(req, res, query);
};
//{
//    "name":"User1",
//    "email": "sample@abc.com",
//    "sessDays": 20,
//    "mobno": 8888888888,
//    "pwd": "Password@1234",
//    "usertype":signup/FB/GP
//}
// google & FB signup users needs a check.
// error code needs to be implemented.
exports.signUpUser = function (req, res) {
    console.log('flow Signup user');
    var _name = "'" + req.body.name + "'";
    var _email = "'" + req.body.email + "'";
    var _mobNo = req.body.mobno;
    var _pwd = "'" + req.body.pwd + "'";
    var _sessValidDays = req.body.sessDays;
    var query = "CALL sp_signup(" + _name + "," + _email + "," + _mobNo + "," + _pwd + "," + _sessValidDays + ");";
    //then i need to update isactive to user table.
    transaction(req, res, query);
};
function sendOTP(value) {
    console.log(value);
}

//{
//    "mobno": 8888888888,
//    "pwd": "Password@1234"
//}
//user information needs to be sent.
exports.loginUser = function (req, res) {
    var _mobNo = req.body.mobno;
    var _pwd = "'" + req.body.pwd + "'";
    var query = "CALL sp_login(" + _mobNo + "," + _pwd + ");";
    transaction(req, res, query);
};
//{
//    "state": "karnataka",
//    "dist": "bangalore"
//}
exports.getLocationList = function (req, res) {
    var _state = "'" + req.body.state + "'";
    var _dist = "'" + req.body.dist + "'";
    var query = "CALL sp_getLocation(" + _state + "," + _dist + ");";
    transaction(req, res, query);
};
//{
//    "mobno": 8888888888
//}
//1hr for OTP.
exports.getOTP = function (req, res) {
    var _mobno = req.body.mobno;
    var _otp = util.genRandomNo();
    var _validTill = 60;
    var query = "CALL sp_getOtp(" + _mobno + "," + _otp + "," + _validTill + ");";
    transaction(req, res, query);
};
//{
//    "mobno": 8888888889,
//    "otp":73797
//}
exports.confirmOTP = function (req, res) {
    var _mobno = req.body.mobno;
    var _otp = req.body.otp;
    var query = "CALL sp_validateOtp(" + _mobno + "," + _otp + ");";
    transaction(req, res, query);
};
//{
//    "from":0,
//    "to":5
//}
exports.getSubscriptions = function (req, res) {
    var _from = req.body.from;
    var _to = req.body.to;
    var query = "CALL sp_getSubscriptions(" + _from + "," + _to + ");";
    transaction(req, res, query);
};
exports.getSubCombos = function (req, res) {
    var _comboId = req.body.comboid;
    var query = "CALL sp_getComboDetails(" + _comboId + ");";
    transaction(req, res, query);
};
exports.getSubCombosDish = function (req, res) {
    var _comboId = req.body.comboid;
    var query = "CALL sp_getComboDishDetails(" + _comboId + ");";
    transaction(req, res, query);
};
//{
//    "subid": 2,
//    "dishid": null,
//    "subscribedDays": 2,
//    "subscribedDates": "'2015-08-16,2015-08-17'",
//    "paymenttypeid": 2,
//    "subtot": null,
//    "vat": null,
//    "servicetax": null,
//    "discounts": null,
//    "Total": 500,
//    "deliverystatus": 2,
//    "userid": 1,
//    "paymentStatus": 2,
//    "ordertypeid": 2,
//    "paymenttype": 2,
//    "paymentmode": 2
//}
exports.addMysubscriptions = function (req, res) {
    var _subid = req.body.subid;
    var _dishid = req.body.dishid;
    var _subscribedDays = req.body.subscribedDays;
    var _subscribedDates = req.body.subscribedDates;
    var _paymenttypeid = req.body.paymenttypeid;
    var _subtot = req.body.subtot;
    var _vat = req.body.vat;
    var _servicetax = req.body.servicetax;
    var _discounts = req.body.discounts;
    var _Total = req.body.Total;
    var _deliverystatus = req.body.deliverystatus;
    var _userid = req.body.userid;
    var _paymentStatus = req.body.paymentStatus;
    var _ordertypeid = req.body.ordertypeid;
    var _paymenttype = req.body.paymenttype;
    var _paymentmode = req.body.paymentmode;

    var query = "CALL sp_addDetailSuborder(" + _subid + ","
        + _dishid + ","
        + _subscribedDays + ","
        + _subscribedDates + ","
        + _paymenttypeid + ","
        + _subtot + ","
        + _vat + ","
        + _servicetax + ","
        + _discounts + ","
        + _Total + ","
        + _deliverystatus + ","
        + _userid + ","
        + _paymentStatus + ","
        + _ordertypeid + ","
        + _paymenttype + ","
        + _paymentmode + ");";
    transaction(req, res, query);
};

exports.getdailymeal = function (req, res) {
    var _from = req.body.from;
    var _to = req.body.to;
    var query = "CALL sp_getdailymeal(" + _from + "," + _to + ");";
    transaction(req, res, query);
};
exports.updateUserDetails = function (req, res) {
    var _name = req.body.name;
    var _MobNo = req.body.MobNo;
    var _email = req.body.email;
    var query = "CALL sp_updateuserDetails(" + _oldMobNo + "," + _newMobNo + "," + _email + ");";
    transaction(req, res, query);
};
exports.updateMobNo = function (req, res) {
    var _oldMobNo = req.body.oldMobNo;
    var _newMobNo = req.body.newMobNo;
    var _email = req.body.email;
    var query = "CALL sp_updateMobNo(" + _oldMobNo + "," + _newMobNo + "," + _email + ");";
    transaction(req, res, query);
};
exports.getUserDetails = function (req, res) {
    var _MobNo = req.body.MobNo;
    var query = "CALL sp_getUserDetails(" + _MobNo + ");";
    transaction(req, res, query);
};
exports.checkMobNo = function (req, res) {
    var _MobNo = req.body.MobNo;
    var query = "CALL sp_getCheckMobNo(" + _MobNo + ");";
    //transaction(req, res, query);
    transactionResponse(req, res, query);
};
exports.checkoutOrder = function (req, res) {
    var _userid = req.body.userId;
    var _dishNQtys = req.body.dishNQtys;
    var _blockedtill = req.body.blocktill;
    var _MobNo = req.body.MobNo;
    var _addressId = req.body.addressid;
    var _DeliveryTime = req.body.deliveryOn;
    var _totAmt = req.body.totAmt;

    var query = "CALL sp_getCheckMobNo(" + _MobNo + ");";
    transactionResponse(req, res, query);
    //transaction(req, res, query);
};
exports.getTest = function (req, res) {

    transactionResponse(req, 'selet * from tbluserasfs', function (results) {
        var users = results;
        console.log(users[0].id);
    });
}
exports.getTest = function (req, res) {
    //console.log('test');
    res.sendFile(('./html/dish.html'));
}
exports.AdminLogin = function (req, res) {
    console.log(req.body);
    res.sendFile(path.join(__dirname, '/dish.html'));
}