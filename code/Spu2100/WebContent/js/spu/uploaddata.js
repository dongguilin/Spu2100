var Uploaddata = function() {

	return {
		init : function() {
			
			var baseurl="../SetupConfServlet";
			
			//请求JCL数据
			$.post(baseurl, {
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
			
			//新增或修改的标志
			var JCL_flag="";
			
			//根据json数据填充JCL表格
			function initJCLTable(data){
				var $tbody = $("#JCL").find("tbody").empty();
				for ( var num in data) {
					var $tr = $('<tr>');
					$tr.append($('<td>').text(num).attr("title","key").attr("val",num));
					lastJCL=num;
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
			
			//新增JCL
			$('#add_JCL').live('click',function(){
				JCL_flag="add";
				$('#JCL_info').hide();
				$('#JCL_form').show();
				$('#JCL_form').find('form')[0].reset();
				
				var num=lastJCL.substring(3, lastJCL.length);
				num=parseInt(num)+1;
				
				$("#JCL_form").find("input[name='key']").first().val("JCL"+num);
				$("#JCL_form").find("input[name='MonitorCount']").first().val(num+1);
				
			});
			
			//编辑JCL
			$('#JCL_info').find("a[title='edit']").live('click',function(){
				JCL_flag="update";
				$('#JCL_info').hide();
				var $form=$('#JCL_form');
				$form.show();
				var $tds=$(this).parents('tr:first').find('td');
				for(var i=0;i<$tds.length-1;i++){
					var $td=$($tds[i]);
					$("#JCL_"+$td.attr("title")).val($td.attr("val"));
				}
				
			});
			
			//保存
			$('#JCL_form').find("button:first").click(function(){
				var data=$('#JCL_form').find("form").serialize();
				$.post(baseurl+"?operation="+JCL_flag,data,function(data){
					alert(data.msg);
					if(data.success==true){
						//请求JCL数据
						$.post(baseurl, {
							"operation" : "query",
							"key" : "JCL",
							"type" : "multi"
						}, function(data) {
							initJCLTable(data);
						}, "json");
						$("#JCL_form").hide();
						$("#JCL_info").show();
					}
				},"json");
			});
			
			//取消
			$('#JCL_form').find("button:last").click(function(){
				$('#JCL_form').find('form')[0].reset();
				$('#JCL_info').show();
				$('#JCL_form').hide();
			});
			
			//请求BX数据
			$.post(baseurl, {
				"operation" : "query",
				"key" : "BX",
				"type" : "multi"
			}, function(data) {
				initBXTable(data);
			}, "json");
			
			//监测对象
			var BX_MonitorFunction={
					"0":"振摆",
					"1":"气隙"
			};
			
			//最后一个BX编号
			var lastBX="";
			
			//新增或修改的标志
			var BX_flag="";
			
			//根据json数据填充BX表格
			function initBXTable(data){
				var $tbody = $("#BX").find("tbody").empty();
				for ( var num in data) {
					lastBX=num;
					var $tr = $('<tr>');
					$tr.append($('<td>').text(num).attr("title","key").attr("val",num));
					var items = data[num];
					$.each(items,function(name,value){
						var showtext=value;
						if(name=="MonitorFunction"){
							showtext=BX_MonitorFunction[value];
						}
						$tr.append($('<td>').text(showtext).attr("title",name).attr("val",value));
					});
					$tr.append($('<td><a title="edit" href="javascript:;"><i class="icon-edit"></i>编辑</a></td>'));
					$tbody.append($tr);
				}
			}
			
			//新增BX
			$('#add_BX').live('click',function(){
				BX_flag="add";
				$('#BX_info').hide();
				$('#BX_form').show();
				$('#BX_form').find('form')[0].reset();
				
				var num=lastBX.substring(2, lastBX.length);
				console.log(num);
				num=parseInt(num)+1;
				
				$("#BX_form").find("input[name='key']").first().val("BX"+num);
			});
			
			//编辑BX
			$('#BX_info').find("a[title='edit']").live('click',function(){
				$('#BX_info').hide();
				var $form=$('#BX_form');
				$form.show();
				var $tds=$(this).parents('tr:first').find('td');
				for(var i=0;i<$tds.length-1;i++){
					var $td=$($tds[i]);
					$("#BX_"+$td.attr("title")).val($td.attr("val"));
				}
			});
			
			//保存BX
			$('#BX_form').find("button:first").click(function(){
				var data=$('#BX_form').find("form").serialize();
				$.post(baseurl+"?operation="+BX_flag,data,function(data){
					alert(data.msg);
					if(data.success==true){
						//请求BX数据
						$.post(baseurl, {
							"operation" : "query",
							"key" : "BX",
							"type" : "multi"
						}, function(data) {
							initBXTable(data);
						}, "json");
						$("#BX_form").hide();
						$("#BX_info").show();
					}
				},"json");
				
			});
			
			//取消BX
			$('#BX_form').find("button:last").click(function(){
				$('#BX_form').find('form')[0].reset();
				$('#BX_info').show();
				$('#BX_form').hide();
			});
			
			
			
		}
	};

}();