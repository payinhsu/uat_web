
/* jQuery */

$(function(){

	$( "#portal #js_date_to" ).datepicker(
	{
		dateFormat: "yy-mm-dd",
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 2,
		onClose: function( selectedDate )
		{
			$( "#js_date_from" ).datepicker( "option", "maxDate", selectedDate );
		}
	});

	// 訂單列表中，點擊被服務這名字，則會 lightbox 出現個人資料

	$(".js_open_person_info").lightBox({
		boxName: "#personInfo" , 
		btnName: "#personInfo .closeBtn, #personInfo .btn_cancel" , 
		btnOkName: "#personInfo .btn_submit",
		lightBoxName: "#lightbox"
	})

	// 在所有的 datepicker 中
	// 選擇日期的公用程式

	$( "#portal .box .js_edit_date" ).datepicker(
	{
		dateFormat: "yy-mm-dd",
		defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 2
	});

	// 所有開啟的 lightbox 中，按下右上角的關閉按鈕
	// 會出現是否關閉的提示

	function checkClose(idName)
	{
		flag = confirm("資料尚未儲存，確認要關閉？");
		if(flag == false)
		{
			return false;
		}
		else
		{
			$("#portal").animate({scrollTop: $(idName).offset().top-110}, 500);
		}
	};

	// 清單中，tr mouseover 會加上底色

	$('#portal .listTB table tr').hover(function()
	{
		$(this).addClass('hover');
	}, function()
	{
		$(this).removeClass('hover');
	});




















	// ==========================================================================================
	// ==========================================================================================
	// ==========================================================================================
	// ==========================================================================================


	// lightbox : 編輯照顧服務

	$("#portal #js_openLightBox_box1").lightBox({
		boxName: "#box1" , 
		btnName: "#box1 .closeBtn, #box1 .btn_cancel" , 
		btnOkName: "#box1 .btn_submit",
		lightBoxName: "#lightbox",
		maskClickClose: false,
		onClose:function()
		{
			return checkClose("#js_openLightBox_box1");
		} ,
		onOk:function()
		{
			$("body").animate({scrollTop: $("#js_openLightBox_box1").offset().top-110}, 500);
		}
	})

	// lightbox : 編輯餐食服務

	$("#portal #js_openLightBox_box2").click(function()
	{
		$("#box2.box_popup .listBox .list1").removeClass("hidden").addClass("show");
		$("#box2.box_popup .listBox .list2").removeClass("show").addClass("hidden");
		$("#box2.box_popup .listBox .submenu .m1").removeClass("off").addClass("on");
		$("#box2.box_popup .listBox .submenu .m2").removeClass("on").addClass("off");
	}).lightBox({
		boxName: "#box2" , 
		btnName: "#box2 .closeBtn, #box2 .btn_cancel" , 
		btnOkName: "#box2 .btn_submit",
		lightBoxName: "#lightbox",
		maskClickClose: false,
		onClose:function()
		{
			return checkClose("#js_openLightBox_box2");
		} ,
		onOk:function()
		{
			$("body").animate({scrollTop: $("#js_openLightBox_box2").offset().top-110}, 500);
		}
	});

	// lightbox : 編輯隨行服務

	$("#portal #js_openLightBox_box3").lightBox({
		boxName: "#box3" , 
		btnName: "#box3 .closeBtn, #box3 .btn_cancel" , 
		btnOkName: "#box3 .btn_submit",
		lightBoxName: "#lightbox",
		maskClickClose: false,
		onClose:function()
		{
			return checkClose("#js_openLightBox_box3");
		} ,
		onOk:function()
		{
			$("body").animate({scrollTop: $("#js_openLightBox_box3").offset().top-110}, 500);
		}
	});

	// lightbox : 編輯家事服務

	$("#portal #js_openLightBox_box4").lightBox({
		boxName: "#box4" , 
		btnName: "#box4 .closeBtn, #box4 .btn_cancel" , 
		btnOkName: "#box4 .btn_submit",
		lightBoxName: "#lightbox",
		maskClickClose: false,
		onClose:function()
		{
			return checkClose("#js_openLightBox_box4");
		} ,
		onOk:function()
		{
			$("body").animate({scrollTop: $("#js_openLightBox_box4").offset().top-110}, 500);
		}
	});





















	// ==========================================================================================
	// ==========================================================================================
	// ==========================================================================================
	// ==========================================================================================



	// lightbox : 選擇照顧服務提供者

	var provider_id_name;
	$("#portal #js_openLightBox_provider1 , #portal #js_openLightBox_provider3 , #portal #js_openLightBox_provider4").click(function()
	{
		provider_id_name = "#" + $(this).attr("id");
		//console.log( provider_id_name );
		$("#portal .box_popup.provider .listBox .list1").removeClass("hidden").addClass("show");
		$("#portal .box_popup.provider .listBox .list2").removeClass("show").addClass("hidden");
		$("#portal .box_popup.provider .listBox .submenu .m1").removeClass("off").addClass("on");
		$("#portal .box_popup.provider .listBox .submenu .m2").removeClass("on").addClass("off");
		//
		$("#provider .frame .listBox .serviceTTL").text( $(this).attr("name") );
	}).lightBox({
		boxName: "#provider" , 
		btnName: "#provider .closeBtn, #provider .btn_cancel" , 
		btnOkName: "#provider .btn_submit",
		lightBoxName: "#lightbox",
		maskClickClose: false,
		onClose:function()
		{
			return checkClose( provider_id_name );
		} ,
		onOk:function()
		{
			$("body").animate({scrollTop: $( provider_id_name ).offset().top-110}, 500);
		}
	});


	// 選擇照顧服務提供者 :: 選擇「機構」

	$("#portal .box_popup.provider .listBox .submenu .m1").click(function()
	{
		if( $("#portal .box_popup.provider .list1").hasClass("hidden") )
		{
			$("#portal .box_popup.provider .listBox .list1").removeClass("hidden").addClass("show");
			$("#portal .box_popup.provider .listBox .list2").removeClass("show").addClass("hidden");
			$(this).removeClass("off").addClass("on");
			$("#portal .box_popup.provider .listBox .submenu .m2").removeClass("on").addClass("off");
		}
	});

	// 選擇照顧服務提供者 :: 選擇「素人」

	$("#portal .box_popup.provider .listBox .submenu .m2").click(function()
	{
		if( $("#portal .box_popup.provider .list2").hasClass("hidden") )
		{
			$("#portal .box_popup.provider .listBox .list1").removeClass("show").addClass("hidden");
			$("#portal .box_popup.provider .listBox .list2").removeClass("hidden").addClass("show");
			$(this).removeClass("off").addClass("on");
			$("#portal .box_popup.provider .listBox .submenu .m1").removeClass("on").addClass("off");
		}
	});

	// 選擇照顧服務提供者 :: 開啟「素人詳細資料」

	$("#portal .box_popup.provider .js_openPersonInfo").click(function()
	{
		$("#portal .box_popup.provider .listBox").css({"display":"none"});
		$("#portal .box_popup.provider .personInfo").show(250).removeClass("hidden");
		$("#portal #provider1 .closeBtn").css({"display":"none"});
		//
		$("#portal .box_popup.provider .personInfo .detail1").css({"display":"block"});
		$("#portal .box_popup.provider .personInfo .detail2").css({"display":"none"});
		$("#portal .box_popup.provider .personInfo .submenu .m1").removeClass("off").addClass("on");
		$("#portal .box_popup.provider .personInfo .submenu .m2").removeClass("on").addClass("off");
	});

	// 選擇照顧服務提供者 :: 關閉「素人詳細資料」

	$("#portal .box_popup.provider .personInfo .buttons .btn_close").click(function()
	{
		$("#portal .box_popup.provider .listBox").show(250);
		$("#portal .box_popup.provider .personInfo").css({"display":"none"});
		$("#portal #provider1 .closeBtn").css({"display":"block"});
	});

	// 選擇照顧服務提供者 :: 選擇「詳細服務內容」

	$("#portal .box_popup.provider .personInfo .submenu .m1").click(function()
	{
		if( $("#portal .personInfo .detail1").hasClass("hidden") )
		{
			$("#portal .box_popup.provider .personInfo .detail1").removeClass("hidden").addClass("show");
			$("#portal .box_popup.provider .personInfo .detail2").removeClass("show").addClass("hidden");
			$(this).removeClass("off").addClass("on");
			$("#portal .box_popup.provider .personInfo .submenu .m2").removeClass("on").addClass("off");
		}
	});

	// 選擇照顧服務提供者 :: 選擇「認證/課程資料」

	$("#portal .box_popup.provider .personInfo .submenu .m2").click(function()
	{
		if( $("#portal .personInfo .detail2").hasClass("hidden") )
		{
			$("#portal .box_popup.provider .personInfo .detail2").removeClass("hidden").addClass("show");
			$("#portal .box_popup.provider .personInfo .detail1").removeClass("show").addClass("hidden");
			$(this).removeClass("off").addClass("on");
			$("#portal .box_popup.provider .personInfo .submenu .m1").removeClass("on").addClass("off");
		}
	});
























	// ==========================================================================================
	// ==========================================================================================
	// ==========================================================================================
	// ==========================================================================================

	// 編輯餐食服務 :: 選擇「機構」

	$("#portal #box2.box_popup .listBox .submenu .m1").click(function()
	{
		if( $("#box2.box_popup .listBox .list1").hasClass("hidden") )
		{
			$("#portal #box2.box_popup .listBox .list1").removeClass("hidden").addClass("show");
			$("#portal #box2.box_popup .listBox .list2").removeClass("show").addClass("hidden");
			$(this).removeClass("off").addClass("on");
			$("#portal #box2.box_popup .listBox .submenu .m2").removeClass("on").addClass("off");
		}
	});

	// 編輯餐食服務 :: 選擇「素人」

	$("#portal #box2.box_popup .listBox .submenu .m2").click(function()
	{
		if( $("#box2.box_popup .listBox .list2").hasClass("hidden") )
		{
			$("#portal #box2.box_popup .listBox .list2").removeClass("hidden").addClass("show");
			$("#portal #box2.box_popup .listBox .list1").removeClass("show").addClass("hidden");
			$(this).removeClass("off").addClass("on");
			$("#portal #box2.box_popup .listBox .submenu .m1").removeClass("on").addClass("off");
		}
	});

	// 編輯餐食服務 :: 改變餐食數量

	function checkCostFunc()
	{
		var nowNum = nowCost = nowTotalNum = nowTotalCost = 0;
		$("#box2.box_popup .provider_list li").each(function()
		{
			nowNum = parseInt( $(this).find(".quantity").attr("value") );
			nowCost = parseInt( $(this).find(".quantity").attr("cost") );
			nowTotalNum += nowNum;
			nowTotalCost += (nowNum * nowCost);
			//console.log("nowNum = " + nowNum);
			//console.log("nowCost = " + nowCost);
			//console.log("nowTotalNum = " + nowTotalNum);
			//console.log("nowTotalCost = " + nowTotalCost);
			//console.log("====================");
			//
			$("#portal #box2.box_popup .list1 .total .num").text( nowTotalNum  );
			$("#portal #box2.box_popup .list1 .total .cost").text( nowTotalCost );
		});
	}

	$("#portal #box2.box_popup .provider_list .plus").click(function()
	{
		var thisNum = $(this).prev("input").attr("value");
		thisNum++;
		$(this).prev("input").attr("value",thisNum);
		//
		var thisCheckBox = $(this).parent().find("input[type=checkbox]");
		if( thisCheckBox.prop("checked") == false )
		{
			thisCheckBox.attr("checked",true);
			thisCheckBox.prop("checked",true);
		}
		//
		checkCostFunc();
	});

	$("#portal #box2.box_popup .provider_list .decrease").click(function()
	{
		var thisNum = $(this).next("input").attr("value");
		if( thisNum != 0 )
		{
			thisNum--;
			$(this).next("input").attr("value",thisNum);
			//
			if( thisNum == 0 )
			{
				var thisCheckBox = $(this).parent().find("input[type=checkbox]");
				thisCheckBox.attr("checked",false);
				thisCheckBox.prop("checked",false);
			}
			//
			checkCostFunc();
		}
	});

	// 編輯餐食服務 :: 開啟「素人詳細資料」

	$("#portal #box2.box_popup .js_openPersonInfo").click(function()
	{
		$("#portal #box2.box_popup .listBox").css({"display":"none"});
		$("#portal #box2.box_popup .personInfo").show(250).removeClass("hidden");
		$("#portal #box2.box_popup .closeBtn").css({"display":"none"});
		//
		$("#portal #box2.box_popup .personInfo .detail1").removeClass("hidden").addClass("show");
		$("#portal #box2.box_popup .personInfo .detail2").removeClass("show").addClass("hidden");
		$("#portal #box2.box_popup .personInfo .submenu .m1").removeClass("off").addClass("on");
		$("#portal #box2.box_popup .personInfo .submenu .m2").removeClass("on").addClass("off");
	});

	// 編輯餐食服務 :: 關閉「素人詳細資料」

	$("#portal #box2.box_popup .personInfo .buttons .btn_close").click(function()
	{
		$("#portal #box2.box_popup .listBox").show(250);
		$("#portal #box2.box_popup .personInfo").css({"display":"none"});
		$("#portal #box2.box_popup .closeBtn").css({"display":"block"});
	});

	// 編輯餐食服務 :: 選擇「詳細服務內容」

	$("#portal #box2.box_popup .personInfo .submenu .m1").click(function()
	{
		if( $("#portal #box2.box_popup .personInfo .detail1").hasClass("hidden") )
		{
			$("#portal #box2.box_popup .personInfo .detail1").removeClass("hidden").addClass("show");
			$("#portal #box2.box_popup .personInfo .detail2").removeClass("show").addClass("hidden");
			$(this).removeClass("off").addClass("on");
			$("#portal #box2.box_popup .personInfo .submenu .m2").removeClass("on").addClass("off");
		}
	});

	// 編輯餐食服務 :: 選擇「認證/課程資料」

	$("#portal #box2.box_popup .personInfo .submenu .m2").click(function()
	{
		if( $("#portal #box2.box_popup .personInfo .detail2").hasClass("hidden") )
		{
			$("#portal #box2.box_popup .personInfo .detail2").removeClass("hidden").addClass("show");
			$("#portal #box2.box_popup .personInfo .detail1").removeClass("show").addClass("hidden");
			$(this).removeClass("off").addClass("on");
			$("#portal #box2.box_popup .personInfo .submenu .m1").removeClass("on").addClass("off");
		}
	});




















	// ==========================================================================================
	// ==========================================================================================
	// ==========================================================================================
	// ==========================================================================================


	// 編輯家事服務 :: 改變清潔數量

	$("#portal #box4.box_popup .provider_list .plus").click(function()
	{
		var thisNum = $(this).prev("input").attr("value");
		thisNum++;
		$(this).prev("input").attr("value",thisNum);
		//
		var thisCheckBox = $(this).parent().find("input[type=checkbox]");
		if( thisCheckBox.prop("checked") == false )
		{
			thisCheckBox.attr("checked",true);
			thisCheckBox.prop("checked",true);
		}
	});

	$("#portal #box4.box_popup .provider_list .decrease").click(function()
	{
		var thisNum = $(this).next("input").attr("value");
		if( thisNum != 0 )
		{
			thisNum--;
			$(this).next("input").attr("value",thisNum);
			//
			if( thisNum == 0 )
			{
				var thisCheckBox = $(this).parent().find("input[type=checkbox]");
				thisCheckBox.attr("checked",false);
				thisCheckBox.prop("checked",false);
			}
		}
	});


});
