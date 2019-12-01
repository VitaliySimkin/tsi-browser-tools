import NSFeature, { NSFeatureInjectFor } from '../../manager/ns-feature';

export default new NSFeature({
	code: `bpm-lookup-name-search`,
	title: {
		ua: `BPM. Відображати назву довідника, а не заголовок`,
		ru: `BPM. Отображать название справочника, а не заголовок`,
		en: `BPM. Display the name of the lookup, not the title`,
	},
	injectFor: NSFeatureInjectFor.BPMDev,
	injectConfig: {
		js: 'bpm-lookup-name-search.js',
	},
	description: {
		screen: 'bpm-lookup-name-search.png',
		text: {
			ua: `При розробці в конфігурації буде відображати назву довідника, замість його заголовка`,
			ru: `При разработке в конфигурации будет отображать название справочника, вместо его заголовка`,
			en: `During development, the configuration will display the name of the lookup, instead of its title`,
		},
	},
});
