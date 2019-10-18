<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">消息</block>
		</cu-custom>
		<view class="cu-list menu-avatar">
			<block v-for="item in messageList" :key="item.id">
				<view class="cu-item" @click="toCommentPage(item)">
					<view class="cu-avatar round lg" :style="{'background-image':'url('+ fileUrl + item.coverPath +')'}"></view>
					<view class="content">
						<view class="text-grey"> {{item.videoDesc}}</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								你发布的视频有了新的评论!
							</view>
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">{{item.timeAgoStr}}</view>
						<view class="cu-tag round bg-red sm">{{item.length}}</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		onShow() {
			this.setTabBarIndex(3)
			this.getMessage()
		},
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				fileUrl: getApp().globalData.fileUrl,
				messageList: []
			}
		},
		methods: {
			toCommentPage(item) {
				uni.navigateTo({
					url: '../comment/comment?videoId=' + item.videoId + '&createrId=' + item.userId + '&videoDesc=' + item.videoDesc
				})
			},
			getMessage() {
				let user = getApp().globalData.getGlobalUserInfo()
				uni.request({
					url: this.baseUrl + '/video/getAllComments?userId=' + user.id,
					method: 'POST',
					success: (res) => {
						if (res.data.status === 200) {
							this.messageList = []
							let data = res.data.data
							data.forEach((item) => {
								let status = false
								for (let i = 0; i < this.messageList.length; i++) {
									if (item.videoId === this.messageList[i].videoId) {
										this.messageList[i].length++
										status = true
										break
									}
								}
								if (!status) {
									this.messageList.push(item)
									this.messageList[this.messageList.length - 1].length = 1
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
</style>
