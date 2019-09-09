//往JQUERY添加扩展方法，获取URL参数
//(function ($)
//{
//    $.getUrlParam = function (name)
//    {
//        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//        var r = window.location.search.substr(1).match(reg);
//        if (r != null) return unescape(r[2]); return null;
//    }
//})(jQuery);
$.extend({
    getUrlParam: function (name)
    {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
});


//加载头部购物车记录
$(function ()
{
    $.post(domainurl + "/Handler/IndexPageHandler/GetUserShopCartList.ashx", "", function (e)
    {
        if (e == "" || e == null || typeof e == 'undefined')
        {
            $("#cartCount").html("0");
        }
        //$(".cart_list1").html(e);
        //var count = $(".cart_list1").find(".count").html();
        //$("#rcart").html(count);   //右侧栏购物车总数
        //$("#Strong1").html(count);   //导航条购物车总数
        $("#cartCount").html(e);
    });


    //var data = {
    //    "HtmlPath": "Common\\RightUserBrowseHistory.htm",
    //    "Count": 8
    //};

    //$.post(domainurl+"/Handler/IndexPageHandler/GetUserBrowseHistory.ashx", data, function (e) {
    //    var html = $(".cart_list2").html() + e;
    //    $(".cart_list2").html(html);

    //});

    $("#btnSearch").click(function ()
    {

        var value = $("#txtSearch").val();
        if (typeof value == "undefined" || value == "" || value == null)
        {
            alert("请输入要搜索的关键字");
            return;
        }

        if (value == "老用户")
        {
            window.open("http://www.hecha.cn/cn/active/2015lyh.html");
            return;
        }

        Search(value);
    });

    //搜索框捕获回车
    $("#txtSearch").keydown(function (event)
    {

        if (event.keyCode == 13)
        {
            $("#btnSearch").click();
        }
    });
    //    //用户浏览的记录
    //    var data = { "HtmlPath": "ProductDetailed\\UserBrowseHistory.htm", "Count": 12 };
    //    $.post(domainurl + "/Handler/IndexPageHandler/GetUserBrowseHistory.ashx", data, function(e) {

    //        //alert(e);
    //        $(".swiper-wrapper").html(e);

    //    });

    //    //用户购买历史Post请求
    //    data["HtmlPath"] = "ProductDetailed\\GuessYoulike.htm";
    //    data["Count"] = 4;
    //    $.post(domainurl+"/Handler/IndexPageHandler/GetUserShopHistory.ashx", data, function(e) {
    //        alert(e);
    //        $(".probox_rlist2").html();
    //    });

    //删除百度图片
    $("a img").each(function ()
    {
        if ($(this).attr("src") == "http://eiv.baidu.com/hmt/icon/21.gif")
        {
            $(this).parent().html('');
            return;
        }
    });

});

//点击搜索按钮
function Search(value)
{
    var urlStr = domainurl + "/cn/Search.html?SearchKey=" + encodeURIComponent(value);
    window.location = encodeURI(urlStr);
}

//添加到收藏夹
function addBookmark()
{
    var url = "www.hecha.cn";
    var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
    try
    {
        if (document.all)
        { //IE类浏览器
            try
            {
                window.external.toString(); //360浏览器不支持window.external，无法收藏
                window.alert("国内开发的360浏览器等不支持主动加入收藏。\n您可以尝试通过浏览器菜单栏 或快捷键 ctrl+D 试试。");
            }
            catch (e)
            {
                try
                {
                    window.external.addFavorite(window.location, document.title);
                }
                catch (e)
                {
                    window.external.addToFavoritesBar(url, document.title);  //IE8
                }
            }
        }
        else if (window.sidebar)
        { //firfox等浏览器
            window.sidebar.addPanel(document.title, window.location, "");
        }
        else
        {
            alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~');
        }
    }
    catch (e)
    {
        window.alert("因为IE浏览器存在bug，添加收藏失败！\n解决办法：在注册表中查找\n HKEY_CLASSES_ROOT\\TypeLib\\{EAB22AC0-30C1-11CF-A7EB-0000C05BAE0B}\\1.1\\0\\win32 \n将 C:\\WINDOWS\\system32\\shdocvw.dll 改为 C:\\WINDOWS\\system32\\ieframe.dll ");
    }
}

//右边栏登陆事件
function RightLogin()
{
    var userName = $("#rightUserName").val();
    var password = $("#rightPassword").val();

    if ($.trim(userName) == "")
    {
        alert('用户名不能为空！');
        return;
    }
    if ($.trim(password) == "")
    {
        alert('密码不能为空！');
        return;
    }

    $.post(domainurl + "/Handler/LoginHandler/LoginHandler.ashx", { "LoginName": userName, "Password": password }, function (data)
    {

        var json = eval("(" + data + ")");
        if (json["Status"] == "False")
        {
            alert(json["Message"]);
            return;
        }
        else
        {
            // window.location="Index.html";
            location.reload();
        }

    }, "text");
}

//根据参数名获取参数
function getQueryString(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//function scRight() {
//    document.writeln("<!-- Baidu Button BEGIN -->");

//    document.writeln("<script type=\"text/javascript\" id=\"bdshare_js\" data=\"type=tools&amp;uid=66616\" ></script>");
//    document.writeln("<script type=\"text/javascript\" id=\"bdshell_js\"></script>");
//    document.writeln("<script type=\"text/javascript\">");
//    document.writeln("document.getElementById(\"bdshell_js\").src = \"http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=\" + Math.ceil(new Date()/3600000);");
//    document.writeln("</script>");
//    document.writeln("<!-- Baidu Button END -->");
//}
//function tj() {
//    scRight();
//    document.writeln("var _bdhmProtocol = ((\"https:\" == document.location.protocol) ? \" https://\" : \" http://\");");
//    document.writeln("document.write(unescape(\"%3Cscript src='\" + _bdhmProtocol + \"hm.baidu.com/h.js%3F5929d4f83ef0b1fad3dd9365bf2c00b4' type='text/javascript'%3E%3C/script%3E\"));");
//    document.writeln("</script>");
//    //auto();
//}
