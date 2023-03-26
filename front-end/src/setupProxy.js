const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  console.log('Proxy setup is running'); // 在此添加 console.log 語句

  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_BASE_URL,
      changeOrigin: true,
    })
  );
};