const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require('cors')

const app = express();
const PORT = 8080;

app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello World")
})

app.use(
  "/members",
  createProxyMiddleware({
    target: "http://members:3000",
    changeOrigin: true,
    pathRewrite: { "^/members": "" },
    onProxyRes: (proxyRes) => {
      // Add CORS headers to the response
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
      proxyRes.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
      proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    },
  })
);

app.use(
  "/books",
  createProxyMiddleware({
    target: "http://books:3001",
    changeOrigin: true,
    pathRewrite: { "^/books": "" },
    onProxyRes: (proxyRes) => {
      // Add CORS headers to the response
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
      proxyRes.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
      proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    },
  })
);

app.use("/borrowedbooks",
  createProxyMiddleware({
    target: "http://borrowedbooks:3002",
    changeOrigin: true,
    pathRewrite: { "^/borrowedbooks": "" },
    onProxyRes: (proxyRes) => {
      // Add CORS headers to the response
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
      proxyRes.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
      proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    },
  })
)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
