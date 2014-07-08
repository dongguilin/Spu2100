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
								+'&nbsp;&nbsp;&nbsp;<a title="restore" href="javascript:;"><i class="icon-share-alt"></i>还原</a>'
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
						alert(data.msg);
					},"json");
				});
			

				$("#" + key).find("a[title='delete']").live('click',function() {
					var name=$(this).parents('tr').find('td:first').text();
					var $tr=$(this).parents('tr:first');
					$.post(url,{"operation":"delete","key":key,"name":name},function(data){
						if(data.success==true){
							$tr.remove();
						}
						alert(data.msg);
					},"json");
				});

			});

		}
	};
}();