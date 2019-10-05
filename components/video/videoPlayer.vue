<template>
	<view class="video-player" @click="doClick">
		<video  class="video" id="myVideo" :src="videoPath" :controls="false" :objectFit="cover" @ended="toNextVideo"
					:show-center-play-btn="false">
		</video>
	</view>
</template>

<script>
	let timer = null;
	export default {
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				isPlay: false,
				clickCount: 0,
				cover: "cover",
				videoPath: "",
				videoContext: '',
			}
		},
		props: ["currentPage", "index","videoList"],
		created() {
			this.videoContext = uni.createVideoContext("myVideo", this);
		},
		mounted() {
			let video = this.videoList[this.index]
			this.videoPath = this.baseUrl + video.videoPath
			// console.log("index=" + this.index + "-----------video="+video.videoWidth);
			// 横向视频进行自适应
			if (video.videoWidth >= video.videoHeight) {
				this.cover = ""
			}
			// 进入页面后开启自动播放
			if (this.index === this.currentPage) {
				setTimeout(() => {
					this.play();
				},150)
			}
		},
		methods: {
			// 播放完成后滑动到下一页
			toNextVideo() {
				this.$emit('toNextVideo', this.currentPage)
			},
			// 播放
			play() {
				this.videoContext.play();
				this.isPlay = true;
				this.$emit('playAnimate', this.currentPage)
			},
			// 暂停
			pause() {
				this.videoContext.pause();
				this.isPlay = false;
				this.$emit('pauseAnimate', this.currentPage)
			},
			// 从头播放
			playFromHead(index) {
				this.videoContext.seek(0);
				this.videoContext.play();
				this.isPlay = true;
				this.$emit('playAnimate', index)
			},
			// 点击播放或暂停视频，双击点赞
			doClick() {
				if (timer) {
					clearTimeout(timer);
				}
				this.clickCount++;
				timer = setTimeout(() => {
					if (this.clickCount >= 2) {
						this.$emit("follow", this.currentPage);
					} else {
						if (this.isPlay) {
							this.pause();
						} else {
							this.play();
						}
					}
					this.clickCount = 0;
				}, 300);
			}
		}
	}
</script>

<style>
	.video-player {
		width: 100%;
		height: 100%;
	}

	.video {
		width: 100%;
		height: 100%;
		z-index: 100;
	}
</style>
