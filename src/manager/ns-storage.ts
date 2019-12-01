/** Тип сховища */
enum StorageType {

	/** Сховище розширення в Google Chrome */
	CHROME = 'chrome',

	/** Локальне сховище */
	LOCAL = 'local',
}

export class NSStorageClass {

	/** Get values from cache
	 * @param value key
	 */
	public async get(key: string) {
		switch (this.getStorageType()) {
			case StorageType.CHROME: return new Promise((resolve) => {
				chrome.storage.sync.get([key], (values) => resolve(values[key]));
			});
			default: return window.localStorage.getItem(key);
		}
	}

	/** Set values to cache
	 * @param {object.<string,string>} values values
	 */
	public async set(key: string, value: string) {
		switch (this.getStorageType()) {
			case StorageType.CHROME: return new Promise((resolve) => chrome.storage.sync.set({[key]: value}, resolve));
			default: return window.localStorage.setItem(key, value);
		}
	}

	/** Отримати тип сховища для даних */
	private getStorageType(): StorageType {
		return Boolean(chrome && chrome.storage && chrome.storage.sync) ? StorageType.CHROME : StorageType.LOCAL;
	}
}

export default new NSStorageClass();
