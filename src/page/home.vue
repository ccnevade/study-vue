<template>
    <div>
        <header class="header">
            <a href="#/" class="logo">
                <!-- <img src="../assets/images/logo_main.png" alt=""> -->
                后台管理
            </a>
            <div class="top_content">
                <el-tooltip class="item" effect="dark" content="安全退出" placement="bottom-start">
                    <div class="logout iconfont ifun-logout fr" @click="logout"></div>
                </el-tooltip>
                <p class="fl">
                    Hi. {{$store.state.loginName}}！
                    <!-- <el-button type="text">修改密码</el-button> -->
                </p >
                <p class="text-right">退出登录</p>

            </div>
        </header>
        <div class="main">
            <div class="main-left">
                <ul class="nav">
                    <li v-for="item in navData">
                        <router-link :to="item.uri">
                            <span>{{item.name}}</span>
                        </router-link>
                        <!-- <router-link :to="item.uri" v-if="item.children.length==0">
                            <span>{{item.name}}</span>
                        </router-link>
                        <a v-else href="javascript:void(0)" :class="{'open':item.open}" @click="item.open=!item.open">
                            <span>{{item.name}}</span>
                            <i class="el-icon-caret-top" v-if="item.open"></i>
                            <i class="el-icon-caret-bottom" v-else></i>
                        </a>
                        <el-collapse-transition>
                            <ul class="sub" v-if="item.children.length>0 && item.open">
                                <li v-for="subItem in item.children">
                                    <router-link :to="subItem.uri">
                    					<span>{{subItem.name}}</span>
                    				</router-link>
                                </li>
                            </ul>
                        </el-collapse-transition> -->
                    </li>
                </ul>
            </div>
            <router-view class="main-right"></router-view>
        </div>
    </div>
</template>
<script>
export default {
    data: function () {
        return {
            navData:[
                // {
                //     name:'门店管理',
                //     open:false,
                //     uri:'/store',
                //     children:[
                //
                //     ]
                // },
                // {
                //     name:'员工管理',
                //     open:false,
                //     uri:'/employee',
                //     children:[
                //     ]
                // },
                // {
                //     name:'账号管理',
                //     open:false,
                //     uri:'/account',
                //     children:[
                //     ]
                // },
            ]
        }
    },
    watch: {

    },
    created: function(){
      this.navChange();
    },
    methods:{
        navChange(){
          this.navData = JSON.parse(window.sessionStorage.getItem('menu')) || [] ;
          // console.log(JSON.stringify(this.navData));
        },
        logout(){
            window.sessionStorage.clear();
            this.$router.push('login')
        },
    }
}
</script>
<style media="screen" lang="less">
    header.header{
        position      : fixed;
        z-index       : 100;top:0;left:0;width: 100%;
        height        : 50px;
        background    : #23262E;
        .logo{
            display : block;
            float   : left;
            height  : 36px;
            padding-top: 7px;
            width: 150px;
            text-align: center;
            color : #1ab394;
            line-height: 36px;
            font-size: 24px;
            img{
                height : 35px;
            }
        }
        .top_content{
            margin-left: 150px;
            padding: 7px;
            height: 36px;
            color:#ddd;
            line-height: 36px;
        }
        .logout{
            color            : #fff;
            height           : 36px;
            width            : 36px;
            border-radius    : 50%;
            text-align       : center;
            line-height      : 35px;
            cursor           : pointer;
            font-size        : 24px;
            &:hover{
                color:#1ab394;
            }
        }
    }
</style>
