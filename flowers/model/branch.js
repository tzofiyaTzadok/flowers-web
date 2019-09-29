const debug = require("debug")("mongo:model-branch");
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
		address: {
			number: Number,
            street: String,
            city: String,
			state: String
        },
		branchNumber: String,
        phoneNumber: String,
		active: Boolean
    }, { autoIndex: false });

    schema.statics.CREATE = async function(branch) {
        return this.create({
			address: branch[0],
			branchNumber: branch[1],
			phoneNumber: branch[2],
			active: branch[3]
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
            let cursor, branch;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (branch = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(branch);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(branch);
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

    
    db.model('Branch', schema); // if model name === collection name
};
