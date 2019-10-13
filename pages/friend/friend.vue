<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" isBack="true">
			<block slot="content">{{isMe ? '我的好友' : 'Ta的好友'}}</block>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" v-for="(item,index) in tabList" :class="index==tabCur?'text-blue cur':''" :key="index"
				 @click="tabSelect" :data-id="index">
					{{item}}
				</view>
			</view>
		</scroll-view>
		<follow-list v-if="tabCur === 0" :userId="userId"></follow-list>
		<fan-list v-else :userId="userId"></fan-list>
	</view>
</template>

<script>
	import followList from '../../components/followList/followList.vue'
	import fanList from '../../components/fanList/fanList.vue'
	export default {
		components:{
			followList,
			fanList
		},
		data() {
			return {
				tabCur: 0,
				tabList: ['我的关注', '我的粉丝'],
				userId: '',
				userInfo: getApp().globalData.getGlobalUserInfo(),
				isMe: false
			}
		},
	
		onLoad(params) {
			this.userId = params.userId
			if(this.userInfo.id === params.userId) {
				this.isMe = true
			} else {
				this.tabList = ['Ta的关注', 'Ta的粉丝']
			}
		},
		methods:{
			tabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
		}
	}
</script>

<style>
</style>
