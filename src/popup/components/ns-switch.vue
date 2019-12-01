<template><input type="checkbox" class="toggle-switch" :checked="value" @change="$emit('change', $event.target.checked)"></input></template>

<script lang="ts">
import Vue from 'vue';

export default {
	props: {
		value: Boolean,
	},
};
</script>

<style lang="less">
input[type=checkbox].toggle-switch {
	-webkit-appearance: none;
	width: 50px;
	height: 25px;
	border-radius: 25px;
	background-color: #ff5d5df3;
	margin: 0;
	outline: 0;
	cursor: pointer;
	transition: background 0.2s ease-in-out;
	position: relative;

	&:checked {
		background-color: #6edc6ef3;
		&::after {
			left: 25px;
		}
	}

	&::after {
		content: '';
		width: 25px;
		height: 25px;
		background-color: #fefefe;
		border-radius: 25px;
		position: absolute;
		transform: scale(0.7);
		left: 0;
		transition: left 0.2s ease-in-out;
	}
}
</style>