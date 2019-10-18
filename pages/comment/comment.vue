<template>
	<view style="padding-bottom: 100upx;" id="page">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">评论页面</block>
		</cu-custom>
		<view class="cu-chat">
			<view class="cu-info round">当前：{{videoDesc}}</view>
			<block v-for="item in commentList" :key="item.id">
				<view class="cu-item" :class="item.fromUserId === userId ? 'self' : ''">
					<view class="cu-avatar radius" :style="{'background-image':'url(' + (item.avatar ? fileUrl + item.avatar : defaultAvatar) +')'}" v-if="item.fromUserId != userId" @click="toUserPage(item.fromUserId)"></view>
					<view class="main">
						<view class="content shadow" :class="item.fromUserId === userId ? 'bg-green' : ''">
							<text>{{item.comment}}</text>
						</view>
					</view>
					<view class="cu-avatar radius" :style="{'background-image':'url(' + (item.avatar ? fileUrl + item.avatar : defaultAvatar) +')'}" v-if="item.fromUserId === userId"></view>
					<view class="date">{{item.timeAgoStr}}</view>
				</view>
			</block>
		</view>

		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus"
			 @blur="InputBlur" v-model="comment"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow" @click="submitComment">发送</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseUrl: getApp().globalData.baseUrl,
				fileUrl: getApp().globalData.fileUrl,
				InputBottom: 0,
				comment: '',
				userId: '',
				videoId: '',
				createrId: '',
				videoDesc: '',
				defaultAvatar: '/static/images/avatar.jpg',
				commentList: [],
				isLoading: false,
			}
		},
		onLoad(params) {
			this.createrId = params.createrId
			this.videoId = params.videoId
			this.videoDesc = params.videoDesc
			this.getAllComments()
		},
		methods: {
			toUserPage(userId) {
				uni.navigateTo({
					url: '../person/person?userId=' + userId
				})
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			getAllComments() {
				let user = getApp().globalData.getGlobalUserInfo()
				this.userId = user.id
				uni.request({
					url: this.baseUrl + '/video/getVideoComments?videoId=' + this.videoId,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'userId': user.id,
						'userToken': user.userToken
					},
					success: (res) => {
						// console.log(res);
						if (res.data.status === 200) {
							this.commentList = []
							this.commentList = res.data.data
						}
					}
				})
			},
			// 获取容器高度，使页面滚动到容器底部
			pageScrollToBottom() {
				// 使页面滚动到底部
				uni.createSelectorQuery().select('#page').boundingClientRect(function(rect) {
					// 使页面滚动到底部
					uni.pageScrollTo({
						scrollTop: rect.height
					})
				}).exec()

			},
			submitComment() {
				if (this.comment === '' || this.isLoading) {
					return
				}
				let user = getApp().globalData.getGlobalUserInfo()
				this.isLoading = true
				let data = {
					videoId: this.videoId,
					fromUserId: user.id,
					comment: this.comment
				}
				uni.request({
					url: this.baseUrl + '/video/saveComment',
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'userId': user.id,
						'userToken': user.userToken
					},
					data: data,
					success: (res) => {
						this.isLoading = false
						this.comment = ''
						if (res.data.status === 200) {
							// 重新获取数据
							this.getAllComments()
							setTimeout(() => {
								this.pageScrollToBottom()
							},300)
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
