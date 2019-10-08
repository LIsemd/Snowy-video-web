<template>
	<view class="content">
		<video-header></video-header>
		<video-list></video-list>
		<video-footer></video-footer>
	</view>
</template>

<script>
	import videoHeader from "../../components/video/videoHeader.vue"
	import videoFooter from "../../components/video/videoFooter.vue"
	import videoList from "../../components/video/videoList.vue"
	export default {
		components: {
			videoList,
			videoHeader,
			videoFooter
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		color: #3F536E;
		.title {
			margin: 0 20rpx;
		}
	}
</style>
