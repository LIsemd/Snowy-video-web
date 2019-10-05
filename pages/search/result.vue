<template>
	<view class="page">
		<cu-custom bgColor="bg-gradual-blue" isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">搜索结果</block>
		</cu-custom>
		<view class="container" v-if="isNoResult">
			<image src="../../static/images/avatar2.jpg" class="image" mode=""></image>
			<view class="content">
				找不到你想要的结果
				<view style="line-height: 100rpx; font-size: 30rpx;" class="text-blue" @click="handleBack">
					<text>换个词试试吧(っ•̀ω•́)っ✎⁾⁾</text>
				</view>
			</view>
		</view>
		<index-list :videoList="videoList" :isNoMore="isNoMore" v-if="!isNoResult"></index-list>
	</view>
</template>

<script>
	import indexList from '../../components/indexList/indexList.vue'
	export default {
		components: {
			indexList,
		},
		data() {
			return {
				// 服务器地址
				baseUrl: getApp().globalData.baseUrl,
				// 视频相关
				videoList: [],
				// 屏幕宽度
				screenWidth: 350,
				// 分页属性
				totalPage: 1,
				page: 1,
				isNoMore: false,
				searchContent: '',
				isSaveRecord: '',
				isNoResult: false
			}
		},
		onShow() {
			this.setTabBarIndex(0)
			this.getAllVideoList(this.page)
		},
		onHide() {
		},
		// 上拉刷新
		onReachBottom() {
			// 判断当前页数和总页数是否相等
			if (this.page === this.totalPage) {
				this.isNoMore = true
				return
			}
			let nextPage = this.page + 1
			this.getAllVideoList(nextPage)
		},
		// 仅第一次进入会触发onLoad
		onLoad() {
			this.screenWidth = uni.getSystemInfo().screenWidth
			let searchInfo = getApp().globalData.searchInfo
			this.searchContent = searchInfo.searchContent ? searchInfo.searchContent : ''
			this.isSaveRecord = searchInfo.isSaveRecord
			if (this.isSaveRecord === null || this.isSaveRecord === '' || this.isSaveRecord === undefined) {
				this.isSaveRecord = 0
			}
		},
		methods: {
			handleBack() {
				uni.navigateBack()
			},
			getAllVideoList(page) {
				uni.request({
					url: this.baseUrl + '/video/showVideos?page=' + page + '&isSaveRecord=' + this.isSaveRecord,
					method: "POST",
					data: {
						'videoDesc': this.searchContent
					},
					success: (res) => {
						if (res.data.status === 200) {
							// 判断当前页是否为第一页，若是，则设置videoList为空
							if (page === 1) {
								this.videoList = []
							}
							uni.stopPullDownRefresh()
							let data = res.data.data
							if (data.rows.length === 0) {
								this.isNoResult = true
								this.isNoMore = true
							}
							this.videoList = this.videoList.concat(data.rows)
							getApp().globalData.videoList = this.videoList
							this.page = data.page
							this.totalPage = data.total
							if (this.page === this.totalPage) {
								this.isNoMore = true
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	.container {
		flex: 1;
		width: 100%;
		text-align: center;
		display: flex;
		flex-direction: row;
		padding-top: 400rpx;
		background-color: #FFF;

		.image {
			width: 300rpx;
			height: 300rpx;
		}

		.content {
			display: inline-block;
			height: 300rpx;
			padding-top: 100rpx;
			font-size: 44rpx;
			flex: 1;
		}
	}
</style>
