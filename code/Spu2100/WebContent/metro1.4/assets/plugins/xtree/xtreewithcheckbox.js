var sysUseCookie=false;



function setUseCookie(useCookie){

    sysUseCookie=useCookie;

}



var treeImgFld = "../tree/dark/";


var userIcon       = 'users.gif';

var rootIcon       = 'bs.gif';

var openRootIcon   = 'openfld.gif';

var folderIcon     = 'clsfld.gif';

var openFolderIcon = 'openfld.gif';

var fileIcon       = 'files.gif';

var iIcon          = 'vertline.gif';

var lIcon          = 'lastnodeline.gif';

var lMinusIcon     = 'lminus.gif';

var lPlusIcon      = 'lplus.gif';

var tIcon          = 'midnodeline.gif';

var tMinusIcon     = 'tminus.gif';

var tPlusIcon      = 'tplus.gif';

var blankIcon      = 'blank.gif';



var defaultText    = 'Tree Item';

var defaultAction  = 'javascript:void(0);';

var defaultClass   = 'link1';



var selectedObj = null;



function setImgPath(sPath,sType){

    if (typeof sType == 'undefined')

        sType = "dark";

    if (sType == "white"){

        treeImgFld=sPath+"/white/";

    }else{

        treeImgFld=sPath+"/dark/";

    }

}



function defaultVoid(objId){

    var obj=document.getElementById(objId);

    webFXTreeHandler.toggle(obj);

}



function setTreeImgPath(sPath,sType){

    if (typeof sType == 'undefined')

        sType = "dark";

    if (sType == "white"){

        treeImgFld=sPath+"/white/";

    }else{

        treeImgFld=sPath+"/dark/";

    }

}



function setTreeImg(sType) {

    if (sType == "white") {

        treeImgFld = "../tree/white/";

    } else if ( sType == "dark") {

        treeImgFld = "../tree/dark/";

    }

}



var webFXTreeHandler = {

    idCounter : 0,

    idPrefix  : "webfx-tree-object-",

    all       : {},

    css          : 'link1',

    behavior  : 'classic',

    getId     : function () { return this.idPrefix + this.idCounter++; },

    toggle    : function (oItem) { this.all[oItem.id.replace('-plus','')].toggle(); },

    select    : function (oItem) { this.all[oItem.id.replace('-icon','')].select(); },

    focus     : function (oItem) { this.all[oItem.id.replace('-anchor','')].focus(); },

    blur      : function (oItem) { this.all[oItem.id.replace('-anchor','')].blur(); }

};



function WebFXTree(sText, sAction, sBehavior, sTitle, sRightAction, sClass) {

    this._subItems = [];

    this.id        = webFXTreeHandler.getId();

    this.text      = sText || defaultText;

    this.title     = sTitle || this.text

    this.action    = sAction || defaultAction;

    this.rgtAction  = sRightAction || '';

    this.css       = sClass || defaultClass;

    this._wasLast  = false; // Used to keep track of the last item in each sub tree

    this.open      = (getCookie(this.id.substr(18,this.id.length - 18)) == '0')?false:true;

    this.icon      = treeImgFld + rootIcon;

    this.openIcon  = treeImgFld + openRootIcon;

    webFXTreeHandler.behavior =  sBehavior || 'classic';

    webFXTreeHandler.all[this.id] = this;

}



WebFXTree.prototype.setBehavior = function (sBehavior) {

    webFXTreeHandler.behavior =  sBehavior;

};



WebFXTree.prototype.setClass = function (sClass) {

    webFXTreeHandler.css =  sClass;

};



WebFXTree.prototype.getBehavior = function (sBehavior) {

    return webFXTreeHandler.behavior;

};



WebFXTree.prototype.add = function (treeItem) {

    treeItem.parent = this;

    this._subItems[this._subItems.length] = treeItem;

};



