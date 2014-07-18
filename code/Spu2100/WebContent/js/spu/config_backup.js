var ConfigBackup = function() {
	return {
		init : function() {
			var keys = [ "setup_backup","channel_backup"];
			var url="../BackupConfServlet";
			keys.forEach(function(key) {
				$.post(url, {
					"operation" : "query",
					"key" : key
				}, function(data) {
					$tbody=$("#"+key).find("tbody").empty();
					data.forEach(function(obj){
						$tr=$('<tr>');
						$tr0=$('<td>').text(obj.dir);
						$tr1=$('<td>').text(obj.size+"byte");
						
						var href="../BackupConfServlet?operation=download&key="+key+"&dir="+obj.dir+"&name="+obj.name;
						$tr2=$('<td><a title="download"  href='+href+'><i class="icon-download"></i>下载</a>'
								+'&nbsp;&nbsp;&nbsp;<a title="restore" href="javascript:;"><i class="icon-share-alt"></i>还原到当前备份</a>'
								+'&nbsp;&nbsp;&nbsp;<a title="delete" href="javascript:;"><i class="icon-trash"></i>删除</a></td>');
						$tbody.append($tr.append($tr0).append($tr1).append($tr2));
					});

				}, "json");
				
				$("#" + key).find("a[title='restore']").live('click',function() {
					var dir=$(this).parents('tr').find('td:first').text();
					var name="";
					if(key=="setup_backup"){
						name="setup.conf";
					}else if(key=="channel_backup"){
						name="channel.conf";
					}
					$.post(url,{"operation":"restore","key":key,"dir":dir,"name":name},function(data){
						if(data.success==true){
							$( "#dialog_backupsuccess" ).dialog( "open" );
						}else{
							$( "#dialog_backupfail" ).dialog( "open" );
						}
					},"json");
				});
			

				$("#" + key).find("a[title='delete']").live('click',function() {
					var name=$(this).parents('tr').find('td:first').text();
					var $tr=$(this).parents('tr:first');
					$.post(url,{"operation":"delete","key":key,"name":name},function(data){
						if(data.success==true){
							$( "#dialog_delsuccess" ).dialog( "open" );
							$tr.remove();
						}else{
							$( "#dialog_delfail" ).dialog( "open" );
						}
					},"json");
				});

			});
			
			//修改成功提示窗口
		    $("#dialog_backupsuccess").dialog({
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
		    $("#dialog_backupfail").dialog({
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
		    
		  //删除成功提示窗口
		    $("#dialog_delsuccess").dialog({
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
		    
		  //删除失败提示窗口
		    $("#dialog_delfail").dialog({
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