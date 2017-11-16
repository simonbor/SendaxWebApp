import { IProvider, BaseProvider } from './';

export class Sender {
    static sentNum: number;
    static triedNum: number;

    public static sendThese(orders: IProvider[], cb: any): void {
        this.sentNum = 0;
        this.triedNum = 0;

        for (let i = 0; i < orders.length; i++) {
            orders[i].send((that, result) => {
                if(result) {
                    that.update();          // update sent order
                    that.store(() => { });  // store sent order in the DB 
                    this.sentNum ++;
                }

                this.triedNum ++;
                // return sent orders number on the last loop iteration
                if (this.triedNum === orders.length) {
                    cb(this.sentNum);
                    return;
                }
            });
        }
    }

    public static sendAll(cb: any): void {
        var now = new Date().getTime();
        
        // select all when "sent" = false or "sent" is not exists or "timeToSend" less then now
        const params = {
            $and: [{
                $or: [{ sent: false }, { sent: { $exists: false } }]
            }, {
                timeToSend: { $lt: now }
            }]
        };

        BaseProvider.find(params, (err, docs)=>{
            if(err){
                console.log(err);
              } else {
                if (docs && docs.length > 0) {
                    this.sendThese(docs, cb);
                } else {
                    cb(0); // orders for sending not found
                }
            }
        });
    }
}
