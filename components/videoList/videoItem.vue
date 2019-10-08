<template>
	<view class="video-item">
		<video-player :video="videoItem" :currentPage="0" :index="0" ref="players" @follow="follow" @pauseAnimate="pauseAnimate"
		 @playAnimate="playAnimate" :isLoop="true">
		</video-player>
		<view class="left-box">
			<list-left :video="videoItem"></list-left>
		</view>
		<view class="right-box">
			<list-right ref="listRight" :video="videoItem"></list-right>
		</view>
	</view>
</template>

<script>
	import videoPlayer from "../video/videoPlayer.vue";
	import listLeft from "../video/listLeft.vue";
	import listRight from "../video/listRight.vue";
	export default {
		components: {
			videoPlayer,
			listLeft,
			listRight
		},
		props:['videoItem'],
		methods:{
			// 双击点赞
			follow(index) {
				this.$refs.listRight.changeColor();
			},
			// 开启旋转动画
			playAnimate(index) {
				this.$refs.listRight.playAnimate();
			},
			// 暂停旋转动画
			pauseAnimate(index) {
				this.$refs.listRight.pauseAnimate();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.video-item {
		width: 100%;
		height: 100%;
	}

	.right-box {
		position: absolute;
		bottom: 180rpx;
		right: 30rpx;
		z-index: 200;
	}

	.left-box {
		position: absolute;
		bottom: 100rpx;
		left: 30rpx;
		z-index: 200;
	}
</style>
