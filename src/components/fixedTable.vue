<template>
    <div :id="tableId">
        <table class="zefun_table hidetable" :class="{'table-fixed':fixedStatus}" :style="{'top':fixedTop+'px'}">
            <thead>
                <tr v-for="trItem in trData">
                    <th v-for="(thItem,index) in trItem.thArr" :class="thItem.class" :style="{'width':thItem.width+'px'}" :rowspan="thItem.rowspan" :colspan="thItem.colspan" v-html="thItem.text"></th>
                </tr>
            </thead>
        </table>
        <slot></slot>
    </div>
</template>
<script>
    import $ from 'jquery'
    export default {
        data: function () {
            return {
                fixedStatus  :false,
                trData       :[],
                updateStatus :true,
                objTop       :0,
            }
        },
        props: {
            fixedTop:{
				type    : Number,
				default : 0
			},
            tableId   : '',
            scrollObj : '',

            sortChange:{
                type : String,
				default: ''
            }
        },
        created:function(){
            var self = this;
            setTimeout(function(){
                self.objTop = $("#"+self.tableId+" .objtable").offset().top+$("#"+self.scrollObj).scrollTop()-$("#"+self.scrollObj).offset().top
                $("#"+self.scrollObj).on('scroll',function(){
                    self.bindScroll();
                });
                $(window).bind('resize',function(){
                    self.updateTable();
                })
                $('#'+self.tableId+' .hidetable').on('click','div',function(obj){
                    var index = $(this).parent().index()
                    $("#"+self.tableId+" .objtable th:eq("+index+") div").click();
                    $("#"+self.scrollObj).scrollTop(20);
                })
            },0)
        },
        updated:function(){
            var self = this;
            if(self.updateStatus && self.fixedStatus){
                setTimeout(function(){
                    self.updateStatus = false;
                    self.updateTable();
                },0)
            }
        },
        destroyed:function(){
            $("#"+this.scrollObj).off('scroll');
            $('#'+this.tableId+' .hidetable').off('click');
            $(window).unbind('resizeEnd')
        },
        methods: {
            bindScroll(){
                var self = this;
                var scrollTop = $("#"+self.scrollObj).scrollTop();
                if(scrollTop > self.objTop){
                    if(!self.fixedStatus){
                        self.updateTable(1);
                    }
                    self.fixedStatus = true;
                }else{
                    self.fixedStatus = false;
                }
            },
            updateTable:function(type){
                var self = this;
                var array = [];

                $("#"+self.tableId+" .objtable > thead:eq(0) tr").each(function(index,item){
                    var arr = {
                        thArr : []
                    }
                    $(this).find('th').each(function(subIndex){
                        arr.thArr.push({
                            text    : $(this).html(),
                            class   : $(this).attr('class'),
                            width   : $(this).width(),
                            rowspan : $(this).attr('rowspan') || 1,
                            colspan : $(this).attr('colspan') || 1
                        })
                    })
                    array.push(arr)
                })

                self.trData = array;
                self.objTop = $("#"+self.tableId+" .objtable").offset().top+$("#"+self.scrollObj).scrollTop()-$("#"+self.scrollObj).offset().top;
                if(!type){
                    self.bindScroll();
                }
            }
        }
    }
</script>
<style lang="less">
    .hidetable{
        display: none;
        width: inherit!important;
    }
    .table-fixed{
        display: block;
        position :fixed!important;
        z-index  :200!important;
        top      :0;
    }
</style>
