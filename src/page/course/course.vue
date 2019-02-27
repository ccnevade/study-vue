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
        <el-table :data="courseList" stripe style="width: 100%">
          <el-table-column type="expand">
                <template slot-scope="props">
                  <div style="margin:30px;">
                      <table v-if="props.row.courseFilesList.length>0" class="zefun_table" width='100%'>
                          <tr>
                              <th>序号</th>
                              <th>文件名</th>
                              <th>上传时间</th>
                              <th>操作</th>
                          </tr>
                          <tr v-for="(item,index) of props.row.courseFilesList">
                              <td>{{index+1}}</td>
                              <td>{{item.fileName}}</td>
                              <td>{{item.createTime}}</td>
                              <td>
                                <!-- <el-button  size="mini" type="primary"  @click="window.location.href=item.fileUri">打开</el-button> -->
                                <el-button  size="mini" type="danger"  @click="delCourseFile(item.id)">删除</el-button>
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

            <el-table-column prop="name" label="课程名"></el-table-column>
            <el-table-column prop="introduction" label="介绍"></el-table-column>
            <el-table-column prop="fee" label="费用"></el-table-column>

            <el-table-column label="操作" align="center" width="180">
                <template scope="scope">
                    <el-button size="mini" type="warning"  @click="addCourseFile(scope.row.id)">上传课件</el-button>
                    <el-button  size="mini" type="danger"  @click="del(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="initData" :current-page.sync="currentPage" :page-size="pageSize" :total="totalData" layout="total, prev, pager, next"></el-pagination>
    </div>

    <el-dialog class="zefun-dialog" :title="editType==-1?'课程添加':'课程编辑'" @keyup.enter.native="editSubmit" :visible.sync="dialogVisible" width="500px">
        <el-form label-position="right" label-width="80px" ref="ruleForm" :model="editObj">
            <el-form-item label="课程名" prop="name">
                <el-input v-model="editObj.name" placeholder="课程名"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="introduction">
                <el-input v-model="editObj.introduction" placeholder="介绍"></el-input>
            </el-form-item>
            <el-form-item label="费用" prop="fee">
                <el-input v-model="editObj.fee" placeholder="费用"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog class="zefun-dialog" title="上传课件" @keyup.enter.native="editSubmit" :visible.sync="uploadDialogVisible" width="500px">
        <el-form label-position="right" label-width="80px" ref="ruleForm" :model="courseFileObj">
            <el-form-item label="课件名" prop="fileName">
                <el-input v-model="courseFileObj.fileName" placeholder="课件名"></el-input>
            </el-form-item>
            <el-form-item label="选择文件">
                <el-upload class="avatar-uploader" :action="globalUrl.course.courseFilesUpload"  :show-file-list="true" :on-success="handleAvatarSuccessImg" :before-upload="beforeAvatarUpload">
                    <i  class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="uploadDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCourseFile">确 定</el-button>
        </div>
    </el-dialog>

</div>
</template>
<script>
export default {
    data() {
        return {
            searchKeyword: '',
            courseStatus: 0,
            courseList: [],

            dialogVisible: false,
            uploadDialogVisible: false,
            editType: -1,
            editObj: {},

            currentPage: 1,
            pageSize: 15,
            totalData: 0,

            fileList: [],

            courseFileObj:{
              courseId:null,
              fileName:'',
              fileUri:''
            }
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
            this.$http.post(self.globalUrl.course.coursePage, JSON.stringify(postData)).then(function(res) {
                if (res.data.code == 200000) {
                    self.courseList = res.data.data.content;
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
            var postUrl = self.globalUrl.course.courseEdit;
            if (this.editType == -1) {
                postUrl = self.globalUrl.course.courseAdd;
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
                this.$http.get(self.globalUrl.course.courseDel + data.id).then(function(res) {
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
                this.courseFileObj.fileUri=res.data;
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
        addCourseFile(cId){
          var self = this;
          this.courseFileObj.courseId = cId;
          this.uploadDialogVisible = true;
        },
        submitCourseFile(){
          var self = this;
          this.$http.post(self.globalUrl.course.courseFilesAdd,JSON.stringify(self.courseFileObj)).then(function(res) {
              if (res.data.code == 200000) {
                  self.$message({ type: 'success', message: '上传成功!' });
                  self.initData();
                  this.uploadDialogVisible = false;
              }
          });
        },
        delCourseFile(id){
          var self = this;
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.$http.get(self.globalUrl.course.courseFilesDel + id).then(function(res) {
                  if (res.data.code == 200000) {
                      self.initData();
                      self.$message({ type: 'success', message: '删除成功!' });
                  }
              });
          });
        }

    }
}
</script>

<style scoped lang="less">
</style>
