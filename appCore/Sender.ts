import Dal = require('./Dal');
import Factory = require('./Factory');

export class Sender {

    public static sendThese(orders: Factory.IProvider[], callback: any): void {
        let sentNum = 0;
        for (var i = 0; i < orders.length; i++) {
            orders[i].send((that, result) => {
                result && that.update();          // update sent order
                result && that.store(() => { });  // store sent order in the DB 
                result && sentNum++;

                // return sent orders number on the last loop iteration
                (i >= orders.length) && callback(sentNum);
            });
        }
    }

    public static sendAll(callback: any): void {
        var orders = Array<Factory.IProvider>();
        Dal.DataBase.findOrdersToSend((docs) => {
            for (var i = 0; i < docs.length; i++) {
                orders[i] = Factory.Activator.createInstance(docs[i].type, docs[i]);
            }

            if (orders && orders.length > 0) {
                this.sendThese(orders, callback);
            } else {
                callback(0); // orders for sending not found
            }
        });
    }
}
