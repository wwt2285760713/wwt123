// 1.预设函数的执行方式，和要传入的参数，及要实现的功能
// ajax({
//     type:"get",             //可选，默认get
//     url:"",                 //必选
//     success:function(){},   //必选
//     error:function(){},     //可选，默认不处理
//     data:{}                 //可选，默认不发
//     timeout:500             //可选，默认500，为了给jsonp设置error写的属性
// })

function ajax(options) {
    let = { type, url, success, error, data, timeout } = options;
    type = type || 'get';
    data = data || {};
    timeout = timeout || 500;

    let str = '';
    for (let sttr in data) {
        str += `${sttr}=${data[sttr]}&`;
    }

    if (type == 'get' || type == "jsonp") {
        let d = new Date();
        url = url + '?' + str + '__fxt=' + d.getTime();
    }

    if (type == 'jsonp') {
        let script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);

        window[data[data.columnName]] = function (res) {
            success && success(res);
            error = null;
        }
        //强写error
        setTimeout(function () {
            error && error('timeout');
            success = null;
        }, timeout);
    } else {
        let xhr = new XMLHttpRequest();
        xhr.open(type, url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                success(xhr.responseText);
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                error && error(xhr.status);
            }
        }
        if (type == 'get') {
            xhr.send();
        } else {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(str.slice(0, str.length - 1));
        }
    }
}