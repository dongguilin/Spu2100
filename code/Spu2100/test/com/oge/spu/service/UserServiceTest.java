package com.oge.spu.service;

import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.junit.Test;

public class UserServiceTest {
	
	private UserService service=new UserService();

	@Test
	public void testAddUser() {
		String username="guilin";
		if(!service.isExist(username)){
//			service.addUser(username, "guilin");
		}
	}

	@Test
	public void testQueryAll() {
		List<String> users=service.queryAll();
		System.out.println(users.size());
		JSONArray array=JSONArray.fromObject(users);
		System.out.println(array);
	}

}
