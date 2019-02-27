export default

function(baseUrl) {
    return {

        coursePlanPage: baseUrl + 'manage/coursePlan/page',
        coursePlanList: baseUrl + 'manage/coursePlan/list',
        coursePlanAdd: baseUrl + 'manage/coursePlan/add',
        coursePlanDel: baseUrl + 'manage/coursePlan/delete/',
        coursePlanAddCourses:baseUrl+'manage/coursePlan/addCourses/',
        coursePlanAddStudents:baseUrl+'manage/coursePlan/addStudents/',

        //课程资源
        coursePlanFilesPage: baseUrl + 'manage/coursePlanFiles/page',
        coursePlanFilesList: baseUrl + 'manage/coursePlanFiles/list',
        coursePlanFilesAdd: baseUrl + 'manage/coursePlanFiles/add',
        coursePlanFilesDel: baseUrl + 'manage/coursePlanFiles/delete/',
        coursePlanFilesUpload:baseUrl+'manage/coursePlanFiles/uploadFile'



    }
}
