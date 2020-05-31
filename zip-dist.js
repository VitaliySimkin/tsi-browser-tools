const { zip } = require('zip-a-folder');
const pjson = require("./package.json");

const ZipManager = {
	async zip(folderPath, zipPath) {
		console.info(`Zip folder '${folderPath}' to '${zipPath}' started`);
		try {
			await zip(folderPath, zipPath);
			console.info('Folder zipped successful!');
		} catch (err) {
			console.error(err);
		}
	}
}

ZipManager.zip('./dist/', `./v${pjson.version}.zip`);
