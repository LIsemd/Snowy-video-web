<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">Snowy 短视频</block>
		</cu-custom>
		<intro-swiper></intro-swiper>
		<index-list ref="videoList"></index-list>
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
				// 屏幕宽度
				screenWidth: 350,
			}
		},
		onShow() {
			this.setTabBarIndex(0)
			for (let i = 1; i <= getApp().globalData.page; i++) {
				if (i === 1) {
					this.$refs.videoList.getAllVideoList(1)
				} else {
					setTimeout(() => {
						this.$refs.videoList.getAllVideoList(i)
					},500)
				}
			}
			// 设置搜索全局属性
			getApp().globalData.isSearch = false
		},
		// 上拉刷新
		onReachBottom() {
			// 判断当前页数和总页数是否相等
			if (getApp().globalData.page === getApp().globalData.totalPage) {
				this.$refs.videoList.isNoMore = true
				return
			}
			let nextPage = getApp().globalData.page + 1
			this.$refs.videoList.getAllVideoList(nextPage)
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.$refs.videoList.getAllVideoList(1)
			getApp().globalData.page = 1
		},
		// 仅第一次进入会触发onLoad
		onLoad() {
			this.screenWidth = uni.getSystemInfo().screenWidth
		}
	}
</script>

<style lang="scss">

</style>
