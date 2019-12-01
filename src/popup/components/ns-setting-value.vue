<template>
<span class="responsive" :active="value === currentValue"
		@click="onClick()"><slot></slot></span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	props: {
		settingName: String,
		value: String,
	},
	data() {
		return {};
	},
	methods: {
		onClick() {
			this.$store.commit('setSettingValue', {code: this.settingName, value: this.value});
		},
	},
	computed: {
		currentValue(): string {
			return this.$store.state[this.settingName];
		},
	},
});
</script>

<style lang="less">
.settings-variables {
	width: calc(75% - 5px);
	display: inline-flex;
	flex-direction: row;
	justify-content: space-evenly;
	span {
		font-family: "Jura-Regular";
		font-size: 15px;
		&[active] {
			font-weight: bold;
		}
	}
}

</style>