package com.oge.spu.service;

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.oge.spu.dao.SetupConfigDao;
import com.oge.spu.util.Constants;

public class AlarmConfigService {

	private SetupConfigDao setupConfigDao = new SetupConfigDao();
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

}
