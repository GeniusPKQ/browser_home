const search_debug = true; // 调试日志，false关闭，true打开
const title = "—首页";
const search = [ // 搜索引擎列表
     {
        //  修改安卓移动端统一跳转新页面
        //  1. 修改X-Frame-Options全为deny
        //  2. 修改 搜索1/4 搜索2/4 搜索4/4 处
         "name": "百度一下",                                 // 引擎名称，可视5个字
         "url": "https://m.baidu.com/s?ie=UTF-8&wd=",        // 移动端
         "pc-url": "https://www.baidu.com/s?ie=UTF-8&wd=",   // PC端
         "url_right": "",                                    // 参数的固顶后缀
        //  "X-Frame-Options": "",                              // 默认为空，deny则表示该网站不允许跨域iframe
         "X-Frame-Options": "deny",  
     },
     {
         "name": "Bing",
         "url": "https://www.bing.com/search?q=",
         "pc-url": "https://www.bing.com/search?q=",
         "url_right": "",
        //  "X-Frame-Options": "",
        "X-Frame-Options": "deny",  
     },
     // {
     //     "name": "淘宝搜索",
     //     "url": "https://s.m.taobao.com/h5?&_input_charset=utf-8&q=",
     //     "pc-url": "https://s.taobao.com/search?ie=utf8&q=",
     //     "url_right": "",
     //     "X-Frame-Options": "",
     // },
     {
         "name": "京东搜索",
         "url": "https://so.m.jd.com/ware/search.action?keyword=",
         "pc-url": "https://search.jd.com/Search?keyword=",
         "url_right": "",
        //  "X-Frame-Options": "",
        "X-Frame-Options": "deny",  
     },
     {
         "name": "Runoob",
         "url": "http://www.runoob.com/?s=",
         "pc-url": "http://www.runoob.com/?s=",
         "url_right": "",
        //  "X-Frame-Options": "",
        "X-Frame-Options": "deny",  
     },
     // {
     //     "name": "npmjs.com",
     //     "url": "https://www.npmjs.com/search?q=",
     //     "pc-url": "https://www.npmjs.com/search?q=",
     //     "url_right": "",
     //     "X-Frame-Options": "",
     // },
     {
         "name": "知乎搜索",
         "url": "https://www.zhihu.com/search?type=content&q=",
         "pc-url": "https://www.zhihu.com/search?type=content&q=",
         "url_right": "",
         "X-Frame-Options": "deny",
     },
     {
         "name": "微博搜索",
         "url": "http://s.weibo.com/weibo/",
         "pc-url": "http://s.weibo.com/weibo/",
         "url_right": "",
         "X-Frame-Options": "deny",
     },
     {
         "name": "CSDN博客",
         "url": "https://so.csdn.net/so/search/s.do?q=",
         "pc-url": "https://so.csdn.net/so/search/s.do?q=",
         "url_right": "",
        //  "X-Frame-Options": "",
        "X-Frame-Options": "deny",  
     },
     // {
     //     "name": "cnblogs",
     //     "url": "https://zzk.cnblogs.com/s/blogpost?w=",
     //     "pc-url": "https://zzk.cnblogs.com/s/blogpost?w=",
     //     "url_right": "",
     //     "X-Frame-Options": "",
     // },
     {
         "name": " Github",
         "url": "https://github.com/search?&type=Repositories&q=",
         "pc-url": "https://github.com/search?&type=Repositories&q=",
         "url_right": "",
         "X-Frame-Options": "deny",
     },
     {
         "name": " BT蚂蚁",
         "url": "https://btmye.cc/bt/",
         "pc-url": "https://btmye.cc/bt/",
         "url_right": "/time-1.html",
         "X-Frame-Options": "deny",
     },
 ];
