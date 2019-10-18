<template>
	<view class="cu-list menu-avatar">
		<block v-for="item in fanList" :key="item.id">
			<view class="cu-item" @click="toPersonPage(item.id)">
				<view class="cu-avatar round lg">
					<image :src="item.avatar ? fileUrl + item.avatar : avatarUrl" mode="" class="avatar"></image>
				</view>
				<view class="content">
					<view class="text-grey">{{item.nickname}}</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">
							{{item.signature}}
						</view>
					</view>
				</view>
				<view class="action">
					<text class="cuIcon-friend icon"></text>
				</view>
			</view>
		</block>
		<view v-else class="container" v-if="isEmpty">
			<image src="../../static/images/avatar2.jpg" class="image" mode=""></image>
			<view class="content">
				这里什么也没有(๑°ㅁ°๑)ᵎᵎᵎ
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				fileUrl: getApp().globalData.fileUrl,
				fanList: [],
				isEmpty: false,
				avatarUrl: '/static/images/avatar.jpg',
				myUserId: ''
			}
		},
		props: ['userId'],
		mounted() {
			let user = getApp().globalData.getGlobalUserInfo()
			this.myUserId = user.id
			uni.request({
				url: this.baseUrl + '/user/queryFans?userId=' + this.userId,
				method: 'POST',
				header: {
					'content-type': 'application/json',
					'userId': user.id,
					'userToken': user.userToken
				},
				success: (res) => {
					if (res.data.status === 200) {
						this.fanList = res.data.data
						if (res.data.data.length === 0) {
							this.isEmpty = true
						}
					}
				}
			})
		},
		methods:{
			toPersonPage(userId) {
				uni.navigateTo({
					url: '../../pages/person/person?userId=' + userId
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.action-btn {
		border-radius: 10rpx;
		width: 122rpx;
		height: 54rpx;
		margin-left: -25rpx;
		font-size: 22rpx;
	}
	.follow {
		color: #808080;
		background: #ddd;
	}
	.icon {
		font-size: 35rpx;
	}
	.avatar {
		height: 100%;
		width: 100%;
		border-radius: 50%;
	}

	.container {
		height: auto;
		width: 94%;
		text-align: center;
		display: flex;
		flex-direction: row;
		margin: 100rpx auto 0;
		padding: 100rpx 0;
		box-shadow: 2px 2px 5px #e0e0e0;
		background-color: #FFF;

		.image {
			width: 300rpx;
			height: 300rpx;
		}

		.content {
			display: inline-block;
			height: 300rpx;
			padding-top: 150rpx;
			font-size: 33rpx;
			flex: 1;
		}
	}
</style>
