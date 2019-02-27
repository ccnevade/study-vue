import student      from '../page/student/subUrl'
import teacher      from '../page/teacher/subUrl'
import notice       from '../page/notice/subUrl'
import course       from '../page/course/subUrl'
import coursePlan       from '../page/coursePlan/subUrl'
import suggestion       from '../page/suggestion/subUrl'



exports.install = function (Vue, options) {
    // const baseUrl = 'http://metc.patpang.cn/'
    const baseUrl = 'http://localhost:8888/'
    Vue.prototype.globalUrl = {
        baseUrl     : baseUrl,
        resourceUrl : 'http://www.baidu.com/',
        imageUpload : baseUrl+'common/uploadImg',

        login    : baseUrl+'manage/login/login',
        // loginOut : baseUrl+'admin/account/logout',
        student     : student(baseUrl),
        teacher     : teacher(baseUrl),
        notice      : notice(baseUrl),
        course      : course(baseUrl),
        coursePlan  : coursePlan(baseUrl),
        suggestion  : suggestion(baseUrl),

    }
};
