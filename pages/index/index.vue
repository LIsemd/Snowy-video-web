<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">Snowy 短视频</block>
		</cu-custom>
		<intro-swiper></intro-swiper>
		<index-list :videoList="videoList" :isNoMore="isNoMore"></index-list>
	</view>
</template>

<script>
	import indexList from '../../components/indexList/indexList.vue'
	import introSwiper from '../../components/introSwiper/introSwiper.vue'
	export default {
		components: {
			indexList,
			introSwiper
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
			}
		},
		onShow() {
			this.setTabBarIndex(0)
			this.getAllVideoList(this.page)
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
		// 下拉刷新
		onPullDownRefresh() {
			this.getAllVideoList(1)
		},
		// 仅第一次进入会触发onLoad
		onLoad() {
			this.screenWidth = uni.getSystemInfo().screenWidth
		},
		methods: {
			getAllVideoList(page) {
				uni.request({
					url: this.baseUrl + '/video/showAll?page=' + page + '&isSaveRecord=' + 0,
					method: "POST",
					data: {
						'videoDesc': ''
					},
					success: (res) => {
						if (res.data.status === 200) {
							// 判断当前页是否为第一页，若是，则设置videoList为空
							if (page === 1) {
								this.videoList = []
							}
							let data = res.data.data
							uni.stopPullDownRefresh()
							this.videoList = this.videoList.concat(data.rows)
							console.log(this.videoList);
							this.page = data.page
							this.totalPage = data.total
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
