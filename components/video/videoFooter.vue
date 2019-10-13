<template>
	<view class="video-footer">
		<view class="footer-item" @click="toHomePage">
			<view class="text">首页</view>
		</view>
		<view class="footer-item" @click="toDynamicPage">
			<view class="text">关注</view>
		</view>
		<view class="footer-item" @click="toUploadPage">
			<view class="cuIcon-add add-button">
			</view>
		</view>
		<view class="footer-item" @click="toMessagePage">
			<view class="text">消息</view>
		</view>
		<view class="footer-item" @click="toMinePage">
			<view class="text">我的</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toHomePage() {
				uni.switchTab({
					url:'../../pages/index/index'
				})
			},
			toDynamicPage() {
				uni.switchTab({
					url:'../../pages/dynamic/dynamic'
				})
			},
			toMessagePage() {
				uni.switchTab({
					url:'../../pages/message/message'
				})
			},
			toUploadPage() {
				// 页面重定向： 如果未登录，则跳转登录页面
				let user = getApp().globalData.getGlobalUserInfo
				if (user === null || user === undefined || user === '') {
					wx.reLaunch({
						url:'../../pages/login/login'
					})
				} else {
					uni.navigateTo({
						url:'../../pages/upload/upload'
					})
				}
			},
			toMinePage() {
				let user = getApp().globalData.getGlobalUserInfo
				if (user === null || user === undefined || user === '') {
					wx.reLaunch({
						url:'../../pages/login/login'
					})
				} else {
					uni.switchTab({
						url:'../../pages/mine/mine'
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.video-footer {
	    height: 100rpx;
	    line-height: 100rpx;
		margin-bottom: 10rpx;
	    width: 100%;
	    position: fixed;
	    bottom: 0;
	    left: 0;
		right: 0;
	    margin: 0 auto;
		display: flex;
	    z-index: 200;
		background: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.6));
		.footer-item {
			flex: 1;
			color: white;
			text-align: center;
			.text {
			    display: inline;
			    margin: 0 10px;
				font-size: 34rpx;
			}
			.add-button {
				width: 90rpx;
				height: 66rpx;
				line-height: 66rpx;
				font-size: 35rpx;
				background-color: #FFF;
				color: #000;
				margin: 17rpx auto 0;
				border-radius: 15rpx;
			}
		}

	}
</style>
