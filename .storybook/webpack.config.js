const path = require('path');
const { lstatSync, readdirSync } = require('fs');

const basePath = path.resolve(__dirname, '../', 'packages');
const packages = readdirSync(basePath).filter((name) => lstatSync(path.join(basePath, name)).isDirectory());

module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['react-app', { flow: false, typescript: true }]],
      rootMode: 'upward',
    },
  });
  config.resolve.extensions.push('.ts', '.tsx');

  Object.assign(config.resolve.alias, {
    ...packages.reduce(
      (acc, name) => ({
        ...acc,
        [`@lingo/${name}`]: path.join(basePath, name, 'src'),
      }),
      {}
    ),
  });

  return config;
};
