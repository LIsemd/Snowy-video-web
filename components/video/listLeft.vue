<template>
	 <view class="list-left">
	        <view class="author">
	            @祝晓晗
	        </view>
	        <view class="title">
	            妈呀，遇到老同学了，缘分呐! @老丈人说车 @抖音小助手
	        </view>
	        <view class="music-box"> 
	            <view class="music">
	                @祝晓晗创作的原声 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  @祝晓晗创作的原声
	            </view>
	        </view>
	    </view>
</template>

<script>
</script>

<style scoped>
	.list-left{
	        width: 70%;
	        height: 120px;
	        color: white;
	    }
	    .author {
	        height: 35px;
	        line-height: 35px;
	        font-size: 17px;
	    }
	    .title {
	        width: 100%;
	        line-height: 25px;
	        font-size: 12px;
	        word-wrap: break-word;
	        color: #FFFAF0;
	    }
	    .music-box {
	        overflow: hidden; 
	        width: 70%;
	    }
	    .music {
	        width: 200%;
	        height: 35px;
	        line-height: 35px;
	        font-size: 12px;
	        animation: scroll-x 5s linear 0.2s infinite; 
	    }
	    @keyframes scroll-x{ 
	        0% {
	            transform: translate3d(80%, 0, 0); 
	        }
	        100% {
	            transform: translate3d(-80%, 0, 0);
	        }
	    }
</style>
