const {
    override,
    removeModuleScopePlugin,
    addBabelPlugins,
    addWebpackAlias,
    addWebpackExternals,
    addWebpackPlugin,
} = require('customize-cra');
const addLessLoader = require('customize-cra-less-loader');
const path = require('path');
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = override(
    removeModuleScopePlugin(),
    addWebpackExternals({
        lodash: '_',
        'react': 'React',
        'react-dom': 'ReactDOM',
        'moment': 'moment',
    }),
    ...addBabelPlugins(
        'babel-plugin-transform-typescript-metadata',
        [
            '@babel/plugin-proposal-decorators',
            {
                'legacy': true,
            },
        ],
        [
            '@babel/plugin-proposal-class-properties',
            {
                'loose': true,
            },
        ],
    ),
    addLessLoader({
        lessLoaderOptions: {
            lessOptions: {
                javascriptEnabled: true,
            },
        },
    }),
    addWebpackPlugin(new WebpackBundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '0.0.0.0',
        analyzerPort: '8888',
        reportFilename: path.resolve(__dirname, './report/report.html'),
        openAnalyzer: false,
        generateStatsFile: false,
        statsFilename: path.resolve(__dirname, './report/stats.json'),
        statsOptions: null,
        excludeAssets: null,
        logLevel: 'info',
    })),
    addWebpackAlias({
        '@': path.resolve(__dirname, 'src'),
        '@modules': path.resolve(__dirname, 'src/modules'),
    }),
);
