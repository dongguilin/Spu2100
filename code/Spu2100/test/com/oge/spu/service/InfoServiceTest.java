package com.oge.spu.service;

import org.junit.Test;

public class InfoServiceTest {
	
	private InfoService service = new InfoService();
	
	@Test
	public void testGetSpuVersionInfo() throws Exception{
		String str=service.getSpuVersionInfo();
		System.out.println(str);
	}

}
