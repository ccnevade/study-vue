import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        loginName     :window.sessionStorage.getItem('loginName') || '系统管理员',
        //用于ajax提前终止请求
        xhrAbout :null,
        //服务于页面切换 数据传递
        changePageData :null,

        userInfo       : JSON.parse(window.sessionStorage.getItem('userInfo')) || {},
        // token          : window.sessionStorage.getItem('token') || '',
        menu           : window.sessionStorage.getItem('menu') || [],
    },
    mutations:{
        loginUserInfo(state, value){
            state.userInfo  = value;
            // state.token     = value.token;
            state.loginName = value.name;
            state.menu      = value.menuList;
            window.sessionStorage.setItem('loginName',value.name);
            window.sessionStorage.setItem('userInfo', JSON.stringify(value));
            // window.sessionStorage.setItem('token', value.token);
            window.sessionStorage.setItem('menu', JSON.stringify(value.menuList));
        },
        setChangePageData(state,value){
            state.changePageData = value;
        }
    }
})
