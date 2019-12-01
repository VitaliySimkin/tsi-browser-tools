import extensionId from '../manager/ns-extension-id';
import NSFeatureInjectFor from '../manager/ns-feature-inject-for';

(() => {
	const injectFor =
		// tslint:disable: no-eval
		(eval(`Boolean(window.JIRA)`) && NSFeatureInjectFor.Jira) ||
		(eval(`Boolean(window.Terrasoft && window.Terrasoft.DataSource)`) && NSFeatureInjectFor.BPMDev) ||
		(eval(`Boolean(window.Terrasoft)`) && NSFeatureInjectFor.BPM) ||
		null;
		// tslint:enabled: no-eval

	window.postMessage(JSON.stringify({extensionId, source: 'inject', injectFor}), '*');
})();
