package com.oge.spu.service;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;

import com.oge.spu.bean.Config;
import com.oge.spu.dao.SetupConfigDao;
import com.oge.spu.util.Constants;

public class SetupConfigService {

	private SetupConfigDao dao = new SetupConfigDao();
	private Logger logger = Logger.getLogger(this.getClass());

	public boolean addJCL(String key, Map<String, String> items) {
		boolean result = false;
		try {
			List<Map<String, Map<String, String>>> list = dao.loadAllForAdd();
			Map<String, Map<String, String>> jclMap = list
					.get(Constants.JCL_INDEX);
			Set<Map.Entry<String, Map<String, String>>> jclset = jclMap
					.entrySet();
			Iterator<Map.Entry<String, Map<String, String>>> iterator = jclset
					.iterator();
			while (iterator.hasNext()) {
				Map.Entry<String, Map<String, String>> entry = iterator.next();
				Map<String, String> map = entry.getValue();
				map.put("MonitorCount", items.get("MonitorCount"));
			}
			jclMap.put(key, items);

			Map<String, Map<String, String>> newMap = new LinkedHashMap<String, Map<String, String>>();
			for (Map<String, Map<String, String>> map : list) {
				newMap.putAll(map);
			}
			dao.writeToConf(newMap);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	public boolean addBX(String key, Map<String, String> items) {
		boolean result = false;
		try {
			List<Map<String, Map<String, String>>> list = dao.loadAllForAdd();
			list.get(Constants.BX_INDEX).put(key, items);

			Map<String, Map<String, String>> newMap = new LinkedHashMap<String, Map<String, String>>();
			for (Map<String, Map<String, String>> map : list) {
				newMap.putAll(map);
			}
			dao.writeToConf(newMap);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	public boolean update(String key, Map<String, String> items) {
		boolean result = false;
		try {
			dao.update(key, items);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	public boolean delete(String key) {
		boolean result = false;
		try {
			dao.delete(key);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	public Config loadSingleTypeConfig(String key) {
		Config config = null;
		try {
			config = dao.loadConfig(key);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return config;
	}

	public Map<String, Map<String, String>> loadMultiTypeConfig(String key) {
		Map<String, Map<String, String>> result = null;
		try {
			result = dao.load(key);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

}
