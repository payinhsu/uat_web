
/* jQuery */

$(function()
{
	$("#learning .mobileMenu").click(function()
	{
		if( $("#learning .topMenu .btns").css("display") == "none" )
		{
			$("#learning .topMenu .btns").fadeIn(200);
		}
		else
		{
			$("#learning .topMenu .btns").fadeOut(200);
		}
	});




});
