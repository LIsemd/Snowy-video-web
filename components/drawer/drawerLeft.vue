<template>
	<view>
		<scroll-view :class="{show: isAvatarEdit}" class="DrawerWindow drawer-window jonquil" scroll-y>
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg">
				<view class="cu-item arrow item-background" @click="changeAvatar">
					<view class="content">
						<text class="cuIcon-github text-grey"></text>
						<text class="text-grey">头像</text>
					</view>
					<view class="cu-avatar lg round action">
						<image :src="avatarUrl" style="width: 100%; height: 100%;" class="round"></image>
					</view>
				</view>
				<view class="cu-item arrow item-background margin-top-sm" @click="changeBackgroundImage">
					<view class="content">
						<text class="cuIcon-clothes text-grey"></text>
						<text class="text-grey">背景</text>
					</view>
					<view class="cu-avatar lg round action" style="background: #E1D7F0;">
						<image :src="backgroundImage" style="width: 100%; height: 100%;" class="round"></image>
					</view>
				</view>
				<view class="cu-item arrow item-background margin-top-sm" @click="openChangeNickName">
					<view class="content">
						<text class="cuIcon-expressman text-grey"></text>
						<text class="text-grey">昵称</text>
					</view>
					<view class="action text-grey">
						{{nickname}}
					</view>
				</view>
				<view class="cu-item arrow item-background margin-top-sm">
					<view class="content">
						<text class="cuIcon-ticket text-grey"></text>
						<text class="text-grey">UID</text>
					</view>
					<view class="action text-grey">
						{{uid}}
					</view>
				</view>
				<view class="cu-item arrow item-background margin-top-sm" @click="openChangeGender">
					<view class="content">
						<text class="text-white round" :class="[gender.class]"></text>
						<text class="text-grey">性别</text>
					</view>
					<view class="action text-grey">
						{{gender.type}}
					</view>
				</view>
				<view class="cu-item arrow item-background margin-top-sm" @click="openChangeSignature">
					<view class="content">
						<text class="cuIcon-post text-grey"></text>
						<text class="text-grey">个性签名</text>
					</view>
					<view class="action text-grey">
						{{signature}}
					</view>
				</view>
				<view class="cu-item arrow item-background margin-top-sm">
					<view class="content">
						<text class="cuIcon-paint text-grey"></text>
						<text class="text-grey">主题</text>
					</view>
					<view class="action">
						<view class="cu-tag light jonquil text-grey padding-left-sm padding-right-sm">
							水仙
						</view>
					</view>
				</view>
				<view class="logout-btn" @click="openLogoutCheck" v-if="isMe">退出登录</view>
			</view>
		</scroll-view>
		<cu-dialog :isShow="isLogoutCheck">
			<block slot="content">乃确定不是手滑了么？</block>
			<block slot="button">
				<button class="cu-btn bg-white text-pink no-border" @click="closeDialog">我手滑了</button>
				<button class="cu-btn bg-white text-pink margin-left no-border" @click="handleLogout">注销</button>
			</block>
		</cu-dialog>
		<cu-dialog :isShow="isChangeNickName">
			<block slot="content">
				<view class="title margin-bottom-xl">修改昵称</view>
				<input name="input" class="change-Input" v-model="tempNickName" placeholder="不超过10个字" />
			</block>
			<block slot="button">
				<button class="cu-btn bg-white text-pink no-border" @click="closeChangeNickName">取消</button>
				<button class="cu-btn bg-white text-pink margin-left no-border" @click="changeNickName">修改</button>
			</block>
		</cu-dialog>
		<cu-dialog :isShow="isChangeGender">
			<block slot="content">
				<view class="title margin-bottom-xl">修改性别</view>
				<switch class="switch-sex" :checked="tempSex" @change="changeSex"></switch>
			</block>
			<block slot="button">
				<button class="cu-btn bg-white text-pink no-border" @click="closeChangeGender">取消</button>
				<button class="cu-btn bg-white text-pink margin-left no-border" @click="changeGender">修改</button>
			</block>
		</cu-dialog>
		<cu-dialog :isShow="isChangeSignature">
			<block slot="content">
				<view class="title margin-bottom-xl">修改签名</view>
				<input name="input" class="change-Input" v-model="tempSignature" placeholder="不超过15个字" />
			</block>
			<block slot="button">
				<button class="cu-btn bg-white text-pink no-border" @click="closeChangeSignature">取消</button>
				<button class="cu-btn bg-white text-pink margin-left no-border" @click="changeSignature">修改</button>
			</block>
		</cu-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 服务器地址
				baseUrl: getApp().globalData.baseUrl,
				tempNickName: '',
				tempSignature: '',
				tempSex: true,
				// 状态控制
				isLogoutCheck: false,
				isChangeNickName: false,
				isChangeSignature: false,
				isChangeGender: false,
				// 用户默认属性
				avatarUrl: '/static/images/avatar.jpg',
				backgroundImage: '',
				uid: '',
				nickname: '',
				signature: '',
				gender: {
					type: '保密',
					class: 'cuIcon-github bg-green'
				},
			}
		},
		props: ['isAvatarEdit', 'userData', 'isMe'],
		mounted() {
			// 设置延迟，防止未获取数据时就开始渲染
			setTimeout(() => {
				if (this.userData) {
					this.getUserMsg()
				}
			}, 600)
		},
		methods: {
			// 获取用户信息
			getUserMsg() {
				if (this.userData.avatar) {
					this.avatarUrl = this.baseUrl + this.userData.avatar
				}
				this.backgroundImage = this.baseUrl + this.userData.backgroundImage
				this.uid = this.userData.id.toString().slice(0, 8)
				this.nickname = this.userData.nickname
				this.signature = this.userData.signature
				if (this.userData.gender === 1) {
					this.tempSex = true
					this.gender = {
						type: '男',
						class: 'cuIcon-male bg-blue'
					}
				} else if (this.userData.gender === 2) {
					this.tempSex = false
					this.gender = {
						type: '女',
						class: 'cuIcon-female bg-pink'
					}
				}
			},
			// 切换性别
			changeSex() {
				this.tempSex = !this.tempSex
			},
			// dialog 开关
			openLogoutCheck() {
				this.$emit('handleEdit')
				this.isLogoutCheck = true
			},
			closeDialog() {
				this.isLogoutCheck = false
			},
			openChangeNickName() {
				if (!this.isMe) {
					return
				}
				this.isChangeNickName = true
			},
			closeChangeNickName() {
				this.tempNickName = ''
				this.isChangeNickName = false
			},
			openChangeSignature() {
				if (!this.isMe) {
					return
				}
				this.isChangeSignature = true
			},
			closeChangeSignature() {
				this.tempSignature = ''
				this.isChangeSignature = false
			},
			openChangeGender() {
				if (!this.isMe) {
					return
				}
				this.isChangeGender = true
			},
			closeChangeGender() {
				this.isChangeGender = false
			},
			// 注销
			handleLogout() {
				let user = getApp().globalData.getGlobalUserInfo()
				uni.request({
					url: this.baseUrl + '/logout?userId=' + user.id,
					method: "POST",
					success: (res) => {
						if (res.data.status === 200) {
							// 注销以后清空缓存
							uni.removeStorageSync("userInfo")
							uni.showToast({
								title: '注销成功!',
								icon: 'success',
								duration: 2000
							})
							uni.redirectTo({
								url: '../login/login'
							})
						}
					}
				})
			},
			// 上传图片
			uploadImage(loadingText, api, obj, successText, errorText) {
				if (!this.isMe) {
					return
				}
				uni.showLoading({
					title: loadingText
				})
				let user = getApp().globalData.getGlobalUserInfo()
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						let tempFilePaths = res.tempFilePaths;
						// 返回 String 类型
						uni.uploadFile({
							url: this.baseUrl + api + user.id,
							filePath: tempFilePaths[0],
							name: 'file',
							header: {
								'content-type': 'application/json',
								'userId': user.id,
								'userToken': user.userToken
							},
							success: (res) => {
								uni.hideLoading()
								let data = JSON.parse(res.data)
								if (data.status === 200) {
									uni.showToast({
										title: successText,
										icon: 'success',
										duration: 1000
									})

									let imageUrl = data.data
									if (obj === 'avatar') {
										this.avatarUrl = this.baseUrl + imageUrl
										this.$emit('changeAvatar', this.avatarUrl)
									} else if (obj === 'backgroundImage') {
										this.backgroundImage = this.baseUrl + imageUrl
										this.$emit('changeBackgroundImage', this.backgroundImage)
									}

								} else if (data.status === 500) {
									uni.showToast({
										title: errorText,
										icon: 'none',
										duration: 1000
									})
								}
							},
							fail: (err) => {
								uni.hideLoading()
							}
						})
					},
					fail: (err) => {
						uni.hideLoading()
					}
				})
			},
			changeAvatar() {
				this.uploadImage('头像上传中...', '/user/uploadAvatar?userId=', 'avatar', '头像修改成功!', '头像修改失败')
			},
			changeBackgroundImage() {
				this.uploadImage('背景上传中...', '/user/uploadBackgroundImage?userId=', 'backgroundImage', '背景修改成功!', '背景修改失败')
			},
			// 修改用户信息
			changeUserInfo(tempInfo, api, successText, errorText, successFunc) {
				let user = getApp().globalData.getGlobalUserInfo()
				uni.request({
					url: this.baseUrl + api + user.id,
					method: "POST",
					data: tempInfo,
					header: {
						'content-type': 'application/json',
						'userId': user.id,
						'userToken': user.userToken
					},
					success: (res) => {
						if (res.data.status === 200) {
							uni.showToast({
								title: successText,
								icon: 'none',
								duration: 1500
							})
							successFunc()
						} else {
							uni.showToast({
								title: errorText,
								icon: 'none',
								duration: 1500
							})
						}
					}
				})
			},
			changeNickName() {
				if (this.tempNickName.length === 0 || this.tempNickName.length > 10) {
					uni.showToast({
						title: '昵称修改不符合要求',
						icon: 'none',
						duration: 1500
					})
					return
				}
				this.changeUserInfo(this.tempNickName, '/user/updateNickName?userId=', '昵称修改成功!', '昵称修改失败', () => {
					this.nickname = this.tempNickName
					this.$emit('changeNickName', this.nickname)
					this.tempNickName = ''
					this.closeChangeNickName()
				})
			},
			changeSignature() {
				if (this.tempSignature.length === 0 || this.tempSignature.length > 15) {
					uni.showToast({
						title: '签名修改不符合要求',
						icon: 'none',
						duration: 1500
					})
					return
				}
				this.changeUserInfo(this.tempSignature, '/user/updateSignature?userId=', '签名修改成功!', '签名修改失败', () => {
					this.signature = this.tempSignature
					this.tempSignature = ''
					this.closeChangeSignature()
				})
			},
			changeGender() {
				let tempGender = this.tempSex ? 1 : 2
				this.changeUserInfo(tempGender, '/user/updateGender?userId=', '性别修改成功!', '性别修改失败', () => {
					if (tempGender === 1) {
						this.gender = {
							type: '男',
							class: 'cuIcon-male bg-blue'
						}
					} else if (tempGender === 2) {
						this.gender = {
							type: '女',
							class: 'cuIcon-female bg-pink'
						}
					}
					this.$emit('changeGender', this.gender)
					this.closeChangeGender()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.drawer-window {
		.logout-btn {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 100rpx;
			margin: 0 auto;
			width: 90%;
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 40rpx;
			background: linear-gradient(180deg, #f43f3b 0, #ec008c 100%);
			text-align: center;
			font-size: 40rpx;
			color: #FFFFFF;
		}

		.item-background {
			background-color: rgba(255, 255, 255, .6) !important;
		}
	}

	.change-Input {
		border-bottom: 1px solid #F9D7EA;
		text-align: left;
		padding-left: 10rpx;
		margin-bottom: 0;
	}
</style>
