package com.oge.spu.service;

import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.commons.configuration.ConfigurationException;
import org.junit.Test;

import com.oge.spu.dao.AlarmElementConfigDao;

public class AlarmElementConfigDaoTest {
	
	private AlarmElementConfigDao dao = new AlarmElementConfigDao();
	
	@Test
	public void testQueryAll(){
		Map<String,String> map = dao.queryAll();
		System.out.println(JSONObject.fromObject(map).toString());
	}
	
	@Test
	public void testUpdate() throws ConfigurationException{
		dao.update("T0", "0,1,0,50,0,5");
	}

}
