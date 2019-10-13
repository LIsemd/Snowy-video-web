<template>
	<view class="cu-list menu-avatar">
		<block v-for="item in followList" :key="item.id">
			<view class="cu-item" @click="toPersonPage(item.id)">
				<view class="cu-avatar round lg">
					<image :src="item.avatar ? baseUrl + item.avatar : avatarUrl" mode="" class="avatar"></image>
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
					<view class="cu-btn follow sm action-btn">
						已关注
					</view>
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
				followList: [],
				isEmpty: false,
				avatarUrl: '/static/images/avatar.jpg',
			}
		},
		props: ['userId'],
		mounted() {
			let user = getApp().globalData.getGlobalUserInfo()
			uni.request({
				url: this.baseUrl + '/user/queryFollows?userId=' + this.userId,
				method: 'POST',
				header: {
					'content-type': 'application/json',
					'userId': user.id,
					'userToken': user.userToken
				},
				success: (res) => {
					if (res.data.status === 200) {
						this.followList = res.data.data
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
