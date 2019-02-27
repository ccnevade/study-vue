import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.http.options.emulateJSON = true;
Vue.http.options.crossOrigin = true;
var timer = null;
Vue.http.interceptors.push(function(request, next) {
    var self = this;
    var loadding = null;
    var quietLodding = false;

    // request.headers.set("access-token", this.$store.state.token);
    // if (!this.$store.state.token && request.url.indexOf('pub/adminLogin') == -1) {
    //     self.$router.push('/login')
    //     return;
    // }

    if (request.url.indexOf('quietLodding') > -1) {
        self.$store.state.xhrAbout = request;
        quietLodding = true;
        request.url = request.url.replace('quietLodding', '')
    }

    if (!quietLodding) {
        window.clearTimeout(timer);
        loadding = this.$loading()
    }

    next(function(res) {
        if (!quietLodding) {
            timer = setTimeout(function() {
                loadding.close();
            }, 100)
        }

        if (res.status == 200 && res.body.code != 200000) {
            if (res.body.code == 400000999996) {
                self.$message({ type: 'warning', message: res.body.message })
                window.sessionStorage.clear();
                self.$router.push('/login')
            } else {
                self.$message({
                    showClose: true,
                    message: res.body.message || '系统异常，请重试',
                    type: 'warning'
                });
            }
        }

        if (res.status != 200 && res.status != 0) {
            self.$message({ showClose: true, message: '系统异常，请重试', type: 'error' });
        }

        return res
    })
})
