import NSFeature, { NSFeatureInjectFor } from '../../manager/ns-feature';

export default new NSFeature({
	code: `bpm-column-info`,
	enabled: true,
	title: {
		ua: `BPM. Інформація про колонку`,
		ru: `BPM. Информация о колонке`,
		en: `BPM. Column info`,
	},
	injectFor: NSFeatureInjectFor.BPM,
	injectConfig: {
		js: 'bpm-column-info.js',
		css: 'bpm-column-info.css',
	},
	description: {
		screen: 'bpm-column-info.png',
		text: {
			ru: `Позволяет отображать информацию о колонке. Для использования нужно нажать клавишу ALT и кликнуть по полю`,
			ua: `Дозволяє відображати інформацію про колонку. Для використання потрібно натиснути клавішу ALT та клікнути по полю`,
			en: `Displays column information. To use, press the ALT key and click on the field`,
		},
	},
});
