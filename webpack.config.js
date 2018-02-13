const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin= require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const purifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
const webpack =  require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
let port = Math.floor(Math.random()*10000);
	port = (port>1024? port: Math.floor(Math.random()*10000));
if(process.env.type === 'build') {
  var website = {
    publicPath: 'http://localhost/'
  }
} else {
  var website = {
    publicPath: 'http://localhost/'
  }
}

module.exports = {
	entry: {
		entry: './src/scripts/entry.js',
		entry2: './src/scripts/entry2.js',
		jquery: 'jquery',
		vue: 'vue'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'scripts/[name].js',
		publicPath: website.publicPath
	},
	devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: extractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{loader: 'css-loader', options: {importLoaders: 1}},
						'postcss-loader'
					]
				})
			},
			{
				test: /\.(png|jpg|gif)/,
				use: [{
					loader: 'url-loader', options: {
						limit: 8192,
						// publicPath: '../',
						outputPath: 'images/'
					}
				}]
			},
			{
				test: /\.(htm|html)$/i,
				use: ['html-withimg-loader']
			},
			{
				test: /\.less$/,
				use: extractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{loader: 'css-loader', options: {importLoaders: 1}},
						'postcss-loader',
						{loader: 'less-loader'}
					]
				})
			},
			{
				test: /\.scss$/,
				use: extractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{loader: 'css-loader', options: {importLoaders: 1}},
						'postcss-loader',
						{loader: 'sass-loader'}
					]
				})
			},
			{
				test: /\.(jsx|js)$/,
				use: [
					{
						loader:'babel-loader', 
						options: {
							presets:[
                'env',
                'react',
                'stage-2'
            	]
	          }
	        }
				],
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		// new uglify(),
		new htmlPlugin({
			minify: {
				removeAttributeQuotes: true
			},
			hash: true,
			template: './src/index.html'
		}),
		// 抽离 CSS，这里是跟随引入 CSS 的 js 文件名作为文件名的
		new extractTextPlugin('styles/[name].css'),
		// 去除 CSS 文件中冗余的 CSS，只保留用到的选择器
		new purifyCSSPlugin({
			paths: glob.sync(path.join(__dirname, 'src/*.html'))
		}),
		// 全局方式引入，好处是在 js 里用了才会打包，否则不会打包
		new webpack.ProvidePlugin({
			$: 'jquery',
			Vue: 'vue'
		}),
		// 在每个打包文件的顶部添加注释信息，可以作为版权信息
		new webpack.BannerPlugin('以下代码归 Season 版权所有.'),
		// 将常用的库分离成独立的 js
		new webpack.optimize.CommonsChunkPlugin({
	    //name 对应入口文件中的名字，这里是从后往前的顺序
	    name: ['vue', 'jquery'],
	    //把文件打包到哪里，是一个路径
	    filename: 'assets/scripts/[name].js',
	    //最小打包的文件模块数，这里直接写2就好
	    minChunks: 2
		}),
		// 拷贝其他杂七杂八的文件过去
		new copyWebpackPlugin([{
      from: __dirname + '/src/public',
      to: './public'
    }])
	],
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		// host: '192.168.142.134',
		// compress: true,
		port: 80
	},
	// 配合 webpack --watch 一起使用，就可以实时监视并编译文件了
	watchOptions:{
    //检测修改的时间，以毫秒为单位
    poll: 1000, 
    //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
    aggregateTimeout: 500, 
    //不监听的目录
    ignored: /node_modules/
	}
}