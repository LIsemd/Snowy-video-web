/**
 * 作者： Lisemd
 * 日期： 2019/10/31
 */
import Vue from 'vue'
import App from './App'

import cuCustom from './components/cu-custom/cu-custom.vue'
import cuDialog from './components/cu-dialog/cu-dialog.vue'

Vue.component('cu-custom', cuCustom)
Vue.component('cu-dialog', cuDialog)

Vue.config.productionTip = false

Vue.mixin({
    methods:{
        setTabBarIndex(index){
            if (typeof this.$mp.page.getTabBar === 'function' &&
                this.$mp.page.getTabBar()) {
                this.$mp.page.getTabBar().setData({
                    selected:index
                })
            }
        }
    }
})

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
