package com.oge.spu.dao;

import java.io.File;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.configuration.reloading.FileChangedReloadingStrategy;

import com.oge.spu.service.UserService;

public class AlarmElementConfigDao {

	private static PropertiesConfiguration proConfiguration = new PropertiesConfiguration();
	private static File file = new File(UserService.class.getResource(
			"/alarm_config.properties").getPath());

	static {
		try {
			proConfiguration.load(file);
			proConfiguration
					.setReloadingStrategy(new FileChangedReloadingStrategy());
		} catch (ConfigurationException e) {
			e.printStackTrace();
		}
	}

	public void add(String key, String value) throws ConfigurationException {
		proConfiguration.addProperty(key, value);
		proConfiguration.save(file);
	}

	public void delete(String key) throws ConfigurationException {
		proConfiguration.clearProperty(key);
		proConfiguration.save(file);
	}

	public void update(String key, String value) throws ConfigurationException {
		proConfiguration.setProperty(key, value);
		proConfiguration.save(file);
	}

	public Map<String, String> queryAll() {
		Map<String, String> result = new LinkedHashMap<String, String>();
		Iterator<String> iter = proConfiguration.getKeys();
		while (iter.hasNext()) {
			String key = iter.next();
			String str=proConfiguration.getProperty(key).toString();
			if(str.length()>2){
				str=str.substring(1,str.length()-1);
			}
			result.put(key, str);
		}
		return result;
	}

}
