package com.oge.spu.bean;


public class Item {
	
	private String name;
	private String description;
	private String value;
	
	public Item() {
		super();
	}
	
	public Item(String name,  String value) {
		super();
		this.name = name;
		this.value = value;
	}

	public Item(String name, String description, String value) {
		super();
		this.name = name;
		this.description = description;
		this.value = value;
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

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

}
