/************************
 * 分享组件，依赖 jQuery
 ************************/
(function($){

	//支持7个分享
	var shareTarget = {
		reg:/\!\!([a-z]+)\!\!/g,
		data:{
			'weibo':'http://service.weibo.com/share/share.php?url=!!url!!&appkey=&title=!!title!!!!text!!&pic=!!pic!!&language=zh_cn&searchPic=false',
			'tweibo':'http://share.v.t.qq.com/index.php?c=share&a=index&title=!!title!!!!text!!&url=!!url!!&pic=!!pic!!&searchPic=false',
			'douban':'http://shuo.douban.com/%21service/share?image=!!pic!!&href=!!url!!&name=!!title!!&text=!!text!!&searchPic=false',
			'qzone':'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=!!url!!&title=!!title!!&pics=!!pic!!&summary=!!text!!&searchPic=false',
			'renren':'http://widget.renren.com/dialog/share?resourceUrl=!!url!!&srcUrl=!!url!!&title=!!title!!&pic=!!pic!!&description=!!text!!&searchPic=false',
			'qq':'http://connect.qq.com/widget/shareqq/index.html?url=!!url!!&showcount=0&desc=!!text!!&summary=!!text!!&title=!!title!!&pics=!!pic!!&shareback=qq&searchPic=false'
		}
	};


	function addClickListener(wrap, options){
		var selector = options.selector;

		wrap.on('click', selector.btn, function(e){
			e.preventDefault();
			var me = $(this),
				type = me.data('share'),
				url = shareTarget.data[type];

			if(typeof options.before === 'function'){
				options.content = $.extend(options.content, options.before(type));
			}

			if(type == 'weixin'){
				e.stopPropagation();

				var qrcode = 'http://open.onebox.haosou.com/dataApi/qrCode?src=onebox&size=' + options.wxQrCodeSize + '&level=l&margin=0&url=' + encodeURIComponent(options.content.url);
				var qrcodeWidth = 25 * options.wxQrCodeSize;
				wrap.find(selector.wxWrap)
					.find(selector.wxQrCode).html('<img src="' + qrcode + '" width="' + qrcodeWidth + '" height="' + qrcodeWidth + '" />')
					.end().show();

			}else{
				var newurl = url.replace(shareTarget.reg,function(str,s){
					switch(s){
						case 'url':

							//hack：在好搜的https下，url会被删掉开头的"http:"，此时qq空间的分享会失效。为了兼容此种情况，故此处把它再次补全
							if(/^\/\//.test(options.content.url)){
								options.content.url = 'http:' + options.content.url;
							}

							return encodeURIComponent(options.content.url || location.href+(location.href.indexOf('?')==-1?'?shareback=' : '&shareback=')+type);
						case 'title':
							return encodeURIComponent(options.content.title || '');
						case 'pic':
							return encodeURIComponent(options.content.pic || '');
						case 'text':
							return encodeURIComponent(options.content.text || '');
					}
				});

				window.open(newurl);
			}
		})
		.on('click', selector.wxWrap+' '+selector.wxClose, function(e){
			e.preventDefault();
			wrap.find(selector.wxWrap).hide();
		})
		.on('click', selector.wxWrap, function(e){
			e.stopPropagation();
		});

		$(document).click(function(e){
			wrap.find(selector.wxWrap).hide();
		});
	}


	$.fn.obShare = function(opt){
		var options = {
			content: {
				title: '标题',
				text: '内容',
				url: '',
				pic: ''
			},
			before: null,//分享前，修改content属性的回调函数
			selector: {
				btn: '.mh-share',
				wxWrap: '.mh-weixin-wrap',
				wxQrCode: '.mh-qrCode',
				wxClose: '.mh-close'
			},
			wxQrCodeSize: 3//微信二维码图片的大小，单位"倍"，1倍=25*25
		};

		options = $.extend(options, opt);

		//由于此处只绑定事件，故没用隐式迭代
		addClickListener(this, options);//this代表jQuery对象，是个数组

		return this;
	};

})(jQuery);