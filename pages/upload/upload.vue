<template>
	<view>
		<!-- 顶部 -->
		<cu-custom bgColor="bg-gradual-blue" isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">上传作品</block>
		</cu-custom>
		<!-- 加载条 -->
		<view class="load-progress" :class="loadingTime!=0?'show':'hide'" :style="[{top:CustomBar+'px'}]">
			<view class="load-progress-bar bg-green" :style="[{transform: 'translate3d(-' + (100-loadingTime) + '%, 0px, 0px)'}]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view>
		<!-- 选择视频 -->
		<view v-if="basics === 0">
			<view class="select-box">
				<view :class="[isSelectVideo ? 'text-blue' : 'text-gray', 'select-music', 'bg-white', 'cu-btn']" @click="selectVideo">
					<view class="cuIcon-pick select-music-icon"></view>
					{{isSelectVideo ? '重新上传' : '上传视频'}}
				</view>
			</view>
			<view class="info-box" v-if="isSelectVideo">
				<view class="cu-form-group">
					<text class="cuIcon-title text-blue"></text>
					<view class="title">作品描述：</view>
					<input name="input" v-model="description" style="text-align: left; margin-left: -18rpx;"></input>
					<text class='cuIcon-info text-orange'></text>
				</view>
				<view class="cu-bar bg-white">
					<view class="action">
						<text class="cuIcon-title text-blue"></text>
						<text class="title">作品时长： {{duration}} 秒</text>
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action">
						<text class="cuIcon-title text-blue"></text>
						<text class="title">自定义作品封面： </text>
					</view>
					<view class="action">
						<text :class="[isSetCoverImage ? 'cuIcon-move' : 'cuIcon-add','text-orange']" @click="toSetCoverImage"></text>
					</view>
				</view>
				<image v-show="isSetCoverImage" :src="tempCoverUrl" class="cover-image" @click="setCoverImage">
				</image>
				<view class="cu-bar btn-group padding">
					<button class="cu-btn bg-gradual-blue shadow-blur round" @click="handleNext">下一步</button>
				</view>
			</view>
		</view>
		<!-- 选择背景音乐 -->
		<view v-if="basics === 1">
			<view class="select-box">
				<view :class="[isSelectBgm ? 'text-blue' : 'text-gray', 'select-music', 'bg-white', 'cu-btn']" @click="openSelectModel">
					<view class="cuIcon-evaluate select-music-icon"></view>
					{{isSelectBgm ? '重新选择' : '选择音乐'}}
				</view>
			</view>
			<view class="info-box">
				<view class="cu-bar bg-white">
					<view class="action">
						<text class="cuIcon-title text-blue"></text>
						<text>歌曲名称： {{bgmName ? bgmName : '暂未选择歌曲'}}</text>
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action">
						<text class="cuIcon-title text-blue"></text>
						<text>歌曲作者： {{bgmAuthor ? bgmAuthor : '暂未选择歌曲'}}</text>
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action">
						<text class="cuIcon-title text-blue"></text>
						<text>歌曲试听： {{bgmSrc ? '' : '暂未选择歌曲'}}</text>
					</view>
				</view>
				<audio class="audio" v-if="isSelectBgm" :poster="bgmCover" :name="bgmName" :author="bgmAuthor" :src="bgmSrc" id="myAudio"
				 controls loop object-fit="cover"></audio>
				<view class="cu-bar btn-group padding">
					<button class="cu-btn bg-gradual-blue shadow-blur round" @click="handleNext">上传作品</button>
				</view>
			</view>
			<view class="cu-modal drawer-modal justify-start" :class="isShowSelectModel ?'show':''" @click="hideSelectModel">
				<view class="cu-dialog basis-lg" @click.stop="" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
					<view class="cu-list menu text-left">
						<view class="cu-item arrow" v-for="(item,index) in bgmList" :key="index" @click="checkBgm(item.id)">
							<view class="content bgm-item">
								<view :class="{'text-blue': bgmId === item.id} ">{{item.name}} <text class="bgm-author">{{item.author}}</text></view>
							</view>
						</view>
						<view class="cu-item" style="background-color: #8799a3;color: #ffffff;" @click="checkBgm()">
							<view class="content" style="text-align: center;">
								不选择背景音乐
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 上传成功界面 -->
		<view v-if="basics === 2">
			<view class="container">
				<image :src="[isUpload ? '../../static/images/avatar.jpg' : '../../static/images/avatar2.jpg']" class="image" mode=""></image>
				<view class="content">
					{{isUpload ? '作品上传成功!' : '作品上传失败...'}}
					<view style="line-height: 100rpx; font-size: 24rpx;" class="text-blue" @click="handleBack">
						<text>快到首页看看叭(´◔ω◔)</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 步骤条 -->
		<view class="bg-white padding step">
			<view class="cu-steps">
				<view class="cu-item" :class="index>basics?'':'text-blue'" v-for="(item,index) in basicsList" :key="index" @click="changeStep(index)">
					<text :class="'cuIcon-' + item.cuIcon"></text> {{item.name}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 服务器地址
				baseUrl: getApp().globalData.baseUrl,
				// 上传作品信息相关
				description: '',
				duration: 0,
				tempCoverUrl: '',
				tempHeight: '',
				tempWidth: '',
				tempVideoUrl: '',
				// BGM相关
				bgmId: '',
				bgmList: [],
				bgmName: '',
				bgmAuthor: '',
				bgmSrc: '',
				bgmCover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570011702869&di=bb184e38fd80df41fa12a53831e22bf1&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201804%2F25%2F20180425214237_fnkuj.thumb.700_0.jpg',
				// 状态控制
				isSelectVideo: false,
				isSetCoverImage: false,
				isSelectBgm: false,
				isShowSelectModel: false,
				isUpload: false,
				isLoading: false,
				// 步骤条
				basics: 0,
				basicsList: [{
						cuIcon: 'video',
						name: '选择视频'
					},
					{
						cuIcon: 'musicfill',
						name: '选择背景音乐'
					},
					{
						cuIcon: 'roundcheckfill',
						name: '上传成功'
					}
				],
				// Loading
				CustomBar: this.CustomBar,
				loadingTime: 0,
				// 防止重复点击
				buttonClicked: false,
			}
		},
		onLoad() {},
		methods: {
			// Loading
			loadProgress() {
				this.loadingTime += 3;
				if (this.loadingTime < 100 || this.isLoading) {
					setTimeout(() => {
						this.loadProgress();
					}, 100)
				} else {
					this.loadingTime = 0;
				}
			},
			// 上传视频相关
			selectVideo() {
				this.loadProgress()
				this.isLoading = true
				// this.LoadProgress()
				uni.chooseVideo({
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.isLoading = false
						this.duration = res.duration
						// 微信手机端不存在 thumbTempFilePath 小坑！
						// this.tempCoverUrl = res.thumbTempFilePath
						this.tempHeight = res.height
						this.tempWidth = res.width
						this.tempVideoUrl = res.tempFilePath
						if (res.duration > 181) {
							uni.showToast({
								title: '视频长度不能超过180秒',
								icon: 'none',
								duration: 2000
							})
							return
						} else if (res.duration < 4) {
							uni.showToast({
								title: '视频长度太短，请上传超过3秒的视频',
								icon: 'none',
								duration: 2000
							})
							return
						} else {
							this.isSelectVideo = true
							uni.showToast({
								title: '视频读取成功！',
								icon: 'none',
								duration: 1000
							})
						}

					},
					fail: () => {
						this.isLoading = false
						uni.showToast({
							title: '视频读取失败！',
							icon: 'none',
							duration: 1000
						})
					}
				})
			},
			toSetCoverImage() {
				console.log(this.isSetCoverImage);
				if (this.isSetCoverImage === false) {
					this.tempCoverUrl = ''
				}
				this.isSetCoverImage = !this.isSetCoverImage
			},
			setCoverImage() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						this.tempCoverUrl = res.tempFilePaths[0]
					}
				})
			},
			handleNext() {
				if (this.basics == 0 && this.isSelectVideo) {
					// 特殊字符检验
					let pattern = new RegExp("`#$^&*=|';'./￥……&*——|‘；：”“'、？");
					if (pattern.test(this.description)) {
						uni.showToast({
							title: '标题不能含有特殊字符 ~',
							icon: 'none',
							duration: 1500
						})
						return
					}
					this.basics++
					uni.request({
						url: this.baseUrl + '/bgm/list',
						method: 'POST',
						success: (res) => {
							if (res.data.status === 200) {
								this.bgmList = res.data.data
							}
						}
					})
				} else if (this.basics == 1) {
					// 防止重复提交
					if (this.buttonClicked) {
						uni.showToast({
							title: '正在提交中...',
							icon: 'none',
							duration: 1000
						})
						return
					}
					// 上传作品操作
					this.loadProgress()
					this.isLoading = true
					this.isUpload = false
					this.buttonClicked = true
					// this.LoadProgress()
					let user = getApp().globalData.getGlobalUserInfo()
					uni.uploadFile({
						url: this.baseUrl + '/video/upload',
						formData: {
							userId: user.id,
							bgmId: this.bgmId,
							description: this.description,
							duration: this.duration,
							videoHeight: this.tempHeight,
							videoWidth: this.tempWidth
						},
						filePath: this.tempVideoUrl,
						name: 'file',
						success: (res) => {
							let data = JSON.parse(res.data)
							if (data.status === 200) {
								// 上传封面图片
								// console.log('----------视频上传成功-----------');
								if (this.tempCoverUrl != '') {
									let videoId = data.data
									uni.uploadFile({
										url: this.baseUrl + '/video/uploadCover',
										formData: {
											userId: user.id,
											videoId: videoId,
										},
										filePath: this.tempCoverUrl,
										name: 'file',
										success: (res) => {
											let data = JSON.parse(res.data)
											this.isLoading = false
											if (data.status === 200) {
												this.basics++
												this.isUpload = true
												this.buttonClicked = false
											} else {
												uni.showToast({
													title: '上传失败(。-`ω´-)',
													icon: 'none',
													duration: 2000
												})
												this.buttonClicked = false
											}
										}
									})
								} else {
									this.basics++
									this.isLoading = false
									this.isUpload = true
									this.buttonClicked = false
								}

							} else {
								uni.showToast({
									title: '上传失败(。-`ω´-)',
									icon: 'none'
								})
								this.isLoading = false
								this.buttonClicked = false
							}
						},
						fail: (err) => {
							this.isLoading = false
							this.buttonClicked = false
						}
					})
				}
			},
			openSelectModel() {
				if (!this.buttonClicked) {
					this.isShowSelectModel = true
				}
			},
			hideSelectModel() {
				this.isShowSelectModel = false
			},
			handleBack() {
				uni.switchTab({
					url: '../index/index'
				})
			},
			// 选择BGM
			checkBgm(id) {
				if (id != undefined) {
					this.bgmId = id
					this.bgmList.forEach((bgm) => {
						if (bgm.id === id) {
							this.bgmName = bgm.name
							this.bgmAuthor = bgm.author
							this.bgmSrc = getApp().globalData.fileUrl + bgm.path
							this.isSelectBgm = true
						}
					})
				} else {
					this.bgmId = ''
					this.bgmName = ''
					this.bgmAuthor = ''
					this.bgmSrc = ''
					this.isSelectBgm = false
				}
				this.hideSelectModel()
			},
			changeStep(index) {
				if (index < this.basics && this.basics != 2) {
					this.basics = index
				}
			}
		},
	}
</script>

<style lang="scss">
	.select-box {
		position: relative;
		width: 100%;
		height: 450rpx;

		.select-music {
			position: absolute;
			left: 0;
			right: 0;
			top: 45%;
			margin: 0 auto;
			width: 250rpx;
			height: 250rpx;
			border-radius: 50%;

			.select-music-icon {
				font-size: 50rpx;
			}
		}
	}

	.info-box {
		margin-top: 40rpx;
		margin-bottom: 200rpx;
		height: 100%;
		width: 100%;
		background: #FFF;
		text-align: center;

		.cover-image {
			width: 256rpx;
			height: 256rpx;
			border: 1px solid #ddd;
		}

		.audio {
			margin: 0 30rpx;
		}
	}

	.container {
		height: 100vh;
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



	.bgm-item {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;

		.bgm-author {
			margin-left: 50rpx;
			font-size: 22rpx;
			color: #C8C7CC;
		}
	}

	.step {
		height: 156rpx;
		background: linear-gradient(rgba(255, 255, 255, .2) 0, #FFF 100%);
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>
