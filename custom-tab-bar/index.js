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
		}, {
			pagePath: "/pages/upload/upload",
			iconPath: "../static/images/add.png",
			text: "上传",
			isSpecial: true
		}, {
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
