
//记录用户

var rurl = location.href;

if (rurl.indexOf("?") > -1)
{
    //alert();
    var sources = new Array("f=vip", "f=qqtg", "f=360tg", "src=emar", "cps=yima", "hcemail", "f=bd", "f=dj", "f=sg", "f=hcbk", "f=jk", "f=yd", "f=gdt", "hyzx");
    for (var i = 0; i < sources.length; i++)
    {
        if (rurl.indexOf(sources[i]) > -1)
        {
            //alert(sources[i]);
            var data = { "Flag": sources[i] };
            $.post("http://www.hecha.cn/Handler/CommonHandler/SetUserSourceHandler.ashx", data);
            saveCookie("sourceflag", sources[i]);
        }
    }

}