var path = require('path');
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../redPacketShare/index.html'),
    assetsRoot: path.resolve(__dirname, '../redPacketShare'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/redPacketShare/',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8086,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false
  }
}
