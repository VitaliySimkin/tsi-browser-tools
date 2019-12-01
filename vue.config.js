const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	pages: {
		index: {
			entry: "src/popup/main.ts",
			template: "src/popup/index.html",
			filename: "popup/index.html",
			title: "TSI Browser Tools"
		}
	},
	filenameHashing: false,
	assetsDir: "popup/assets",
	outputDir: "dist/",
	configureWebpack: config => {
		config.devtool = 'source-map';
		config.plugins.push(new CopyWebpackPlugin([
			{ from: 'src/img/', to: 'img/' },
			{ from: 'src/chrome.manifest.json', to: 'manifest.json' },
			{ from: 'src/features/', to: 'features/', ignore: ["*.ts"] }
		]));
	}
}