WebFXTree.prototype.toString = function () {

    var str = "<div id=\"" + this.id + "\" ondblclick=\"webFXTreeHandler.toggle(this);\" class=\"webfx-tree-item\" style=\"font-size:9pt\" nowrap>";

    str += "<img align=absbottom id=\"" + this.id + "-icon\" src=\"" + ((webFXTreeHandler.behavior == 'classic' && this.open)?this.openIcon:this.icon) + "\" onclick=\""+this.action+"\">&nbsp;<a href=\"" + this.action + "\" id=\"" + this.id + "-anchor\" onmouseup=\"if(event.button==2){"+this.rgtAction+"}\" title=\""+this.title+"\" class=\""+this.css+"\">" + this.text + "</a></div>";

    str += "<div id=\"" + this.id + "-cont\" class=\"webfx-tree-container\" style=\"display: " + ((this.open)?'block':'none') + ";\" nowrap>";

//        alert (str);

    for (var i = 0; i < this._subItems.length; i++) {

        str += this._subItems[i].toString(i,this._subItems.length);

    }

    str += "</div>";    

//        alert (str);

    return str;

};



WebFXTree.prototype.getSelected = function () {

    if (selectedObj) { return selectedObj.id; }

    else { return null; }

}



WebFXTree.prototype.toggle = function () {

    if (this.open) { this.collapse(); }

    else { this.expand(); }

}



WebFXTree.prototype.select = function () {

    document.getElementById(this.id + '-anchor').focus();

}



WebFXTree.prototype.focus = function () {

    if (selectedObj) { selectedObj.blur(); }

    selectedObj = this;

    if ((this.openIcon) && (webFXTreeHandler.behavior != 'classic')) { document.getElementById(this.id + '-icon').src = this.openIcon; }

    document.getElementById(this.id + '-anchor').style.backgroundColor = 'highlight';

    document.getElementById(this.id + '-anchor').style.color = 'highlighttext';

    document.getElementById(this.id + '-anchor').style.border = '1px dotted threedshadow';

}



WebFXTree.prototype.blur = function () {

    if ((this.openIcon) && (webFXTreeHandler.behavior != 'classic')) { document.getElementById(this.id + '-icon').src = this.icon; }

    document.getElementById(this.id + '-anchor').style.backgroundColor = 'window';

    document.getElementById(this.id + '-anchor').style.color = 'menutext';

    document.getElementById(this.id + '-anchor').style.border = '0px';

}



WebFXTree.prototype.expand = function () {

    if (webFXTreeHandler.behavior == 'classic') {

        document.getElementById(this.id + '-icon').src = this.openIcon;

    }

    document.getElementById(this.id + '-cont').style.display = 'block';

    this.open = true;

    setCookie(this.id.substr(18,this.id.length - 18), '1');

}



WebFXTree.prototype.collapse = function () {

    if (webFXTreeHandler.behavior == 'classic') {

        document.getElementById(this.id + '-icon').src = this.icon;

    }

    document.getElementById(this.id + '-cont').style.display = 'none';

    this.open = false;

    setCookie(this.id.substr(18,this.id.length - 18), '0');

}



WebFXTree.prototype.expandAll = function () {

    this.expandChildren();

    this.expand();

}



WebFXTree.prototype.expandChildren = function () {

    for (var i = 0; i < this._subItems.length; i++) {

        this._subItems[i].expandAll();

    }

}



WebFXTree.prototype.collapseAll = function () {

    this.collapse();

    this.collapseChildren();

}



WebFXTree.prototype.collapseChildren = function () {

    for (var i = 0; i < this._subItems.length; i++) {

        this._subItems[i].collapseAll();

    }

}



WebFXTree.prototype.ishavesubitem = function () {

    if(this._subItems.length>0){

        return "yes";

    }

    else{

        return "no";

    }

}



function WebFXTreeItem(sText, sAction, sTitle, sRightAction, sClass, sUser) {

    this._subItems  = [];

    this._wasLast   = false;

    this.text       = sText || defaultText;

    this.title      = sTitle || this.text

    this.css        = sClass || defaultClass;

    this.id         = webFXTreeHandler.getId();

    this.action     = sAction || "javascript:defaultVoid('"+this.id+"')";

    this.open       = (getCookie(this.id.substr(18,this.id.length - 18)) == '1')?true:false;

    this.rgtAction  = sRightAction || '';

    webFXTreeHandler.all[this.id] = this;
    
    this.users      = sUser || '';

};



