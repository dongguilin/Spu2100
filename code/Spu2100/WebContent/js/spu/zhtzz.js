var Zhtzz = function() {

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
			
			//最后一个JCL编号
			var lastJCL="";
			
			//根据json数据填充JCL表格
			function initJCLTable(data){
				var $tbody = $("#JCL").find("tbody").empty();
				for ( var num in data) {
					var $tr = $('<tr>');
					$tr.append($('<td>').text(num));
					lastJCL=num;
					var items = data[num];
					$.each(items,function(name,value){
						if(name=="calcMethord"){
							value=JCL_calcMethord[value];
						}else if(name=="monitorUnit"){
							value=JCL_monitorUnit[value];
						}else if(name=="Uploading"){
							value=JCL_boolean[value];
						}
						$tr.append($('<td>').text(value));
					});
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
					$tbody.append($tr);
				}
			}
			
			//新增JCL
			$('#add_JCL').live('click',function(){
				$('#JCL_info').hide();
				$('#JCL_form').show();
				
				var num=lastJCL.substring(3, lastJCL.length);
				num=parseInt(num)+1;
				
				$("#JCL_form").find("input[name='key']").first().val("JCL"+num);
				$("#JCL_form").find("input[name='MonitorCount']").first().val(num+1);
				
			});
			
			//保存
			$('#ok').click(function(){
				var url="../SetupConfServlet?operation=add&";
				var data=$('#JCL_form').find("form").serialize();
				var key=$("#JCL_form").find("input[name='key']").first().val();
				var MonitorCount=$("#JCL_form").find("input[name='MonitorCount']").first().val();
				url=url+"key="+key+"&"+data+"&MonitorCount"+MonitorCount;
				$.get(url,function(data){
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