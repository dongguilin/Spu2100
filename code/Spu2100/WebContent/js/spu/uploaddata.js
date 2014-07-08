var Uploaddata = function() {

	return {
		init : function() {
			
			var url="../SetupConfServlet";
			
			//请求JCL数据
			$.post(url, {
				"operation" : "query",
				"key" : "JCL",
				"type" : "multi"
			}, function(data) {
				initJCLTable(data);
			}, "json");
			
			//计算方法
			var JCL_calcMethord={
					"1":"转速",
					"2":"开关量",
					"3":"报警量",
					"4":"平均值(Ave)",
					"5":"峰值(PP)",
					"6":"平均气隙(Ave)",
					"7":"最大气隙(Max)",
					"8":"最小气隙(Min)",
					"9":"低频峰峰值(LowPP)",
					"10":"高频峰峰值(HigPP)",
					"11":"1X峰峰值(BanPP)"
			};
			
			//单位
			var JCL_monitorUnit={
				"0":"um",
				"1":"mm/s",
				"2":"KPa",
				"3":"MW",
				"4":"%",
				"5":"A",
				"6":"V",
				"7":"℃",
				"8":"m",
				"9":"mA",
				"10":"mV",
				"11":"m3/s",
				"12":"MVar",
				"13":"mm",
				"14":"db"
			};
			
			var JCL_boolean={
					"True":"是",
					"False":"否"
			};
			
			//根据json数据填充JCL表格
			function initJCLTable(data){
				var $tbody = $("#JCL").find("tbody").empty();
				for ( var num in data) {
					var $tr = $('<tr>');
					$tr.append($('<td>').text(num).attr("title","key").attr("val",num));
					var items = data[num];
					$.each(items,function(name,value){
						var showtext=value;
						if(name=="calcMethord"){
							showtext=JCL_calcMethord[value];
						}else if(name=="monitorUnit"){
							showtext=JCL_monitorUnit[value];
						}else if(name=="Uploading"){
							showtext=JCL_boolean[value];
						}
						$tr.append($('<td>').text(showtext).attr("title",name).attr("val",value));
					});
					$tr.append($('<td><a title="edit" href="javascript:;"><i class="icon-edit"></i>编辑</a></td>'));
					$tbody.append($tr);
				}
			}
			
			//请求BX数据
			$.post(url, {
				"operation" : "query",
				"key" : "BX",
				"type" : "multi"
			}, function(data) {
				initBXTable(data);
			}, "json");
			
			//根据json数据填充BX表格
			function initBXTable(data){
				var $tbody = $("#BX").find("tbody").empty();
				for ( var config in data) {
					var $tr = $('<tr>');
					$tr.append($('<td>').text(config));
					var items = data[config];
					for ( var i in items) {
						$tr.append($('<td>').text(items[i]));
					}
					$tr.append($('<td><a title="edit" href="javascript:;"><i class="icon-edit"></i>编辑</a></td>'));
					$tbody.append($tr);
				}
			}
			
			//编辑JCL
			$('#JCL_info').find("a[title='edit']").live('click',function(){
				$('#JCL_info').hide();
				var $form=$('#JCL_form');
				$form.show();
				var $tds=$(this).parents('tr:first').find('td');
				for(var i=0;i<$tds.length-1;i++){
					var $td=$($tds[i]);
					$("#"+$td.attr("title")).val($td.attr("val"));
				}
				
			});
			
			//保存
			$('#ok').click(function(){
				var url="../SetupConfServlet?operation=update";
				var data=$('#JCL_form').find("form").serialize();
				var key=$("#JCL_form").find("input[name='key']").first().val();
//				var MonitorCount=$("#JCL_form").find("input[name='MonitorCount']").first().val();
//				url=url+"key="+key+"&"+data+"&MonitorCount"+MonitorCount;
				$.post(url,data,function(data){
					console.log(data);
				},"json");
				
			});
			
			//取消
			$('#cancel').click(function(){
				$('#JCL_form').find('form')[0].reset();
				$('#JCL_info').show();
				$('#JCL_form').hide();
			});
			
		}
	};

}();