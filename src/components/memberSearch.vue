<template>
	<div @keyup="keybordFun">
		<el-popover
			ref="goodsSearchPop"
			placement="bottom-start"
			v-model = "searchStatus"
			width="800"
			trigger="manual">
			<el-table ref="memberTableList" :data="memberData" border @row-click="chooseMember" :empty-text="searchMmberValue==''?'请输入手机号/姓名/卡号/关键词搜索':'未搜索到会员'" highlight-current-row max-height="240">
				<el-table-column property="name" label="姓名"></el-table-column>
				<el-table-column property="address" label="手机号"></el-table-column>
				<el-table-column property="address" label="卡号"></el-table-column>
				<el-table-column property="address" label="卡型"></el-table-column>
				<el-table-column property="address" label="余额"></el-table-column>
				<el-table-column property="address" label="礼金"></el-table-column>
				<el-table-column property="address" label="欠款"></el-table-column>
				<el-table-column property="address" label="门店" with="150"></el-table-column>
			</el-table>
		</el-popover>
		<el-input :style="'width:'+width" placeholder="手机号/姓名/卡号" ref="inputObj" :size="size" v-model="searchMmberValue" @change="changeFun" @click.stop.native v-popover:goodsSearchPop>
			<el-button slot="append" size="small" icon="el-icon-search" @click.stop="open"></el-button>
		</el-input>
	</div>
</template>
<script>
	import $ from 'jquery'
    export default {
		data: function () {
          	return {
				searchStatus     : false,                                                                                //是否显示搜索结果浮动窗
				searchMmberValue : '',
				memberData       : [{name:'测试名1',address:'测试1'},{name:'测试名2',address:'测试2'},{name:'测试名3',address:'测试3'}],
				selectIndex      : -1,
				timerFun         : null,
				canSearch        : true,
		  	}
	    },
        props: {
			width:{
				type:String,
				default:'100%'
			},
			size:{
				type:String,
				default:'-'
			},
			resetStatus:{
				type:Boolean,
				default:true,
			}
        },
		watch:{
			selectIndex:function(val){
				this.$refs.memberTableList.setCurrentRow(this.memberData[val]);
			},
			resetStatus:function(val){
				if(val){
					this.searchMmberValue = '';
				}
			},
		},
		created:function(){
			//866451295726752318
		},
        methods: {
			changeFun(){
				var self = this;
				window.clearTimeout(self.timerFun);
				if(this.searchMmberValue.length>0){
					this.timerFun = setTimeout(function(){
					   self.open();
				   },500)
			   }else{
				   self.goodsData = [];
			   }
			},
			open(){
				var self = this;
				this.searchStatus = true;
				// if(this.searchMmberValue.length>0){
				// 	this.$http.get(self.globalUrl.findGoods+this.searchMmberValue).then(function(res){
				// 		if(res.data.status==20000){
				// 			self.memberData = res.data.data;
				// 			self.selectIndex  = -1;
				// 			self.searchStatus = true;
				// 			if(self.searchMmberValue.length>10 && res.data.data.length==1){
				// 				self.chooseMember(res.data.data[0]);
				// 			}else{
				// 				self.$nextTick(function(){
				// 					self.selectIndex  = 0;
				// 				})
				// 			}
				// 		}else{
				// 			self.searchStatus = true;
				// 			self.memberData = [];
				// 		}
				//
				// 	})
				// }
				$('body').on('click',function(){
					 self.searchStatus = false;
				})
			},
			chooseMember(row){
				var self = this;
				this.searchMmberValue = row.customCode;
				this.searchStatus     = false;
				this.$emit('goodsChoose',row);
				this.memberData = [];
			},
			keybordFun(event){
				var self = this;
				var len  = this.memberData.length-1;
				if(event.keyCode==13){	//	enter
					if(this.searchMmberValue==''){
						this.$message({type:'warning',message:'请输入搜索值!',showClose :true});
					}
					if(len>=0){
						this.chooseMember(this.memberData[this.selectIndex]);
					}
					return;
				}
				if(event.keyCode==40){	//	下
					if(this.selectIndex==len){
						this.selectIndex=0;
					}else{
						this.selectIndex++;
					}
					return;
				}
				if(event.keyCode==38){	//	上
					var max_Len=this.searchMmberValue.length;
					this.$refs.inputObj.$refs.input.setSelectionRange(max_Len,max_Len);
					if(this.selectIndex==0){
						this.selectIndex=len;
					}else{
						this.selectIndex--;
					}
					return;
				}
				console.log(this.selectIndex)
			}
        }
    }
</script>
<style lang="less">

</style>
