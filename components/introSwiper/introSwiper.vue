<template>
	<swiper class="card-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
	 duration="500" @change="cardSwiper" indicator-color="#8799a3" indicator-active-color="#0081ff">
		<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
			<view class="swiper-item">
				<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
				<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		data() {
			return {
				// 轮播图
				cardCur: 0,
				swiperList: [{
					id: 0,
					type: 'image',
					url: 'https://s2.ax1x.com/2019/10/04/uDkWOs.jpg'
				}, {
					id: 1,
					type: 'image',
					url: 'https://s2.ax1x.com/2019/10/04/uDkhmn.png',
				}, {
					id: 2,
					type: 'image',
					url: 'https://s2.ax1x.com/2019/10/04/uDk5T0.png'
				}, {
					id: 3,
					type: 'image',
					url: 'https://s2.ax1x.com/2019/10/04/uDkTYT.jpg'
				}, {
					id: 4,
					type: 'image',
					url: 'https://s2.ax1x.com/2019/10/04/uDk7fU.jpg'
				}],
				dotStyle: false,
				towerStart: 0,
				direction: '',
			}
		},
		methods: {
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
		}
	}
</script>

<style>

</style>
