"use strict";
var Dal = require('./Dal');
var Factory = require('./Factory');
var Sender = (function () {
    function Sender() {
    }
    Sender.sendThese = function (orders, callback) {
        var sentNum = 0;
        for (var i = 0; i < orders.length; i++) {
            orders[i].send(function (that, result) {
                result && that.update(); // update sent order
                result && that.store(function () { }); // store sent order in the DB 
                result && sentNum++;
                // return sent orders number on the last loop iteration
                (i >= orders.length) && callback(sentNum);
            });
        }
    };
    Sender.sendAll = function (callback) {
        var _this = this;
        var orders = Array();
        Dal.DataBase.findOrdersToSend(function (docs) {
            for (var i = 0; i < docs.length; i++) {
                orders[i] = Factory.Activator.createInstance(docs[i].type, docs[i]);
            }
            if (orders && orders.length > 0) {
                _this.sendThese(orders, callback);
            }
            else {
                callback(0); // orders for sending not found
            }
        });
    };
    return Sender;
}());
exports.Sender = Sender;
//# sourceMappingURL=Sender.js.map