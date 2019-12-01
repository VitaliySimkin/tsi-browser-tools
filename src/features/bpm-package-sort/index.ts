import NSFeature, { NSFeatureInjectFor } from '../../manager/ns-feature';

export default new NSFeature({
	code: 'bpm-package-sort',
	enabled: true,
	description: {
		text: {
			ua: ``, ru: ``, en: ``,
		},
		code: `let sortPriority = [
			item.IsChanged,
			item.IsContentChanged,
			item.Name === "TsiBase",
			item.Name.startsWith("TsiBase"),
			item.Name.startsWith("Tsi"),
			item.Name.startsWith("Ts"),
			item.Maintainer !== "Terrasoft",
			other
		];`,
		screen: 'bpm-package-sort.png',
	},
	title: {
		ua: `BPM. Сортування пакетів в конфігурації`,
		ru: `BPM. Сортировка пакетов в конфигурации`,
		en: `BPM. Sort packages in configuration`,
	},
	injectFor: NSFeatureInjectFor.BPMDev,
	injectConfig: {
		js: 'bpm-package-sort.js',
	},
});
