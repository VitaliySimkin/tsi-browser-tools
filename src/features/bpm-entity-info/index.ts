import NSFeature, { NSFeatureInjectFor } from '../../manager/ns-feature';

export default new NSFeature({
	code: `bpm-entity-info`,
	enabled: true,
	title: {
		ua: `[ALPHA] BPM. Інформація про об'єкт`,
		ru: `[ALPHA] BPM. Информация об объекте`,
		en: `[ALPHA] BPM. Entity info`,
	},
	injectFor: NSFeatureInjectFor.BPM,
	injectConfig: {
		js: 'bpm-entity-info.js',
		css: 'bpm-entity-info.css',
	},
	description: {
		screen: 'bpm-entity-info.png',
		text: {
			ua: `Ціль - зручне відображення інформації про entity. Поки що тільки перша версія.
Для користування натисність [CTRL] + [SHIFT] + [E] на сторінці.
Назва entity чутлива до регістру.
Поля фільтруються по назві та заголовку, нечутливе до регістру`,
			ru: `Цель - удобное отображение информации о entity. Пока только первая версия.
Для использования нажмите [CTRL] + [SHIFT] + [E] на странице.
Название entity чувствительна к регистру.
Поля фильтруются по названию и заголовку, нечувствительно к регистру`,
			en: `The goal is a convenient display of information about the entity. So far, only the first version.
To use, press [CTRL] + [SHIFT] + [E] on the page.
The entity name is case sensitive.
Fields are filtered by name and title, case insensitive`,
		},
	},
});
