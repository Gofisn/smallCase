Date.prototype.format = function (format) {
    var weekday = new Array(7)
    weekday[0] = "星期日"
    weekday[1] = "星期一"
    weekday[2] = "星期二"
    weekday[3] = "星期三"
    weekday[4] = "星期四"
    weekday[5] = "星期五"
    weekday[6] = "星期六"

    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day  
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds(), //millisecond 
        "D": weekday[this.getDay()],
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

// 转base64
var base = new Base64();

function Base64() {

    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding  
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding  
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60); //定义每秒执行60次动画
        };
})();

var $hz = function () {}
$hz.prototype = {
    // 设置cookie
    setCookie: function (c_name, value, expiredays) {
        //var exdate=new Date(); 
        //exdate.setDate(exdate.getDate()+expiredays);

        var exdate = new Date();

        var times = exdate.getTime() + parseInt(expiredays * 24 * 60 * 60 * 1000)

        exdate.setTime(times);
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + "; path=/")
        //  path=/ cookie存储位置在域名下 与path无关
    },
    getCookie: function (c_name) {
        if (document.cookie.length > 0) {

            c_start = document.cookie.indexOf(c_name + "=")

            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length

                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    delAllCookie: function () {
        var myDate = new Date();
        myDate.setTime(-1000); //设置时间    
        var data = document.cookie;
        var dataArray = data.split("; ");
        for (var i = 0; i < dataArray.length; i++) {
            var varName = dataArray[i].split("=");
            document.cookie = varName[0] + "=''; expires=" + myDate.toGMTString();
        }

    },
    route: function (url) {
        window.location.href = url;
    },
    //去左空格;
    ltrim: function (s) {
        return s.replace(/(^\s*)/g, "");
    },

    //去右空格;
    rtrim: function (s) {
        return s.replace(/(\s*$)/g, "");
    },
    //去左右空格;
    trim: function (s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 总长度中文2英文1
    getLength: function (str) {
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            // console.log(charCode);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    },
    // 断行
    changeLineAS: function (str, num) {
        console.log(str.length);
        var charCode = -1;
        var realLength = 0; //英文1 中文2
        var lastInd = 0; //上一次截取的位置
        var newStr = ''; //换行后的字符串
        for (var i = 0; i < str.length; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode < 128) {
                realLength += 1;
            } else {
                realLength += 2;
            }
            if (realLength >= num * 2) {
                newStr = newStr + '\n' + str.substring(lastInd, i + 1);
                // console.log(realLength);
                //     console.log('new:'+str.substring(lastInd, i + 1));
                lastInd = i + 1;
                realLength = 0;
                if (i >= str.length - 1) {
                    newStr = newStr + '\n' + str.substring(lastInd, i + 1);

                    return newStr;
                }
            } else if (i >= str.length - 1) {
                newStr = newStr + '\n' + str.substring(lastInd, i + 1);

                return newStr;
            }
        }
    },
    // 检测字符串中是否含有html标签
    checkHtml: function (htmlStr) {
        var reg = /<[^>]+>/g;
        return reg.test(htmlStr);
    },
    // 转义字符转码
    htmlEncode: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        return s;
    },
    // 转义字符解码
    htmlDecode: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        return s;
    },
    // blob转dataurl
    fileToDataURL: function (blob, callback) {
        var a = new FileReader();
        a.onload = function (e) {
            callback(e.target.result);
        };
        a.readAsDataURL(blob);
    },

    fileToBase64: function (file, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            if (callback)
                callback(e.target.result)
        }
    },
    // dataurl转blob
    dataURLtoBlob: function (dataurl) {
        /*
         var arr = dataurl.split(','),
             mime = arr[0].match(/:(.*?);/)[1],
             bstr = atob(arr[1]),
             n = bstr.length,
             u8arr = new Uint8Array(n);
         while (n--) {
             u8arr[n] = bstr.charCodeAt(n);
         }
         return new Blob([u8arr], { type: mime });*/

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]);

        return new Blob([bstr], {
            type: mime
        });
    },

    fileToBlob: function (file) {
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file)
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file)
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file)
        }
        return url
    },
    // 获取连接传参
    getParas: function () {
        var url = window.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    // 浏览器全屏
    fullScreen: function () {

        var el = document.documentElement;

        var rfs = el.requestFullScreen || el.webkitRequestFullScreen;

        if (typeof rfs != "undefined" && rfs) {

            rfs.call(el);

        } else if (typeof window.ActiveXObject != "undefined") {

            var wscript = new ActiveXObject("WScript.Shell");

            if (wscript != null) {

                wscript.SendKeys("{F11}");

            }

        } else if (el.msRequestFullscreen) {

            el.msRequestFullscreen();

        } else if (el.oRequestFullscreen) {

            el.oRequestFullscreen();

        } else {

            swal({
                title: "浏览器不支持全屏调用！",
                text: "请更换浏览器或按F11键切换全屏！(3秒后自动关闭)",
                type: "error",
                timer: 3000
            });

        }

    },

    /*
     * 浏览器退出全屏
     */
    exitFullScreen: function () {

        var el = document;

        var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.exitFullScreen;

        if (typeof cfs != "undefined" && cfs) {

            cfs.call(el);

        } else if (typeof window.ActiveXObject != "undefined") {

            var wscript = new ActiveXObject("WScript.Shell");

            if (wscript != null) {

                wscript.SendKeys("{F11}");

            }

        } else if (el.msExitFullscreen) {

            el.msExitFullscreen();

        } else if (el.oRequestFullscreen) {

            el.oCancelFullScreen();

        } else {

            swal({
                title: "浏览器不支持全屏调用！",
                text: "请更换浏览器或按F11键切换全屏！(3秒后自动关闭)",
                type: "error",
                timer: 3000
            });
        }

    },
    getRootUrl: function () {
        var url = window.location.href;
        var index = url.lastIndexOf('\/');
        var new_url = url.substring(0, index + 1);
        return new_url;

    },
    // 比较两个字符串时间大小 返回差值
    compareTime: function (beginTime, endTime) {
        var beginTimes = beginTime.substring(0, 10).split('-');
        var endTimes = endTime.substring(0, 10).split('-');

        beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
        endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
        var end_t = Date.parse(endTime) || Date.parse(endTime.replace(/-/g, "/"))
        var begin_t = Date.parse(beginTime) || Date.parse(beginTime.replace(/-/g, "/"))
        var a = (end_t - begin_t);
        return a;
    },

    strToBlob: function (txt) {
        var myblob = new Blob([txt], {
            type: 'text/plain'
        });
        return myblob;
    },
    // 苹果系统维修视频自动播放
    initAudioPlay: function (audio) {
        document.addEventListener("WeixinJSBridgeReady", function () {
            audio.play();
            audio.pause();
        }, false);
        document.addEventListener('YixinJSBridgeReady', function () {
            audio.play();
            audio.pause();
        }, false);
    },
    // 转化数据流
    dataFlow: function (option) {
        var fd = new FormData();

        for (var p in option) {

            if (option[p] instanceof Blob) {
                fd.append(p, option[p], option[p].name);
            } else {

                if (option[p] instanceof Function) {

                } else {

                    fd.append(p, option[p]);
                }
            }
        }
        console.log(fd)
        return fd;
    },
    // 判断对象是否为空
    isEmptyObject: function (obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    },
    checkCloseWindow: function () {
        window.onbeforeunload = function () {
            return "quit?"; //关闭或者刷新时弹框
        }
    },
    isPhone: function (phone) {
        var reg = /^1[34578]\d{9}$/;
        if ((reg.test(phone))) {
            return true;
        } else {
            return false;
        }
    },

    isEmail: function (email) {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        // var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ((reg.test(email))) {
            return true;
        } else {
            return false;
        }
    },
    // rem布局
    initRem: function () {
        var docEl = document.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if (clientWidth >= 750) {
                    docEl.style.fontSize = '100px';
                } else {
                    docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
                }
            };

        if (!document.addEventListener) return;
        window.addEventListener(resizeEvt, recalc, false);
        document.addEventListener('DOMContentLoaded', recalc, false);
    },
    // 随机字符串
    randomString: function (len) {
        len = len || 12;
        var $chars =
            "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = "";
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    // 反转字符串
    reverseString: function (str) {
        str = str + "";
        return str.split("").reverse().join("");
    }

}
$hz = new $hz();