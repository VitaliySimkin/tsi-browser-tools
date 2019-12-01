import NSFeature, { NSFeatureInjectFor } from '../../manager/ns-feature';

export default new NSFeature({
	code: 'bpm-parent-name',
	enabled: true,
	description: {
		text: {
			ua: `При розробці в конфігурації при виборі батьківської схеми замість її caption буде відображатись назва`,
			ru: `BPM. При разработке в конфигурации при выборе родительской схемы вместо её caption будет отображаться название`,
			en: `BPM. When developing in the configuration, when choosing the parent scheme, the name will be displayed instead of its caption`,
		},
		screen: 'bpm-parent-name.png',
	},
	title: {
		ua: `BPM. При виборі батьківської схеми відображати назву`,
		ru: `BPM. При выборе родительской схемы отображать название`,
		en: `BPM. When choosing a parent scheme, display the name`,
	},
	injectFor: NSFeatureInjectFor.BPMDev,
	injectConfig: {
		js: 'bpm-parent-name.js',
	},
});
