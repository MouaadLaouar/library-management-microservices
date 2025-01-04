const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 8888;

app.get('/', (req, res) => {
  res.send("Hello World")
})

app.use(
  "/members",
  createProxyMiddleware({
    target: "http://members:3000",
    changeOrigin: true,
    pathRewrite: { "^/members": "" },
  })
);

app.use(
  "/books",
  createProxyMiddleware({
    target: "http://books:3001",
    changeOrigin: true,
    pathRewrite: { "^/books": "" },
  })
);

app.use("/borrowedbooks",
  createProxyMiddleware({
    target: "http://borrowedbooks:3002",
    changeOrigin: true,
    pathRewrite: { "^/borrowedbooks": "" },
  })
)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