WebFXTreeItem.prototype.add = function (treeItem) {

    treeItem.parent = this;

    this._subItems[this._subItems.length] = treeItem;

};



WebFXTreeItem.prototype.toggle = function () {

    if (this.open) { this.collapse(); }

    else { this.expand(); }

}



WebFXTreeItem.prototype.select = function () {

    document.getElementById(this.id + '-anchor').focus();

}



WebFXTreeItem.prototype.focus = function () {

    if (selectedObj) { selectedObj.blur(); }

    selectedObj = this;

    if ((this.openIcon) && (webFXTreeHandler.behavior != 'classic')) { document.getElementById(this.id + '-icon').src = this.openIcon; }

    document.getElementById(this.id + '-anchor').style.backgroundColor = 'highlight';

    document.getElementById(this.id + '-anchor').style.color = 'highlighttext';

    document.getElementById(this.id + '-anchor').style.border = '1px dotted threedshadow';

}



WebFXTreeItem.prototype.blur = function () {

    if ((this.openIcon) && (webFXTreeHandler.behavior != 'classic')) { document.getElementById(this.id + '-icon').src = this.icon; }

    document.getElementById(this.id + '-anchor').style.backgroundColor = 'window';

    document.getElementById(this.id + '-anchor').style.color = 'menutext';

    document.getElementById(this.id + '-anchor').style.border = '0px';

}



WebFXTreeItem.prototype.expand = function () {

    if (this._subItems.length > 0) { 

        document.getElementById(this.id + '-cont').style.display = 'block';

    }

    if (webFXTreeHandler.behavior == 'classic' && this._subItems.length>0) {

        document.getElementById(this.id + '-icon').src = this.openIcon;

    }

    if (this._subItems.length>0){

        document.getElementById(this.id + '-plus').src = this.minusIcon;

    }

    this.open = true;

    setCookie(this.id.substr(18,this.id.length - 18), '1');

}



WebFXTreeItem.prototype.collapse = function () {

    if (this._subItems.length > 0) {

        document.getElementById(this.id + '-cont').style.display = 'none';

        document.getElementById(this.id + '-plus').src = this.plusIcon;

    }

    if (webFXTreeHandler.behavior == 'classic' && this._subItems.length > 0) {

        document.getElementById(this.id + '-icon').src = this.icon;

    }

    this.open = false;

    setCookie(this.id.substr(18,this.id.length - 18), '0');

}



WebFXTreeItem.prototype.expandAll = function () {

    this.expandChildren();

    this.expand();

}



WebFXTreeItem.prototype.expandChildren = function () {

    for (var i = 0; i < this._subItems.length; i++) {

        this._subItems[i].expandAll();

    }

}



WebFXTreeItem.prototype.collapseAll = function () {

    this.collapse();

    this.collapseChildren();

}



WebFXTreeItem.prototype.collapseChildren = function () {

    for (var i = 0; i < this._subItems.length; i++) {

        this._subItems[i].collapseAll();

    }

}



