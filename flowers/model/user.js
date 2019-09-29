const debug = require("debug")("mongo:model-user");
const mongo = require("mongoose");
let passportLocalMongoose = require('passport-local-mongoose');

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
		name: {
            firstName: String,
            lastName : String
        },
		address: {
            streetAddress: String,
            city: String,
			state: String
        },
        phoneNumber: String,
        mailAddress: String,
		userCategory: String,
		branchNumber: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    }, { autoIndex: false });
    schema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };

    schema.statics.CREATE = async function(user) {
        return this.create({
			name: user[2],
			address: user[3],
			phoneNumber: user[4],
			mailAddress: user[5],
			userCategory: user[6],
			branchNumber: user[7]
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
            let cursor, user;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (user = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(user);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(user);
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

    schema.plugin(passportLocalMongoose);

    // the schema is useless so far
    // we need to create a model using it
    // db.model('User', schema, 'User'); // (model, schema, collection)
    db.model('User', schema); // if model name === collection name
};
