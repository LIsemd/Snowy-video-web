<template>
	<view style="background: #212C37;height: 100%;">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">视频举报</block>
		</cu-custom>
		<view class="report-header margin-top-sm" @click="showModal"><text class="cuIcon-warnfill margin-lr-lg"></text>举报理由：
			{{reasonType}}
		</view>
		<view class="report-content"><text class="cuIcon-infofill margin-lr-lg"></text>举报描述（选填）：
			<textarea v-model="reportDesc" placeholder="请详细说明举报原因..."  class="report-area"/>
			<view class="report-tip"><text class="cuIcon-emoji margin-right-xs"></text>收到举报后，我们将在12小时内处理，非常感谢您的举报 ~ </view>
		</view>
		<button class="submit bg-gradual-red" type="button" @click="submitReport">提交</button>
		<view class="cu-modal bottom-modal" :class="isChooseReason?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green"></view>
					<view class="action text-blue" @tap="hideModal">取消</view>
				</view>
				<scroll-view scroll-y style="height: 500rpx;">
					<block v-for="item in reasonTypeList" :key="index">
						<view class="cu-bar bg-white" @click="selectReportReason" :data-target="item">
							<view class="action" style="width:100%;">
								<text>{{item}}</text>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				reasonType: '请选择原因',
				reportDesc: '',
				isChooseReason: false,
				radio: 'radio1',
				dealUserId: '',
				dealVideoId: '',
				reasonTypeList: [
					'色情低俗',
					'政治敏感',
					'涉嫌诈骗',
					'辱骂谩骂',
					'广告垃圾',
					'引人不适',
					'诱导分享',
					'过于暴力',
					'违法违纪',
					'其他原因'
				],
			}
		},
		onLoad(params) {
			this.dealUserId = params.dealUserId
			this.dealVideoId = params.dealVideoId
		},
		methods: {
			showModal() {
				this.isChooseReason = true
			},
			hideModal() {
				this.isChooseReason = false
			},
			selectReportReason(e) {
				this.isChooseReason = false
				this.reasonType = e.currentTarget.dataset.target
			},
			submitReport() {
				if (this.reasonType === '请选择原因') {
					uni.showToast({
						title: '请选择举报原因 ~',
						icon: 'none',
						duration: 1500
					})
					return
				}
				let user = getApp().globalData.getGlobalUserInfo()
				uni.request({
					url: this.baseUrl + '/user/reportUser',
					method: "POST",
					data:{
						dealUserId: this.dealUserId,
						dealVideoId: this.dealVideoId,
						title: this.reasonType,
						content: this.reportDesc,
						userId: user.id
					},
					header: {
						'content-type': 'application/json',
						'userId': user.id,
						'userToken': user.userToken
					},
					success: (res) => {
						if (res.data.status === 200) {
							uni.showToast({
								title: '举报成功! \r\n 稍后将返回视频页面~',
								icon: 'none',
								duration: 1500
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 2000);
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.report-header {
		height: 100rpx;
		width: 100%;
		line-height: 100rpx;
		font-size: 32rpx;
		color: #F2F2F3;
		background-color: #212C37;
	}
	.report-content {
		padding-top: 50rpx;
		height: auto;
		width: 100%;
		color: #F2F2F3;
		font-size: 32rpx;
		background-color: #212C37;
		.report-area {
			width: 90%;
			padding: 30rpx;
			margin: 40rpx auto;
			background: #2C405A;
			height: 340rpx;
		}
		.report-tip {
			color: #E7EBED;
			font-size: 24rpx;
			margin: 40rpx;
		}
	}
	.submit {
		margin-top: 80rpx;
		width: 80%;
		height: 80rpx;
		color: #F2F2F3;		font-size: 36rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 10rpx;
	}
</style>
