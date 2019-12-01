/** Available Language Code */
export enum LOCALES {
	/** Ukrainian */
	UA = 'ua',
	/** Russian */
	RU = 'ru',
	/** English */
	EN = 'en',
}

/** Вкладки */
export enum TABS {
	/** Опис релізів */
	VERSIONS = 'versions',
	/** Налаштування */
	SETTINGS = 'settings',
	/** Фічі */
	FEATURES = 'features',
}

/** Доступні теми */
export enum COLOR_THEME {
	/** темна */
	DARK = 'dark',
	/** світла */
	LIGHT = 'light',
}

export class NeverError extends Error {
	constructor(value: never) {
		super(`Unreachable statement: ${value}`);
	}
}
