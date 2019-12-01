const path = require('path');

function getConfig(inputFilePath, outputPath) {
	return {
		entry: inputFilePath,
		mode: "production",
		module: {rules: [{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
		}]},
		resolve: { extensions: [ '.tsx', '.ts', '.js' ] },
		output: {
			filename: outputPath,
			path: path.resolve(__dirname, 'dist/'),
		},
		plugins: []
	}
}


module.exports = [
	getConfig("./src/content/content.ts", "content/content.js"),
	getConfig("./src/inject/inject.ts", "inject/inject.js")
];