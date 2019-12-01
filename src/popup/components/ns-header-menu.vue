<template><div class="ns-header-menu">
	<span v-for="tab in Tabs" class="ns-header-menu-item responsive-cnt" :key="tab.code"
		@click="setSettingValue({code:'ActiveTab', value:tab.code})" :active="tab.code === ActiveTab">
		<span v-if="tab.icon" :class="'icon ' + tab.icon"></span>
		<span class="caption">{{LS[tab.caption]}}</span>
	</span>
</div></template>

<script lang="ts">
import Vuex from 'vuex';
export default {
	methods: {
		...Vuex.mapMutations(['setSettingValue']),
	},
	computed: {
		...Vuex.mapState(['Tabs', 'ActiveTab']),
		...Vuex.mapGetters(['LS']),
	},
};
</script>

<style lang="less">
.dark .ns-header-menu-item {
	background: #333;
	color: #aaa;
	.icon {
		filter: invert(1);
	}
	&:hover, &:focus {
		border-color: #391D00;
		background-color: #130A00;
	}
	&:active {
		border-color: #C57119;
		outline: 0;
	}
	&[active] {
		background-color: #3a8ee647;
		border-bottom: solid 1px #0c83ff;
	}
}
.ns-header-menu-item {
	display: inline-block;
	background: #fefefe;
	-webkit-appearance: none;
	text-align: center;
	color: #555555;
	box-sizing: border-box;
	outline: 0;
	margin: 0;
	transition: .1s;
	padding: 7px 10px;
	font-size: 13px;
	/* border-radius: 4px; */
	position: relative;
	height: 100%;
	border: none;
	.icon {
		width: 16px;
		height: 21px;
		position: absolute;
		background-position: center;
		background-repeat: no-repeat;
	}
	.caption {
		margin-left: 24px;
		vertical-align: middle;
		font-family: sans-serif;
		font-size: 12px;
		vertical-align: -webkit-baseline-middle;
	}
	&:hover, &:focus {
		border-color: #c6e2ff;
		background-color: #ecf5ff;
	}
	&:active {
		border-color: #3a8ee6;
		outline: 0;
	}
	&[active] {
		background-color: #3a8ee60d;
		border-bottom: solid 1px #0c83ff;
	}
}
</style>