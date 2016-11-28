/**
 * Created by MissLi1991 on 2016/11/22.
 */
//页面加载完成调用函数
function addLoadEvent(func){
    oldonload = window.onload;
    if(typeof window.onload != "function"){
        window.onload = func;
    }else{
        window.onload = function(){
            oldonload();
            func();
        }
    }
}
//在目标节点之后插入新节点
function insertAfter(newElement,targetElement){
    var parent = targetElement.parentNode;
    if(parent.lastChild == targetElement){
        parent.appendChild(newElement);
    }else{
        parent.insertBefore(newElement,targetElement.nextSibling);
    }
}
//利用JavaScript为元素添加类
function addClass(element,value){
    if(!element.className){
        element.className = value;
    }else{
        newClassName = element.className;
        newClassName +=" ";
        newClassName +=value;
        element.className = newClassName;
    }
}
/*-------index--------*/
//亮度显示当前页面所在位置
function highlightPage(){
    //检查DOM可用方法是否
    if(!document.getElementsByTagName) return false;
    if(!document.getElementById) return false;
    var headers = document.getElementsByTagName("header");
    if(headers.length == 0) return false; //p判断header是否元素存在
    var navs = headers[0].getElementsByTagName("nav");
    if(navs.length == 0) return false;
    //获得导航条的所有链接
    var links = navs[0].getElementsByTagName("a");
    var linkurl;
    for(var i = 0; i < links.length; i++){
        linkurl = links[i].getAttribute("href");
        if(window.location.href.indexOf(linkurl) != -1){
            //为当前页面链接添加类
            addClass(links[i],"here");
            //获取当前链接中的文本添加为body的id值,利用id值在css中设置差异性
            var linktext = links[i].lastChild.nodeValue.toLowerCase();
            document.body.setAttribute("id",linktext);
        }
    }
}
//图片幻灯片制作
function moveElement(elementID,final_x,final_y,interval){
    if(!document.getElementById) return false;
    var ele = document.getElementById(elementID);
    if(!ele) return false;
    //判断moment是否存在，如果存在就删除。解决阻塞问题。
    if(ele.moment){
        clearTimeout(ele.moment);
    }
    var xpos = parseInt(ele.style.left);
    var ypos = parseInt(ele.style.top);
    if(xpos == final_x && ypos == final_y) return true;
    if(xpos < final_x){
        var dist = Math.ceil((final_x - xpos)/10);
        xpos += dist;
    }
    if(xpos > final_x){
        var dist = Math.ceil((xpos - final_x)/10);
        xpos -= dist;
    }
    if(ypos < final_x){
        var dist = Math.ceil((final_y - ypos)/10);
        ypos += dist;
    }
    if(ypos > final_x){
        var dist = Math.ceil((ypos - final_y)/10);
        ypos -= dist;
    }
    ele.style.left = xpos +"px";
    ele.style.top = ypos +"px";
    var repeat = "moveElement('"+elementID+"',"+final_x+","+final_y+","+interval+")";
    //将moment设置为只与移动元素有关的ele的属性
    ele.moment = setTimeout(repeat,interval);
}
function prepareSlideshow(){
    if(!document.getElementById) return false;
    if(!document.getElementsByTagName) return false;
    if(!document.getElementById("intro")) return false;
    var intro = document.getElementById("intro");
    //动态创建div元素和插入图片
    var slideshow = document.createElement("div");
    slideshow.setAttribute("id","slideshow");
    var frame = document.createElement("img");
    frame.setAttribute("src","images/frame.gif");
    frame.setAttribute("id","frame");
    frame.setAttribute("alt","");
    slideshow.appendChild(frame);
    var preview = document.createElement("img");
    preview.setAttribute("id","preview");
    preview.setAttribute("src","images/slideshow.gif");
    slideshow.appendChild(preview);
    insertAfter(slideshow,intro);

    preview.style.left = "0";
    preview.style.top = "0";
    //遍历“intro”中所有链接添加鼠标操作
    //var links = intro.getElementsByTagName("a");
    //遍历“body”中的所有链接
    var links = document.getElementsByTagName("a");
    if(links.length == 0) return false;
    var destination;
    for(var i = 0; i < links.length; i++){
        links[i].onmouseover = function(){
            destination = this.getAttribute("href");
            if(destination.indexOf("index.html") != -1){

                moveElement("preview",0,0,5);
            }
            if(destination.indexOf("about.html") != -1){
                moveElement("preview",-150,0,5);
            }
            if(destination.indexOf("photos.html") != -1){
                moveElement("preview",-300,0,5);
            }
            if(destination.indexOf("live.html") != -1){
                moveElement("preview",-450,0,5);
            }
            if(destination.indexOf("contact.html") != -1){
                moveElement("preview",-600,0,5);
            }
        }
    }

}
/*-------about--------*/
function prepareIntervalnav(){
    if(!document.getElementsByTagName) return false;
    if(!document.getElementById) return false;
    /*页面加载后将全部section隐藏,是个数组,第一行错误
    var a = document.getElementsByTagName("section").style.display = "none";
    var a = document.getElementsByTagName("section");
    for(var i = 0; i < a.length; i++) a[i].style.display = "none";*/
    var articles = document.getElementsByTagName("article");
    if(articles.length == 0) return false;
    var navs = articles[0].getElementsByTagName("nav");
    if(navs.length == 0) return 0;
    var links = navs[0].getElementsByTagName("a");
    for(var i = 0; i < links.length; i++){
        var links_id = links[i].getAttribute("href");
        //获取nav id的#之后的内容，split会根据给定符号将字符串分成两个或多个部分构成数组
        var section_id = links_id.split("#")[1];
        //判断是否存在带有section_id的元素，没有，跳出继续下一轮循环
        if(!document.getElementById(section_id)) continue;
        //页面加载后将带有id的section隐藏
        document.getElementById(section_id).style.display = "none";
        //section_id为局部变量，传到showSection函数中不存在。创建为链接的属性，属性作用域持久存在。
        links[i].sectionid = section_id;
        links[i].onclick = function(){
            showSection(this.sectionid);
            return false;
        }
    }
}
function showSection(id){
    if(!document.getElementsByTagName) return false;
    var sections = document.getElementsByTagName("section");
    for(var i = 0; i < sections.length; i++) {
        var sectionid = sections[i].getAttribute("id");
        if (sectionid != id) {
            sections[i].style.display = "none";
        } else {
            sections[i].style.display = "block";
        }
    }
}
/*-------photos--------*/
function prepareHolderplace(){
    if(!document.getElementById) return false;
    if(!document.getElementsByTagName) return false;
    if(!document.createElement) return false;
    if(!document.createTextNode) return false;
    var para = document.createElement("p");
    para.setAttribute("id","description");
    var text = document.createTextNode("Choose a image.");
    para.appendChild(text);
    var placeholder = document.createElement("img");
    placeholder.setAttribute("id","placeholder");
    placeholder.setAttribute("src","images/placeholder.gif");
    //para.appendChild(placeholder);成为了para的孩子，placeholder和para并列关系
    var imagegallery = document.getElementById("imagegallery");
    //insertAfter(placeholder,para);文档片段无法使用insertBefore；
    insertAfter(para,imagegallery);
    insertAfter(placeholder,para);
}
function showPic(){
    if(!document.getElementById) return false;
    if(!document.getElementsByTagName) return false;

    var gallery = document.getElementById("imagegallery");
    var description = document.getElementById("description");
    var placeholder = document.getElementById("placeholder");
    if(!gallery || !description ||!placeholder) return false;
    var links = gallery.getElementsByTagName("a");
    if(links.length == 0) return false;
    for(var i = 0; i < links.length; i++){
        //var source = links[i].getAttribute("href");source值不会随着点击改变赋值
        links[i].onclick = function(){
            var source = this.getAttribute("href");
            var title;
            if(this.getAttribute("title")){
                title = this.getAttribute("title");
            }else{
                title = "";//考虑没有title的元素,其实不加，也会自动显示空
            }
            placeholder.setAttribute("src",source);
            //判断第一个节点是否为文本节点
            if(description.firstChild.nodeType == 3){
                description.firstChild.nodeValue = title;
            }
            return false;
        }
    }
}
/*-------live--------*/
function stripleTables(){
    if(!document.getElementsByTagName) return false;
    var tables = document.getElementsByTagName("table");
    if(tables.length == 0) return false;
    for(var j =0; j < tables.length; j++){
        var rows = tables[j].getElementsByTagName("tr");
        if(rows.length == 0) return false;
        var odd1 = false;
        for(var i = 0; i < rows.length; i++){
            if(odd1){
                addClass(rows[i],"odd");
                odd1 = false;
            }else{
                odd1 = true;
            }
        }
    }

}
function highlightRows(){
    if(!document.getElementsByTagName) return false;
    var tables = document.getElementsByTagName("table");
    if(tables.length == 0) return false;
    for(var i=0; i < tables.length;i++){
        var rows = tables[i].getElementsByTagName("tr");
        for(var j = 0; j< rows.length; j++){
            rows[j].oldclassName = rows[j].className;
            rows[j].onmouseover = function(){
                addClass(this,"highlight")
            }
            rows[j].onmouseout = function(){
                this.className = this.oldclassName;
            }
        }
    }
}
function displayAbbreviations(){
    if(!document.getElementsByTagName) return false;
    var abbreviations = document.getElementsByTagName("abbr");
    if(abbreviations.length == 0) return false;
    //将缩略词保存在数组中
    var defs = new Array();
    for(var i = 0; i <abbreviations.length ;i++){
        var current_abbr = abbreviations[i];
        if(current_abbr.childNodes.length < 1) continue;
        var description = current_abbr.getAttribute("title");
        var key = current_abbr.lastChild.nodeValue;
        defs[key] = description;
    }
    var dlist = document.createElement("dl");
    for(key in defs){
        var definition = document.createTextNode(defs[key]);
        var dtitle = document.createElement("dt");
        var dtitle_text = document.createTextNode(key);
        dtitle.appendChild(dtitle_text);
        var ddesc = document.createElement("dd");
        ddesc.appendChild(definition);
        dlist.appendChild(dtitle);
        dlist.appendChild(ddesc);
    }
    var header = document.createElement("h3");
    var header_text = document.createTextNode("Abbreviations");
    header.appendChild(header_text);
    var articles = document.getElementsByTagName("article");
    if(articles.length == 0) return false;
    var container = articles[0];
    container.appendChild(header);
    container.appendChild(dlist);
}
/*-------Contact--------*/
//lable中的文本被单击，关联的表单字段会获得焦点
function foucsLables(){
    if(!document.getElementsByTagName) return false;
    var lables = document.getElementsByTagName("lable");
    if(lables.length == 0) return false;
    for(var i = 0; i < lables.length; i++){
        if(!lables[i].getAttribute("for")) continue;
        lables[i].onclick = function(){
            var id = this.getAttribute("for");
            if(document.getElementById) return false;
            var element = document.getElementById(id);
            element.focus();
        }
    }
}
//对于不支持html5的浏览器中显示表单占位符
function resetFields(whichform){
    if(Modernizr.input.placeholder) return;
    for(var i = 0;i < whichform.length; i++){
        var element = whichform[i];
        if(element.type == "submit") continue;
        var check = element.placeholder || element.getAttribute("placeholder");
        if(!check) continue;
        //元素获得焦点时，字段值=“占位符“，清空
        element.onfocus = function(){
            var text = element.placeholder || element.getAttribute("placeholder");
            if(this.value == text){
                this.className = "";
                this.value = "";
            }
        }
        //失去焦点时空（用户未输入），恢复占位符
        element.onblur = function(){
            if(this.value == ""){
                this.className = "placeholder";
                this.value = element.placeholder || element.getAttribute("placeholder");
            }
        }
        element.onblur();//立即调用，显示占位符
    }
}
//验证表单
function isFilled(field){
    if(field.value.replace(' ','').length  == 0) return false;
    var placeholder = field.placeholder || field.getAttribute("placeholder");
    return (field.value != placeholder);
}
function isEmail(field){
    return (field.value.indexOf("@") != -1 && field.value.indexOf(".") != -1 );
}
function validateForm(whichform){
    for(var i =0; i < whichform.elements.length; i++){
        var element = whichform.elements[i];
        if(element.getAttribute("required") == 'required'){
            if(!isFilled(element)){
                alert("Please fill in the "+element.name +" filed.");
                return false;
            }
        }
        if(element.type == "email"){
            if(!isEmail(element)){
                alert("The "+element.name +" field must be a valid address!");
                return false;
            }
        }
        //return true;错误
    }
    return true;
}
function prepareForms(){
    for(var i = 0; i < document.forms.length; i++){
        var thisform = document.forms[i];
        //resetFields(thisform);
        thisform.onsubmit = function() {
            if(!validateForm(this)) return false;//验证不通过，不提交

            //利用Ajax拦截
            var article = document.getElementsByTagName("article")[0];
            if(submitFormWithAjax(this,article)) return false;//拦截成功，返回false才能阻止下一步运行

            return true;//验证成功，Ajax拦截不成功，正常执行通过页面提交
        }
    }
}
/*-------Ajax--------*/
//获得XMLHttpRequest对象
function getHttpObject(){
    if(typeof XMLHttpRequest == "undefined"){
        //var XMLHttpRequest = function(){ XMLHttpRequest是全局变量
        XMLHttpRequest = function(){
            try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}
            catch(e){}
            try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}
            catch(e){}
            try{return new ActiveXObject("Msxml2.XMLHTTP");}
            catch(e){}
            return false;
        }
    }
    return new XMLHttpRequest();
}
//使用Ajax请求后客服端操作
function displayAjaxLoading(element){
    // 删除所有子节点
    while(element.hasChildNodes()){          //忘记（）
        element.removeChild(element.lastChild);
    }
    //添加加载图
    var image = document.createElement("img");
    image.setAttribute("src","images/loading.gif");
    image.setAttribute("alt","loading...");
    element.appendChild(image);
}
function submitFormWithAjax(whichform,thetarget){
    var request = getHttpObject();
    if(!request) return false;
    displayAjaxLoading(thetarget);
    // 获取表单数据并编码成URL，(name1=value1&name2=value2)以便通过post请求发送给服务器。
    // 利用Javascript的encodeURIComponent编码
    var dataparts = new Array();
    for(var i = 0; i < whichform.elements.length; i++){
        var element = whichform.elements[i];
        dataparts[i] = element.name + "=" + encodeURIComponent(element.value);
    }
     //利用&将数组拼接
    var data =dataparts.join("&");
    request.open("POST",whichform.getAttribute("action"),true);//服务器将要访问的文件（指定请求目标）
    //头部信息对于POST请求是必须的，表示请求中包含URL编码的表单
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //如何处理响应(事件处理函数onreadystatechange)
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            if(request.status == 200 || request.status == 0){
                //利用正规表达式获得目标内容\sa匹配任意空白字符\S匹配任意非空字符
                var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
                if(matches.length> 0){
                    //alert(matches[0]);包含<article>？？？？
                    //alert(matches[1]);不包含<article>，与捕获组中模式匹配匹配的部分
                    thetarget.innerHTML = matches[1];
                }else{
                    thetarget.innerHTML = "<p>Opos, there was an error, Sorry.</p>";
                }
            }else{
                thetarget.innerHTML = "<p>"+request.statusText+"</p>";
            }
        }
    };
    //提交表单数据
    request.send(data);
    return true;
}
function loadEvent(){
    prepareIntervalnav();
    prepareSlideshow();
    stripleTables();//stripleTables();一定要放在highlightRows();前面，之前要把odd类加入
    highlightRows();//为什么这两行放到prepareHolderplace()和showPic后无法运行？？？？？
    displayAbbreviations();
    foucsLables();
    prepareForms();
    prepareHolderplace();
    showPic();
}

//不同的页面加载
addLoadEvent(highlightPage);
//addLoadEvent( stripleTables);
//addLoadEvent(highlightRows);
//addLoadEvent(displayAbbreviations);
addLoadEvent(loadEvent);
/* 加载第三个函数时陷入循环?
addLoadEvent(prepareIntervalnav);
addLoadEvent(prepareSlideshow);*/
