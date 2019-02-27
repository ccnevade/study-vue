<template>
	<!-- weui编辑器 -->
	<div class="edit-box">
		<div class="edir-rightbar">
			<div id="forMediaFixed">
				<h4>多媒体</h4>
				<span class="insert_btn" @click="uploadImage">
					<i class="iconfont ifun-image"></i>图片
				</span>
				<span class="insert_btn" @click="uploadVideo">
					<i class="iconfont ifun-video"></i>视频
				</span>
				<input type="file" style="display:none;" id="uploadimgbtnId" @change="uploadimgChange">
			</div>
		</div>
		<div class="weui_editor">
			<!-- weui-UI -->
			<div class="weui_edui_wrap" :class="{'weui_edui_wrap_none':!editorShow}">
				<!-- weui工具栏 -->
				<div class="weui_editor_hd">
					<div class="weui_editor_toolbar_box_wrap" ref="toolbar">
						<weuiToolbar
							:toolStates="toolStates"
							:toolValues="toolValues"
							:imageFloatMask="imageMaskVisible"
							:selectOptions="selectOptions"
							:listVisible="listVisible"
							:maskVisible="toolbarMaskVisible"
							@on-editor-execCommand="execCommand"
							@on-maskvisible-change="onMaskVisibleChange">
						</weuiToolbar>
					</div>
				</div>
				<div class="weui_editor_bd">
					<slot class="weui_editor_extra" name="header"></slot>
					<div class="weui_editor_body">
						<div ref="editor"></div>
					</div>
					<slot class="weui_editor_extra" name="footer"></slot>
				</div>
				<div class="weui_editor_ft"></div>
			</div>
			<slot name="loading" v-if="!editorShow"></slot>
		</div>
	</div>
