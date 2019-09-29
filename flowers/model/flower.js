const debug = require("debug")("mongo:model-flower");
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
        name: String,
        color: String,
        imageContentType: String,
		imageData: Buffer,
		price: Number
    }, { autoIndex: false });

    schema.statics.CREATE = async function(flower) {
        return this.create({
            name: flower[0],
            color: flower[1],
            imageContentType: flower[2],
			imageData: flower[3],
            price: flower[4]
        });
    };
	
	schema.statics.REQUEST = async function() {
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
            debug(`request: with ${asynch?'async':'sync'} callback`);
            args.pop();
            let cursor, flower;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (flower = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(flower);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(flower);
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
	
    db.model('Flower', schema); // if model name === collection name
};
