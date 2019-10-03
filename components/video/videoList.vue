<template>
	<view class="video-list">
		<view class="swiper-box">
			<swiper class="swiper" :vertical="true" @change="slider" :current="currentPage">
				<swiper-item v-for="(item,index) in videos" :key="index">
					<view class="swiper-item">
						<video-player :video="item" :currentPage="currentPage" :index="index"  @toNextVideo="toNextVideo"
								ref="players" @follow="follow" @pauseAnimate="pauseAnimate" @playAnimate="playAnimate">
						</video-player>
						<view class="left-box">
							<list-left></list-left>
						</view>
						<view class="right-box">
							<list-right ref="listRight"></list-right>
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
		props: ['list'],
		data() {
			return {
				videos: [],
				currentPage: 0
			}
		},
		watch: {
			list() {
				this.videos = this.list;
			}
		},
		methods: {
			toNextVideo(index) {
				this.currentPage = index + 1
				this.$refs.players[this.currentPage].playFromHead(this.currentPage);
				this.$refs.players[index].pause(); 
			},
			follow(index) {
				this.$refs.listRight[index].changeColor();
			},
			playAnimate(index) {
				this.$refs.listRight[index].playAnimate();
			},
			pauseAnimate(index) {
				this.$refs.listRight[index].pauseAnimate();
			},
			slider(e) {
				const targetPage = e.detail.current;
				 // 滑动切换视频
				if (targetPage === this.currentPage + 1) {
					this.$refs.players[targetPage].playFromHead(targetPage);
					this.$refs.players[this.currentPage].pause(); 
				} else if (targetPage === this.currentPage - 1) {
					this.$refs.players[targetPage].playFromHead(targetPage); 
					this.$refs.players[this.currentPage].pause();
				}
				this.currentPage = targetPage;
			}
		}
	}
</script>

<style>
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
</style>