const search_cookie_pre = "search_";
const search_eq = search_cookie_pre+"_eq";
let search_time_style = 0; // 自动校正iframe
let focus_time = 1.5*60*60*1000; // 保护用户输入框隐私，1.5h不聚焦删一次
let blur_time = 3*60*60*1000; // 保护用户输入框隐私，3h聚焦删一次
let dead_input_num = 0; // 自动初始化输入框
function console_log(txt){ // 调试日志
    search_debug === true ? console.info(txt) : "";
}
function set_search(val){ // 配置当前的搜索引擎
    console_log("配置当前搜索引擎");
    setCookie(search_eq, val, 30 * 24 * 60 * 60 * 1000);
    for (let i = 0; i<document.getElementsByClassName("option").length; i++) {
        document.getElementsByClassName("option")[i].removeAttribute("selected");
    }
    document.getElementsByClassName("option-"+val)[0].setAttribute("selected", "selected");
    document.getElementsByTagName("title")[0].innerText = document.getElementsByClassName("option-"+val)[0].innerText + title;     let _select = document.getElementById("select");
    _select.options[_select.selectedIndex].value = val;
}
function create_input(pre) { // 渲染模板
    console_log("渲染模板数据");
    document.getElementsByTagName("title")[0].innerText = title;
    let content = document.getElementsByClassName("content")[0];
    content.innerHTML = '<div class="input-div"><select class="select search-style" id="select"></select><input type="text" value="" maxlength="100" id="input" class="input search-style"  placeholder="'+ pre +'输入内容，按Enter开始搜索！"/><div class="clear"></div></div><div class="res-div"></div>';
    let append_tag = [];
    for (let i = 0; i < search.length; i++){
        let tag = '<option class="option option-'+i+'" value="'+i+'">'+ search[i]["name"] +'</option>';
        append_tag.push(tag);
    }
    document.getElementsByClassName("select")[0].innerHTML = append_tag.join("");       
    let _eq = getCookie(search_eq);
    if (_eq){set_search(_eq);}else {set_search(0);}
}
create_input("");
function dead_input(del_time) { // 处理清空用户输入的情况
    try {
        clearTimeout(dead_input_num);
        console_log(dead_input_num+"-清除成功");
    }catch (e) {
        console_log(dead_input_num+"-timeout is none");
    }
    dead_input_num = setTimeout(function () {
        create_input("重新");
        console_log(del_time);
    }, del_time);
    console_log(dead_input_num);
}
function iframe_load() { // iframe加载动画
    console_log("iframe加载完成");
    delete_loading();
}
function run_search(){ // 执行搜索
    document.getElementsByClassName("input")[0].blur(); // 主动失去聚焦后会自动退去键盘
    try {clearInterval(search_time_style);}
    catch (e) {console_log("第一次进入页面是没有定时器的");}
    let _select = document.getElementById("select");
    let engine = _select.options[_select.selectedIndex].value;
    let _input = document.getElementById("input").value;
    if (!_input.trim()) {
        alert_txt("内容不能为空", 1000);
        return;
    }
    //处理输入事件
    if (inputFunc(_input)){
        return;
    }
    let http_url = _input;
    let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)+([A-Za-z0-9-~\/])/; // 至少是 http://a 这种格式
    if(!reg.test(http_url)){
        console_log("不是网址");
    }else{
        console_log("是网址");
        //window.open(http_url, "_blank"); // 搜索4/4
        window.location.href=http_url;
        return;
    }
    let url_right = search[engine]["url_right"].trim(); // 参数固定后缀
    let res_url = search[engine]["url"]+_input+url_right; // get
    let pc_res_url = search[engine]["pc-url"]+_input+url_right; // get
    if (window.innerWidth > 640) {
        // document.getElementsByClassName("res-div")[0].innerHTML = '<div class="flex-center" style="font-size: 15px;color: grey;height: 50px;text-align:center;line-height: 22px;padding: 5px 20px;"><div style="height: 44px;overflow: hidden;">PC模式会自动打开新标签来展示搜索结果</div></div>';
        //window.open(pc_res_url, "_blank"); // 搜索1/4
        window.location.href=pc_res_url;
        return;
    }else {
        // 操作iOS设备Bug情况
        let u = navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isAndroid === true || isiOS === false){ // android
            console_log("Android");
        }else if(isAndroid === false || isiOS === true){ // ios
            console_log("iOS");
            // document.getElementsByClassName("res-div")[0].innerHTML = '<div class="flex-center" style="font-size: 15px;color: grey;height: 50px;text-align:center;line-height: 22px;padding: 5px 20px;"><div style="height: 44px;overflow: hidden;">iOS移动设备会自动打开新标签来展示搜索结果</div></div>';
            // window.open(res_url, "_blank"); // 由于iOS兼容iframe特性不佳，所以直接打开新标签
            window.location.href=res_url;
            return;
        }else { // pc
            console_log("PC");
        }
    }
    if (search[engine]["X-Frame-Options"]){
        console_log("该网站禁止非同源在iframe中加载");
        // document.getElementsByClassName("res-div")[0].innerHTML = '<div class="flex-center" style="font-size: 15px;color: grey;height: 50px;text-align:center;line-height: 22px;padding: 5px 20px;"><div style="height: 44px;overflow: hidden;">由于“'+search[engine]["name"]+'”做了跨域限制，已经在新标签打开了本次搜索结果</div></div>';
        //window.open(res_url, "_blank"); // 搜索2/4
        window.location.href=res_url;
        setTimeout(function () {
            delete_loading();
        }, 700);
    }else {
        document.getElementsByClassName("res-div")[0].innerHTML = '<iframe class="iframe iframe-box" id="iframe-box" src="" onload="iframe_load()"></iframe>';
        search_time_style = setInterval(function () { // 自动校正宽高
            console_log("自动校正iframe宽和高");
            if (window.innerWidth > 780){
                document.getElementsByClassName("iframe-box")[0].style.height = (window.innerHeight*0.9 - 58)+"px";
                document.getElementsByClassName("iframe-box")[0].style.width = 780+"px";
            }else {
                document.getElementsByClassName("iframe-box")[0].style.height = (window.innerHeight + 80)+"px";
                document.getElementsByClassName("iframe-box")[0].style.width = window.innerWidth+"px";
            }
        }, 1000);
        document.getElementsByClassName("iframe-box")[0].setAttribute("src", res_url);
    }
    show_loading();
}
(function () {
    var state = 0;
    document.getElementsByClassName("input")[0].addEventListener("mouseclick", function (e) {
        console_log("鼠标click了输入框，输入框自动聚焦");
        let that = this;
        that.focus();
    });
    document.getElementById("select").onchange = function(e){ // 设置历史和当前选中的搜索引擎
        console_log("选择搜素引擎" );
        let that = this;
        set_search(that.value);
    };
    document.getElementById("input").onfocus = function(e){
        state = 1
        console_log("监听输入框状态-onfocus" + state);
        document.getElementsByClassName("select")[0].classList.add("liner-color");
        dead_input(focus_time);
    };
    document.getElementById("input").onblur = function(e){
        state = 0
        console_log("监听输入框状态-onblur" + state);
        document.getElementsByClassName("select")[0].classList.remove("liner-color");
        dead_input(blur_time);
    };      /*
      * 键盘事件处理
      * */
    document.onkeyup = function (event) { // Enter
        console_log("按键盘enter进行搜素");
        let _key = event.key;
        if (_key === "Enter") {run_search();}         //快捷切换搜索引擎
        //    "name": "百度一下",                               
        //    "name": "Bing",
        //    "name": "京东搜索",
        //    "name": "Runoob",
        //    "name": "知乎搜索",
        //    "name": "微博搜索",
        //    "name": "CSDN博客",
        //    "name": " Github",
        //    "name": " BT蚂蚁",
        if (_key === "b" && state == 0) {set_search(0);}
        if (_key === "i" && state == 0) {set_search(1);}
        if (_key === "j" && state == 0) {set_search(2);}
        if (_key === "r" && state == 0) {set_search(3);}
        if (_key === "z" && state == 0) {set_search(4);}
        if (_key === "w" && state == 0) {set_search(5);}
        if (_key === "c" && state == 0) {set_search(6);}
        if (_key === "g" && state == 0) {set_search(7);}
        if (_key === "m" && state == 0) {set_search(8);}
        //循环切换
        if (_key === "n" && state == 0) {
            let _select = document.getElementById("select");
            set_search((_select.options[_select.selectedIndex].value + 1)%search.length);
        }             
    };
})("用户操作");

