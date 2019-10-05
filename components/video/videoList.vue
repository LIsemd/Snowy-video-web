<template>
	<view class="video-list">
		<view class="swiper-box">
			<swiper class="swiper" :vertical="true" @change="slider" :current="currentPage">
				<swiper-item v-for="(item,index) in videoList" :key="index">
					<view class="swiper-item">
						<video-player :video="item" :videoList="videoList" :currentPage="currentPage" :index="index" @toNextVideo="toNextVideo" ref="players"
						 @follow="follow" @pauseAnimate="pauseAnimate" @playAnimate="playAnimate">
						</video-player>
						<view class="left-box">
							<list-left :index="index" :videoList="videoList"></list-left>
						</view>
						<view class="right-box">
							<list-right ref="listRight" :index="index" :videoList="videoList"></list-right>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="container">
						<image src="../../static/images/avatar2.jpg" class="image" mode=""></image>
						<view class="content">
							木有视频了哟|д･)...
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import videoPlayer from "./videoPlayer.vue";
	import listLeft from "./listLeft.vue";
	import listRight from "./listRight.vue";
	export default {
		components: {
			videoPlayer,
			listLeft,
			listRight
		},
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				videoList: getApp().globalData.videoList,
				currentPage: getApp().globalData.currentPage
			}
		},
		mounted() {
			if (!getApp().globalData.isSearch) {
				uni.request({
					url: this.baseUrl + '/video/showAllVideos',
					method: "POST",
					success: (res) => {
						if (res.data.status === 200) {
							this.videoList = res.data.data
						}
					}
				})
			}
		},
		methods: {
			// 播放完成后滑动到下一页
			toNextVideo(index) {
				this.currentPage = index + 1
				if (index + 1 === this.$refs.players.length) {
					this.$refs.players[index].pause();
					return
				}
				this.$refs.players[this.currentPage].playFromHead(this.currentPage);
				this.$refs.players[index].pause();
			},
			// 双击点赞
			follow(index) {
				this.$refs.listRight[index].changeColor();
			},
			// 开启旋转动画
			playAnimate(index) {
				this.$refs.listRight[index].playAnimate();
			},
			// 暂停旋转动画
			pauseAnimate(index) {
				this.$refs.listRight[index].pauseAnimate();
			},
			// 上滑与下滑功能实现
			slider(e) {
				const targetPage = e.detail.current;
				// 滑动切换视频
				if (targetPage === this.currentPage + 1) {
					// console.log("切换到下一个视频");
					this.$refs.players[this.currentPage].pause();
					if (targetPage != this.$refs.players.length) {
						this.$refs.players[targetPage].playFromHead(targetPage);
					}
				} else if (targetPage === this.currentPage - 1) {
					// console.log("切换到上一个视频");
					if (this.currentPage != this.$refs.players.length) {
						this.$refs.players[this.currentPage].pause();
					}
					this.$refs.players[targetPage].playFromHead(targetPage);
				}
				this.currentPage = targetPage;
			}
		}
	}
</script>

<style lang="scss" scoped>
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

	.video-list {
		width: 100%;
		height: 100%;
	}

	.swiper-box {
		height: 100%;
		width: 100%;
	}

	.swiper {
		height: 100%;
		width: 100%;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
	}
	.container {
		height: 100vh;
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: row;
		padding-top: 500rpx;
		background-color: #FFF;
	
		.image {
			width: 300rpx;
			height: 300rpx;
		}
	
		.content {
			display: inline-block;
			height: 300rpx;
			padding-top: 100rpx;
			font-size: 44rpx;
			flex: 1;
		}
	}
</style>
