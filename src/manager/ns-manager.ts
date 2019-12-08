import NSStorage, {NSStorageClass} from './ns-storage';
import NSFeature from './ns-feature';
import featuresList from '../features/index';


class NSManagerClass {

	/** Версія розширення */
	public VERSION: string = '1.4.1';

	/** Перелік фіч */
	public features: NSFeature[] = featuresList;

	/** Префікс для зберігання налаштувань */
	private settingStoragePrefix: string = 'settings/';

	/** Встановити значення налаштування
	 * @param code код налаштування
	 * @param value значення
	 */
	public async setSettingValue(code: string, value: string) {
		await NSStorage.set(`${this.settingStoragePrefix}${code}`, value);
	}

	/** Отримати значення налаштування
	 * @param code код налаштування
	 */
	public async getSettingValue(code: string) {
		return await NSStorage.get(`${this.settingStoragePrefix}${code}`);
	}

	/** Зачекати ініціалізації всіх фіч */
	public waitFeaturesInit() {
		return Promise.all(this.features.map(((item) => item.waitInit())));
	}
}

const NSManager = new NSManagerClass();

window.NSManager = NSManager;

export default NSManager;
