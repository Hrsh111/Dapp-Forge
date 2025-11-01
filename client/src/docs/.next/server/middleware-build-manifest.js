self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/deployment": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/deployment.js"
    ],
    "/guides": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/guides.js"
    ],
    "/smart-contracts": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/smart-contracts.js"
    ],
    "/smart-contracts/exchange": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/smart-contracts/exchange.js"
    ],
    "/smart-contracts/security": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/smart-contracts/security.js"
    ],
    "/smart-contracts/token": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/smart-contracts/token.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];