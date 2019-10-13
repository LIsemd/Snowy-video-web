<template>
	<view class="list-left">
		<view class="author">
			@{{nickname}}
		</view>
		<view class="title">
			{{videoDesc}}
		</view>
		<view class="music-box">
			<view class="music" v-if="id">
				BGM: {{name}} &nbsp; &nbsp; @{{author}} &nbsp; &nbsp;
			</view>
			<view class="music" v-else>
				@{{nickname}}创作的原声 &nbsp; &nbsp;
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname: '',
				videoDesc: '',
				author: '',
				name: '',
				id: ''
			}
		},
		props: ['video'],
		mounted() {
			this.id = this.video.audioId
			this.nickname = this.video.nickname
			this.videoDesc = this.video.videoDesc
			if (this.id != '') {
				uni.request({
					url: getApp().globalData.baseUrl + '/bgm/getBgmInfo?id=' + this.id,
					method: 'POST',
					success: (res) => {
						if (res.data.status === 200) {
							this.author = res.data.data.author
							this.name = res.data.data.name
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-left {
		width: 70%;
		height: 240rpx;
		color: white;	
		margin-bottom: 60rpx;
	}

	.author {
		height: 66rpx;
		line-height: 66rpx;
		font-size: 34rpx;
	}

	.title {
		width: 420rpx;
		line-height: 80rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		color: #FFFAF0;
	}

	.music-box {
		overflow: hidden;
		width: 70%;
	}

	.music {
		width: 500rpx;
		height: 66rpx;
		line-height: 66rpx;
		font-size: 24rpx;
		animation: scroll-x 8s linear 0.2s infinite;
	}

	@keyframes scroll-x {
		0% {
			transform: translate3d(60%, 0, 0);
		}

		100% {
			transform: translate3d(-60%, 0, 0);
		}
	}
</style>
