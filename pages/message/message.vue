<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">Snowy 短视频</block>
		</cu-custom>
	</view>
</template>

<script>
	export default {
		onShow() {
			this.setTabBarIndex(3)
		}
	}
</script>

<style>
</style>
