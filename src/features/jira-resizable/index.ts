import NSFeature, { NSFeatureInjectFor } from '../../manager/ns-feature';

export default new NSFeature({
	code: 'jira-resizable',
	enabled: true,
	description: {
		text: {
			ua: `Дозволяє змінювати ширину таски. Можна краще подивитись інформацію не відкриваючи нову вкладку`,
			ru: `Позволяет изменять ширину таски. Можно лучше посмотреть информацию не открывая новую вкладку`,
			en: `Allows you to change the width of the task. You can better see the information without opening a new tab`,
		},
		screen: 'jira-resizable.gif',
	},
	title: {
		ua: 'JIRA. Зміна ширини відкритої таски',
		ru: 'JIRA. Изменение ширину открытой задачи',
		en: 'JIRA. Change the width of an open task',
	},
	injectFor: NSFeatureInjectFor.Jira,
	injectConfig: {
		js: 'jira-resizable.js',
		css: 'jira-resizable.css',
	},
});
