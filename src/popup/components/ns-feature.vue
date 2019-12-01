<template><div class="ns-container feature-container">
	<div class="feature-header">
		<div class="feature-title"><span>{{title}}</span></div>
		<div class="feature-action">
			<span v-if="feature.customizator" class="feature-action-item responsive feature-setting-button"
				@click="showConfig = !showConfig" :active="showConfig"></span>
			<span class="feature-action-item responsive feature-info-button"
				@click="showInfo = !showInfo" :active="showInfo"></span>
			<ns-switch class="feature-enabled" v-model="feature.enabled"
				@change="changeActive"></ns-switch>
		</div>
	</div>
	<div>
	<span v-if="showInfo" class="ns-feature-description">
			<span v-if="feature.description.screen" class="screen">
				<img :src="`../features/${feature.code}/${feature.description.screen}`"/></span>
			<span v-if="descriptionText" class="text">{{descriptionText}}</span>
			<span v-if="feature.description.code" class="code">{{feature.description.code}}</span>
		</span>
	</div>
	<span v-if="showConfig" class="ns-feature-description" :id="getFeatureConfigCntId()">
	</span>
</div></template>


<script lang="ts">
import Vue from 'vue';
import Vuex from 'vuex';
import NSSwitch from './ns-switch.vue';
import NSFeature from '../../manager/ns-feature';

export default Vue.extend({
	props: {
		feature: NSFeature,
	},
	components: {
		'ns-switch': NSSwitch,
	},
	data() {
		return {
			showInfo: false,
			showConfig: false,
		};
	},
	watch: {
		showInfo() {
			// if (this.showConfig && this.showInfo) this.showConfig = false;
		},
		showConfig() {
			// if (this.showConfig && this.showInfo) this.showInfo = false;
			// if (this.showConfig) {
				// this.showCustomConfig();
			// }
		},
	},
	methods: {
		async showCustomConfig() {
			// let customizatorPath = `/features/${this.feature.code}/${this.feature.customizator}`;
			// let customizator = (await import(customizatorPath)).default;
			// customizator.render(this.feature.code, this.getFeatureConfigCntId());
		},
		getLS(text: any): string {
			return typeof text === 'object' ? text[this.Locale] : text;
		},
		changeActive(value: boolean) {
			this.feature.setEnabled(value);
			// NSManager.setFeatureEnable(this.feature.code, this.feature.enabled);
		},
		getFeatureConfigCntId() {
			// return `ns-feature-${this.feature.code}-custom-config-cnt`;
		},
	},
	computed: {
		Locale(): string {
			return this.$store.state.Locale;
		},
		title(): string {
			return this.getLS(this.feature.title);
		},
		descriptionText(): string {
			return this.getLS(this.feature.description.text);
		},
	},
});
</script>

<style lang="less">
.feature-title span {
	font-family: Georgia;
	font-size: 16px;
}

.feature-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.feature-action-item {
	height: 20px;
	width: 20px;
	display: inline-block;
	margin: 0 3px;
	cursor: pointer;
}
.feature-info-button {
	background-image: url(/img/info.svg);
	margin-right: 6px;
}

.feature-setting-button {
	background-image: url(/img/setting-button.svg);
}

.feature-enabled {
	top: 2px;
}

.ns-feature-description {
	width: 100%;
	display: block;
	border: solid 1px #dddddd;
	padding: 5px;
	box-shadow: inset 0 0 8px 0px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: row;
	flex: 1;
	flex-basis: auto;
	box-sizing: border-box;
	min-width: 0;
	margin-top: 6px;
	max-width: 100%;
	overflow: auto;
}
.dark .ns-feature-description {
	border-color: #555555;
  }
.ns-feature-description .screen {
	margin-right: 10px;
}
.ns-feature-description .screen img {
	border: solid 1px #dddddd;
	max-width: 400px;
}
.ns-feature-description .text {
	white-space: pre-line;
	padding: 10px 5px;
	font-family: serif;
	font-size: 20px;
}
.ns-feature-description .code {
	padding: 10px 5px;
	font-size: 13px;
	font-family: monospace;
	white-space: pre-wrap;
}
</style>