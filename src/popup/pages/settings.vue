<template><div id="settings-tab-container" class="popup-content">
	<ns-setting :caption="LS.LocalizationCaption">
		<ns-setting-value v-for="(local, code) in LOCALIZATIONS" v-bind:key="code"
			setting-name="Locale" :value="code">{{local.Caption}}</ns-setting-value>
	</ns-setting>
	<ns-setting :caption="LS.ColorThemeCaption">
		<ns-setting-value v-for="({code, caption}) in ColorThemes" v-bind:key="code"
			setting-name="ColorTheme" :value="code">{{LS[caption]}}</ns-setting-value>
	</ns-setting>
</div></template>

<script lang="ts">
import Vue from 'vue';
import Vuex from 'vuex';
import NSSettingValue from '../components/ns-setting-value.vue';
import NSSetting from '../components/ns-setting.vue';

export default {
	props: ['caption'],
	components: {
		'ns-setting': NSSetting,
		'ns-setting-value': NSSettingValue,
	},
	computed: {
		...Vuex.mapState(['LOCALIZATIONS', 'ColorThemes']),
		...Vuex.mapGetters(['LS']),
	},
};
</script>

<style lang="less">

</style>