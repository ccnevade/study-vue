import $ from 'jquery'
exports.install = function(Vue, options) {
    Vue.prototype.phoneReg = /^((1[3|4|5|7|8]{1})+\d{9})$/;
    //日期展示格式处理
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // this.dateFormat(dateObj,"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // this.dateFormat(dateobj,"yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Vue.prototype.dateFormat_zefun = function(date, fmt) {
        try {
            date = new Date(date)
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        } catch (e) {
            return date;
        }
    }
    Vue.prototype.moneyCaptain = function(n) {
        var fraction = ['角', '分'];
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);

        var s = '';

        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);

        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    }

    Vue.prototype.tableKeybordFun = function(event) { //table 键盘事件
        var self = this;
        var obj = $(event.path[0]);
        var tdIndex = obj.parents('td').index();
        var tdObj = obj.parents('td');
        var trObj = obj.parents('tr');
        if (event.keyCode == 13 || event.keyCode == 40) { //	enter
            var controllTd = trObj.next('tr').find('td:eq(' + tdIndex + ')');
            controllTd.find('input').focus().select();
            return;
        }
        if (event.keyCode == 38) { //	上
            var controllTd = trObj.prev('tr').find('td:eq(' + tdIndex + ')');
            controllTd.find('input').focus().select();
            return;
        }
    }

    Vue.prototype.beforeAvatarUpload = function(file) {
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            this.$message({
                showClose: true,
                message: '上传图片大小不能超过 5MB!',
                type: 'warning'
            });
        }
        return isLt2M;
    }

    Vue.prototype.validMoney = function(rule, value, callback) {
        var temp = /^\d+\.?\d{0,2}$/;
        if (!value) {
            return callback(new Error('请输入金额'));
        } else if (!temp.test(value)) {
            return callback(new Error('请输入正确的金额,保留两位小数'));
        } else {
            callback();
        }
    }

    Vue.prototype.validNumber = function(rule, value, callback) {
        var temp = /^\d+(?=\.{0,1}\d+$|$)/
        if (!value || !temp.test(value)) {
            return callback(new Error('请输入正确的数字'));
        } else {
            callback();
        }
    }
};
