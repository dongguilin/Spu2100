package com.oge.spu.service;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import jodd.util.StringUtil;

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
	 * 在报警通道下新增一条报警通道组合配置信息(修改setup.conf文件)
	 * 
	 * @param alarmKey
	 *            报警通道号 [0][1]...[15]
	 * @param itemKey
	 *            报警元素键如： TT 或者 CC
	 * @param itemValue
	 *            报警元素值如： TT=(T0+T1)或者CC=(C0*C1)
	 * @return
	 */
	public boolean addAlarmCombine(String alarmKey, String itemKey,
			String itemValue) {
		boolean result = false;
		try {
			List<Map<String, Map<String, String>>> list = setupConfigDao
					.loadAllForAdd();
			Map<String, Map<String, String>> alarmMap = list
					.get(Constants.ALARM_INDEX);
			Map<String, String> itemMap = alarmMap.get(alarmKey);

			// 添加基本元素T0 T1...或者C0 C1...
			Set<String> set = getSet(itemValue);
			Iterator<String> iter = set.iterator();
			while (iter.hasNext()) {
				String key = iter.next();
				String value = alarmElementConfigDao.getValue(alarmKey, key);
				itemMap.put(key, value);
			}
			// 添加组合元素TT或者CC
			itemMap.put(itemKey, itemValue);

			// 转置List<Map<String, Map<String, String>>>为Map<String, Map<String,
			// String>>
			Map<String, Map<String, String>> newMap = new LinkedHashMap<String, Map<String, String>>();
			for (Map<String, Map<String, String>> m : list) {
				newMap.putAll(m);
			}

			// 写入文件
			setupConfigDao.writeToConf(newMap);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	/**
	 * 
	 * 更新报警通道下的报警通道组合配置信息(修改setup.conf文件)
	 * 
	 * @param alarmKey
	 *            报警通道号 [0][1]...[15]
	 * @param itemKey
	 *            报警元素键如： TT 或者 CC
	 * @param itemValue
	 *            报警元素值如： TT=(T0+T1)或者CC=(C0*C1)
	 * @return
	 */
	public boolean updateAlarmCombine(String alarmKey, String itemKey,
			String itemValue) {
		boolean result = false;
		try {
			List<Map<String, Map<String, String>>> list = setupConfigDao
					.loadAllForAdd();
			Map<String, Map<String, String>> map = list
					.get(Constants.ALARM_INDEX);
			Map<String, String> items = map.get(alarmKey);

			// 为避免脏数据，先移除C0、C1、...CC或者T0、T1、...TT
			Iterator<String> iter = items.keySet().iterator();
			while (iter.hasNext()) {
				String key = iter.next();
				if (itemKey.equals("CC") && key.contains("C")) {
					iter.remove();
				}
				if (itemKey.equals("TT") && key.contains("T")) {
					iter.remove();
				}
			}

			// 添加基本配置元素
			Set<String> set = getSet(itemValue);
			iter = set.iterator();
			while (iter.hasNext()) {
				String key = iter.next();
				String value = alarmElementConfigDao.getValue(alarmKey, key);
				items.put(key, value);
			}
			// 添加组合配置元素
			items.put(itemKey, itemValue);

			// 转置
			Map<String, Map<String, String>> newMap = new LinkedHashMap<String, Map<String, String>>();
			for (Map<String, Map<String, String>> m : list) {
				newMap.putAll(m);
			}
			// 保存
			setupConfigDao.writeToConf(newMap);
			result = true;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
		}
		return result;
	}

	/**
	 * 
	 * 移除报警通道下的报警通道组合配置信息(修改setup.conf文件)
	 * 
	 * @param alarmKey
	 *            报警通道号 [0][1]...[15]
	 * @param itemKey
	 *            报警元素键如： TT 或者 CC
	 * @param itemValue
	 *            报警元素值如： TT=(T0+T1)或者CC=(C0*C1)
	 * @return
	 */
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
				System.out.println(key);
				items.remove(key);
			}
			items.remove(itemKey);

			Map<String, Map<String, String>> newMap = new LinkedHashMap<String, Map<String, String>>();
			for (Map<String, Map<String, String>> m : list) {
				newMap.putAll(m);
			}
			setupConfigDao.writeToConf(newMap);
			result = true;
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

//	/**
//	 * 查询所有报警配置信息
//	 * 
//	 * @return
//	 * @throws Exception
//	 */
//	public List<Map<String, Map<String, String>>> queryAllAlarm() {
//		List<Map<String, Map<String, String>>> result = null;
//		try {
//			result = setupConfigDao.loadAllForAdd();
//		} catch (Exception e) {
//			logger.error(e.getMessage());
//		}
//		return result;
//	}

	/**
	 * 新增或修改报警元素配置信息(修改alarm_item.conf文件)
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean addOrUpdateAlarmElement(String alarmKey, String itemKey,
			String value) {
		boolean result = false;
		try {
			alarmElementConfigDao.addOrUpdateItem(alarmKey, itemKey, value);
			result = true;
		} catch (ConfigurationException e) {
			logger.error(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	/**
	 * 删除报警元素配置信息(修改alarm_item.conf文件)
	 * 
	 * @param alarmKey
	 * @param itemKey
	 * @return
	 */
	public boolean deleteAlarmElement(String alarmKey, String itemKey) {
		boolean result = false;
		try {
			Map<String, Map<String, String>> map = alarmElementConfigDao
					.loadAll();
			Map<String, String> items = map.get(alarmKey);
			items.remove(itemKey);
			alarmElementConfigDao.writeToConf(map);
			result = true;
		} catch (ConfigurationException e) {
			logger.error(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}

	/**
	 * 查询所有报警元素配置信息(查询alarm_item.conf文件)
	 * 
	 * @return
	 */
	public Map<String,Map<String, List<String>>> queryAllAlarmElement() {
		Map<String,Map<String, List<String>>> result = new LinkedHashMap<String,Map<String, List<String>>>();
		try {
			Map<String, Map<String, String>> map = alarmElementConfigDao
					.loadAll();
			Iterator<String> keys=map.keySet().iterator();
			while(keys.hasNext()){
				String key = keys.next();
				Map<String,String> temp=map.get(key);
				Map<String,List<String>> items=new LinkedHashMap<String, List<String>>();
				Iterator<String> itemKeys=temp.keySet().iterator();
				while(itemKeys.hasNext()){
					String itemKey = itemKeys.next();
					String itemValue=temp.get(itemKey);
					items.put(itemKey, convertStrToList(itemValue));
				}
				result.put(key, items);
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return result;
	}
	
	/**
	 * 查询所有组合报警配置信息(查询setup.conf文件)
	 * 
	 * @return
	 */
	public Map<String, Map<String, String>> queryAllAlarmCombine() {
		Map<String, Map<String, String>> result = new LinkedHashMap<String, Map<String, String>>();
		try {
			Map<String, Map<String, String>> alarmMap = setupConfigDao
					.loadAlarm();
			Iterator<String> keys = alarmMap.keySet().iterator();
			while (keys.hasNext()) {
				String key = keys.next();
				Map<String, String> temp = alarmMap.get(key);
				Map<String, String> itemMap = new LinkedHashMap<String, String>();
				if (temp.containsKey("CC")) {
					itemMap.put("CC", temp.get("CC"));
				}
				if (temp.containsKey("TT")) {
					itemMap.put("TT", temp.get("TT"));
				}
				result.put(key, itemMap);
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
		str = str.replaceAll("\\*", " ");
		str = str.replaceAll("\\+", " ");
		str = str.replaceAll("\\(", " ");
		str = str.replaceAll("\\)", " ");
		str = str.trim();
		String[] strs = str.split(" ");
		for (String s : strs) {
			if (!StringUtil.isEmpty(s)) {
				result.add(s);
			}
		}
		return result;
	}

}
