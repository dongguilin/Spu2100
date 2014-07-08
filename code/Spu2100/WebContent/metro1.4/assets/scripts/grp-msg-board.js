	var _msgBoard_button_id_pre = 'msg_board_button_';
	var _msgBoard_button_action_pre = 'todo_';
	var _msgBoard_id = 'msg_board';
	var _msgBoard_bind = 'work_area';
	
	function msgBoard()
	{
		this._json = {'isError':'','isSuccess':'','info':'','detail':'',};
		this._isError = (this._json.isError=='true'?true:false);
		this._isSuccess =  (this._json.isSuccess=='true'?true:false);
		this._buttons = new Array;
		
		this._custom = function (json){		//Ĭ�ϵĴ�����������json�еĲ���״̬���趨��ʾ��ͬ�İ�ť
			if (this._isError){
				$('#' + _msgBoard_button_id_pre + 'retry').show();
				return;
			} 
			if (this._isSuccess){
				$('#' + _msgBoard_button_id_pre + 'new').show();
				$('#' + _msgBoard_button_id_pre + 'edit').show();
				$('#' + _msgBoard_button_id_pre + 'show').show();
				$('#' + _msgBoard_button_id_pre + 'del').show();
				return;
			}else{
				$('#' + _msgBoard_button_id_pre + 'return').show();
				return;
			}
			return;
		};
	}
	
	msgBoard.prototype.isError = function(){
		return this._isError;
	}
	msgBoard.prototype.hide = function(){
		$("#_msg_board").remove();
		$(".doing").show();
		
	}
	msgBoard.prototype.custom = function(func){
		this._custom = func;
	}
	msgBoard.prototype.isSuccess = function(){
		return this._isSuccess;
	}

	msgBoard.prototype.getInfo = function(){
		return this._info;
	}
	msgBoard.prototype.getDetail = function(){
		return this._detail;
	}
	msgBoard.prototype.setJson = function(json){
		this._json = json;
		this._isError = (this._json.isError=='true'?true:false);
		this._isSuccess =  (this._json.isSuccess=='true'?true:false);
	}
	msgBoard.prototype.addButton = function(button){
		this._buttons.push(button);
	}
	msgBoard.prototype.toString = function(){
		var buttons = "";
		
		for(var i=0;i<this._buttons.length;i++){
			
			var icon = '';
			var color = '';
			var text = '';
			var id = '';
			var action = '';
			if (typeof this._buttons[i] == 'string'){
				switch (this._buttons[i]){
					case 'new': icon = 'icon-plus';color = 'blue';text='�������';break;
					case 'edit': icon = 'icon-edit';color = 'blue';text='�༭';break;
					case 'del': icon = 'icon-remove';color = 'blue';text='ɾ��';break;
					case 'show': icon = '';color = 'green';text='��ʾ';break;
					case 'save': icon = 'icon-save';color = 'blue';text='����';break;
					case 'submit': icon = 'icon-ok';color = 'yellow';text='�ύ';break;
					case 'list': icon = 'icon-list';color = 'green';text='�б�';break;
					case 'return': icon = 'icon-signout';color = 'gray';text='����';break;
					case 'refresh':icon = 'icon-refresh';color = 'green';text='ˢ��';break;
					case 'ok': icon = '';color = 'blue';text='ȷ��';break;
					case 'cancel':icon = '';color = 'gray';text='ȡ��';break;
					case 'reset':icon = '';color = 'gray';text='����';break;
					case 'retry':icon = '';color = 'yellow';text='����';break;
				}
				id = _msgBoard_button_id_pre + this._buttons[i];
				action = 'javascript:' + _msgBoard_button_action_pre + this._buttons[i] + "()";
			}else{
				if (this._buttons[i].icon){ icon = this._buttons[i].icon;}
				if (this._buttons[i].color){ color = this._buttons[i].color;}
				if (this._buttons[i].text){ text = this._buttons[i].text;}
				if (this._buttons[i].id){ id = this._buttons[i].id;}
				if (this._buttons[i].action){ id = this._buttons[i].action;}
			}
			buttons = buttons 
					+ "<a id='" + id + "' class='btn " + color + "' href='"+action+"' style='display:none'>"
					+ "<i class='" + icon + "'></i> "
					+ text
					+ "</a>" + " ";
		}
		var s = "<div id='" + _msgBoard_id + "' class='portlet-body' style='display:none'>"
				+ "<div class='alert alert-block fade in " + (this._isError?'alert-error':(this._isSuccess?'alert-success':'alert-warning'))+ "'>"
				+ "<h4 id = 'title' class='alert-heading'>" + (this._isError?'ϵͳ����':(this._isSuccess?'�����ɹ�':'����ʧ��')) + "</h4>"
				+ "<p>&nbsp;</p><p ><span id='info'>&nbsp;&nbsp;" + this._json.info 
				+ (this._json.detail ?("</span>&nbsp;<i class=' show_detail icon-chevron-down' onclick='$(\"#detail\").show();$(this).hide();'></i></p>"+ "<p id='detail' style='display:none;'>&nbsp;&nbsp;" + this._json.detail + "</p>"):"")
				+ "<p>&nbsp;</p>"
				+ "<p>"
				+ buttons
				+ "</p>"
				+ "</div>"
				+ "</div>"
				+ "</div>";
		return s;
	}

	msgBoard.prototype.button = function(button){
		return $('#' + _msgBoard_button_id_pre + button);
	}
	
	msgBoard.prototype.remove = function(){
		$("#" + _msgBoard_id).remove();
	}
	msgBoard.prototype.show = function(json){
		if (typeof json != 'undefined'){
			this.setJson(json);
		}
		this.addButton('return');
		this.addButton('retry');
		$("#" + _msgBoard_bind).hide();
		this.hideMask();
		$("#" + _msgBoard_id).remove();
		$("#" + _msgBoard_bind).after(this.toString());
		this._custom(this._json);				//ִ���û����ƺ���������json����ȷ����ʾ��Щ��ť
		$("#" + _msgBoard_id).show();
		
	}
	
	msgBoard.prototype.showMask = function()
	{
		
		var iTop = $('body').offset().top;
		var iLeft = $('body').offset().left;
		var iHeight =  $('body').height();
		var iWidth =  $('body').width();
		$('body').after("<div class='mask' style='top:"+iTop+"px;left:"+iLeft+"px;width:"+iWidth+"px;height:"+iHeight+"px;'></div>");
		//alert($(".mask").attr("style"));
		$(".mask").show();
	}
	
	msgBoard.prototype.hideMask = function()
	{
		$(".mask").remove();
	}
	msgBoard.prototype.showError = function(info,detail)
	{	
		var s_info = '';
		s_info = info?info:'';
		var s_detail = '';
		s_detail = detail?detail:'';
		var json = {'isError':'true','info':s_info,'detail':s_detail}; 
		this.show(json);
	}
	var msg_board = new msgBoard();
	
	/*ΪϵͳԤ�õİ�ť�ṩ���� */
	function todo_retry(){
		window.location.reload();
	}
	
	function todo_refresh(){
		window.location.reload();
	}
	
	function todo_return(){
		$("#" + _msgBoard_id).remove();
		$("#" + _msgBoard_bind).show();
	}