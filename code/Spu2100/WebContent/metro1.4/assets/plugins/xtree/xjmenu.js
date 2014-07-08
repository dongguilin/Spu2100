function mouseRightClick(){

    

window.event.returnValue=false;

};

function setUseRightClick(useRight){

    if (useRight){

        document.oncontextmenu=mouseRightClick;

    }else{

        document.oncontextmenu="";

    }

};



var menuImgFld = "../tree/images/";

function setMenuImgPath(sPath){

    menuImgFld = sPath + "/images/";

};



var MenuImage = 

{

    Name:new Array("copy","cut","paste","delete","exit","refresh","new","save","blue","red","yellow","view"),

    Pic:new Array("copy.gif","cut.gif","paste.gif","delete.gif","exit.gif","refresh.gif","new.gif","save.gif","blue.gif","red.gif","yellow.gif","view.gif")

};

var DefaultPic="view.gif";

function getMenuImage(name)

{

    var Name=MenuImage.Name;

    var Pic=MenuImage.Pic;

    for(var i=0;i<Name.length;i++){

        if (Name[i]==name)

        {

            return menuImgFld + Pic[i];

        }

    }

    return menuImgFld + DefaultPic;

};

function XJPopupMenu()

{

    var pMenu='';

    var OverColor='#BAE3F9';

    var OutColor='#d4d0c8';

    var DisColor='#888888';

    var ItemStyleStr;

    var MMax=21;

    var Width=200;

    var IHeight=25;

    var TrueHeight=-1;

    var UnderLine="false";

    var SS;

    var SPEnable="false";

    var MenuTitle="";



    // *** XJPopupMenu.prototype Start *** */

    var privateVar =

    {

        Items:new Array(),

        Props:new Array()

    };

    this.GetItems=function()

    {

        return privateVar.Items;

    };

    this.GetProps=function()

    {

        return privateVar.Props;

    };

    this.AddItem=function(name,tObj,fObj)

    {

        var Obj=new Array(tObj,fObj);

        this.GetItems().push(Obj);

        this.GetProps().push(name);

    };

    this.setItemEnable=function(name,prop)

    {

        var Props=this.GetProps();

        var Items=this.GetItems();

        var Item=null;

        var index=-1;

        for(var i=0;i<Props.length;i++)

        {

            if (Props[i]==name)

            {

                Item=Items[i];

                index=i;

            }

        }

        if (index==-1)

        {

            return;

        }

        var obj=Item[0];

        if (typeof obj == 'object')

        {

            if (obj.length==1)

            {

                obj[1]="";

                obj[2]=prop;

            }else if (obj.length==2)

                obj[2]=prop;

            else

                obj[2]=prop;

        }else{

            obj=new Array();

            obj[0]=Item[0];

            obj[1]="";

            obj[2]=prop;

        }

        Item[0]=obj;

        //this.GetItems().splice(index,1,Item);

    };

    this.setItemJScript=function(name,jscript)

    {

        var Props=this.GetProps();

        var Items=this.GetItems();

        var Item=null;

        var index=-1;

        for(var i=0;i<Props.length;i++)

        {

            if (Props[i]==name)

            {

                Item=Items[i];

                index=i;

            }

        }

        if (index==-1)

        {

            return;

        }

        var obj=Item[0];

        if (typeof obj == 'object')

        {

            if (obj.length==1)

            {

                obj[1]="";

                obj[2]="";

            }else if (obj.length==2)

                obj[2]="";

            else

                obj[2]="";

        }else{

            obj=new Array();

            obj[0]=Item[0];

            obj[1]="";

            obj[2]="";

        }

        Item[0]=obj;

        Item[1]=jscript;

        //this.GetItems().splice(index,1,Item);

    };

    this.ClearItems=function()

    {

        var Items=this.GetItems();

        var Props=this.GetProps();

        var len=Items.length;

        for(var i=0;i<len;i++) {

            Items.pop();

            Props.pop();

        }

    };

    // *** XJPopupMenu.prototype End *** */



    this.SetSp=function(str)

    {

        SPEnable=str;

    };

    this.AddUnderLine=function(str)

    {

        UnderLine=str;

    };

    function CreateItem(iObj,order)

    {

        var ObjStr,OutStr,PicStr,StyleStr,OverStr,Title,UStyleStr,ClickStr,VALignStr;

        if((typeof iObj[0])=="object"&&iObj[0][0]=='-')

        {

            SS++;                  

            return '<tr style="height:15px;"><td colspan=2><hr size="1" style="color:black"></td></tr>';

        }

        

        if((typeof iObj[0])=='object'&&iObj[0][2]=="disable")

        {

            ObjStr='';

            StyleStr='style="color:'+DisColor+'"';

            OverStr='';

             OutStr='';

            ClickStr='';

        }

        else

        {

            ObjStr='';

            StyleStr='style="cursor:hand;background:'+OutColor+'" ';

            OverStr='onmouseover="this.style.background=pTable.OverColor" '; 

            OutStr='onmouseout="this.style.background=pTable.OutColor" ';

            ClickStr='onclick="'+iObj[1]+';document.pMenu.hide();" ';

        } 

        if((typeof iObj[0])=='object')

        {

            if(iObj[0][1]!='')

            {

                PicStr='<img src="'+getMenuImage(iObj[0][1])+'">';

            }

            else

            {

                PicStr='&nbsp;';

            }

            Title=iObj[0][0];

        }

        else

        {

            PicStr='<img src="'+DefaultPic+'">';

            Title=iObj[0];

        }

         if(UnderLine=="true")

            UStyleStr='text-decoration :underline;';

        else

            UStyleStr='';        

        if(order==0)

            VAlignStr='vertical-align:middle;';

        else

            VAlignStr='vertical-align:middle;';

        return '<TR '+StyleStr+ObjStr+OutStr+ClickStr+OverStr+'><td width="20" align="middle">'+PicStr+'</td><td style="'+VAlignStr+'font-size:12px;'+UStyleStr+'height:'+IHeight+';width:'+Width+'">'+Title+'</td></TR>';

    };

    this.SetMenuTitle=function(Title)

    {

        MenuTitle=Title;

    }

    this.SetItemWidth=function(iWidth)

    {

        if (iWidth>100)

            Width=iWidth;

    };

    this.SetItemHeight=function(iHeight)

    {

        if (iHeight>25)

            IHeight=iHeight;

    };

    this.BuildMenu=function()

    {

        var iObj,iItem,oBody;

        var mObj=this.GetItems();

        TrueHeight=-1;

        try

        {

            if(mObj&&mObj.length>0)

            {    

                iItem='<TABLE id=pTable style="width:100%;background:'+OutColor+'" OutColor='+OutColor+' OverColor='+OverColor+' border="0" cellpadding="0" cellspacing="0">';

                if(SPEnable=="true")

                {

                    iItem+='<TR><TD style="filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0, StartColorStr=\'#00ff00\', EndColorStr=\'#0000FF\')" style="vertical-align:middle;" width="22" height="100%">';

                    iItem+='<DIV style="text-align:center;center;color:white;font-size:14px;font-weight:bolder">'+MenuTitle+'</DIV><DIV>&nbsp;</DIV>';

                    iItem+='</TD>';

                    iItem+='<TD>';

                    iItem+='<TABLE style="height:100%;width:100%" border="0" cellpadding="0" cellspacing="0">';

                }

                SS=0;

                for(var i=0;i<mObj.length;i++)

                {

                    iObj=mObj[i];

                    iItem+=CreateItem(iObj,i);

                }    

                if(SPEnable=="true")

                {

                    iItem+='</TABLE></TD></TR>';

                }

                iItem+='</TABLE>';

                pMenu=window.createPopup();

                

                pMenu.document.pWindow=window;

                pMenu.document.pMenu=pMenu;

                                

                oBody = pMenu.document.body;

                oBody.style.border = "1px solid";

                oBody.style.padding = "0";

                oBody.style.margin = "0";



                oBody.oncontextmenu=function()

                {

                    return false;

                };

                if(this.GetItems().length>MMax)

                    oBody.style.overflow="scroll";

                else

                    oBody.style.overflow="hidden";                                

                oBody.innerHTML = iItem;

            }

        }                        

        catch(e)

        {

            alert(e.description);

        }    

    };

    this.ShowMenu=function(x,y,obj)

    {

        this.BuildMenu();

        var ILen=this.GetItems().length;

        ILen=(ILen>MMax)?MMax:ILen;

        if(obj)

        {

            if(TrueHeight==-1)

                TrueHeight=IHeight*(ILen-SS)+SS*15+2;            

            pMenu.show(x,y,Width+2,TrueHeight,obj);            

        }

        else

        {

            if(TrueHeight==-1)

                TrueHeight=IHeight*(ILen-SS)+SS*15+2;

            pMenu.show(x,y,Width+2,TrueHeight);            

        }

    };

    this.HideMenu=function()

    {

        pMenu.hide();

    };

};

