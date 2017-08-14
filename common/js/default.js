
/* JS */

// 底下是檢查是否使用 IE9 以下的瀏覽器
// 若是使用 IE9 以下，則彈出警告訊息

if(navigator.appName.indexOf("Internet Explorer")!=-1){     //yeah, he's using IE
	var badBrowser=(
		navigator.appVersion.indexOf("MSIE 9")==-1 &&   //v9 is ok
		navigator.appVersion.indexOf("MSIE 1")==-1  //v10, 11, 12, etc. is fine too
	);

	if(badBrowser){
		// navigate to error page
		//console.log("XXXX");
		alert("請使用 IE9 以上的瀏覽器！謝謝！");
	}
}

/* jQuery */

$(function()
{
	// 點擊回到最上面的按鈕，畫面會移到嘴上面

	$(".gototop a").click(function()
	{
		$('html,body').animate({scrollTop: 0}, 500);
	});

});