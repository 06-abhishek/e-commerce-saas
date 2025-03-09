const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/gatewayConfig");

const setupProxy = (app) => {
  Object.entries(services).forEach(([serviceName, serviceUrl]) => {
    console.log(`Proxying /api/${serviceName} → ${serviceUrl}`);

    app.use(
      `/api/${serviceName}`,
      createProxyMiddleware({
        target: serviceUrl,
        changeOrigin: true,
        pathRewrite: {
          [`^/api/${serviceName}`]: "",
        },
      })
    );
  });
};

module.exports = setupProxy;
