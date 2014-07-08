package com.oge.spu.bean;

import java.util.ArrayList;
import java.util.List;

public class Config {
	
	private String name;
	private String description;
	private List<Item> items;
	public Config() {
		items = new ArrayList<Item>();
	}
	public Config(String name, String description) {
		super();
		this.name = name;
		this.description = description;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public List<Item> getItems() {
		return items;
	}
	public void setItems(List<Item> items) {
		this.items = items;
	}

}
