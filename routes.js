const routes = require("next-routes")();

module.exports = routes;

routes.add("job", "/job/:id/:name");