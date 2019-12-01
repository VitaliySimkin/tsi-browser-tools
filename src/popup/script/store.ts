import Vue from 'vue';
import Vuex from 'vuex';
import NSLocalization from './localization';
import NSManager from '../../manager/ns-manager';
import {LOCALES, TABS, COLOR_THEME } from './types';

Vue.use(Vuex);

const NSStore = new Vuex.Store({
	state: {

		/** Версія розширення */
		VERSION: NSManager.VERSION,

		/** Посилання на проект в GitHub */
		GitHubURL: 'https://github.com/VitaliySimkin/tsi-browser-tools',

		/** Локалізації */
		LOCALIZATIONS: NSLocalization,

		/** Вкладки */
		Tabs: [
			// {code: TABS.VERSIONS, caption: 'VersionsTabCaption', icon: 'ns-icon-versions-tab'},
			{code: TABS.SETTINGS, caption: 'SettingsTabCaption', icon: 'ns-icon-settings-tab'},
			{code: TABS.FEATURES, caption: 'FeaturesTabCaption', icon: 'ns-icon-features-tab'},
		],

		/** Доступні теми */
		ColorThemes: [
			{code: COLOR_THEME.DARK, caption: 'DarkColorThemeCaption'},
			{code: COLOR_THEME.LIGHT, caption: 'LightColorThemeCaption'},
		],

		/** Можливості */
		features: NSManager.features,

		/** Локалізація */
		Locale: LOCALES.UA,

		/** Активна вкладка */
		ActiveTab: TABS.FEATURES,

		/** Активна тема */
		ColorTheme: COLOR_THEME.LIGHT,
	},
	getters: {
		/** Отримати локалізований рядок
		 * @param state state
		 */
		LS(state) {
			return state.LOCALIZATIONS[state.Locale || LOCALES.UA];
		},
	},
	mutations: {
		/** Встановити значення налаштування
		 * @param state state
		 * @param config значення
		 * @param config.code код налаштування
		 * @param config.value значення
		 * @param config.saveToStorage зберігати значення в сховище
		 */
		setSettingValue(state, {code, value, saveToStorage = true}:
				{code: string, value: string, saveToStorage: boolean}) {
			switch (code) {
				case 'Locale': state.Locale = value as LOCALES; break;
				case 'ActiveTab': state.ActiveTab = value as TABS; break;
				case 'ColorTheme': NSStore.commit('setColorTheme', value as COLOR_THEME); break;
				default: return;
			}
			if (saveToStorage) {
				NSManager.setSettingValue(code, value);
			}
		},

		setColorTheme(state, value: COLOR_THEME) {
			state.ColorTheme = value;
			document.body.className = value;
		},

		/** Ініціювати значення змінних */
		initSettingsValue() {
			const settings = ['Locale', 'ActiveTab', 'ColorTheme'];
			settings.forEach((code) => NSManager.getSettingValue(code).then((value) =>
				value && NSStore.commit('setSettingValue', { code, value, saveToStorage: false })));
		},
	},
});


export default NSStore;
