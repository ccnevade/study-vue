<template>
<div class="login-page" @keyup.enter="submitForm">
    <div class="login-box">
        <!-- <a class="logo"></a> -->
        <h5>后台登录</h5>
        <div class="input-box">
            <input type="text" placeholder="用户名" v-model="userName" autocomplete="off">
        </div>
        <div class="input-box">
            <input type="password" placeholder="密码" v-model="password" autocomplete="off">
        </div>
        <el-button type="primary" class="login-btn" @click="submitForm">登录</el-button>
        <!-- <p class="call">服务专线: 400-XXX-XXXX</p> -->
    </div>
    <!-- <div class="copyright">© 2015 - 2017 Maywant.com 深圳市XXX科技有限公司 版权所有 ICP证： 粤ICP备xxxxxx号</div> -->
</div>
</template>
<script>
export default {
    data() {
        return {
            userName: '',
            password: '',
        };
    },
    created: function() {
        var self = this;
    },
    methods: {
        submitForm() {
            var self = this;
            if (this.userName == '') {
                self.$message({ showClose: true, message: '请输入用户名', type: 'warning' });
                return;
            }
            if (this.password == '') {
                self.$message({ showClose: true, message: '请输入密码', type: 'warning' });
                return;
            }
            var postData = {
                username: this.userName,
                password: this.password,
            }

            this.$http.post(self.globalUrl.login, postData).then(function(res) {
                if (res.data.code == 200000) {
                    self.loginSuccessFun(res.data.data);
                }
            })
        },
        loginSuccessFun(data) {
            var self = this;
            var menuList=[
              {'name':'学生管理','uri':'/student','sort':10},
              {'name':'教师管理','uri':'/teacher','sort':20},
              {'name':'公告管理','uri':'/notice','sort':30},
              {'name':'课程管理','uri':'/course','sort':40},
              {'name':'课程计划管理','uri':'/coursePlan','sort':50},
              {'name':'意见反馈管理','uri':'/suggestion','sort':60},
            ]
            data.menuList= menuList;
            self.$store.commit("loginUserInfo", data);
            self.$router.push(menuList[0].uri);
        },
    }
}
</script>
<style scoped lang="less">
.login-page {
    width: 100%;
    height: 100%;
    background: #f5f5f5 url("../assets/images/login_bg.jpg") no-repeat center;
    background-size: cover;
    .login-box {
        width: 270px;
        height: 340px;
        padding: 20px 35px;
        background-color: rgba(255,255,255,0.9);
        position: fixed;
        z-index: 3;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -webkit-transform: translate(-50%,-50%);
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        // border-radius: 5px;
        h5 {
            font-size: 16px;
            color: #03BC97;
            text-align: center;
            margin-bottom: 0;
        }
        .call {
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 0 35px;
            box-sizing: border-box;
            color: #999;
            line-height: 44px;
            width: 100%;
            text-align: center;
        }
        .logo {
            display: block;
            background: url("../assets/images/logo.png") no-repeat center center;
            background-size: auto 39px;
            background-color: #03BC97;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            margin: auto auto 10px;
            border: 5px solid #eee;
        }
        .login-btn {
            border-radius: 21px;
            background-color: #03BC97;
            display: block!important;
            width: 100%;
            line-height: 16px;
            margin-left: 0;
            border: none;
            padding: 10px;
            border: 3px solid #eee;
            margin-top: 30px;
            &:hover {
                background-color: #03BC97;
            }
        }
        .about-btn {
            border-radius: 21px;
            display: block!important;
            width: 100%;
            line-height: 16px;
            margin-left: 0;
            padding: 10px;
            margin-top: 30px;
            color: #999;
            &:hover {
                color: #03BC97;
            }
        }
        .input-box {
            overflow: hidden;
            height: 46px;
            position: relative;
            margin-top: 15px;
            margin-bottom: 15px;
            & > input {
                width: 100%;
                line-height: 34px;
                height: 44px;
                text-indent: 5px;
                font-size: 14px;
                padding: 5px;
                box-sizing: border-box;
                border-bottom: 2px solid #03BC97;
                background-color: transparent;
                &:-webkit-autofill {
                    box-shadow: 0 0 0 1000px white inset !important;
                }
            }
        }
    }
    .copyright {
        position: fixed;
        width: 100%;
        line-height: 32px;
        z-index: 4;
        text-align: center;
        bottom: 10px;
        color: #fff;
    }
}
</style>
