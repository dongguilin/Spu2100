package com.oge.spu.service;

import static org.junit.Assert.*;

import org.junit.Test;

public class LogFileServiceTest {
	
	private LogFileService service = new LogFileService();

	@Test
	public void testReadLastContent() throws Exception {
		service.readLastContent("em_new_log");
	}

}
