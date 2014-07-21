var Alarm_config = function() {

	return {

		init : function() {

			$.post("../AlarmConfigServlet", {
				"operation" : "queryAll"
			}, function(data) {
				initBaseTable(data);
			}, "json");
			
			// 存储上次编辑对象，一次只能有一行为编辑状态
			var lastEditObj = {
				"isEdit" : false,
				"tr" : null,
				"data" : {}
			};
			
			//新增或修改的标志
			var baseform_flag="";
			
			// 重置数据
			function resetLastEditObj() {
				lastEditObj.isEdit = false;
				lastEditObj.tr = null;
				lastEditObj.data = {};
			}
			
			// 根据后台返回的json数据初始化表格
			function initBaseTable(data){
				var $tbody=$('#form_base_table').find('tbody').empty();
				$.each(data,function(index,d){
					var $tr=$('<tr>');
					$tr.append($('<td>').text(index));
					for(var i in d){
						$td=$('<td>').text(d[i]);
						$tr.append($td);
					}
					var $con=$('<td><a title="edit" data-toggle="modal" href="#form_base"><i class="icon-edit"></i>编辑</a>'+
							'&nbsp;&nbsp;<a title="delete" href="javascript:;"><i class="icon-trash"></i>删除</a></td>');
					$tr.append($con);
					$tbody.append($tr);
				});
			}
			
			//编辑
			$('#form_base_table').find("a[title='edit']").live('click',function(){
				baseform_flag="update";
				var $tds=$(this).parents('tr:first').find('td');
				for(var i=0;i<$tds.length-1;i++){
					var $td=$($tds[i]);
					var value=$td.text().trim();
					if(i==0){
						$("#v"+i).val(value);
					}else if(i==1||i==3){
						$("#v"+i).find('option[value="'+value+'"]').attr("selected","selected");
					}else{
						$("#v"+i).val(value);
					}
				}
			});
			
			
			$('#addbasebutton').click(function(){
				var $form=$('#form_base').find('form');
				var key=$('#v0').val();
				var value="";
				for(var i=1;i<7;i++){
					value=value+$('#v'+i).val().trim()+",";
				}
				value=value.substring(0, value.length-1);
				$.post("../AlarmConfigServlet", {
					"key" : key,"value":value
				}, function(data) {
					if(data.success==true){
						
					}else{
						
					}
				}, "json");
				
			});
			

		}

	};

}();