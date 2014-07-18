var ChannelConfig = function () {

    return {
    	//main function to initiate the module
        init: function () {
        	
        	$.post("../ChannelConfServlet",{"operation":"queryAll"},function(data){
        		var obj=jQuery.parseJSON(data);
        		initTable(obj);
        	});
        	
        	//存储上次编辑对象，一次只能有一行为编辑状态
        	var lastEditObj={
        			"isEdit":false,
        			"tr":null,
        			"data":[]
        	};
        	
        	//重置数据
        	function resetLastEditObj(){
        		lastEditObj["idEdit"]=false;
        		lastEditObj["tr"]=null;
        		lastEditObj["data"]=[];
        	}
        	
        	//根据后台返回的json数据初始化表格
        	function initTable(jsonObj){
        		var $tbody=$('#channel_table').find('tbody').empty();
        		for(var key in jsonObj){
        			var itemsObj=jsonObj[key];
        			var $tr=$('<tr>');
        			$tr.append($('<td>').text(key))
        				.append($('<td>').text(itemsObj["k"]))
        				.append($('<td>').text(itemsObj["B"]))
        				.append($('<td><a title="edit" href="javascript:;"><i class="icon-edit"></i>编辑</a></td>'));
        			$tbody.append($tr);
        		}
        	}
        	
        	
        	//编辑，使行进入编辑状态
        	$('#channel_table a[title="edit"]').live('click', function (e) {
                e.preventDefault();
                
                var isEdit=lastEditObj["idEdit"];
                if(isEdit==true){
                	resetRow();
            	}
            	var $tr=$(this).parents('tr:first');
            	var $tds=$tr.find('td');
            	var data=[];
            	data.push($($tds[0]).text());
            	data.push($($tds[1]).text());
            	data.push($($tds[2]).text());
            	$tds[0].innerHTML='<input type="text" class="m-wrap small" name="key" value="' + data[0] + '" disabled>';
            	$tds[1].innerHTML='<input type="text" class="m-wrap small" name="k" value="' + data[1] + '">';
            	$tds[2].innerHTML='<input type="text" class="m-wrap small" name="B" value="' + data[2] + '">';
            	$tds[3].innerHTML='<a title="save"  href="javascript:;"><i class="icon-save"></i>保存</a>'+
            	'&nbsp;&nbsp;&nbsp;<a title="cancel" href="javascript:;">取消</a>';
            	
            	lastEditObj["idEdit"]=true;
            	lastEditObj["tr"]=$tr;
            	lastEditObj["data"]=data;
            });
        	
        	//取消编辑状态
        	$('#channel_table a[title="cancel"]').live('click', function (e) {
                e.preventDefault();
                
                resetRow();
        	});
        	
        	//重置行内容
        	function resetRow(){
        		
        		var $tr=lastEditObj["tr"];
                var $tds=$tr.find('td');
                var data=lastEditObj["data"];
               
        		$tds[0].innerHTML='<td>' + data[0] + '</td>';
        		$tds[1].innerHTML='<td>' + data[1] + '</td>';
        		$tds[2].innerHTML='<td>' + data[2] + '</td>';
        		$tds[3].innerHTML='<td><a title="edit" href="javascript:;"><i class="icon-edit"></i>编辑</a></td>';
                
        		resetLastEditObj();
        	}
        	
        	//保存
        	$('#channel_table a[title="save"]').live('click', function (e) {
                e.preventDefault();
                
                var data={"operation":"update"};
                var $tr=$(this).parents('tr:first');
                var $inputs= $tr.find('input');
                for(var i=0;i<$inputs.length;i++){
                	var name=$($inputs[i]).attr("name");
                	var value=$($inputs[i]).attr("value");
                	data[name]=value;
                }
                
                $.post("../ChannelConfServlet",data,function(result){
                	var obj=jQuery.parseJSON(result);
                	if(obj.success==true){
                		$( "#dialog_updatesuccess" ).dialog( "open" );
                        var $tds=$tr.find('td');
                       
                		$tds[0].innerHTML='<td>' + $($inputs[0]).attr("value")+ '</td>';
                		$tds[1].innerHTML='<td>' + $($inputs[1]).attr("value") + '</td>';
                		$tds[2].innerHTML='<td>' + $($inputs[2]).attr("value") + '</td>';
                		$tds[3].innerHTML='<td><a title="edit" href="javascript:;"><i class="icon-edit"></i>编辑</a></td>';
                		resetLastEditObj();
                	}else{
                		$( "#dialog_updatefail" ).dialog( "open" );
                	}
                });
                
        	});
        	
        	//修改成功提示窗口
		    $("#dialog_updatesuccess").dialog({
		      dialogClass: 'ui-dialog-blue',
		      autoOpen: false,
		      resizable: false,
		      modal: true,
		      buttons: [
		      	{
		      		"text" : "关闭",
		      		'class' : 'btn green',
		      		click: function() {
	        			$(this).dialog( "close" );
	      			}
		      	}
		      ]
		    });
		    
		  //修改失败提示窗口
		    $("#dialog_updatefail").dialog({
		      dialogClass: 'ui-dialog-red',
		      autoOpen: false,
		      resizable: false,
		      modal: true,
		      buttons: [
		      	{
		      		"text" : "关闭",
		      		'class' : 'btn green',
		      		click: function() {
	        			$(this).dialog( "close" );
	      			}
		      	}
		      ]
		    });
        	
        	
        	
        }
    };

}();