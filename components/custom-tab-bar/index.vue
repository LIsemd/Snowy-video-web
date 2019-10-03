<template>
	<cover-view class="tab-bar">
	  <cover-view class="tab-bar-border"></cover-view>
	  <cover-view wx:for="{{list}}" wx:key="index" class="tab-bar-item" data-path="{{item.pagePath}}" data-index="{{index}}" bindtap="switchTab">
	    <cover-image wx:if="{{item.isSpecial != null && item.isSpecial == true}}" src="{{item.iconPath}}" class='centerImage'></cover-image>
	    <cover-image wx:else class='cover-image' src="{{selected === index ? item.selectedIconPath : item.iconPath}}"></cover-image>
	    <cover-view style="color: {{selected === index ? selectedColor : color}}">{{item.text}}</cover-view>
	  </cover-view>
	</cover-view>
</template>

<script>
	export default {
		data () {
			return {
				    selected: 2,
				    color: "#7A7E83",
				    selectedColor: "#3cc51f",
				    list: [{
				      pagePath: "/pages/mine/mine",
				      iconPath: "static/images/mine.png",
				      selectedIconPath: "static/images/mine.png",
				      text: "首页",
				      isSpecial: false
				    }, {
				      pagePath: "/pages/mine/mine",
				      iconPath: "static/images/mine.png",
				      selectedIconPath: "static/images/mine.png",
				      text: "",
				      isSpecial: true
				    }, {
				      pagePath: "/pages/mine/mine",
				      iconPath: "static/images/mine.png",
				      selectedIconPath: "static/images/mine.png",
				      text: "我的",
				      isSpecial: false
				    }],
			}
		},
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
			        wx.switchTab({
			          url: path
			        })
			        this.setData({
			          selected: index
			        })
			      }
			    }
		}
	}
</script>

<style>
	.tab-bar {
	  position: fixed;
	  bottom: 0px;
	  left: 0px;
	  right: 0px;
	  width: 100%;
	  height: 120rpx;
	  background: white;
	  display: flex;
	  flex-direction: row;
	  padding-bottom: env(safe-area-inset-bottom);
	}
	
	.tab-bar-border {
	  background-color: #e4e4e4;
	  position: absolute;
	  left: 0px;
	  top: 0px;
	  width: 100%;
	  height: 20rpx;
	}
	
	.tab-bar-item {
	  flex: 1;
	  text-align: center;
	  display: flex;
	  align-items: center;
	  flex-direction: column;
	  padding-top: 26rpx;
	}
	
	.cover-image {
	  width: 56rpx;
	  height: 56rpx;
	}
	
	.tab-bar-item cover-view {
	  font-size: 20rpx;
	}
	
	.centerImage {
	  width: 80rpx;
	  height: 80rpx;
	  position: absolute;
	  top: 5rpx;
	  border-radius: 50%;
	  border: 6rpx solid #fff;
	}
</style>
