<template>
	<view class="cu-modal" :class="{show: isShow}">
		<view class="cu-dialog">
			<view class="content">
				<slot name="title"></slot>
			</view>
			<view class="padding-xl bg-white">
				<slot name="content"></slot>
			</view>
			<view class="cu-bar bg-white justify-end">
				<view class="action">
					<slot name="button"></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['isShow']
	}
</script>

<style>
</style>
