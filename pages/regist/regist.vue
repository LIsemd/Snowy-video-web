<template>
	<view class="page">
		<image src="../../static/images/background.jpeg" class="background-image"></image>
		<view class="regist-contaner">
			<view class="logo">
				<image src="../../static/images/logo.png" class="logo-image"></image>
			</view>
			<view class="content">
				<view class="box-wrap">
					<text class="cuIcon-my icon text-grey"></text>
					<input type="text" placeholder-class="text-grey" placeholder="Username" class="username" v-model="username" />
				</view>
				<view class="box-wrap">
					<text class="cuIcon-lock icon text-grey"></text>
					<input type="password" placeholder-class="text-grey" placeholder="Password" class="password" v-model="password" />
				</view>
				<button class="box-wrap cu-btn bg-gradual-red" @click="handleRegist">
					<text class="regist">注 册</text>
				</button>
				<view class="text-right margin-right-xl margin-top-xl text-sm text-gray">
					已有账号 ？
					<navigator url="../login/login" style="display: inline-block;" open-type="redirect">
						<view class="text-blue">立即登录 ></view>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		onLoad() {

		},
		methods: {
			handleRegist() {
				// 简单验证
				if (this.username.length === 0) {
					uni.showToast({
						title: '用户名不能为空',
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (this.password.length === 0) {
					uni.showToast({
						title: '密码不能为空',
						icon: 'none',
						duration: 2000
					})
					return
				}
				uni.showLoading({
					title: '请稍等...'
				})
				uni.request({
					url: getApp().globalData.baseUrl + '/regist',
					method: "POST",
					data: {
						username: this.username,
						password: this.password
					},
					success: (res) => {
						let status = res.data.status
						if (status === 200) {
							uni.showToast({
								title: " 用户注册成功! 页面跳转中... ",
								icon: 'none',
								duration: 2000
							})
							getApp().globalData.setGlobalUserInfo(res.data.data)
							uni.switchTab({
								url: '../index/index'
							})
						} else if (status === 500) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.page {
		width: 100%;
		height: 100%;
		background-color: #70c7da;
		position: relative;
	}

	.background-image {
		position: absolute;
		left: 0px;
		top: 0px;
		height: 100vh;
		width: 100%;
		opacity: .8;
	}

	.regist-contaner {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0px;
		top: 0px;

		.logo {
			position: absolute;
			top: 15vh;
			left: 0;
			right: 0;
			margin: 0 auto;
			width: 140rpx;
			height: 140rpx;

			.logo-image {
				width: 100%;
				height: 100%;
			}
		}

		.content {
			position: absolute;
			top: 62vh;
			left: 0;
			width: 100%;
			height: 38vh;
		}

		.box-wrap {
			width: 80vw;
			height: 100rpx;
			line-height: 100rpx;
			margin: 30rpx auto;
			border-radius: 40rpx;
			display: flex;
			flex-direction: row;
			background-color: rgba(255, 255, 255, .5);

			.icon {
				margin: 0 40rpx;
				font-size: 40rpx;
				opacity: .8;
			}

			.username,
			.password {
				height: 100rpx;
				line-height: 100rpx;
				font-size: 35rpx;
				flex: 1;
				padding-right: 60rpx;
			}
		}

		.regist {
			width: 100%;
			height: 100%;
			line-height: 100rpx;
			font-size: 40rpx;
			font-weight: 500;
			display: inline-block;
			text-align: center;
		}
	}
</style>
