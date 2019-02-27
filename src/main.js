import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routeConfig from './configs/router'

import Element from 'element-ui'
// import './assets/css/element-ui.css'
// import 'element-ui/lib/theme-chalk/index.css';
import '../theme/index.css';
Vue.use(Element)

import globalFun from './configs/globalFun.js'
Vue.use(globalFun);
import globalUrl from './configs/globalUrl.js'
Vue.use(globalUrl);

import './assets/css/layout.less'  //自定义样式
import './assets/css/page.less'  //页面样式 maybe可共用部分

//全局指令和组件
import myDirectiveComponent from './configs/directive-component.js'
Vue.use(myDirectiveComponent);

// import VueAwesomeSwiper from './components/vue-awesome-swiper'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

//加载路由中间件
Vue.use(VueRouter)
Vue.use(VueResource)

//http 拦截器
import interceptors from './configs/interceptors.js';

//vuex 全局状态管理
import store from './configs/store.js'
//定义路由
const router = new VueRouter({
  routes: routeConfig
})

new Vue({
  router,
  store,
  el: "#app",
  render: h => h(App)
})

//路由监控
router.beforeEach((to, from, next) => {
    next()
})
