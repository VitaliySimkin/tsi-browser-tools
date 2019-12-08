import NSFeature, { NSFeatureInjectFor } from '../../manager/ns-feature';

export default new NSFeature({
	code: `bpm-detail-info`,
	enabled: true,
	title: {
		ua: `BPM. Інформація про деталь`,
		ru: `BPM. Информация о детали`,
		en: `BPM. Detail info`,
	},
	injectFor: NSFeatureInjectFor.BPM,
	injectConfig: {
		js: 'bpm-detail-info.js',
		css: 'bpm-detail-info.css',
	},
	description: {
		screen: 'bpm-detail-info.png',
		text: {
			ua: `Дозволяє відображати інформацію про деталь. Для використання потрібно натиснути клавішу ALT та клікнути по деталі`,
			ru: `Позволяет отображать информацию о детали. Для использования нужно нажать клавишу ALT и кликнуть по детали`,
			en: `Displays detail information. To use, press the ALT key and click on the detail`,
		},
	},
});
