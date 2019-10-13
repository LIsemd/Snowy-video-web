<script>
	import Vue from 'vue'
	export default {
		globalData: {
			baseUrl: 'http://127.0.0.1:8080',
			// baseUrl: 'http://192.168.43.61:8080',
			searchInfo: {},
			videoList: [],
			currentPage: 0,
			totalPage: 1,
			page: 1,
			isSearch: false,
			setGlobalUserInfo(user) {
				uni.setStorageSync("userInfo", user)
			},
			getGlobalUserInfo() {
				return uni.getStorageSync("userInfo")
			},
		},
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style>
	/*每个页面公共css */
	@import "static/colorui/main.css";
	@import "static/colorui/icon.css";

	html,
	body {
		height: 100%;
		width: 100%;
	}
</style>
