//import Dal = require('./MongoDal');
import Factory = require('./Factory');
import {BaseProvider} from './BaseProvider';

export class Sender {

    public static sendThese(orders: Factory.IProvider[], cb: any): void {
        let sentNum = 0;
        for (var i = 0; i < orders.length; i++) {
            orders[i].send((that, result) => {
                result && that.update();          // update sent order
                result && that.store(() => { });  // store sent order in the DB 
                result && sentNum++;

                // return sent orders number on the last loop iteration
                (i >= orders.length) && cb(sentNum);
            });
        }
    }

    public static sendAll(cb: any): void {
        //var orders = Array<BaseProvider>();
        var now = new Date().getTime();
        
        // select all when "sent" = false or "sent" is not exists or "timeToSend" less then now
        let params = {
            $and: [{
                $or: [{ sent: false }, { sent: { $exists: false } }]
            }, {
                timeToSend: { $lt: now }
            }]
        };

        console.log('send all');
        
        BaseProvider.find(params, (err, docs)=>{
            console.log('find');
            
            if(err){
                console.log(err);
              } else {
                /* for (var i = 0; i < docs.length; i++) {
                    orders[i] = Factory.Activator.createInstance(docs[i].type, docs[i]);
                } */
                if (docs && docs.length > 0) {
                    this.sendThese(docs, cb);
                } else {
                    cb(0); // orders for sending not found
                }
            }
        });

        /* Dal.DataBase.findOrdersToSend((docs) => {
            for (var i = 0; i < docs.length; i++) {
                orders[i] = Factory.Activator.createInstance(docs[i].type, docs[i]);
            }

            if (orders && orders.length > 0) {
                this.sendThese(orders, cb);
            } else {
                cb(0); // orders for sending not found
            }
        }); */
    }
}
