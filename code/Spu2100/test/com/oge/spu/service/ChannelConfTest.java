package com.oge.spu.service;

import java.util.Map;

import net.sf.json.JSONObject;

import org.junit.Test;

import com.oge.spu.util.ChannelConfUtil;

public class ChannelConfTest {

	@Test
	public void testQuery(){
		Map<String,Map<String,String>> map=ChannelConfUtil.loadAll();
		System.out.println(JSONObject.fromObject(map).toString());
	}
}
