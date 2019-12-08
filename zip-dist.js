const { zip } = require('zip-a-folder');

const ZipManager = {
	async zip(folderPath = './dist/', zipPath = './dist.zip') {
		console.info(`Zip folder '${folderPath}' to '${zipPath}' started`);
		try {
			await zip(folderPath, zipPath);
			console.info('Folder zipped successful!');
		} catch (err) {
			console.error(err);
		}
	}
}


ZipManager.zip(process.argv[2], process.argv[3]);
