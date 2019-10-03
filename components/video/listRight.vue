<template>
	<view class="list-right">
		<view class="author-img">
			<img class="img" src="../../static/images/avatar.jpg" />
			<view class="follow cuIcon-add" v-show="showFollow" @click="hideFollow"></view>
		</view>
		<view class="right-box">
			<view class="icon cuIcon-likefill" :class="{fav: isFav}" @click="changeColor"></view>
			<view class="count">72.2w</view>
		</view>
		<view class="right-box">
			<view class="icon cuIcon-commentfill"></view>
			<view class="count">1.8w</view>
		</view>
		<view class="right-box">
			<view class="icon cuIcon-forwardfill"></view>
			<view class="count">6645</view>
		</view>
		<view class="music-img" :class="{'pauseAnimate': isPauseAnimate}">
			<img class="img" src="../../static/images/avatar2.jpg" />
		</view>
	</view>
</template>

<script>
	export default {
	        data() {
	            return {
	                showFollow: true,
	                isFav: false,
					isPauseAnimate: true
	            }
	        },
	        methods: {
	            hideFollow() {
	                this.showFollow = false;
	            },
	            changeColor() {
	                this.isFav = !this.isFav;
	            },
				pauseAnimate() {
					this.isPauseAnimate = true
				},
				playAnimate() {
					this.isPauseAnimate = false
				}
	        }
	    }
</script>

<style lang="scss" scoped>
	.list-right {
		width: 120rpx;
		margin-right: 20rpx;
		.author-img {
			position: relative;
			width: 120rpx;
			text-align: center;
			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				border: 2px solid #FFFFFF;
			}
			.follow {
			        color: white;
			        position: absolute;
			        width: 30rpx;
			        height: 30rpx;
			        line-height: 30rpx;
			        background: red;
			        border-radius: 50%;
			        text-align: center;
			        left: 23rpx;
			        bottom: -5rpx;
			        font-weight: bold;
			}
		}
		.right-box {
			margin: 60rpx auto;
			color: white;
			text-align: center;
			font-size: 30rpx;
			.fav {
			    color:#F43F3B;
			}
			.icon {
				font-size: 70rpx;
				transition: color .5s;
			}
		}
		.music-img {
			width: 120rpx;
			height: 120rpx;
			text-align: center;
			margin-top: 40rpx;
			animation: around 2.5s linear .2s infinite;
			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				border: 2px solid #FFFFFF;
			}
		}
		.pauseAnimate {
			animation-play-state: paused; 
		}
	}
	@keyframes around {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
