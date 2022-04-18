const {
    override,
    removeModuleScopePlugin,
    addBabelPlugins,
    addWebpackAlias,
    addWebpackExternals,
    overrideDevServer,
} = require('customize-cra');
const addLessLoader = require('customize-cra-less-loader');
const path = require('path');
const fs = require('fs');
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = {
    devServer: overrideDevServer((devServerConfig) => {
        return {
            ...devServerConfig,
            proxy: {
                '/api': {
                    target: 'https://pugio.lenconda.top',
                    secure: true,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': '/api',
                    },
                },
                '/socket.io': {
                    target: 'https://pugio.lenconda.top',
                    secure: true,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/socket.io': '/socket.io',
                    },
                },
                '/endpoints': {
                    target: 'https://account.lenconda.top',
                    secure: true,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/endpoints': '/endpoints',
                    },
                },
            },
            https: {
                cert: fs.readFileSync(path.resolve(__dirname, './pugio.cert.pem')),
                key: fs.readFileSync(path.resolve(__dirname, './pugio.key.pem')),
                ca: fs.readFileSync(path.resolve(__dirname, './root.pem')),
            },
        };
    }),
    webpack: override(
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
        (config) => {
            if (config.mode === 'development') {
                config.plugins.push(new WebpackBundleAnalyzerPlugin({
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
                }));
            }

            return config;
        },
        addWebpackAlias({
            '@': path.resolve(__dirname, 'src'),
            '@modules': path.resolve(__dirname, 'src/modules'),
            '@builtin:web-terminal': path.resolve(__dirname, 'src/builtin/web-terminal'),
        }),
        (config) => {
            config.plugins.push(
                new DefinePlugin({
                    ORIGIN: JSON.stringify(
                        config.mode === 'production'
                            ? 'pugio.lenconda.top'
                            : process.env.PUGIO_ORIGIN || 'localhost:3000',
                    ),
                }),
            );
            return config;
        },
    ),
};
