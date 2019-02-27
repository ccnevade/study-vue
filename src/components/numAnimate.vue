<template>
	<span>
		<slot></slot>{{showNum}}
	</span>
</template>
<script>
    export default {
		data: function () {
          	return {
				showNum:0,
		  	}
	    },
        props: {
			number:{
				type    :Number,
                default :0
			}
        },
		watch:{
			number:function(val){
				this.changeFun(val);
			}
		},
		created:function(){
			this.changeFun(this.number)
		},
        methods: {
			changeFun(val){
				var self = this;
				var runNum=0;
				var addNumber = false;
				if(this.showNum>val){
					runNum = this.showNum-val;
					addNumber = false;
				}else{
					runNum = val-this.showNum;
					addNumber = true;
				}
				var spread = Math.round(runNum/50);
				spread = spread==0?1:spread
				self.toChange(addNumber,spread,val)
			},
			toChange(addNumber,spread,val){
				var self = this;
				var roll = setTimeout(function(){
					if(addNumber){
						self.showNum += spread;
						if(self.showNum>=val){
							self.showNum = val;
						}else{
							self.toChange(addNumber,spread,val);
						}
					}else{
						self.showNum -= spread;
						if(self.showNum<=val){
							self.showNum = val;
						}else{
							self.toChange(addNumber,spread,val);
						}
					}
				},10)
			}
        }
    }
</script>
<style lang="less">
</style>
