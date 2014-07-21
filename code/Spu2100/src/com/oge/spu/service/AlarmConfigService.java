package com.oge.spu.service;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.log4j.Logger;

import com.oge.spu.dao.AlarmElementConfigDao;
import com.oge.spu.dao.SetupConfigDao;
import com.oge.spu.util.Constants;

public class AlarmConfigService {

	private SetupConfigDao setupConfigDao = new SetupConfigDao();
	private AlarmElementConfigDao alarmElementConfigDao = new AlarmElementConfigDao();
	private Logger logger = Logger.getLogger(this.getClass());

	/**
	 * 
	 * 在alarmKey下新增一条报警配置信息
	 * 
	 * @param alarmKey
	 * @param itemKey
	 * @param itemValue
	 * @return
	 */
	public boolean addAlarmItem(String alarmKey, String itemKey,
			String itemValue) {
		boolean result = false;
		try {
			List<Map<String, Map<String, String>>> list = setupConfigDao
					.loadAllForAdd();
			Map<String, String> map = list.get(Constants.ALARM_INDEX).get(
					alarmKey);
			map.put(itemKey, itemValue);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	/**
	 * 查询所有报警配置信息
	 * 
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Map<String, String>>> queryAllAlarm() {
		List<Map<String, Map<String, String>>> result = null;
		try {
			result = setupConfigDao.loadAllForAdd();
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	/**
	 * 新增报警配置元素
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean addAlarmElement(String key, String value) {
		boolean result = false;
		try {
			alarmElementConfigDao.add(key, value);
			result = true;
		} catch (ConfigurationException e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	/**
	 * 修改报警配置元素
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean updateAlarmElement(String key, String value) {
		boolean result = false;
		try {
			alarmElementConfigDao.update(key, value);
			result = true;
		} catch (ConfigurationException e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	/**
	 * 删除报警配置元素
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean deleteAlarmElement(String key, String value) {
		boolean result = false;
		try {
			alarmElementConfigDao.delete(key);
			result = true;
		} catch (ConfigurationException e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	/**
	 * 查询所有报警元素配置
	 * 
	 * @return
	 */
	public Map<String, List<String>> queryAllAlarmElement() {
		Map<String, List<String>> result = new LinkedHashMap<String, List<String>>();
		Map<String, String> map = alarmElementConfigDao.queryAll();
		Iterator<String> iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = iter.next();
			String value = map.get(key);
			result.put(key, convertStrToList(value));
		}
		return result;
	}

	private List<String> convertStrToList(String str) {
		List<String> result = new LinkedList<String>();
		String[] array = str.split(",");
		for (String value : array) {
			result.add(value);
		}
		return result;
	}

}