WebFXTreeItem.prototype.toString = function (nItem,nItemCount) {

    var foo = this.parent;

    var indent = '';

    if (nItem + 1 == nItemCount) { this.parent._wasLast = true; }

    while (foo.parent) {

        foo = foo.parent;

        indent = "<img align=absbottom src=\"" + ((foo._wasLast)?treeImgFld + blankIcon:treeImgFld + iIcon) + "\">" + indent;

    }

    if (this._subItems.length) { this.folder = 1; }
		if (this.folder) {

        if (!this.icon) { this.icon = treeImgFld + folderIcon; }

        if (!this.openIcon) { this.openIcon = treeImgFld + openFolderIcon; }

        var str = "<div id=\"" + this.id + "\" ondblclick=\"webFXTreeHandler.toggle(this);\" class=\"webfx-tree-item\" style=\"font-size:9pt\" nowrap>";

        str += indent;

        str += "<img align=absbottom id=\"" + this.id + "-plus\" style=\"cursor:hand\" src=\"" + ((this.open)?((this.parent._wasLast)?treeImgFld + lMinusIcon:treeImgFld + tMinusIcon):((this.parent._wasLast)?treeImgFld + lPlusIcon:treeImgFld + tPlusIcon)) + "\" onclick=\"webFXTreeHandler.toggle(this);\">";

//        alert (str);

        //这里是文件夹处理子句

        str += "<img align=absbottom id=\"" + this.id + "-icon\" src=\"" + ((webFXTreeHandler.behavior == 'classic' && this.open)?this.openIcon:this.icon) + "\" onclick=\""+this.action+"\">   <a href=\"" + this.action + "\" id=\"" + this.id + "-anchor\" onmouseup=\"if(event.button==2){"+this.rgtAction+"}\" title=\""+this.title+"\" class=\""+this.css+"\">" + this.text + "</a></div> ";

        str += "<div id=\"" + this.id + "-cont\" class=\"webfx-tree-container\" style=\"display: " + ((this.open)?'block':'none') + ";\" nowrap>";

        for (var i = 0; i < this._subItems.length; i++) {

            if (this._subItems[i].text !="@@@"){

                str += this._subItems[i].toString(i,this._subItems.length);

            }

        }

//        alert (str);

        str += "</div>";

    }

    else {

        if (!this.icon) {

            if (webFXTreeHandler.behavior == 'classic') {

//++++++++++++++added by libo++++++++++++++++++++++++

             if (this.users == 'user') {
             	//alert("is user!!!");
             	
                this.icon = treeImgFld + userIcon;

            }else{

//+++++++++++++++++++added end+++++++++++++++++++++++++++

                this.icon = treeImgFld + fileIcon;

                //+++++++++++++++++libo+++++++++++++++++
                }
                //+++++++++++++added end+++++++++++++

            }

            else {

                this.icon = treeImgFld + folderIcon;

                this.openIcon = treeImgFld + openFolderIcon;

            }

        }

        var str = "<div id=\"" + this.id + "\" class=\"webfx-tree-item\" style=\"font-size:9pt\" nowrap>";

        str += indent;

        str += "<img align=absbottom id=\"" + this.id + "-plus\" src=\"" + ((this.parent._wasLast)?treeImgFld + lIcon:treeImgFld + tIcon) + "\">";

        //这是处理叶节点子句

        //str += "<img align=absbottom id=\"" + this.id + "-icon\" src=\"" + this.icon + "\" onclick=\""+this.action+"\"><a href=\"" + this.action + "\" id=\"" + this.id + "-anchor\" onmouseup=\"if(event.button==2){"+this.rgtAction+"}\" title=\""+this.title+"\" class=\""+this.css+"\">" + this.text + "</a></div>";
				str += "<input type=\"checkbox\" id=\"" + this.id + "-anchor\" name=\"" + this.id + "-anchor\" title=\""+this.title+"\" value=\""+this.text+"\">" + this.text + "</div>";
       // alert(str);

    }

    this.plusIcon = ((this.parent._wasLast)?treeImgFld + lPlusIcon:treeImgFld + tPlusIcon);

    this.minusIcon = ((this.parent._wasLast)?treeImgFld + lMinusIcon:treeImgFld + tMinusIcon);

    return str;

}



WebFXTreeItem.prototype.ishavesubitem = function () {

    if(this._subItems.length>0){

        return "yes";

    }

    else{

        return "no";

    }

}



function setCookie(key, value) {

    if (sysUseCookie){

        document.cookie = key + "=" + escape(value);

    }

}



function getCookie(key) {

    if (!sysUseCookie){

        return null;

    }

    if (document.cookie.length) {

        var cookies = ' ' + document.cookie;

        var start = cookies.indexOf(' ' + key + '=');

        if (start == -1) { return null; }

        var end = cookies.indexOf(";", start);

        if (end == -1) { end = cookies.length; }

        end -= start;

        var cookie = cookies.substr(start,end);

        return unescape(cookie.substr(cookie.indexOf('=') + 1, cookie.length - cookie.indexOf('=') + 1));

    }

    else { return null; }

}