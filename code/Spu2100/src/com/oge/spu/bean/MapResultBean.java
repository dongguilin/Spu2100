package com.oge.spu.bean;

import java.util.LinkedHashMap;
import java.util.Map;

import net.sf.json.JSONObject;

/**
 * @author guilin
 *
 */
public class MapResultBean {

	private boolean success;// 是否成功
	private Map<String,Object> data;//数据
	
	public MapResultBean(boolean success, Map<String, Object> data) {
		super();
		this.success = success;
		this.data = data;
	}

	public MapResultBean() {
		super();
		data = new LinkedHashMap<String, Object>();
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}

	/**
	 * 
	 * @return json字符串
	 */
	public String toJSONStr() {
		return JSONObject.fromObject(this).toString();
	}

}
