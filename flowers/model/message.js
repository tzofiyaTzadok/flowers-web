const debug = require("debug")("mongo:model-message");
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
		msg : String,
        username : String,
        date : Date
    }, { autoIndex: true });

    schema.statics.CREATE = async function(message) {
        return this.create({
            username : message[0],
            msg : message[1],
            date : message[2]
        });
    };
	
	schema.statics.REQUEST = async function() {
        // no arguments - bring all at once
        const args = Array.from(arguments); // [...arguments]
        if (args.length === 0) {
            //debug("request: no arguments - bring all at once");
            return this.find({}).exec();
        }

        // perhaps last argument is a callback for every single document
        let callback = arguments[arguments.length - 1];
        if (callback instanceof Function) {
            let asynch = callback.constructor.name === 'AsyncFunction';
            //debug(`request: with ${asynch?'async':'sync'} callback`);
            args.pop();
            let cursor, message;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (message = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(message);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(message);
                    }
                }
            } catch (err) { throw err; }
            return;
        }

        // request by id as a hexadecimal string
        if (args.length === 1 && typeof args[0] === "string") {
            //debug("request: by ID");
            return this.findById(args[0]).exec();
        }

        // There is no callback - bring requested at once
        //debug(`request: without callback: ${JSON.stringify(args)}`);
        return this.find(...args).exec();
    };


    // the schema is useless so far
    // we need to create a model using it
    // db.model('User', schema, 'User'); // (model, schema, collection)
    db.model('Message', schema); // if model name === collection name
};
