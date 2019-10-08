<template>
	<view class="content">
		<video-header :single="true" :isMine="isMine" :videoItem="videoItem"></video-header>
		<video-item :videoItem="videoItem"></video-item>
		<video-footer></video-footer>
	</view>
</template>

<script>
	import videoHeader from "../../components/video/videoHeader.vue"
	import videoFooter from "../../components/video/videoFooter.vue"
	import videoItem from "../../components/videoList/videoItem.vue"
	export default {
		components: {
			videoItem,
			videoHeader,
			videoFooter
		},
		data() {
			return {
				videoItem: '',
				isMine: false
			}
		},
		onLoad(params) {
			this.videoItem = JSON.parse(params.videoItem)
			if (params.isMine === 'true') {
				this.isMine = true
			}
		}
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
