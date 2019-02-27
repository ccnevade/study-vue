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
        <el-table :data="studentList" stripe style="width: 100%">
          <el-table-column type="expand">
                <template slot-scope="props">
                  <div style="margin:30px;">
                      <table v-if="props.row.studentCourseList.length>0" class="zefun_table" width='100%'>
                          <tr>
                              <th>序号</th>
                              <th>课程</th>
                              <th>成绩</th>
                              <th>操作</th>
                          </tr>
                          <tr v-for="(item,index) of props.row.studentCourseList">
                              <td>{{index+1}}</td>
                              <td>{{item.courseName}}</td>
                              <td>{{item.achievement}}</td>
                              <td>
                                <el-button  size="mini" type="primary"  @click="editStuAchievement(item.id)">录入成绩</el-button>
                                <el-button  size="mini" type="danger"  @click="delStudentCourse(item.id)">删除</el-button>
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
              </el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column label="性别">
                <template scope="scope">
                    {{scope.row.sex==1?'男':'女'}}
                </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
            <el-table-column prop="account" label="学号"></el-table-column>
            <el-table-column prop="major" label="专业"></el-table-column>
            <el-table-column prop="classroom" label="班级"></el-table-column>
            <el-table-column prop="tuition" label="学费"></el-table-column>

            <el-table-column label="操作" align="center" width="180">
                <template scope="scope">
                    <!-- <el-button size="mini" type="warning" icon="el-icon-edit" @click="edit(scope.$index,scope.row)">编辑</el-button> -->
                    <el-button size="mini" type="danger"  @click="del(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="initData" :current-page.sync="currentPage" :page-size="pageSize" :total="totalData" layout="total, prev, pager, next"></el-pagination>
    </div>

    <el-dialog class="zefun-dialog" :title="editType==-1?'学生添加':'学生编辑'" @keyup.enter.native="editSubmit" :visible.sync="dialogVisible" width="500px">
        <el-form label-position="right" label-width="80px" ref="ruleForm" :model="editObj">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="editObj.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio class="radio" v-model="editObj.sex" :label="1">男</el-radio>
                <el-radio class="radio" v-model="editObj.sex" :label="2">女</el-radio>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model="editObj.age" placeholder="年龄"></el-input>
            </el-form-item>
            <el-form-item label="学号" prop="account">
                <el-input v-model="editObj.account" placeholder="学号"></el-input>
            </el-form-item>
            <el-form-item label="专业" prop="major">
                <el-input v-model="editObj.major" placeholder="专业"></el-input>
            </el-form-item>
            <el-form-item label="班级" prop="classroom">
                <el-input v-model="editObj.classroom" placeholder="班级"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog title="录入成绩" class="dialog" :visible.sync="achimentDialogVisible" width="400px">
      <el-form label-position="right" label-width="80px" ref="ruleForm" >
          <el-form-item label="成绩" prop="achievement">
              <el-input v-model="achievement" placeholder="成绩"></el-input>
          </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="achimentDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEidtStuAchievement">确 定</el-button>
        </div>
    </el-dialog>

</div>
</template>
<script>
export default {
    data() {
        return {
            searchKeyword: '',
            studentStatus: 0,
            studentList: [],

            achimentDialogVisible:false,
            dialogVisible: false,
            editType: -1,
            editObj: {},

            currCourseId:null,
            achievement:null,

            currentPage: 1,
            pageSize: 15,
            totalData: 0,
        }
    },
    computed: {
    },
    created: function() {
        this.initData();
    },
    methods: {
        initData() {
            var self = this;
            var postData = {
                "pageSize": this.pageSize,
                "currPage": this.currentPage
            }
            this.$http.post(self.globalUrl.student.studentPage, JSON.stringify(postData)).then(function(res) {
                if (res.data.code == 200000) {
                    self.studentList = res.data.data.content;
                    self.totalData = res.data.data.totalElements;
                }
            });
        },
        edit(type, data) {
            var self = this;
            this.editType = type;
            this.editObj = {
                name: data.name || '',
                sex: data.sex || 1,
                age: data.age || '',
                account: data.account || '',
                major: data.major || '',
                classroom: data.classroom || '',
                id: data.id || null
            }
            this.dialogVisible = true;
        },
        editSubmit() {
            var self = this;
            if (this.editObj.name == '') {
                self.$message({ showClose: true, message: '请输入学生姓名', type: 'warning' });
                return;
            }
            if (this.editObj.account == '') {
                self.$message({ showClose: true, message: '请输入学号', type: 'warning' });
                return;
            }
            var postData = JSON.parse(JSON.stringify(self.editObj));
            var postUrl = self.globalUrl.student.studentEdit;
            if (this.editType == -1) {
                postUrl = self.globalUrl.student.studentAdd;
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
            this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get(self.globalUrl.student.studentDel + data.id).then(function(res) {
                    if (res.data.code == 200000) {
                        self.initData();
                        self.$message({ type: 'success', message: '删除成功!' });
                    }
                });
            });
        },
        delStudentCourse(id){
            var self = this;
            this.$confirm('此操作将永久删除该学生的课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get(self.globalUrl.student.studentDelCourse + id).then(function(res) {
                    if (res.data.code == 200000) {
                        self.initData();
                        self.$message({ type: 'success', message: '删除成功!' });
                    }
                });
            });
        },
        editStuAchievement(id){
            console.log(id);
            this.currCourseId = id;
            this.achimentDialogVisible = true;

        },
        submitEidtStuAchievement(){
            var self = this;
            this.$http.post(self.globalUrl.student.studentEditAchievement+self.currCourseId+'/'+self.achievement,{}).then(function(res){
              if (res.data.code == 200000) {
                  self.initData();
                  self.$message({ type: 'success', message: '操作成功!' });
                  self.achimentDialogVisible = false;
              }
            });
        }

    }
}
</script>

<style scoped lang="less">
</style>
