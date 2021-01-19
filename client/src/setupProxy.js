const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/api/customers", { target: "http://localhost:5000" }));
};

// https://chaewonkong.github.io/posts/express-with-react.html