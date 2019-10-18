<template>
	<view>
		<scroll-view :class="{show: isEdit}" class="DrawerPage" scroll-y>
			<view class="header">
				<view class="header-mask"></view>
				<Text class="back-icon cuIcon-back" @click="handleBack"></Text>
				<image :src="backgroundImage" class="header-background"></image>
				<view class="cu-avatar round user-avatar" @click="handleEdit">
					<image :src="avatarUrl" style="width: 100%; height: 100%;" class="round"></image>
					<view class="cu-tag badge" :class="[gender.class]"></view>
				</view>
				<button class="cu-btn round nickname text-white" @click="handleEdit">
					{{nickname}}
				</button>
				<button class="cu-btn round attentionBtn text-white" :class="{'bg-gradual-green': isFollow}" v-if="!isMe" @click="handleFollow">
					<text class="margin-bottom-sm" :class="isFollow ? 'cuIcon-likefill' :'cuIcon-like'"></text>
					{{isFollow ? '已关注' : '关 注'}}
				</button>
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
			<contribute-list v-if="tabCur === 0" :userId="createrId" style="margin-bottom: 140rpx;"></contribute-list>
			<like-list v-else :userId="createrId" style="margin-bottom: 140rpx;"></like-list>
		</scroll-view>
		<view :class="{show: isAvatarEdit}" class="DrawerClose" @click="handleEdit">
			<text class="cuIcon-pullright"></text>
		</view>
		<drawer-left :isAvatarEdit="isAvatarEdit" :userData="userData" :isMe="false" @handleEdit="handleEdit"></drawer-left>
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
				// 用户默认属性
				avatarUrl: '/static/images/avatar.jpg',
				backgroundImage: '',
				nickname: '',
				userData: {},
				gender: {
					type: '保密',
					class: 'cuIcon-github'
				},
				tabCur: 0,
				tabList: ['投稿', '喜欢'],
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
				createrId: '',
				isAvatarEdit: false,
				isMe: false,
				isFollow: false,
				isLoading: false
			}
		},
		onLoad(params) {
			let baseUrl = getApp().globalData.baseUrl
			let fileUrl = getApp().globalData.fileUrl
			// 获取当前视频作者ID
			this.createrId = params.userId
			let user = getApp().globalData.getGlobalUserInfo()
			if (user.id === params.userId) {
				this.isMe = true
			}
			uni.request({
				url: baseUrl + '/user/query?userId=' + params.userId + '&fanId=' + user.id,
				method: "POST",
				header: {
					'content-type': 'application/json',
					'userId': user.id,
					'userToken': user.userToken
				},
				success: (res) => {
					if (res.data.status === 200) {
						let data = res.data.data
						this.userData = data
						if (data.avatar != null && data.avatar != '' && data.avatar != undefined) {
							this.avatarUrl = fileUrl + data.avatar
						}
						if (data.backgroundImage != null && data.backgroundImage != '' && data.backgroundImage != undefined) {
							this.backgroundImage = fileUrl + data.backgroundImage
						}
						this.nickname = data.nickname
						this.userInfo[0].value = data.fansCounts
						this.userInfo[1].value = data.followCounts
						this.userInfo[2].value = data.receiveLikeCounts
						if (!this.isMe) {
							this.isFollow = data.follow;
						}
						if (data.gender === 1) {
							this.tempSex = true
							this.gender = {
								type: '男',
								class: 'cuIcon-male bg-blue'
							}
						} else if (data.gender === 2) {
							this.tempSex = false
							this.gender = {
								type: '女',
								class: 'cuIcon-female bg-pink'
							}
						}
					}
				}
			})
		},
		onShow() {
			this.isAvatarEdit = false
		},
		methods: {
			tabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			toFriendList() {
				uni.navigateTo({
					url: '../friend/friend?userId=' + this.createrId
				})
			},
			// dialog 开关
			handleEdit() {
				this.isAvatarEdit = !this.isAvatarEdit
			},
			handleBack() {
				uni.navigateBack()
			},
			handleFollow() {
				if (this.isLoading) {
					return
				}
				let user = getApp().globalData.getGlobalUserInfo()
				let url = this.baseUrl + '/user/follow?userId=' + this.createrId + '&fanId=' + user.id
				if (this.isFollow) {
					url = this.baseUrl + '/user/unFollow?userId=' + this.createrId + '&fanId=' + user.id
				}
				this.isLoading = true
				uni.request({
					url: url,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'userId': user.id,
						'userToken': user.userToken
					},
					success: (res) => {
						this.isLoading = false
						if (res.data.status === 200) {
							this.isFollow = !this.isFollow
							if (this.isFollow) {
								uni.showToast({
									title: '关注成功',
									icon: 'none',
									duration: 1200
								})
								this.userInfo[0].value++
							} else {
								uni.showToast({
									title: '取消关注',
									icon: 'none',
									duration: 1200
								})
								this.userInfo[0].value--
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/styles/drawer.css";
	@import '../../static/styles/gradientColor.css';
	@import '../../static/styles/mine.scss';

	.back-icon {
		position: absolute;
		top: 70rpx;
		left: 40rpx;
		font-size: 50rpx;
		color: #F0F0F0;
		z-index: 200;
	}

	.attentionBtn {
		position: absolute;
		top: 32%;
		left: 65%;
		height: auto;
		writing-mode: vertical-lr;
		background-color: rgba(0, 0, 0, 0.2)!important;
		border: 1px solid rgba(0, 0, 0, 0.1);
		z-index: 200;
		padding: 20rpx 10rpx;
	}
</style>
