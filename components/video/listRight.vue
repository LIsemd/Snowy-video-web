<template>
	<view class="list-right">
		<view class="author-img">
			<view @click="toCreaterPage">
				<image class="img" :src="avatar"></image>
				<view class="follow cuIcon-add"></view>
				<!--  v-show="!isFollow" @click="handleFollow"  -->
			</view>
		</view>
		<view class="right-box">
			<view class="icon cuIcon-likefill" :class="{fav: isFav}" @click="changeColor"></view>
			<view class="count">{{videoInfo.likeCounts}}</view>
		</view>
		<view class="right-box">
			<view class="icon cuIcon-commentfill"></view>
			<view class="count">0</view>
		</view>
		<view class="right-box">
			<view class="icon cuIcon-forwardfill"></view>
			<view class="count">0</view>
		</view>
		<view class="music-img" :class="{'pauseAnimate': isPauseAnimate}">
			<image class="img" src="../../static/images/avatar2.jpg" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				isFollow: false,
				isFav: false,
				isPauseAnimate: true,
				videoInfo: '',
				avatar: '',
				userInfo: getApp().globalData.getGlobalUserInfo()
			}
		},
		mounted() {
			this.videoInfo = this.video
			this.avatar = this.baseUrl + this.video.avatar
			uni.request({
				url: this.baseUrl + '/user/queryUserLike?userId=' + this.userInfo.id + '&videoId=' + this.video.id,
				method: 'POST',
				header: {
					'content-type': 'application/json',
					'userId': this.userInfo.id,
					'userToken': this.userInfo.userToken
				},
				success: (res) => {
					if (res.data.status === 200) {
						this.isFav = res.data.data
					}
				}
			})
		},
		props: ['index', 'video'],
		methods: {
			// 跳转到作者个人界面
			toCreaterPage() {
				uni.navigateTo({
					url: '../../pages/person/person?userId=' + this.video.userId
				})
			},
			// 点赞与取消点赞
			changeColor() {
				if (this.userInfo === null || this.userInfo === undefined || this.userInfo === '') {
					uni.showToast({
						title: "登录后才可以点赞噢 \r\n ∠( ᐛ 」∠)＿",
						icon: "none",
						duration: 2000
					})
					return
				}
				let userId = this.userInfo.id
				let videoId = this.video.id
				let videoCreaterId = this.video.userId
				let url = this.baseUrl + '/video/userLike?userId=' + userId + '&videoId=' + videoId + '&videoCreaterId=' +
					videoCreaterId
				if (this.isFav) {
					url = this.baseUrl + '/video/userUnlike?userId=' + userId + '&videoId=' + videoId + '&videoCreaterId=' +
						videoCreaterId
				}
				uni.request({
					url: url,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'userId': this.userInfo.id,
						'userToken': this.userInfo.userToken
					},
					success: (res) => {
						if (res.data.status === 200) {
							this.isFav = !this.isFav;
							if (this.isFav) {
								this.videoInfo.likeCounts++
								uni.showToast({
									title: '点赞成功',
									icon: 'none',
									duration: 1000
								})
							} else {
								if (this.videoInfo.likeCounts > 0) {
									this.videoInfo.likeCounts--
									uni.showToast({
										title: '取消点赞',
										icon: 'none',
										duration: 1000
									})
								}
							}
						}
					}
				})
			},
			pauseAnimate() {
				this.isPauseAnimate = true
			},
			playAnimate() {
				this.isPauseAnimate = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-right {
		width: 120rpx;
		margin-right: 20rpx;

		.author-img {
			position: relative;
			width: 120rpx;
			text-align: center;

			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				border: 2px solid #FFFFFF;
			}

			.follow {
				color: white;
				position: absolute;
				width: 30rpx;
				height: 30rpx;
				line-height: 30rpx;
				background: red;
				border-radius: 50%;
				text-align: center;
				left: 23rpx;
				bottom: -5rpx;
				font-weight: bold;
			}
		}

		.right-box {
			margin: 60rpx auto;
			color: white;
			text-align: center;
			font-size: 30rpx;

			.fav {
				color: #F43F3B;
			}

			.icon {
				font-size: 70rpx;
				transition: color .5s;
			}
		}

		.music-img {
			width: 120rpx;
			height: 120rpx;
			text-align: center;
			margin-top: 40rpx;
			animation: around 2.5s linear .2s infinite;

			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				border: 2px solid #FFFFFF;
			}
		}

		.pauseAnimate {
			animation-play-state: paused;
		}
	}

	@keyframes around {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
