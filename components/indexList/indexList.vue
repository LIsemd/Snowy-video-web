<template>
	<view class="video-container">
		<block v-for="(item,index) in videoList" :key="item.id">
			<view class="cu-card case" @click="toVideoPage(index)">
				<view class="cu-item shadow">
					<view class="image" style="height: 450rpx; width: 100%;">
						<image :src="baseUrl + item.coverPath" mode="aspectFill" style="height: 100%; width: 100%;"></image>
						<!-- <view class="cu-tag bg-blue">史诗</view> -->
						<view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{item.videoDesc}}</text></view>
					</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<!-- 背景样式动态绑定  :style="{'background': 'url(' + item.avatar + ')'}"  -->
							<view class="cu-avatar round lg">
								<image :src="baseUrl + item.avatar" mode="widthFix" style="height: 100%; width: 100%; border-radius: 50%;"></image>
							</view>
							<view class="content flex-sub">
								<view class="text-grey">{{item.nickname}}</view>
								<view class="text-gray text-sm flex justify-between">
									{{item.createTime.slice(5,10)}}
									<view class="text-gray text-sm">
										<!-- <text class="cuIcon-attentionfill margin-lr-xs"></text> 10 -->
										<text class="cuIcon-likefill text-red margin-lr-xs"></text> {{item.likeCounts}}
										<!-- <text class="cuIcon-messagefill margin-lr-xs"></text> 30 -->
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<view class="cu-load" :class="!isNoMore?'loading':'over'" style="background: rgba(0,0,0,0);"></view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl
			}
		},
		props:{
			videoList: Array,
			isNoMore: Boolean
		},
		methods:{
			toVideoPage(index) {
				uni.navigateTo({
					url:'../../pages/video/video?current=' + index
				})
			}
		}
	}
</script>

<style>
	.video-container {
		margin-bottom: 110rpx;
	}
</style>
