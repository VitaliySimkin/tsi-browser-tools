/** Локалізоване значення */
interface NSLocalizableValue {
	/** Українська */
	ua: string;
	/** Російська */
	ru?: string;
	/** Англійська */
	en?: string;
}

/** Конфіг для додавання скриптів та стилів на сторінку */
interface NSFeatureConfigInject {
	/** Назва файлу с js який необхідно додати на сторінку */
	js?: string;
	/** Назва файлу з стилями які необхідно додати на сторінку */
	css?: string;
}

/** Конфіг з описом фічі */
interface NSFeatureConfigDescription {
	/** опис */
	text: NSLocalizableValue;
	/** назва файлу з зображенням */
	screen: string;
	/** код для відображення (preformatted) */
	code?: string;
}

/** Конфіг фічі */
interface NSFeatureConfig {
	/** код */
	code: string;
	/** заголовок */
	title: NSLocalizableValue;
	/** активна */
	enabled?: boolean;
	/** тип сайту для якого потрібно додати */
	injectFor: 'BPM' | 'BPMDev' | 'Jira';
	/** конфіг для додавання скриптів та стилів на сторінку */
	injectConfig: NSFeatureConfigInject;
	/** опис */
	description: NSFeatureConfigDescription;
}

interface Window {
	NSManager: any;
}
