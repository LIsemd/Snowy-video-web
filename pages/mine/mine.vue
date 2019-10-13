<template>
	<view>
		<scroll-view :class="{show: isEdit}" class="DrawerPage" scroll-y>
			<view class="header">
				<view class="header-mask"></view>
				<image :src="backgroundImage" class="header-background"></image>
				<view class="cu-avatar round user-avatar" @click="handleEdit">
					<image :src="avatarUrl" style="width: 100%; height: 100%;" class="round"></image>
					<view class="cu-tag badge" :class="[gender.class]"></view>
				</view>
				<view class="cu-btn round nickname text-white" @click="handleEdit">
					{{nickname}}
				</view>
				<view class="user-info">
					<block v-for="item in userInfo" :key="index">
						<view class="cu-capsule radius" @click="toFriendList">
							<view class="cu-tag tag-title" :class="item.color">
								{{item.title}}
							</view>
							<view class="cu-tag line-white">{{item.value}}</view>
						</view>
					</block>
				</view>
			</view>
			<scroll-view scroll-x class="bg-white nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" v-for="(item,index) in tabList" :class="index==tabCur?'text-blue current':''" :key="index"
					 @click="tabSelect" :data-id="index">
						{{item}}
					</view>
				</view>
			</scroll-view>
			<contribute-list v-if="tabCur === 0" :userId="userId" style="margin-bottom: 140rpx;"></contribute-list>
			<like-list v-else :userId="userId" style="margin-bottom: 140rpx;"></like-list>
			<!-- 用来撑开被 tabbar 遮挡的地方 -->
			<view style="height: 120rpx;"></view>
		</scroll-view>
		<view :class="{show: isAvatarEdit}" class="DrawerClose" @click="handleEdit">
			<text class="cuIcon-pullright"></text>
		</view>
		<drawer-left :isAvatarEdit="isAvatarEdit" :userData="userData" :isMe="true"
				@handleEdit="handleEdit"
				@changeGender="changeGender"
				@changeNickName="changeNickName"
				@changeAvatar="changeAvatar"
				@changeBackgroundImage="changeBackgroundImage"></drawer-left>
	</view>
</template>

<script>
	import contributeList from '../../components/videoList/contributeList.vue'
	import likeList from '../../components/videoList/likeList.vue'
	import drawerLeft from '../../components/drawer/drawerLeft.vue'
	export default {
		components: {
			contributeList,
			likeList,
			drawerLeft
		},
		data() {
			return {
				// 服务器地址
				baseUrl: getApp().globalData.baseUrl,
				tabCur: 0,
				// 用户默认属性
				avatarUrl: '/static/images/avatar.jpg',
				backgroundImage: '',
				nickname: '',
				userData: {},
				userId: '',
				gender: {
					type: '保密',
					class: 'cuIcon-github bg-green'
				},
				userInfo: [{
						title: '粉丝',
						color: 'text-pink',
						value: 0
					},
					{
						title: '关注',
						color: 'text-yellow',
						value: 0
					},
					{
						title: '点赞',
						color: 'text-blue',
						value: 0
					}
				],
				tabList: ['投稿', '喜欢'],
				// 状态控制
				isAvatarEdit: false,
			}
		},
		onLoad() {
			let user = getApp().globalData.getGlobalUserInfo()
			this.userId = user.id
			this.isUserToken(user)
			this.getUserData(user)
		},
		onShow() {
			this.isAvatarEdit = false
			this.setTabBarIndex(4)
		},
		methods: {
			// 判断token是否过期
			isUserToken(user) {
				if (user.userToken === null) {
					let time = 3
					let interval = setInterval(() => {
						uni.showToast({
							title: "当前登录信息已过期\r\n" + time + "秒后将跳转到登录页面",
							icon: "none",
							duration: 1000
						})
						time--
					}, 1000)
				
					setTimeout(() => {
						clearInterval(interval)
						uni.reLaunch({
							url: '../login/login'
						})
					}, 3500)
					return
				}
			},
			// 获取用户信息
			getUserData(user) {
				uni.request({
					url: getApp().globalData.baseUrl + '/user/query?userId=' + user.id,
					method: "POST",
					header: {
						'content-type': 'application/json',
						'userId': user.id,
						'userToken': user.userToken
					},
					success: (res) => {
						if (res.data.status === 200) {
							let data = res.data.data
							data.userToken = user.userToken
							this.userData = data
							getApp().globalData.setGlobalUserInfo(data)
							if (data.avatar != null && data.avatar != '' && data.avatar != undefined) {
								this.avatarUrl = getApp().globalData.baseUrl + data.avatar
							}
							if (data.backgroundImage != null && data.backgroundImage != '' && data.backgroundImage != undefined) {
								this.backgroundImage = getApp().globalData.baseUrl + data.backgroundImage
							}
							this.nickname = data.nickname
							this.userInfo[0].value = data.fansCounts
							this.userInfo[1].value = data.followCounts
							this.userInfo[2].value = data.receiveLikeCounts
							if (data.gender === 1) {
								this.gender = {
									type: '男',
									class: 'cuIcon-male bg-blue'
								}
							} else if (data.gender === 2) {
								this.gender = {
									type: '女',
									class: 'cuIcon-female bg-pink'
								}
							}
						} else if (res.data.status === 502) {
							let time = 3
							let interval = setInterval(() => {
								uni.showToast({
									title: res.data.msg + "\r\n" + time + "秒后将跳转到登录页面",
									icon: "none",
									duration: 1000
								})
								time--
							}, 1000)
				
							setTimeout(() => {
								clearInterval(interval)
								uni.reLaunch({
									url: '../login/login'
								})
							}, 3500)
						}
					}
				})
			},
			// 切换 Tab
			tabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			// 跳转好友列表
			toFriendList() {
				uni.navigateTo({
					url: '../friend/friend?userId=' + this.userId
				})
			},
			// 切换 Drawer
			handleEdit() {
				this.isAvatarEdit = !this.isAvatarEdit
			},
			// 更改性别
			changeGender(gender) {
				this.gender = gender
			},
			// 更改头像
			changeAvatar(avatarUrl) {
				this.avatarUrl = avatarUrl
			},
			// 更改背景
			changeBackgroundImage(backgroundImage) {
				this.backgroundImage = backgroundImage
			},
			// 更改昵称
			changeNickName(nickname) {
				this.nickname = nickname
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/styles/drawer.css";
	@import '../../static/styles/gradientColor.css';
	@import '../../static/styles/mine.scss';
</style>
