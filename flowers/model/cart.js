const debug = require("debug")("mongo:model-product");
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let productSchema = new mongo.Schema({
        name: String,
        imageContentType: String,
        imageData: Buffer,
        price: Number,
        quantity: Number
    });

    let schema = new mongo.Schema({
        user: mongo.Types.ObjectId,
        createdAt: { type: Date, default: Date.now() },
        products: [productSchema],
    }, { autoIndex: false });

    schema.statics.CREATE = async function (cart) {
        return this.create({
            user: cart[0],
            products: [cart[1]]
        });
    };


    schema.statics.REQUEST = async function () {
        // no arguments - bring all at once
        const args = Array.from(arguments); // [...arguments]
        if (args.length === 0) {
            debug("request: no arguments - bring all at once");
            return this.find({}).exec();
        }

        // perhaps last argument is a callback for every single document
        let callback = arguments[arguments.length - 1];
        if (callback instanceof Function) {
            let asynch = callback.constructor.name === 'AsyncFunction';
            debug(`request: with ${asynch ? 'async' : 'sync'} callback`);
            args.pop();
            let cursor, product;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (product = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(product);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(product);
                    }
                }
            } catch (err) { throw err; }
            return;
        }

        // request by id as a hexadecimal string
        /*if (args.length === 1 && typeof args[0] === "string") {
            debug("request: by ID");
            return this.findById(args[0]).exec();
        }*/

        // There is no callback - bring requested at once
        debug(`request: without callback: ${JSON.stringify(args)}`);
        return this.find(...args).exec();
    };

    db.model('Cart', schema); // if model name === collection name
};
