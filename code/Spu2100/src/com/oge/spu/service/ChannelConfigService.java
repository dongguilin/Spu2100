package com.oge.spu.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.oge.spu.dao.ChannelConfigDao;

public class ChannelConfigService {

	private ChannelConfigDao dao = new ChannelConfigDao();
	private Logger logger = Logger.getLogger(this.getClass());

	public boolean update(String key, String kValue, String bValue) {
		boolean result = false;
		Map<String, String> itemMap = new LinkedHashMap<String, String>();
		itemMap.put("k", kValue);
		itemMap.put("B", bValue);
		try {
			dao.updateConfig(key, itemMap);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	public Map<String, Map<String, String>> queryAll() {
		Map<String, Map<String, String>> result = null;
		try {
			result = dao.loadAll();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

}