</template>
<script type="text/ecmascript-6">
	import $ from 'jquery'
	import weuiToolbar from '../Toolbar';
	import './editor.stylus';
	import {selectOptions, ueConfig} from '../ueditor/config';
	import '../ueditor/ueditor.config';
	import '../ueditor/ueditor.all.min';
	import '../ueditor/lang/zh-cn/zh-cn';
	export default {
		name: 'weui-ueditor',
		components: {weuiToolbar},
		props: {
			content: {
				type: String,
				default: ''
			},
			config: {
				type: Object,
				default() {
					return {};
				}
			},
			editorTopOffset: {
				type: String,
				default: '0'
			}
		},
		computed: {
			selectOptions() {
				return Object.assign({}, selectOptions, this.config.selectOptions);
			}
		},
		data() {
			return {
				editorShow:false,
				// 编辑器id
				id: 'weui_edui_' + Math.random(10),
				UE: window.UE || null,
				editor: null,
				_content: '',
				// 工具条状态和数据
				toolStates: {
					// 是否可操作 -1:不可用 0:可用 1:已操作
					undo: -1,
					redo: -1,
					blockquote: 0,
					horizontal: 0,
					removeformat: 0,
					formatmatch: 0,
					bold: 0,
					italic: 0,
					underline: 0,
					indent: 0
				},
				// 子组件的值，必须确保在此注册才能监听动态数据双向绑定
				toolValues: {
					fontsize: '16px',
					forecolor: '',
					backcolor: '',
					justify: '',
					imagefloat: '',
					lineheight: '',
					rowspacingtop: '',
					rowspacingbottom: '',
					insertorderedlist: '',
					insertunorderedlist: ''
				},
				listVisible: !0,
				toolbarMaskVisible: !0,
				imageMaskVisible: !1,

				objTop:0,
			};
		},
		destroyed:function(){
			var scrollObj = $('.content_body')[0];
			if(window.attachEvent){//ff
                   scrollObj.detachEvent("onscroll",this.onScroll,false);
          	}else{//ie
                   scrollObj.removeEventListener("scroll",this.onScroll,false);
          	}
        },
		methods: {
			init() {
				// console.info('<editor-component> inited');
				var self = this;
				setTimeout(() => {
					self.setContent();
					//self.$emit('on-editor-ready');
					self.editorShow = true;
				},0);
				self.objTop = $('.weui_editor').offset().top+$('.content_body').scrollTop()-$('.content_body').offset().top
			},
			setContent(value) {
				this.editor.setContent(value || this.content || this._content || '');
			},
			execCommand(name, value, dir) {
				this.editor.execCommand(name, value, dir);
			},
			onScroll() {
				const H = $('.content_body')[0].scrollTop;
				this.objTop = $('.weui_editor').offset().top+$('.content_body').scrollTop()-$('.content_body').offset().top
				const toolbarboxWrapCss = getComputedStyle(this.toolbar.parentNode, false);
				const toolbarCss = getComputedStyle(this.toolbar, false);
				var mediah = Number(this.editorTopOffset)+10
				try {
					if (H > this.objTop) {
						this.toolbar.parentNode.style.cssText = `height:${toolbarCss.height}`;
						this.toolbar.style.cssText = `top:${this.editorTopOffset}px;position:fixed;width:${toolbarboxWrapCss.width}`;
						document.getElementById('forMediaFixed').style.position = 'fixed';
						document.getElementById('forMediaFixed').style.top = mediah+'px';
					} else {
						this.toolbar.style.cssText = this.toolbar.parentNode.style.cssText = '';
						document.getElementById('forMediaFixed').style.position = '';
						document.getElementById('forMediaFixed').style.top = '';
					}
				} catch (e) {
					console.warn(e);
				}
			},

			uploadImage(){
	            $("#uploadimgbtnId").click();
	        },
	        uploadimgChange(e){
	            var self = this;
	            var formData = new FormData();
	            formData.append('file', e.target.files[0]);
	            this.$http.post(self.globalUrl.imageUpload+'/product',formData).then(function(res){
	                if(res.data.code==200000){
	                    self.editor.execCommand('inserthtml','<p style="text-align:center;"><img style="display:block;margin:auto;max-width:100%;" src='+self.globalUrl.resourceUrl + res.data.data+' /></p>',{});
	                    $("#uploadimgbtnId").val('')
	                }
	            });
	        },
	        uploadVideo(){
				var self = this;
				// iframe元素
				var iframeRe = /iframe/gi;
				this.$prompt('请将(腾讯/优酷/爱奇艺)视频的"通用代码"粘贴在下框', '添加视频', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	inputValidator: function(value){
						if(value.match(iframeRe)){
							return true;
						}else{
							return false;
						}
				  	},
		          	inputErrorMessage: '请粘贴正确的通用代码'
		        }).then(({ value }) => {
					var src = $(value).attr('src');
					var html = '<p style="width:100%;height:0;position:relative;padding-top:70%;"><iframe style="width:100%;height:100%;position:absolute;top:0;left:0;" src='+src+' frameborder=0 "allowfullscreen"></iframe><p></p></br></p>'
					//<iframe height=498 width=510 src='http://player.youku.com/embed/XMzMyNzMyMTAzMg==' frameborder=0 'allowfullscreen'></iframe>

					 self.editor.execCommand('inserthtml',html);
		        })
	        },
			getContent(type, fn) {
				type = type || 'Content';
				return this.editor[`get${type}`](fn);
			},
			/**
			 * 监听ueditor 编辑器内容更改，返回给editor-component
			 * @createdAt 2017-05-15T10:19:22+0800
			 * @author yiwuyu
			 */
			onContentChange() {
				this.editor.addListener('contentChange', function() {
					this._content = this.editor.getContent();
				}.bind(this));
			},
			/**
			 * 监听编辑器光标选取改变，触发对toolbars的遮罩和状态option切换
			 * @createdAt 2017-05-15T10:20:24+0800
			 * @author yiwuyu
			 */
			onSelectionChange() {
				this.editor.addListener('selectionchange', function() {
					const statelist = Object.keys(this.toolStates);
					const valuelist = Object.keys(this.toolValues);

					for (let item of statelist) {
						this.toolStates[item] = this.editor.queryCommandState(item);
					}
					for (let item of valuelist) {
						if (item.indexOf('rowspacing') > -1) {
							// rowspacing的值比较特别
							this.toolValues[item] = this.editor.queryCommandValue('rowspacing', item.replace('rowspacing', ''));
						} else {
							this.toolValues[item] = this.editor.queryCommandValue(item) + '';
						}
					}
					// 图片浮动
					const dom = this.editor.selection.getRange().getClosedNode();
					if (dom && dom.tagName === 'IMG') {
						this.imageMaskVisible = !1;
					} else {
						this.imageMaskVisible = !0;
					}
				}.bind(this));
			},
			bindScrollEvent() {
				var scrollObj = $('.content_body')[0];
				if (window.addEventListener) {
					scrollObj.addEventListener('scroll', this.onScroll, false);
				} else{
					scrollObj.attachEvent('scroll', this.onScroll);
				}
			},
			onFocus() {
				this.editor.addListener('focus', function() {
					this.toolbarMaskVisible = !1;
					this.listVisible = !1;
				}.bind(this));
				this.editor.addListener('blur', function() {
					this.listVisible = !0;
				}.bind(this));
			},
			onMaskVisibleChange(val) {
				this.toolbarMaskVisible = !0;
			}
		},
		mounted() {
			this.toolbar = this.$refs.toolbar;
			this.$nextTick(() => {
				this.$refs.editor.id = this.id;
				this.editor = this.UE.getEditor(this.id, ueConfig);
				this.editor.ready(() => {
					this.init();
					this.onContentChange();
					this.onSelectionChange();
					this.onFocus();
					this.bindScrollEvent();
				});
			});
		}
	};
</script>
