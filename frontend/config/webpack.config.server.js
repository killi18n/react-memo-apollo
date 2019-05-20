const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const publicPath = paths.servedPath;
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

module.exports = {
    target: 'node',
    entry: paths.ssrTsx,
    output: {
        path: paths.ssrBuild,
        filename: 'bundle.js',
        libraryTarget: 'commonjs2',
    },
    externals: (context, request, callback) => {
        // Externalize all npm modules.
        if (/^[a-z0-9-][a-z0-9-./]+$/.test(request)) {
            return callback(null, `commonjs ${request}`);
        }
        callback();
    },
    module: {
        strictExportPresence: true,
        rules: [
            { parser: { requireEnsure: false } },
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            emitFile: false, // 실제로 파일을 생성하지 않음
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
                        include: paths.appSrc,

                        loader: require.resolve('babel-loader'),
                        options: {
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),

                            plugins: [
                                [
                                    require.resolve(
                                        'babel-plugin-named-asset-import'
                                    ),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent:
                                                    '@svgr/webpack?-prettier,-svgo![path]',
                                            },
                                        },
                                    },
                                ],
                            ],
                            cacheDirectory: true,
                            cacheCompression: false,
                            compact: false,
                        },
                    },
                    {
                        test: /\.(ts|tsx)$/,
                        include: path.resolve('./src'),
                        use: [
                            {
                                loader: 'ts-loader',
                                options: {
                                    // disable type checker - we will use it in fork plugin
                                    transpileOnly: true,
                                    configFile: path.resolve('tsconfig.json'),
                                },
                            },
                        ],
                    },
                    {
                        test: /\.(js|mjs)$/,
                        exclude: /@babel(?:\/|\\{1,2})runtime/,
                        loader: require.resolve('babel-loader'),
                        options: {
                            babelrc: false,
                            configFile: false,
                            compact: false,
                            presets: [
                                [
                                    require.resolve(
                                        'babel-preset-react-app/dependencies'
                                    ),
                                    { helpers: true },
                                ],
                            ],
                            cacheDirectory: true,
                            cacheCompression: true,
                            sourceMaps: false,
                        },
                    },
                    {
                        test: /\.css$/,
                        loader: require.resolve('css-loader'),
                        // 뒤에 /locals 를 붙여줘야 실제로 파일을 생성하지 않음.
                        // postcss-loader 같은건 생략해도됨.
                    },
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.(js|mjs|jsx)$/, /\.html$/, /\.json$/],
                        options: {
                            emitFile: false, // 실제로 파일을 생성하지 않게 함
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        // same configuration with webpack.prod.js
        modules: ['node_modules', paths.appNodeModules].concat(
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        extensions: ['.ts', '.tsx', '.js', '.json'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve('tsconfig.json'),
                logLevel: 'info',
                extensions: ['.ts', '.tsx'],
                mainFields: ['browser', 'main'],
                // baseUrl: path.resolve('src'),
            }),
        ],
    },
    // sets env variables
    plugins: [new webpack.DefinePlugin(env.stringified)],
};
