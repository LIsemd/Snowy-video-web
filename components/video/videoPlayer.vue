<template>
	<view class="video-player" @click="doClick">
		<video class="video" id="myVideo" :src="video.src" :controls="false" objectFit="fill" @ended="toNextVideo" >
		</video>
	</view>
</template>

<script>
	let timer = null;
	export default {
		data() {
			return {
				isPlay: false,
				clickCount: 0,
			}
		},
		props: ["video", "currentPage", "index"],
		onReady() {
			this.videoContext = uni.createVideoContext("myVideo", this);
		},
		created() {
			setTimeout(() => {
				this.autoPlay();
			}, 300)
		},
		methods: {
			toNextVideo() {
				this.$emit('toNextVideo', this.currentPage)
			},
			play() {
				this.videoContext.play();
				this.isPlay = true;
				this.$emit('playAnimate', this.currentPage)
			},
			pause() {
				this.videoContext.pause();
				this.isPlay = false;
				this.$emit('pauseAnimate', this.currentPage)
			},
			playFromHead(index) {
				this.videoContext.seek(0);
				this.videoContext.play();
				this.isPlay = true;
				this.$emit('playAnimate', index)
			},
			autoPlay() {
				if (this.index === 0) {
					this.play()
				}
			},
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
