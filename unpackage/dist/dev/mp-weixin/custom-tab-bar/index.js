const app = getApp();
Component({
	data: {
		selected: 0,
		color: "#7A7E83",
		selectedColor: "#BAEFFF",
		list: [{
			pagePath: "/pages/index/index",
			iconPath: "../static/images/home.png",
			selectedIconPath: "../static/images/home_actived.png",
			text: "首页",
			isSpecial: false
		},
		{
			pagePath: "/pages/dynamic/dynamic",
			iconPath: "../static/images/dynamic.png",
			selectedIconPath: "../static/images/dynamic_actived.png",
			text: "动态",
			isSpecial: false
		},
		{
			pagePath: "/pages/upload/upload",
			iconPath: "../static/images/add.png",
			text: "上传",
			isSpecial: true
		},
		{
			pagePath: "/pages/message/message",
			iconPath: "../static/images/message.png",
			selectedIconPath: "../static/images/message_actived.png",
			text: "消息",
			isSpecial: false
		},
		{
			pagePath: "/pages/mine/mine",
			iconPath: "../static/images/mine.png",
			selectedIconPath: "../static/images/mine_actived.png",
			text: "我的",
			isSpecial: false
		}],
	},
	attached() {},
	methods: {
		switchTab(e) {
			const dataset = e.currentTarget.dataset
			const path = dataset.path
			const index = dataset.index
			let currentPage = getCurrentPages()
			// 如果点击当前页面，则返回
			if ('/' + currentPage[0].route === path) {
				console.log('-----------------');
				return
			}
			//如果是特殊跳转界面
			if (this.data.list[index].isSpecial) {
				wx.navigateTo({
					url: path
				})
			} else {
				//正常的tabbar切换界面
				//使用switch会导致顶部自定义失效
				this.setData({
					selected: index
				})
				wx.switchTab({
					url: path
				})
			}
		}
	}
})
