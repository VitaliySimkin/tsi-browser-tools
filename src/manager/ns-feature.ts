import NSStorage from './ns-storage';
import NSFeatureInjectFor from './ns-feature-inject-for';

/** Фіча */
class NSFeature implements NSFeatureConfig {

	/** код */
	public readonly code: string;

	/** активна */
	public enabled?: boolean | undefined;

	/** заголовок */
	public readonly title: NSLocalizableValue;

	/** конфіг для додавання скриптів та стилів на сторінку */
	public readonly injectConfig: NSFeatureConfigInject;

	/** тип сайту для якого потрібно додати */
	public readonly injectFor: 'BPM' | 'BPMDev' | 'Jira';

	/** опис */
	public readonly description: NSFeatureConfigDescription;

	/** чи ініцалізована фіча (завантаженні налаштування) */
	private initied: boolean = false;

	/** слухачі ініціалізації */
	private initiedListeners: Array<() => void> = [];

	constructor(config: NSFeatureConfig) {
		this.code = config.code;
		this.enabled = typeof config.enabled === 'boolean' ? config.enabled : true;
		this.title = config.title;
		this.injectConfig = config.injectConfig;
		this.injectFor = config.injectFor;
		this.description = config.description;
		this.loadUserConfigToStorage().then(this.callInitiedCallback.bind(this));
	}

	/** Встановити стан
	 * @param value ввімкнуто/вимкнуто
	 */
	public setEnabled(value: boolean) {
		this.enabled = value;
		this.saveUserConfigToStorage();
	}

	/** Зачекати ініціалізації */
	public async waitInit() {
		if (this.initied) {
			return true;
		}
		return new Promise((resolve) => this.initiedListeners.push(resolve));
	}

	/** Додати фічу на сайт */
	public inject() {
		this.injectJS();
		this.injectCSS();
	}

	/** Додати JS код на сайт */
	protected injectJS() {
		if (!Boolean(this.injectConfig.js)) {
			return;
		}
		const url = chrome.extension.getURL(`features/${this.code}/${this.injectConfig.js}`);
		const script = document.createElement('script');
		script.type = 'module';
		script.src = url;
		document.head.appendChild(script);
	}

	/** Додати стилі на сайт */
	protected injectCSS() {
		if (!Boolean(this.injectConfig.css)) {
			return;
		}
		const url = chrome.extension.getURL(`features/${this.code}/${this.injectConfig.css}`);
		const link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('href', url);
		document.head.appendChild(link);
	}

	/** Викликати callback ініціалізації */
	protected callInitiedCallback() {
		this.initied = true;
		this.initiedListeners.forEach((item) => item());
	}

	/** Отримати ключ для зберігання налаштувань в сховищі */
	protected getStorageKey(): string {
		return `features/${this.code}`;
	}

	/** Зберегти налаштування користувача в сховище */
	protected saveUserConfigToStorage() {
		const storageKey = this.getStorageKey();
		const userConfig = {enabled: this.enabled};
		NSStorage.set(storageKey, JSON.stringify(userConfig));
	}

	/** Завантажити налаштування користувача зі сховища */
	protected async loadUserConfigToStorage() {
		const storageKey = this.getStorageKey();
		try {
			let value = await NSStorage.get(storageKey);
			if (!Boolean(value)) {
				return;
			}
			value = JSON.parse(String(value));
			Object.assign(this, value);
		} catch (error) {
			// tslint:disable-next-line: no-console
			console.warn(error);
		}
	}
}

export default NSFeature;

export { NSFeatureInjectFor };
