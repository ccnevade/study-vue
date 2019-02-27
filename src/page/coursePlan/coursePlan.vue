<template>
<div class="has_content_top_fixed no_content_footer">
    <div class="content_top text-right">
        <el-form :inline="true" @submit.prevent.native>
            <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-plus" @click="edit(-1,{})">添加</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="content_body">
        <el-table :data="coursePlanList" stripe style="width: 100%">
          <!-- <el-table-column type="expand">
                <template slot-scope="props">
                  <div style="margin:30px;">
                      <table v-if="props.row.coursePlanFilesList.length>0" class="zefun_table" width='100%'>
                          <tr>
                              <th>序号</th>
                              <th>文件名</th>
                              <th>上传时间</th>
                              <th>操作</th>
                          </tr>
                          <tr v-for="(item,index) of props.row.coursePlanFilesList">
                              <td>{{index+1}}</td>
                              <td>{{item.fileName}}</td>
                              <td>{{item.createTime}}</td>
                              <td>
                                <el-button  size="mini" type="danger"  @click="delcoursePlanFile(item.id)">删除</el-button>
                              </td>
                          </tr>
                      </table>
                      <div v-else style="text-align:center;">
                          <div style="margin:0,auto;">
                              暂无数据
                          </div>
                      </div>
                  </div>
                </template>
              </el-table-column> -->

            <el-table-column prop="name" label="计划名"></el-table-column>
            <el-table-column prop="introduction" label="介绍"></el-table-column>
            <el-table-column prop="courseList" label="包含课程">
                <template scope="scope">
                    <span v-for="item of scope.row.courseList">{{item.name}}; </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
                <template scope="scope">
                    <el-button size="mini" type="primary"  @click="selectStu(scope.row.id)">添加学生</el-button>
                    <el-button size="mini" type="warning"  @click="selectCourse(scope.row.id)">配置课程</el-button>
                    <el-button  size="mini" type="danger"  @click="del(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="initData" :current-page.sync="currentPage" :page-size="pageSize" :total="totalData" layout="total, prev, pager, next"></el-pagination>
    </div>

    <el-dialog class="zefun-dialog" :title="editType==-1?'计划添加':'计划编辑'" @keyup.enter.native="editSubmit" :visible.sync="dialogVisible" width="500px">
        <el-form label-position="right" label-width="80px" ref="ruleForm" :model="editObj">
            <el-form-item label="计划名" prop="name">
                <el-input v-model="editObj.name" placeholder="计划名"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="introduction">
                <el-input v-model="editObj.introduction" placeholder="介绍"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
    </el-dialog>


    <el-dialog title="学生列表" class="dialog" :visible.sync="studentDialogVisible" width="800px">
        <el-table :data="studentList" tooltip-effect="dark" style="width: 100%" @selection-change="handleStuSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="classroom" label="班级"></el-table-column>
            <el-table-column prop="major" label="专业"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="studentDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitSelectedStu">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="课程列表" class="dialog" :visible.sync="courseDialogVisible" width="800px">
        <el-table :data="courseList" tooltip-effect="dark" style="width: 100%" @selection-change="handleCourseSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="课程名"></el-table-column>
            <el-table-column prop="introduction" label="介绍"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="courseDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitSelectedCourse">确 定</el-button>
        </div>
    </el-dialog>

