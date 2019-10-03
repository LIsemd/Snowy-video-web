<template>
	<view class="content">
		<video-header></video-header>
		<video-list :list="list"></video-list>
		<video-footer></video-footer>
	</view>
</template>

<script>
	import videoHeader from "../../components/video/videoHeader.vue"
	import videoFooter from "../../components/video/videoFooter.vue"
	import videoList from "../../components/video/videoList.vue"
	export default {
		components: {
			videoList,
			videoHeader,
			videoFooter
		},
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			this.getVideos();
			console.log(getApp());
		},
		methods: {
			getVideos() {
				const res = [{
						id: 0,
						src: "http://alimov2.a.yximgs.com/bs2/gdtPostRoll/postRoll-MTA3MDY0NDY3Mzk.mp4",
						autho: "张三",
						title: "仙娜美",
						loveNumber: 10000,
						commentNumber: 2000,
						shareNumber: 30000
					},
					{
						id: 1,
						src: "http://upmov.a.yximgs.com/upic/2019/02/13/22/BMjAxOTAyMTMyMjUxMTlfNDc4ODM2MzlfMTA3Mjc5ODU2MjhfMV8z_b_B1fbc185eaca8cc06efa2d4f713e13e8c.mp4",
						autho: "李四",
						title: "【搞笑】最强猜歌王",
						loveNumber: 40000,
						commentNumber: 5000,
						shareNumber: 60000
					},
					{
						id: 2,
						src: "http://bdmov.a.yximgs.com/bs2/gdtPostRoll/postRoll-MTA3MDk5Mjc5OTg.mp4",
						autho: "王五",
						title: "特制流泪芥末酱",
						loveNumber: 70000,
						commentNumber: 8000,
						shareNumber: 90000
					}
				];
				this.list = res;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		color: #3F536E;
		.title {
			margin: 0 20rpx;
		}
	}
</style>
