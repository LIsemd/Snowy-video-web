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
			<view class="icon cuIcon-likefill" :class="{fav: isFav}" @click="handleFollow"></view>
			<view class="count">{{videoInfo.likeCounts}}</view>
		</view>
		<view class="right-box">
			<view class="icon cuIcon-commentfill" @click="handleComment"></view>
			<view class="count">{{videoInfo.comments}}</view>
		</view>
		<view class="right-box">
			<view class="icon cuIcon-forwardfill" @click="handleForward"></view>
		</view>
		<view class="music-img" :class="{'pauseAnimate': isPauseAnimate}">
			<image class="img" src="../../static/images/music.png" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				fileUrl: getApp().globalData.fileUrl,
				isFollow: false,
				isFav: false,
				isPauseAnimate: true,
				isForward: false,
				videoInfo: '',
				avatar: '',
				userInfo: getApp().globalData.getGlobalUserInfo(),
				clickLoading: false,
			}
		},
		mounted() {
			this.videoInfo = this.video
			this.avatar = this.fileUrl + this.video.avatar
			this.getFav()
		},
		props: ['index', 'video'],
		methods: {
			// 获取点赞信息
			getFav() {
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
			// 打开评论界面
			handleComment() {
				uni.navigateTo({
					url: '../../pages/comment/comment?videoId=' + this.video.id + '&createrId=' + this.video.userId + '&videoDesc=' + this.video.videoDesc
				})
			},
			// 打开分享与举报
			handleForward() {
				uni.showActionSheet({
					itemList: ['分享到朋友圈', '分享到QQ空间', '分享到微博', '举报用户'],
					success: (res) => {
						if (res.tapIndex === 3) {
							uni.navigateTo({
								url: '../../pages/report/report?dealUserId=' + this.video.userId + '&dealVideoId=' + this.video.id
							})
						} else {
							uni.showToast({
								title: '分享功能正在施工中...',
								icon: 'none',
								duration: 1500
							})
						}
					}
				})
			},
			// 跳转到作者个人界面
			toCreaterPage() {
				uni.navigateTo({
					url: '../../pages/person/person?userId=' + this.video.userId
				})
			},
			// 点赞与取消点赞
			handleFollow() {
				if (this.clickLoading) {
					uni.showToast({
						title: "点击过于频繁 ~",
						icon: "none",
						duration: 1000
					})
					return
				}
				if (this.userInfo === null || this.userInfo === undefined || this.userInfo === '') {
					uni.showToast({
						title: "登录后才可以点赞噢 \r\n ∠( ᐛ 」∠)＿",
						icon: "none",
						duration: 2000
					})
					return
				}
				this.clickLoading = true
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
						this.clickLoading = false
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
					},
					fail: () => {
						this.clickLoading = false
					}
				})
			},
			// 旋转动画暂停
			pauseAnimate() {
				this.isPauseAnimate = true
			},
			// 旋转动画开启
			playAnimate() {
				this.isPauseAnimate = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-right {
		width: 120rpx;
		margin-right: 10rpx;

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
			animation: around 3.5s linear .2s infinite;

			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				background: #F1F1F1;
				opacity: .8;
				border: 2px solid #F1F1F1;
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
