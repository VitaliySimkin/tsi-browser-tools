import NSManager from '../manager/ns-manager';
import extensionId from '../manager/ns-extension-id';
import NSFeature from '../manager/ns-feature';


const ContentManager = {

	/** Ініціалізація менеджера */
	async init() {
		await NSManager.waitFeaturesInit();
		const scope = this;
		const listener = (ev: MessageEvent) => {
			if (scope.onWindowMessageEvent(ev)) {
				window.removeEventListener('message', listener);
			}
		};
		window.addEventListener('message', listener);
		this.loadInjectScript();
	},

	/** Завантажити inject скрипт (для визначення сайту) */
	loadInjectScript() {
		const script = document.createElement('script');
		script.type = 'module';
		script.src = chrome.extension.getURL('inject/inject.js');
		document.head.appendChild(script);
	},

	/** Обробка повідомелння
	 * @param event messageEvent
	 */
	onWindowMessageEvent(event: MessageEvent): boolean {
		try {
			const data = JSON.parse(event.data);
			if (data.extensionId === extensionId && data.source === 'inject') {
				this.onInjectLoaded(data.injectFor);
				return true;
			}
		} catch (err) {
			// tslint:disable-next-line: no-console
			console.warn(err);
		}
		return false;
	},

	/** Обробка завантаженя inject
	 * @param injectFor тип сайту
	 */
	onInjectLoaded(injectFor: string) {
		this.getFeatutesFor(injectFor).forEach((feature: NSFeature) => feature.inject());
	},

	/** Отримати фічі для сайту
	 * @param injectFor тип сайту
	 */
	getFeatutesFor(injectFor: string): NSFeature[] {
		return NSManager.features.filter((feature) => feature.enabled && feature.injectFor === injectFor);
	},
};

ContentManager.init();
