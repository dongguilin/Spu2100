package com.oge.spu.bean;

import net.sf.json.JSONObject;

/**
 * @author guilin
 *
 */
public class BaseResultBean {

	private boolean success;// 是否成功
	private String msg;// 附加信息

	public BaseResultBean(boolean success, String msg) {
		super();
		this.success = success;
		this.msg = msg;
	}

	public BaseResultBean() {
		super();
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	/**
	 * 
	 * @return json字符串
	 */
	public String toJSONStr() {
		return JSONObject.fromObject(this).toString();
	}

}
