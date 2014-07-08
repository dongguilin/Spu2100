package com.oge.spu.service;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.junit.Test;

public class JSONTest {

	@Test
	public void test1(){
		Map<String,String> map = new LinkedHashMap<String, String>();
		map.put("name", "guilin");
		map.put("age", "25");
		map.put("address", "henan");
		System.out.println(JSONArray.fromObject(map).toString());
		JSONObject obj = JSONObject.fromObject(map);
		System.out.println(obj);
		Iterator<String> iter=obj.keys();
		while(iter.hasNext()){
			String key = iter.next();
			System.out.println(key+","+obj.getString(key));
		}
	}
}
