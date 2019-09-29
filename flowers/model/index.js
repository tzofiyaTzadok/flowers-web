const debug = require("debug")("mongo:model");
const mongo = require("mongoose");
let db = mongo.createConnection();
(async () => {
    try {
        await db.openUri('mongodb://localhost/flowers', { 'useFindAndModify': false });
    } catch (err) {
        debug("Error connecting to DB: " + err);
    }
})();
debug('Pending DB connection');
require("./user")(db);
require("./branch")(db);
require("./flower")(db);
require("./message")(db);
require("./product")(db);
require("./cart")(db);
module.exports = model => db.model(model);
