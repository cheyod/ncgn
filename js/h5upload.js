(function(win,$){
	function NftFile(key,file){
		this[key] = file;
	}

	function h5upload(){
		
	}

	h5upload.prototype.uploadFile = function(url,nftFile,data,success){
		data = $.extend({}, data, nftFile);
		this.ajax({
			url: url,
			data: data,
			success: success
		});
	}

	h5upload.prototype.ajaxFile = function(nftFile,options){
		if(options.data != undefined){
			options.data = $.extend({}, options.data, nftFile);
		}else{
			options.data = nftFile;
		}
		this.ajax(options);
	}

	h5upload.prototype.ajax = function(options){
		var optDef = {
			url: '',
			type: 'post',
			dataType: 'json',
			data: {},
			success: function(json){},
			error: function(msg){},
			complete: function(status,responseText){},
			beforeSend: function(xhr){},
			progress: function(loaded,total){}
		};
		var o = $.extend({}, optDef, options);

		o.type = o.type.toLowerCase();
		o.dataType = o.dataType.toLowerCase();
		if(o.type!='post' && o.type!='get'){
			throw('AjaxFile Error:not surpport the request type.');
		}
		if(o.dataType!='json' && o.dataType!='text'){
			throw('AjaxFile Error:not surpport the data type.');
		}

		var xhr = new XMLHttpRequest();
		var fd = new FormData();
		if(typeof o.data == 'object'){
			for(var i in o.data){
				fd.append(i, o.data[i]);
			}
		}

		xhr.upload.addEventListener("progress", function(evt){
			if(evt.lengthComputable){
				o.progress.call(this, evt.loaded, evt.total);
			}
		}, false);
		xhr.addEventListener("load", function(evt){
			var result;
			o.complete.call(this, evt.target.status, evt.target.responseText);
			if(o.dataType == 'json'){
				try{
					result = $.parseJSON(evt.target.responseText);
				}catch(e){
					o.error.call(this, 'JSON parse error');
				}
			}else{
				result = evt.target.responseText;
			}
			o.success.call(this, result);
		}, false);
		xhr.addEventListener("error", function(evt){
			o.error.call(this, 'request error');
		}, false);
		xhr.addEventListener("abort", function(evt){
			o.error.call(this, 'request abort');
		}, false);
		xhr.open(o.type, o.url, true);
		o.beforeSend.call(this, xhr);
		xhr.send(fd);
	}

	win.h5upload = h5upload;
	win.NftFile = NftFile;

	function empty(){}
	/**jquery plugin*/
	$.fn.h5upload = function(options){
		var $dropDom = $(this);
		var opt = {};
		var defaults = {
			checkFile: empty,
			onInit: empty,
			onDragEnter: empty,
			onDragOver: empty,
			onDragLeave: empty,
			onDrop: empty,
			onSelectFile: empty
		};
		opt = $.extend({}, defaults, options);

		function stopDrag(evt){
			evt.stopPropagation();
			evt.preventDefault();
			return false;
		}

		function single(dropDom){
			this.dropDom = dropDom;
		}
		single.prototype.init = function(){
			var dropDom = this.dropDom;
			var _this = this;

			dropDom.addEventListener("dragenter", function(evt){
				evt.stopPropagation();
				evt.preventDefault();
				opt.onDragEnter.call(_this, dropDom, evt);
			}, false);
			dropDom.addEventListener("dragover", function(evt){
				evt.stopPropagation();
				evt.preventDefault();
				opt.onDragOver.call(_this, dropDom, evt);
			}, false);
			dropDom.addEventListener("dragleave", function(evt){
				evt.stopPropagation();
				evt.preventDefault();
				opt.onDragLeave.call(_this, dropDom, evt);
			}, false);
			dropDom.addEventListener("drop", function(evt){
				evt.stopPropagation();
				evt.preventDefault();
				var file = evt.dataTransfer.files.item(0);
				if(!file){
					return false;
				}
				opt.onSelectFile.call(_this, dropDom, file);
			}, false);

			dropDom.querySelector("input[type='file']").addEventListener("change", function(evt){
				var file = evt.target.files.item(0);
				if(!file){
					return;
				}
				opt.onSelectFile.call(_this, dropDom, file);
			}, false);
			$(document).on("dragenter", stopDrag).on("dragover",stopDrag).on("dragleave",stopDrag).on("drop",stopDrag);

			opt.onInit.call(_this, dropDom);
		}

		/**init*/
		$dropDom.each(function(){
			if(!this.h5upload){
				this.h5upload = new single(this);
			}
			this.h5upload.init();
		});
	}
})(window==undefined ? this : window, jQuery);