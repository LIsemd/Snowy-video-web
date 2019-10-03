<template>
	    <view class="video-header">
	        <view class="icon cuIcon-search" @click="handleSearch"></view> 
	        <view class="middle">
	            <view class="text">推荐</view>|
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
		methods: {
			handleSearch() {
				uni.navigateTo({
					url:'../../pages/search/search'
				})
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
	    top: 70rpx;
	    left: 0;
	    margin: 0 auto;
	    background: rgba(0,0,0,0);
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
