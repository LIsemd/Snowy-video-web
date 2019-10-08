<template>
	<view>
		<scroll-view :class="{show: isEdit}" class="DrawerPage" scroll-y>
			<view class="header">
				<view class="header-mask"></view>
				<cover-view class="back-icon cuIcon-back" @click="handleBack"></cover-view>
				<image :src="backgroundImage" class="header-background"></image>
				<view class="cu-avatar round user-avatar" @click="handleEdit">
					<image :src="avatarUrl" style="width: 100%; height: 100%;" class="round"></image>
					<view class="cu-tag badge" :class="[gender.class]"></view>
				</view>
				<button class="cu-btn round attentionBtn text-white" :class="{'bg-gradual-green': isFollow}"
				 :disabled="isMe" @click="handleFollow">
					<text class="margin-right-sm" :class="isFollow ? 'cuIcon-likefill' :'cuIcon-like'"></text>
					{{isFollow ? '已关注' : '关 注'}}
				</button>
				<view class="user-info">
					<block v-for="item in userInfo" :key="index">
						<view class="cu-capsule radius">
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
					<view class="cu-item flex-sub" v-for="(item,index) in tabList" :class="index==tabCur?'text-pink current':''" :key="index" @click="tabSelect" :data-id="index">
						{{item}}
					</view>
				</view>
			</scroll-view>
			<contribute-list v-if="tabCur === 0" :userId="createrId" style="margin-bottom: 140rpx;" ></contribute-list>
			<like-list v-else :userId="createrId" style="margin-bottom: 140rpx;" ></like-list>
		</scroll-view>
		<view :class="{show: isAvatarEdit}" class="DrawerClose" @click="handleEdit">
			<text class="cuIcon-pullright"></text>
		</view>
		<scroll-view :class="{show: isAvatarEdit}" class="DrawerWindow drawer-window jonquil" scroll-y>
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg">
				<view class="cu-item arrow item-background">
					<view class="content">
						<text class="cuIcon-github text-grey"></text>
						<text class="text-grey">头像</text>
					</view>
					<view class="cu-avatar lg round action">
						<image :src="avatarUrl" style="width: 100%; height: 100%;" class="round"></image>
					</view>
				</view>
				<view class="cu-item arrow item-background margin-top-sm">
					<view class="content">
						<text class="cuIcon-clothes text-grey"></text>
						<text class="text-grey">背景</text>
					</view>
					<view class="cu-avatar lg round action" style="background: #E1D7F0;">
						<image :src="backgroundImage" style="width: 100%; height: 100%;" class="round"></image>
					</view>
				</view>
				<view class="cu-item arrow item-background margin-top-sm">
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
				<view class="cu-item arrow item-background margin-top-sm">
					<view class="content">
						<text class="text-white round" :class="[gender.class]"></text>
						<text class="text-grey">性别</text>
					</view>
					<view class="action text-grey">
						{{gender.type}}
					</view>
				</view>
				<view class="cu-item arrow item-background margin-top-sm">
					<view class="content">
						<text class="cuIcon-post text-grey"></text>
						<text class="text-grey">个性签名</text>
					</view>
					<view class="action text-grey">
						{{signature}}
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import contributeList from '../../components/videoList/contributeList.vue'
	import likeList from '../../components/videoList/likeList.vue'
	export default {
		components:{
			contributeList,
			likeList
		},
		data() {
			return {
				// 服务器地址
				baseUrl: getApp().globalData.baseUrl,
				// 用户默认属性
				avatarUrl: '/static/images/avatar.jpg',
				backgroundImage: '',
				uid: '',
				nickname: '',
				signature: '',
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
				isFollow: false
			}
		},
		onLoad(params) {
			let baseUrl = getApp().globalData.baseUrl
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
						if (data.avatar != null && data.avatar != '' && data.avatar != undefined) {
							this.avatarUrl = baseUrl + data.avatar
						}
						if (data.backgroundImage != null && data.backgroundImage != '' && data.backgroundImage != undefined) {
							this.backgroundImage = baseUrl + data.backgroundImage
						}
						this.nickname = data.nickname
						this.signature = data.signature
						this.userInfo[0].value = data.fansCounts
						this.userInfo[1].value = data.followCounts
						this.userInfo[2].value = data.receiveLikeCounts
						if (!this.isMe) {
							this.isFollow = data.follow;
						}
						this.uid = data.id.toString().slice(0, 8)
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
			// dialog 开关
			changeSex() {
				this.tempSex = !this.tempSex
			},
			handleEdit() {
				this.isAvatarEdit = !this.isAvatarEdit
			},
			handleBack() {
				uni.navigateBack()
			},
			handleFollow() {
				let user = getApp().globalData.getGlobalUserInfo()
				let url = this.baseUrl + '/user/follow?userId=' + this.createrId + '&fanId=' + user.id
				if (this.isFollow) {
					url = this.baseUrl + '/user/unFollow?userId=' + this.createrId + '&fanId=' + user.id
				}
				uni.request({
					url: url,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'userId': user.id,
						'userToken': user.userToken
					},
					success: (res) => {
						if (res.data.status === 200) {
							this.isFollow = !this.isFollow
							if(this.isFollow) {
								uni.showToast({
									title:'关注成功',
									icon:'none',
									duration:1200
								})
								this.userInfo[0].value ++
							} else {
								uni.showToast({
									title:'取消关注',
									icon:'none',
									duration:1200
								})
								this.userInfo[0].value --
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

	.header {
		position: relative;
		width: 100%;
		height: 450rpx;
		text-align: center;
		background: #E1D7F0;

		.header-mask {
			width: 100%;
			height: 100%;
			position: absolute;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 70%, rgba(0, 0, 0, .8) 100%);
			z-index: 100;
		}

		.back-icon {
			position: absolute;
			top: 70rpx;
			left: 40rpx;
			font-size: 50rpx;
			color: #F0F0F0;
			z-index: 200;
		}

		.header-background {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			height: 100%;
			width: 100%;
		}

		.user-avatar {
			margin-top: 140rpx;
			width: 160rpx;
			height: 160rpx;
			z-index: 200;
		}

		.attentionBtn {
			position: absolute;
			top: 70%;
			left: 50%;
			transform: translateX(-50%);
			height: 50rpx;
			width: auto;
			background-color: rgba(0, 0, 0, 0.2);
			border: 1px solid rgba(0, 0, 0, 0.1);
			z-index: 200;
		}

		.user-info {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			margin: 20rpx auto;
			z-index: 200;

			.tag-title {
				background-color: rgba(255, 255, 255, 0.6);
				margin-left: 20rpx;
			}
		}
	}
	.current {
		border-bottom: 1px solid;
		transition: .5s ease-in;
	}
	.drawer-window {
		.item-background {
			background-color: rgba(255, 255, 255, .6) !important;
		}
	}
</style>
