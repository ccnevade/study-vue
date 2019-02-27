
import login            from '../page/login.vue'
import home             from '../page/home.vue'

import student            from '../page/student/student.vue'
import teacher            from '../page/teacher/teacher.vue'
import notice            from '../page/notice/notice.vue'
import course            from '../page/course/course.vue'
import coursePlan            from '../page/coursePlan/coursePlan.vue'
import suggestion            from '../page/suggestion/suggestion.vue'



export default [
    { path: '/login', component: login },
    {
        path:'/home',component:home,redirect:'/student',
        children:[
            {
                path     : '/student',component:student,
            },
            {
                path     : '/teacher',component:teacher,
            },
            {
                path     : '/notice',component:notice,
            },
            {
                path     : '/course',component:course,
            },
            {
                path     : '/coursePlan',component:coursePlan,
            },
            {
                path     : '/suggestion',component:suggestion,
            },

        ]
    },
    { path: '*',redirect:'/login'}
]
