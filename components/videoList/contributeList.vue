<template>
	<scroll-view>
		<block v-for="item in videoList" :key="item.id">
			<list-item :video="item">
				<block slot="image">
					<view class="image" :style="{'background-image':'url(' + fileUrl + item.coverPath + ')'}"></view>
				</block>
				<block slot="seconds">
					{{Math.floor(item.videoSeconds / 60)}}:{{Math.floor(item.videoSeconds % 60) < 10 ? '0' + Math.floor(item.videoSeconds % 60) : Math.floor(item.videoSeconds % 60)}}
				</block>
				<block slot="title">
					{{item.videoDesc ? item.videoDesc : '无标题'}}
				</block>
				<text slot="create">
					{{item.createTime.slice(0,10) + " " + item.createTime.slice(11,19)}}
				</text>
				<text slot="like">
					{{item.likeCounts}}
				</text>
			</list-item>
		</block>
		<view class="cu-load over" style="background: rgba(0,0,0,0);" v-if="!isEmpty"></view>
		<view v-else class="container">
			<image src="../../static/images/avatar2.jpg" class="image" mode=""></image>
			<view class="content">
				空空如也(๑°ㅁ°๑)ᵎᵎᵎ
				<view style="line-height: 100rpx; font-size: 30rpx;" class="text-blue" @click="toUploadPage" v-if="isMe">
					<text>快去上传属于自己的作品吧!</text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import listItem from './listItem.vue'
	export default {
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				fileUrl: getApp().globalData.fileUrl,
				userInfo: getApp().globalData.getGlobalUserInfo(),
				videoList: [],
				isEmpty: false,
				isMe: false
			}
		},
		props: ['userId'],
		mounted() {
			this.getVideoList()
			if (this.userId === this.userInfo.id) {
				this.isMe = true
			}
		},
		methods: {
			toUploadPage() {
				uni.navigateTo({
					url: '../../pages/upload/upload'
				})
			},
			getVideoList() {
				uni.request({
					url: this.baseUrl + '/video/showVideos?page=' + 1 + '&isSaveRecord=' + 0,
					method: 'POST',
					data: {
						'videoDesc': '',
						'userId': this.userId
					},
					success: (res) => {
						if (res.data.status === 200) {
							this.videoList = res.data.data.rows
							if (res.data.data.rows.length === 0) {
								this.isEmpty = true
							}
						}
					}
				})
			}
		},
		components: {
			listItem
		},
	}
</script>

<style lang="scss">
	@import '../../static/styles/listItem.scss'
</style>
