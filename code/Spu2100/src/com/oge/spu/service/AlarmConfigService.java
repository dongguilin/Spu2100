package com.oge.spu.service;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.TreeSet;

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

	public boolean addAlarmCombine(String alarmKey, String itemKey,
			String itemValue) {
		boolean result = false;
		try {
			List<Map<String, Map<String, String>>> list = setupConfigDao
					.loadAllForAdd();
			Map<String, Map<String, String>> map = list
					.get(Constants.ALARM_INDEX);
			Map<String, String> items = map.get(alarmKey);

			Set<String> cc = getSet(itemValue);
			Iterator<String> iter = cc.iterator();
			while (iter.hasNext()) {
				String key = iter.next();
				String value = alarmElementConfigDao.get(key);
				items.put(key, value);
			}
			items.put(itemKey, itemValue);
			
			Map<String, Map<String, String>> newMap = new LinkedHashMap<String, Map<String, String>>();
			for (Map<String, Map<String, String>> m : list) {
				newMap.putAll(map);
			}
			setupConfigDao.writeToConf(newMap);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}
	
	public boolean updateAlarmCombine(String alarmKey, String itemKey,
			String itemValue) {
		boolean result = false;
		try {
			List<Map<String, Map<String, String>>> list = setupConfigDao
					.loadAllForAdd();
			Map<String, Map<String, String>> map = list
					.get(Constants.ALARM_INDEX);
			Map<String, String> items = map.get(alarmKey);

			Set<String> cc = getSet(itemValue);
			Iterator<String> iter = cc.iterator();
			while (iter.hasNext()) {
				String key = iter.next();
				String value = alarmElementConfigDao.get(key);
				items.put(key, value);
			}
			items.put(itemKey, itemValue);
			
			Map<String, Map<String, String>> newMap = new LinkedHashMap<String, Map<String, String>>();
			for (Map<String, Map<String, String>> m : list) {
				newMap.putAll(map);
			}
			setupConfigDao.writeToConf(newMap);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}
	
	public boolean removeAlarmCombine(String alarmKey, String itemKey,
			String itemValue) {
		boolean result = false;
		try {
			List<Map<String, Map<String, String>>> list = setupConfigDao
					.loadAllForAdd();
			Map<String, Map<String, String>> map = list
					.get(Constants.ALARM_INDEX);
			Map<String, String> items = map.get(alarmKey);

			Set<String> cc = getSet(itemValue);
			Iterator<String> iter = cc.iterator();
			while (iter.hasNext()) {
				String key = iter.next();
				items.remove(key);
			}
			items.remove(itemKey);
			
			Map<String, Map<String, String>> newMap = new LinkedHashMap<String, Map<String, String>>();
			for (Map<String, Map<String, String>> m : list) {
				newMap.putAll(map);
			}
			setupConfigDao.writeToConf(newMap);
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
	public boolean deleteAlarmElement(String key) {
		boolean result = false;
		try {
			alarmElementConfigDao.delete(key);
			int num = Integer.parseInt(key.substring(1));
			Map<String, List<String>> map = queryAllAlarmElement();
			Iterator<String> iter = map.keySet().iterator();
			while (iter.hasNext()) {
				String k = iter.next();
				int n = Integer.parseInt(k.substring(1));
				if (k.startsWith(key.substring(0, 1)) && n > num) {
					alarmElementConfigDao.delete(k);
					String newk = key.substring(0, 1) + (n - 1);
					alarmElementConfigDao.add(newk,
							convertListToStr(map.get(k)));
				}
			}
			result = true;
		} catch (ConfigurationException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * 查询所有报警元素配置
	 * 
	 * @return
	 */
	public Map<String, List<String>> queryAllAlarmElement() {
		SortedMap<String, List<String>> result = new TreeMap<String, List<String>>();
		Map<String, String> map = alarmElementConfigDao.queryAll();
		Iterator<String> iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = iter.next();
			String value = map.get(key);
			result.put(key, convertStrToList(value));
		}
		return result;
	}

	public Map<String, Map<String, String>> queryAllAlarmCombine() {
		Map<String, Map<String, String>> result = new LinkedHashMap<String, Map<String, String>>();
		try {
			Map<String, Map<String, String>> map = setupConfigDao.loadAlarm();
			Iterator<String> config = map.keySet().iterator();
			while (config.hasNext()) {
				String configKey = config.next();
				Map<String, String> temp = map.get(configKey);
				Map<String, String> itemMap = new LinkedHashMap<String, String>();
				if (temp.containsKey("CC")) {
					itemMap.put("CC", temp.get("CC"));
				}
				if (temp.containsKey("TT")) {
					itemMap.put("TT", temp.get("TT"));
				}
				result.put(configKey, itemMap);
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
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

	private String convertListToStr(List<String> list) {
		String result = "";
		for (String str : list) {
			result = result + str + ",";
		}
		result = result.substring(0, result.length() - 1);
		return result;
	}

	private Set<String> getSet(String str) {
		Set<String> result = new TreeSet<String>();
		str = str.replaceAll("\\*", "");
		str = str.replaceAll("\\+", " ");
		str = str.replaceAll("\\(", " ");
		str = str.replaceAll("\\)", " ");
		str = str.trim();
		String[] strs = str.split(" ");
		for (String s : strs) {
			result.add(s);
		}
		return result;
	}

}
