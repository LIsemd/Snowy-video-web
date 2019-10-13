<template>
	<view class="video-item">
		<video-player :video="videoItem" :currentPage="0" :index="0" ref="players" @follow="follow" @pauseAnimate="pauseAnimate"
		 @playAnimate="playAnimate" :isLoop="true">
		</video-player>
		<view class="left-box">
			<list-left :video="videoItem"></list-left>
		</view>
		<view class="center-box" v-show="isPause" @click="clickPlay"><text class="cuIcon-stop"></text></view>
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
		data() {
			return {
				isPause: false
			}
		},
		props: ['videoItem'],
		methods: {
			// 双击点赞
			follow(index) {
				this.$refs.listRight.handleFollow();
			},
			// 开启旋转动画
			playAnimate(index) {
				this.isPause = false
				this.$refs.listRight.playAnimate();
			},
			// 暂停旋转动画
			pauseAnimate(index) {
				this.isPause = true
				this.$refs.listRight.pauseAnimate();
			},
			clickPlay() {
				this.isPause = false
				this.$refs.listRight.playAnimate();
				this.$refs.players.play();
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

	.center-box {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 70rpx;
		text-align: center;
		line-height: 100rpx;
		color: #FFF;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, .15);
		z-index: 200;
	}

	.left-box {
		position: absolute;
		bottom: 100rpx;
		left: 30rpx;
		z-index: 200;
	}
</style>
