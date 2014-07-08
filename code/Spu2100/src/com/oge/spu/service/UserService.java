package com.oge.spu.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.configuration.reloading.FileChangedReloadingStrategy;

import com.oge.spu.util.EncryptUtil;
import com.oge.spu.util.ProUtil;

public class UserService {

	private static PropertiesConfiguration con = new PropertiesConfiguration();
	private static File file = new File(UserService.class.getResource("/user")
			.getPath());

	static {
		try {
			con.load(file);
			con.setReloadingStrategy(new FileChangedReloadingStrategy());
			// con.setAutoSave(true);//自动保存
		} catch (ConfigurationException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 验证用户名、密码
	 * 
	 * @param username
	 * @param password
	 * @return
	 */
	public boolean validate(String username, String password) {
		boolean result = false;
		String encryName = EncryptUtil.encryptStr(username);
		if (con.containsKey(encryName)) {
			String encryPwd = con.getString(encryName);
			if (encryPwd.equals(EncryptUtil.encryptStr(password))) {
				result = true;
			}
		}
		return result;
	}

	/**
	 * 增加用户
	 * 
	 * @param username
	 * @param password
	 * @throws Exception
	 */
	public boolean addUser(String username, String password) throws Exception {
		boolean result = false;
		String encryName = EncryptUtil.encryptStr(username);
		String encryPwd = EncryptUtil.encryptStr(password);
		con.addProperty(encryName, encryPwd);
		con.save(file);
		result = true;
		return result;
	}

	/**
	 * 是否存在用户
	 * 
	 * @param username
	 * @return
	 */
	public boolean isExist(String username) {
		boolean result = false;
		String encryName = EncryptUtil.encryptStr(username);
		if (con.containsKey(encryName)) {
			result = true;
		}
		return result;
	}

	/**
	 * 删除用户
	 * 
	 * @param username
	 */
	public boolean delUser(String username) {
		boolean result = false;
		String encryName = EncryptUtil.encryptStr(username);
		con.clearProperty(encryName);
		try {
			con.save(file);
			result = true;
		} catch (ConfigurationException e) {
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * 修改用户密码
	 * 
	 * @param username
	 * @param password
	 * @return
	 */
	public boolean updateUserPwd(String username, String password) {
		boolean result = false;
		String encryName = EncryptUtil.encryptStr(username);
		String encryPwd = EncryptUtil.encryptStr(password);
		if (con.containsKey(encryName)) {
			con.setProperty(encryName, encryPwd);
			result = true;
		}
		return result;
	}

	/**
	 * 查询所有用户
	 * 
	 * @return
	 */
	public List<String> queryAll() {
		List<String> result = new ArrayList<String>();
		Iterator<String> iter = con.getKeys();
		while (iter.hasNext()) {
			String encryName = iter.next();
			String name = EncryptUtil.encryptStr(encryName);
			result.add(name);
		}
		return result;
	}

}
