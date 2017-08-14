$.fn.lightBox = function(settings)
{
	// 預設
	var DEFAULT_SETTINGS =
	{
		boxName:			"#box",
		lightBoxName:		"#lightbox",
		btnName:			"#closeBtn",
		btnOkName:			undefined,
		backgroundOpacity:	0.8,
		maskClickClose:		true,
		onOpen:				undefined,
		onClose:			undefined,
		onOk:				undefined
	},
	_settings = $.extend(DEFAULT_SETTINGS, settings),
	html = $("html") , 
	body = $("body") , 
	box = $(_settings.boxName) , 
	lightBox = $(_settings.lightBoxName) , 
	lightBoxZ = lightBox.css("z-index") , 
	boxShow = flatBrowser = thinBrowser = boxX = boxY = browserW = browserH = bodyW = bodyH = boxH = scrollTop = lockCheck = scrollbarWidth = 0 , 
	scrollPosition = [],
	lightBoxCID, lightBoxCIDiv;

	// IE6-8
	if( !$.support.leadingWhitespace )
	{
		body = $("html");
	}

	// 當開啟 lightbox 或改變瀏覽器大小時會執行
	var checkSize = function()
	{
		// 記錄目前捲軸位置
		scrollPosition = [self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft , self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop];
		scrollTop = $(window).scrollTop();	// 捲軸的 Y 位置

		// 先隱藏捲軸並判斷 browser、body 的寬高
		if(boxShow==0)
		{
			html.css({"overflow-y": "hidden","overflow-x": "hidden"});
		}

		browserW = $(window).width();		// browser weight
		browserH = $(window).height();		// browser height
		bodyW = $(document).width();		// body width
		bodyH = $("body").height();			// body height
		boxW = box.outerWidth(true);		// box width
		boxH = box.outerHeight(true);		// box height

		if( !$.support.leadingWhitespace )
		{
			bodyW-=4;	// IE6、IE8
		}
		if(boxShow==1)
		{
			lightBox.width(browserW);	// 當瀏覽器寬度小於 box 寬度，lightbox width = browserW
		}

		// 顯示捲軸，並計算捲軸的寬度
		if(boxShow==0)
		{
			html.css({"overflow-y": "scroll","overflow-x": "auto"});
			scrollbarWidth = browserW - $(window).width();
		}
		whenUseFF();

		// z-index 強制為最大
		box.css("z-index", ++lightBoxZ);

		// 判斷 lightbox 的底色高度
		var boxHY = boxH+boxY,height,width;
		if( browserH > bodyH ){height = ( browserH > boxHY ) ? browserH : boxHY;}
		else{height = ( boxHY > bodyH ) ? boxHY : bodyH;}

		// 判斷 lightbox 的底色寬度
		if( browserW < bodyW ){width = ( bodyW > boxW ) ? bodyW : boxW;}
		else{width = ( boxW > browserW ) ? boxW : browserW;}

		lightBox.height(height).width(width);

		// lightbox box 的位置
		browserW < boxW ? boxX = 20 : boxX = (browserW-boxW)/2;
		browserH < boxH ? boxY = scrollTop+20 : boxY = (browserH-boxH)/2 + scrollTop;
		box.css("left",boxX);
		box.css("top",boxY);

		// 判斷瀏覽器是窄高型或扁矮型
		flatBrowser = 0; thinBrowser = 0;
		browserW < (boxW+20) ? flatBrowser=1 : flatBrowser=0 ;
		browserH < (boxH+20) ? thinBrowser=1 : thinBrowser=0 ;

		// 滑鼠游標
		if(_settings.maskClickClose == false)
		{
			lightBox.css("cursor","not-allowed");
		}
		else
		{
			lightBox.css("cursor","default");
		};
	};

	// CSS 控制
	if( 'undefined' == typeof(document.body.style.maxHeight) )
	{
		lightBox.css("position","fixed");	// IE6 can't read fixed
	}

	$("html").css({"overflow-y": "scroll","overflow-x": "auto"});

	if( !$.support.leadingWhitespace )// IE6-8
	{
		$("html").css({"overflow-y": "hidden","overflow-x": "hidden"});
	}

	// 鎖住捲軸
	var lockScroll = function()
	{
		lockCheck = 1;
		html.data({"scroll-position": scrollPosition,"previous-overflow": html.css("overflow")}).css({"overflow-y": "hidden","overflow-x": "hidden"});
		whenUseFF();
		html.css("margin-right",scrollbarWidth);
		box.css("left",boxX);
		lightBox.css("overflow-y","scroll");
		lightBox.css("overflow-x","hidden");
	};

	// 不鎖住捲軸
	var unlockScroll = function()
	{
		var disappearThis = function()
		{
			lockCheck = 0;
			html.css({"overflow": html.data("previous-overflow"),"overflow-y": "scroll","overflow-x": "auto"});
			whenUseFF();
			html.css("margin-right","0");
			box.css("left",boxX);
			lightBox.css("overflow-y","hidden");
			lightBox.css("overflow-x","hidden");
		};
		setTimeout(disappearThis, 250);
	};

	// scroll to current position when use FireFox
	var whenUseFF = function()
	{
		if ( /firefox/.test(navigator.userAgent.toLowerCase()) )
		{
			window.scrollTo(scrollPosition[0], scrollPosition[1]);
		}
	};

	// 當瀏覽器改變大小時
	$(window).resize(function()
	{
		if(boxShow==1)
		{
			checkSize();
			if(thinBrowser == 0 && flatBrowser == 0)
			{
				if(lockCheck == 0)
				{
					lockScroll();// 鎖住捲軸
				}
			}
			else
			{
				if(lockCheck == 1)
				{
					unlockScroll();// 不鎖住捲軸
				}
			}
		};
	});

	// 定義 lightbox 背景的名稱
	lightBoxCID = "LB" + Math.ceil(Math.random()*100);
	lightBoxCIDiv = "." + lightBoxCID;

	// 啟動 lightbox
	var openFunc = function()
	{
		if(_settings.onOpen === undefined || _settings.onOpen(box) !== false )
		{
			checkSize();
			if(thinBrowser == 0 && flatBrowser == 0)
			{
				lockScroll();
			}
			lightBox.fadeTo(250, _settings.backgroundOpacity);
			box.fadeIn(250);
			boxShow=1;
			lightBox.attr("class",lightBoxCID);
		}
	};
	box.data("open",openFunc);

	$(this).on("click", function()
	{
		openFunc();
	});

	// 關閉 lightbox
	var closeDo = function()
	{
		if(thinBrowser == 0 && flatBrowser == 0)
		{
			unlockScroll();
		}
		lightBox.fadeOut(250);
		box.fadeOut(250);
		boxShow=0;
	}

	// 關閉按鈕
	var closeFunc = function()
	{
		if(typeof(scrollPosition[1]) != "undefined")
		{
			if(_settings.onClose === undefined || _settings.onClose(box) !== false)
			{
				closeDo();
			}
		}
	};
	box.data("close",closeFunc);

	// 按下 lightbox 的背景時
	$(document).on("click",lightBoxCIDiv,function(event)
	{
		if(_settings.maskClickClose)
		{
			closeFunc();
		}
	});

	// 按下 box 右上角的 X
	$(document).on("click",_settings.btnName,function(event)
	{
		closeFunc();
	});

	// 按下 box 右上角的 OK 按鈕
	if(typeof _settings.btnOkName == "string")
	{
		$(document).on("click",_settings.btnOkName,function(event)
		{
			if(_settings.onOk === undefined || _settings.onOk(box) !== false)
			{
				closeDo();
			}
		});
	}
};