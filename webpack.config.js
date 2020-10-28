module.exports = {
  module: {
    rules: [
      {
        test: /\.pu$/i,
        use: [
          {
            loader: "raw-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
