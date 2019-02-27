<template>
	<div class="sort-wrapper" @click="sortFun(2)">
		{{title}}
		<span class="sort-content">
			<i class="ascending" :class="{'active':sortType==0}" @click.stop="sortFun(0)"></i>
			<i class="descending" :class="{'active':sortType==1}" @click.stop="sortFun(1)"></i>
		</span>
	</div>
</template>
<script>
    export default {
		data: function () {
          	return {
				sortType:2
		  	}
	    },
        props: {
			title:{
				type    :String,
                default :''
			},
			attr:{
				type    :String,
                default :''
			},
			sortKey:{
				type    :String,
                default :''
			},
        },
		watch:{
			sortKey:function(val){
				if(val != this.attr){
					this.sortType =2;
				}
			}
		},
		created:function(){

		},
        methods: {
			sortFun(type){
				if(type!=2){
					this.sortType = type;
				}else{
					if(this.sortType==2){
						this.sortType = 1;
					}else if(this.sortType==1){
						this.sortType = 0;
					}else if(this.sortType==0){
						this.sortType = 2;
					}
				}
				this.$emit('sortAction',this.sortType,this.attr)
			}
        }
    }
</script>
<style lang="less">
</style>
