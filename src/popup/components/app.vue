<template>	<div id="app">
	<div class="popup-header">
		<div class="extension-logo-cnt">
			<!-- <button onclick="window.open(window.location.href, '_blank')">OPEN</button> -->
			<span class="extension-logo-icon"></span>
			<span class="extension-logo-version">v{{VERSION}}</span>
			<a class="extension-logo-github" :href="GitHubURL" target="_blank"></a>
		</div>
		<ns-header-menu></ns-header-menu>
	</div>
	<ns-settings-page v-if="ActiveTab === TABS.SETTINGS"></ns-settings-page>
	<ns-features-page v-if="ActiveTab === TABS.FEATURES"></ns-features-page>
</div></template>

<script lang="ts">
import Vue from 'vue';
import Vuex from 'vuex';
import NSHeaderMenu from './ns-header-menu.vue';
import NSVersionInfo from './ns-version-info.vue';
import SettingsPage from '../pages/settings.vue';
import FeaturesPage from '../pages/features.vue';
import { TABS } from '../script/types';

export default Vue.extend({
	name: 'app',
	components: {
		'ns-header-menu': NSHeaderMenu,
		'ns-version-info': NSVersionInfo,
		'ns-settings-page': SettingsPage,
		'ns-features-page': FeaturesPage,
	},
	computed: {
		...Vuex.mapState(['VERSION', 'GitHubURL', 'ActiveTab', 'LOCALIZATIONS', 'ColorThemes']),
		...Vuex.mapGetters(['LS']),
	},
	data() {
		return {TABS};
	},
});
</script>

<style lang="less">
@import url("../style/ns-icon.less");
@import url("../fonts/Jura/jura-font.css");
body {
	min-width: 800px;
	margin: 0;
	padding: 0;
	font-family: 'Times New Roman', Times, serif;
}
.popup-content {
	padding: 5px;
	height: -webkit-fill-available;
	max-height: 500px;
	background-color: #f3f3f3;
	overflow-y: auto;
}
.dark .popup-content {
	background-color: #1C1C1C;
}
.popup-header {
	height: 36px;
	background-color: #fefefe;
	border-bottom: solid 1px #aaaaaa;
	display:flex;
	justify-content:space-between;
}

.dark .popup-header {
	background-color: #333;
}

.ns-container {
	width: calc(100% - 2px);
	padding: 9px;
	margin-bottom: 5px;
	box-sizing: border-box;
	background-color: #fefefe;
	border: 1px solid #ebeef5;
	border-radius: 3px;
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}
.dark .ns-container {
	background-color: #444;
	border: #14110A;
	color: #aaa;
}
.responsive, .responsive-cnt {
	cursor: pointer;
	user-select: none;
}

.responsive:hover, .responsive-cnt:hover span {
	filter: invert(1) brightness(0.5) sepia(1) hue-rotate(180deg) saturate(5);
}

.dark .responsive:hover,.dark  .responsive-cnt:hover span {
	filter: invert(1) brightness(0.9) sepia(1) hue-rotate(180deg) saturate(5);
}

.responsive:active, .responsive[active], .responsive-cnt:active span, .responsive-cnt[active] span {
	filter: invert(1) brightness(0.3) sepia(1) hue-rotate(180deg) saturate(5);
	//color: #111;
}

.dark .responsive:active,
.dark .responsive[active],
.dark .responsive-cnt:active span,
.dark .responsive-cnt[active] span {
	color: #111;
	filter: invert(1) brightness(0.8) sepia(1) hue-rotate(180deg) saturate(5);
}


/* #endregion */

/* #region header styles */
.extension-logo-cnt {
	user-select: none;
	margin: 4px 10px;
}
.extension-logo-icon {
	background-image: url(/img/128.png);
	background-size: contain;
	display: inline-block;
	height: 25px;
	width: 25px;
}
.dark .extension-logo-icon {
	filter: invert(1);
}
.extension-logo-version {
	font-family: "Jura-Medium";
	font-size: 15px;
	display: inline-block;
	color: #555555;
	height: 100%;
	vertical-align: 3px;
}
.dark .extension-logo-version {
	color: #bbb;
}
.extension-has-update-text {
	color: red;
	position: absolute;
	top: -1px;
	right: 2px;
}
.extension-logo-github {
	background-image: url(/img/github.png);
	height: 23px;
	display: inline-block;
	width: 65px;
	background-size: 117%;
	background-position-y: -2px;
	background-position-x: -7px;
	margin-left: 20px;
}
.dark .extension-logo-github {
	filter: invert(1);
}
/* #endregion */

/* #region scrollbar */
::-webkit-scrollbar {
	width: 10px !important;
	height: 10px !important;
}
::-webkit-scrollbar-track {
	background: #f1f1f1 !important;
}
::-webkit-scrollbar-thumb {
	background: #bbb !important;
}
::-webkit-scrollbar-thumb:hover {
	background: #888 !important;
}
/* #endregion */
</style>
