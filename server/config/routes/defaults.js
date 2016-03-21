/**
 * Dependencies.
 */
var DefaultsController = require('../../controllers/defaults');

module.exports = exports = function(server) {
    exports.create(server);;
};


/**
 * POST /new
 * Creates a new Tenants in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.create = function(server) {
    // POST

    server.route({
        method: 'POST',
        path: '/defaults/{numbers}',
        config: {
            handler: DefaultsController.Create
        }

    });
};