</div>
</template>
<script>
export default {
    data() {
        return {
            searchKeyword: '',
            coursePlanStatus: 0,
            coursePlanList: [],

            dialogVisible: false,
            uploadDialogVisible: false,
            studentDialogVisible:false,
            courseDialogVisible:false,
            editType: -1,
            editObj: {},

            currentPage: 1,
            pageSize: 15,
            totalData: 0,

            fileList: [],

            studentList:[],
            courseList:[],

            //已选列表
            selectedStudent:[],
            selectedCourse:[],

            currPlanId:null,

            coursePlanFileObj:{
              coursePlanId:null,
              fileName:'',
              fileUri:''
            }
        }
    },
    computed: {
    },
    created: function() {
        this.getAllCourse();
        this.getAllStudent();
        this.initData();
    },
    methods: {
        initData() {
            var self = this;
            var postData = {
                "pageSize": this.pageSize,
                "currPage": this.currentPage
            }
            this.$http.post(self.globalUrl.coursePlan.coursePlanPage, JSON.stringify(postData)).then(function(res) {
                if (res.data.code == 200000) {
                    self.coursePlanList = res.data.data.content;
                    self.totalData = res.data.data.totalElements;
                }
            });
        },
        edit(type, data) {
            var self = this;
            this.editType = type;
            this.editObj = {
                name: data.name || '',
                introduction: data.introduction || '',
                fee: data.fee || 0,
                id: data.id || null
            }
            this.dialogVisible = true;
        },
        editSubmit() {
            var self = this;
            if (this.editObj.name == '') {
                self.$message({ showClose: true, message: '请输入课程名', type: 'warning' });
                return;
            }
            if (this.editObj.introduction == '') {
                self.$message({ showClose: true, message: '请输入介绍', type: 'warning' });
                return;
            }
            var postData = JSON.parse(JSON.stringify(self.editObj));
            var postUrl = self.globalUrl.coursePlan.coursePlanEdit;
            if (this.editType == -1) {
                postUrl = self.globalUrl.coursePlan.coursePlanAdd;
            }
            this.$http.post(postUrl, JSON.stringify(postData)).then(function(res) {
                if (res.data.code == 200000) {
                    self.$message({ type: 'success', message: '操作成功!' });
                    self.initData();
                    self.dialogVisible = false;
                }
            });
        },
        del(index, data) {
            var self = this;
            this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get(self.globalUrl.coursePlan.coursePlanDel + data.id).then(function(res) {
                    if (res.data.code == 200000) {
                        self.initData();
                        self.$message({ type: 'success', message: '删除成功!' });
                    }
                });
            });
        },

        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 5;
            if (!isLt2M) {
                this.$message({
                    showClose: true,
                    message: '上传文件大小不能超过 5MB!',
                    type: 'warning'
                });
            }
            return isLt2M;
        },
        handleAvatarSuccessImg(res, file) {
            if (res.code == 200000) {
                console.log("handleAvatarSuccessImg:" + JSON.stringify(res));
                this.coursePlanFileObj.fileUri=res.data;
            } else {
                this.$message({
                    showClose: true,
                    message: res.msg,
                    type: 'error'
                });
            }
        },
        handleAvatarSuccess(res, file) {
            if (res.code == 200000) {
                this.fileList.push({
                    name: res.data,
                    url:  res.data
                });

            } else {
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error'
                });
            }
        },
        handleRemove(file) {
            for (var i = 0; i < this.fileList.length; i++) {
                if (this.fileList[i].uid == file.uid) {
                    this.fileList.splice(i, 1);
                }
            }
        },
        addcoursePlanFile(cId){
          var self = this;
          this.coursePlanFileObj.coursePlanId = cId;
          this.uploadDialogVisible = true;
        },
        submitcoursePlanFile(){
          var self = this;
          this.$http.post(self.globalUrl.coursePlan.coursePlanFilesAdd,JSON.stringify(self.coursePlanFileObj)).then(function(res) {
              if (res.data.code == 200000) {
                  self.$message({ type: 'success', message: '上传成功!' });
                  self.initData();
                  this.uploadDialogVisible = false;
              }
          });
        },
        delcoursePlanFile(id){
          var self = this;
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.$http.get(self.globalUrl.coursePlan.coursePlanFilesDel + id).then(function(res) {
                  if (res.data.code == 200000) {
                      self.initData();
                      self.$message({ type: 'success', message: '删除成功!' });
                  }
              });
          });
        },
        getAllStudent(){
          var self = this;
          this.$http.post(self.globalUrl.student.studentList, {}).then(function(res) {
              if (res.data.code == 200000) {
                  self.studentList = res.data.data;
              }
          });
        },
        getAllCourse(){
          var self = this;
          this.$http.post(self.globalUrl.course.courseList, {}).then(function(res) {
              if (res.data.code == 200000) {
                  self.courseList = res.data.data;
              }
          });
        },
        handleStuSelectionChange(val) {
          this.selectedStudent = val;
        },
        handleCourseSelectionChange(val) {
          this.selectedCourse = val;
        },
        selectStu(id){
          this.currPlanId = id;
          this.studentDialogVisible = true;
        },
        selectCourse(id){
          this.currPlanId = id;
          this.courseDialogVisible=true;
        },
        submitSelectedStu(){
          var self = this;
          this.$http.post(self.globalUrl.coursePlan.coursePlanAddStudents+self.currPlanId, JSON.stringify(self.selectedStudent)).then(function(res) {
              if (res.data.code == 200000) {
                  self.$message({ type: 'success', message: '操作成功!' });
                  self.initData();
                  self.courseDialogVisible = false;

              }
          });
          self.studentDialogVisible = false;
        },
        submitSelectedCourse(){
          var self = this;
          this.$http.post(self.globalUrl.coursePlan.coursePlanAddCourses+self.currPlanId, JSON.stringify(self.selectedCourse)).then(function(res) {
              if (res.data.code == 200000) {
                  self.$message({ type: 'success', message: '操作成功!' });
                  self.initData();
                  self.courseDialogVisible = false;

              }
          });

        }

    }
}
</script>

<style scoped lang="less">
</style>
