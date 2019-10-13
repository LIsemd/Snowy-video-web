<template>
	<view class="video-header">
		<view class="icon cuIcon-search" @click="handleSearch" v-if="!single"></view>
		<view class="icon cuIcon-back" @click="handleBack" v-else></view>
		<view class="middle">
			<view class="text">推荐</view>
			<text style="font-size: 34rpx;">|</text>
			<view class="text">同城</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			single: {
				type: Boolean,
				default: false
			},
			isMine: Boolean,
			isDynamic: Boolean,
			videoItem: Object
		},
		methods: {
			handleSearch() {
				getApp().globalData.isSearch = true
				uni.navigateTo({
					url: '../../pages/search/search'
				})
			},
			handleBack() {
				if (this.isMine) {
					uni.switchTab({
						url: '../../pages/mine/mine'
					})
				} else if(this.isDynamic) {
					uni.switchTab({
						url: '../../pages/dynamic/dynamic'
					})
				} else {
					uni.redirectTo({
						url: '../../pages/person/person?userId=' + this.videoItem.userId
					})
				}
				
			}
		}
	}
</script>

<style scoped>
	.video-header {
		height: 50rpx;
		line-height: 50rpx;
		width: 100%;
		position: fixed;
		top: 85rpx;
		left: 0;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0);
		z-index: 200;
	}

	.icon {
		position: absolute;
		left: 0;
		top: 0;
		color: white;
		width: 20%;
		text-align: center;
		font-size: 45rpx;
	}

	.middle {
		text-align: center;
		color: white;
	}

	.text {
		display: inline;
		margin: 0 10px;
		font-size: 34rpx;
	}
</style>
