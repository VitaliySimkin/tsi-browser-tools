<template><div id="features-tab-container" class="popup-content">
	<ns-feature v-for="feature in features" :key="feature.code" :feature="feature"></ns-feature>
</div></template>

<script lang="ts">
import Vue from 'vue';
import Vuex from 'vuex';
import NSFeature from '../components/ns-feature.vue';

export default {
	props: ['caption'],
	components: {
		'ns-feature': NSFeature,
	},
	computed: {
		...Vuex.mapState(['features']),
	},
};
</script>

<style lang="less">

</style>