<template>
	<view>
		<view class="item" @click="openVideoPage">
			<view class="item-left">
				<slot name="image"></slot>
				<view class="item-seconds">
					<slot name="seconds"></slot>
				</view>
			</view>
			<view class="item-right">
				<view class="item-right-title">
					<slot name="title"></slot>
				</view>
				<view class="item-right-content">
					<view class="item-right-create">
						<slot name="create"></slot>
					</view>
					<view class="item-right-like">
						<text class="cuIcon-likefill text-pink margin-right-xs"></text>
						<slot name="like"></slot>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:['video'],
		methods:{
			openVideoPage() {
				let page = getCurrentPages();
				let currentPage = page[0].__route__
				let isMine = false
				let isDynamic = false
				if (currentPage === "pages/mine/mine") {
					isMine = true
				} else if (currentPage === "pages/dynamic/dynamic") {
					isDynamic = true
				}
				uni.redirectTo({
					url:'../../pages/video/videoSingle?videoItem=' + JSON.stringify(this.video) + '&isMine=' + isMine + '&isDynamic=' + isDynamic
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.item {
		width: 100%;
		height: auto;
		background-color: #FFF;
		padding: 18rpx;
		display: flex;
		border-bottom: 1px solid rgba(0,0,0,.1);	
		
		.item-left {
			width: 240rpx;
			height: 176rpx;
			position: relative;
			margin-right: 18rpx;
			border: 1px solid #F1F1F1;
			border-radius: 10rpx;
			.item-seconds {
				position: absolute;
				right: 10rpx;
				bottom: 10rpx;
				width: 70rpx;
				height: 30rpx;
				border-radius: 5rpx;
				color: #FFF;
				font-size: 22rpx;
				line-height: 30rpx;
				text-align: center;
				background: rgba(0,0,0,.4);
			}
		}

		.item-right {
			flex: 1;
		}

		.item-right-title {
			padding-top: 10rpx;
			font-size: 32rpx;
			height: 140rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: wrap;
		}

		.item-right-content {
			font-size: 26rpx;
			color: #888;
			display: flex;
			.item-right-create {
				float: left;
				flex: 1;
			}
			.item-right-like {
				width: 100rpx;
				float: right;
			}
		}
	}
</style>
