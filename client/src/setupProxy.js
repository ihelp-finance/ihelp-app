const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

    if (process.env.REACT_CLIENT_PROXY && process.env.REACT_CLIENT_PROXY != '') {
        app.use(
            '/api',
            createProxyMiddleware({
              target: process.env.REACT_CLIENT_PROXY,
              changeOrigin: true,
            })
          );
    }

};