function inputFunc(_input){
    let patt = new RegExp("/*#003.+#/*")
     //添加隐藏输入换壁纸功能
     if (_input == "*#001#*") {
        setCookie("bg_cookie", 0, 30 * 24 * 60 * 60 * 1000);
        alert_txt("网页切换为Bing图片", 1000);
        document.body.style.backgroundImage="url(https://api.rthe.cn/backend/bing/)";
        return true;
    }else if(_input == "*#002#*"){
        setCookie("bg_cookie", 1, 30 * 24 * 60 * 60 * 1000);
        alert_txt("网页切换为随机图片", 1000);
        document.body.style.backgroundImage="url(http://api.btstu.cn/sjbz/zsy.php)";
        return true;
    }else if(patt.test(_input)){
        setCookie("bg_cookie", 2, 30 * 24 * 60 * 60 * 1000);
        setCookie("loc_bg_cookie", _input.slice(5, -2), 30 * 24 * 60 * 60 * 1000);
        alert_txt(_input.slice(5, -2), 1000);
        document.body.style.backgroundImage="url(" + _input.slice(5, -2) + ")";
        return true;
    }
     //添加隐藏输入help功能
     if (_input == "*#help#*") {
        window.location.href="https://github.com/Thetophh/startpage";
        return true;
        //  let str1 = "使用说明:\n1. 点击三下显示或隐藏选择按钮(默认隐藏)\n2. 可以使用快捷键切换搜索引擎\n"
        //  let str2 = "3. 搜索框可以输入的隐藏命令: *#001#* *#002#* *#003.+#* *#help#*\n"
        //  let bg_img = getCookie("bg_cookie")*1;
        //  let str3 = "4. 壁纸：";
        //  if (bg_img === 0) {
        //     str3 = str3 + "Bing壁纸"
        //  }else if(bg_img === 1) {
        //     str3 = str3 + "随机壁纸"
        //  }else if(bg_img === 2){
        //     let loc_bg_img = getCookie("loc_bg_cookie");
        //     if (!loc_bg_img) {
        //         alert_txt("cookie出错，请清除cookie后再试")
        //     }else {
        //         str3 = str3 + getCookie("loc_bg_cookie")
        //     }
        //  }
        //  let str = str1 + str2 + str3
        // alert(str, 1000);
        // return true;
    }
}  

