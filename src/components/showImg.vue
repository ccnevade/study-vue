<template>
	<div class="seeImg" @click="close" v-if="value">
		<i class="iconfont ifun-left" @click.stop="changeImg(0)" :class="{'disabled':showIndex==0}"></i>
		<i class="iconfont ifun-right" @click.stop="changeImg(1)" :class="{'disabled':showIndex==showImgArray.length-1}"></i>
		<i class="el-icon-close"></i>
		<img :src="showImgUrl" alt="" @click.stop>
		<input type="text" :value="value" style='display:none;'>
	</div>
</template>
<script>
    export default {
		data: function () {
          	return {
				showImgUrl:'',
		  	}
	    },
        props: {
			value: {
                type    :Boolean,
                default :false
            },
			showImgArray:{
				type    :Array,
                default :[]
			},
			showIndex:{
				type    :Number,
                default :0
			}
        },
		watch:{
			value:function(val){
				if(val){
					this.showImgUrl = this.globalUrl.resourceUrl+this.showImgArray[this.showIndex];
				}
			}
		},
		created:function(){

		},
        methods: {
			changeImg(type){
	            var len = this.showImgArray.length-1;
	            if(type==0){
	                if(this.showIndex==0){
	                    return;
	                }
	                this.showIndex--;
	            }else{
	                if(this.showIndex==len){
	                    return;
	                }
	                this.showIndex++;
	            }
	            this.showImgUrl = this.globalUrl.resourceUrl+this.showImgArray[this.showIndex];
	        },
			close(){
				this.showIndex=0;
				this.$emit('input', false);
			}
        }
    }
</script>
<style lang="less">
.seeImg{
    position         :fixed;
    z-index          :99999;
    width            :100%;
    height           :100%;
    box-sizing       :border-box;
    padding          :0 40px;
    background-color :rgba(0,0,0,0.5);
    top              :0;
    left             :0;
    &>i{
        position: absolute;
        display: block;
        height: 60px;
        width: 40px;
        color: #fff;
        font-size: 48px;
        text-align: center;
        line-height: 60px;
        top:50%;
        margin-top: -30px;
        cursor: pointer;
        z-index: 1001;
        &:hover{
            color: #f90;
        }
    }
    &>i.ifun-left{
        left:0;
    }
    &>i.ifun-right{
        right:0;
    }
    &>i.disabled{
        cursor:not-allowed;
        opacity: 0.3;
        color: #fff;
    }
    &>i.el-icon-close{
        top         :10px;
        right       :10px;
        font-size   :32px;
        margin-top  :0;
        height      :32px;
        line-height :32px;
        width       :32px;
    }
    &>img{
        position   :absolute;
        top        :0;
        bottom     :0;
        left       :0;
        right      :0;
        margin     :auto;
        max-width  :100%;
        max-height :100%;
        z-index    :1000;
    }
}
</style>
