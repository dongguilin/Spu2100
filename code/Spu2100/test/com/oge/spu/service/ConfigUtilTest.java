package com.oge.spu.service;

import java.util.Map;

import net.sf.json.JSONObject;

import org.junit.Test;

import com.oge.spu.util.ConfigUtil;

public class ConfigUtilTest {
	
	@Test
	public void test1(){
		Map<String,Map<String,String>> map = ConfigUtil.load("AD");
		System.out.println(JSONObject.fromObject(map).toString());
	}

}