//隐藏选择搜索下拉框
document.getElementsByClassName("select")[0].style.display="none"; 


document.getElementsByTagName("body")[0].addEventListener("click", function () {
    many_click(4, hidden_content);
});
function hidden_content() {
    if (document.getElementById("clock").style.display=="none"){
        document.getElementById("clock").style.display="block";
        document.getElementById("content").style.display="block";
    }else {
        document.getElementById("clock").style.display="none";
        document.getElementById("content").style.display="none";
    }
}




/*
*  个性化功能，初始化页面背景图片
* */
let bg_img = getCookie("bg_cookie")*1;
if (!bg_img) {
    setCookie("bg_cookie", 0, 30 * 24 * 60 * 60 * 1000);
    document.body.style.backgroundImage="url(https://api.rthe.cn/backend/bing/)";
}else {
    if (bg_img === 0){
        //cookie为0,设置bing图片
        document.body.style.backgroundImage="url(https://api.rthe.cn/backend/bing/)";
    } else if (bg_img === 1) {
        //cookie为1,设置小姐姐图片
        document.body.style.backgroundImage="url(http://api.btstu.cn/sjbz/zsy.php)";
    }else if (bg_img === 2) {
        //cookie为2,设置用户指定的壁纸
        let loc_bg_img = getCookie("loc_bg_cookie");
        if (!loc_bg_img) {
            alert_txt("cookie出错，请清除cookie后再试")
        }else {
            console_log("loc_bg_img:", loc_bg_img)
            document.body.style.backgroundImage="url("+ loc_bg_img +")";
        }
    } }
