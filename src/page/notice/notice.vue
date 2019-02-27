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
        <el-table :data="noticeList" stripe style="width: 100%">
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="publisher" label="发布者"></el-table-column>
            <el-table-column prop="createTime" label="发布时间"></el-table-column>

            <el-table-column label="操作" align="center" width="180">
                <template scope="scope">
                    <!-- <el-button size="mini" type="warning" icon="el-icon-edit" @click="edit(scope.$index,scope.row)">编辑</el-button> -->
                    <el-button  size="mini" type="danger"  @click="del(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="initData" :current-page.sync="currentPage" :page-size="pageSize" :total="totalData" layout="total, prev, pager, next"></el-pagination>
    </div>

    <el-dialog class="zefun-dialog" :title="editType==-1?'公告添加':'公告编辑'" @keyup.enter.native="editSubmit" :visible.sync="dialogVisible" width="500px">
        <el-form label-position="right" label-width="80px" ref="ruleForm" :model="editObj">
            <el-form-item label="标题" prop="title">
                <el-input v-model="editObj.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <el-input v-model="editObj.content" placeholder="内容"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
    </el-dialog>

</div>
</template>
<script>
export default {
    data() {
        return {
            searchKeyword: '',
            noticeStatus: 0,
            noticeList: [],

            dialogVisible: false,
            editType: -1,
            editObj: {},

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
            this.$http.post(self.globalUrl.notice.noticePage, JSON.stringify(postData)).then(function(res) {
                if (res.data.code == 200000) {
                    self.noticeList = res.data.data.content;
                    self.totalData = res.data.data.totalElements;
                }
            });
        },
        edit(type, data) {
            var self = this;
            this.editType = type;
            this.editObj = {
                title: data.title || '',
                content: data.content || '',
                publisher: data.publisher || self.$store.state.loginName,
                id: data.id || null
            }
            this.dialogVisible = true;
        },
        editSubmit() {
            var self = this;
            if (this.editObj.title == '') {
                self.$message({ showClose: true, message: '请输入标题', type: 'warning' });
                return;
            }
            if (this.editObj.content == '') {
                self.$message({ showClose: true, message: '请输入内容', type: 'warning' });
                return;
            }
            var postData = JSON.parse(JSON.stringify(self.editObj));
            var postUrl = self.globalUrl.notice.noticeEdit;
            if (this.editType == -1) {
                postUrl = self.globalUrl.notice.noticeAdd;
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
            this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get(self.globalUrl.notice.noticeDel + data.id).then(function(res) {
                    if (res.data.code == 200000) {
                        self.initData();
                        self.$message({ type: 'success', message: '删除成功!' });
                    }
                });
            });
        },

    }
}
</script>

<style scoped lang="less">
</style>
