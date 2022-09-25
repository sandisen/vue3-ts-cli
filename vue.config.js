const isProd = process.env.NODE_ENV === 'production'
const isRelease = process.env.MODE === 'release'
const path = require('path')
const resolve = dir => path.join(__dirname, dir)

/** elememnt-ui 按需自动导入 */
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i // 开启gzip压缩， 定义压缩文件类型
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 打包分析

/**全局文件路径 */
const glob = require('glob-all')
const PATHS = {
	src: path.join(__dirname, 'src')
}

const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	outputDir: process.env.outputDir || 'dist',
	publicPath: process.env.baseUrl || '/',
	assetsDir: 'static',
	productionSourceMap: false,
	transpileDependencies: true,
	lintOnSave: false,
	chainWebpack: config => {
		config.resolve.symlinks(true) // 修复热更新失效
		config.resolve.alias // 添加别名
			.set('@', resolve('src'))
			.set('@assets', resolve('src/assets'))
			.set('@components', resolve('src/components'))
			.set('@views', resolve('src/views'))
			.set('@store', resolve('src/store'))
			.set('@service', resolve('src/service'))
		// 压缩图片
		config.module
			.rule('images')
			.use('image-webpack-loader')
			.loader('image-webpack-loader')
			.options({
				mozjpeg: { progressive: true, quality: 65 },
				optipng: { enabled: false },
				pngquant: { quality: [0.65, 0.9], speed: 4 },
				gifsicle: { interlaced: false },
				webp: { quality: 75 }
			})
		//压缩代码
		config.optimization.minimizer('js').use(
			new TerserPlugin({
				terserOptions: {
					compress: {
						warnings: false,
						drop_console: true,
						drop_debugger: true
					}
				}
			})
		)
		// 打包分析, 打包之后自动生成一个名叫report.html文件(可忽视)
		if (!isRelease) {
			// config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
			// 	{
			// 		analyzerMode: 'static'
			// 	}
			// ])
		}
	},
	configureWebpack: config => {
		//配置webpack自动按需引入element-plus，
		const plugins = []
		if (isProd) {
			plugins.push(
				new CompressionWebpackPlugin({
					filename: '[path].gz[query]',
					algorithm: 'gzip',
					test: productionGzipExtensions,
					threshold: 10240,
					minRatio: 0.8
				})
			)
		}
		// 去除无用的css
		plugins.push(
			new PurgeCSSPlugin({
				paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
				safelist: function () {
					return {
						standard: ['body', 'html', 'ef']
					}
				}
			})
		)

		plugins.push(
			AutoImport({
				resolvers: [ElementPlusResolver()]
			})
		)
		plugins.push(
			Components({
				resolvers: [ElementPlusResolver()]
			})
		)
		config.plugins = [...config.plugins, ...plugins]
	},
	devServer: {
		open: false //配置自动启动浏览器
		// proxy: { // 代理
		// 	'/api': {
		// 		target: 'https://www.baidu.com',
		// 		changeOrigin: true,
		// 		ws: true,
		// 		pathRewrite: {
		// 			'^/api': ''
		// 		},
		// 		logLevel: 'debug'
		// 	}
		// }
	}
})
