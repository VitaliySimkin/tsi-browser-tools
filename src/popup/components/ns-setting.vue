<template><div class="ns-container setting-container">
	<div class="settings-caption">{{caption}}</div>
	<div class="settings-variables">
		<slot></slot>
	</div>
</div></template>

<<script lang="ts">
export default {
	props: ['caption'],
};
</script>

<style lang="less">
	.setting-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.settings-caption {
		width: calc(25% - 5px);
		display: inline-block;
		font-family: Georgia;
		font-size: 16px;
	}
</style>