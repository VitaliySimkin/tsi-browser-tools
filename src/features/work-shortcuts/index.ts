import NSFeature, { NSFeatureInjectFor } from '../../manager/ns-feature';

export default new NSFeature({
	code: 'work-shortcuts',
	enabled: true,
	description: {
		text: {
			ua: ``,
			ru: ``,
			en: ``,
		},
		screen: 'work-shortcuts.png',
	},
	title: {
		ua: 'JIRA. Зміна ширини відкритої таски',
		ru: 'JIRA. Изменение ширину открытой задачи',
		en: 'JIRA. Change the width of an open task',
	},
	injectFor: NSFeatureInjectFor.BPM,
	injectConfig: {
		js: 'work-shortcuts.js',
		css: 'work-shortcuts.css',
	},
});
