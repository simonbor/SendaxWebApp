module.exports.createTransport = function (transporter, defaults) {
    return {
        sendMail: function(mailObj, cb){
            cb(null, { response: "mock mail" });
        }
    }
}
