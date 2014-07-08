package com.oge.spu.socket;

public class Msg {
	
	//包头
	private int length;
	private byte version;
	private short type_id;
	private int msn;
	//包体
	private byte[] msg;
	
	private byte[] buff=new byte[100];
	
	public Msg() {
		super();
	}
	
	public Msg(int length, byte version, short type_id, int msn, byte[] msg) {
		super();
		this.length = length;
		this.version = version;
		this.type_id = type_id;
		this.msn = msn;
		this.msg = msg;
		
		
		byte[] temp=CommonUtil.intToByte(length);
		System.arraycopy(temp,0,buff,0,temp.length);
		
		buff[4]=version;
		
		temp=CommonUtil.shortToByte(type_id);
		System.arraycopy(temp,0,buff,5,temp.length);
		
		System.arraycopy(msg,0,buff,7,msg.length);
	}

	public byte[] getBuff() {
		return buff;
	}

	public void setBuff(byte[] buff) {
		this.buff = buff;
	}

	public int getLength() {
		return length;
	}

	public void setLength(int length) {
		this.length = length;
	}

	public byte getVersion() {
		return version;
	}

	public void setVersion(byte version) {
		this.version = version;
	}

	public short getType_id() {
		return type_id;
	}

	public void setType_id(short type_id) {
		this.type_id = type_id;
	}

	public int getMsn() {
		return msn;
	}

	public void setMsn(int msn) {
		this.msn = msn;
	}

	public byte[] getMsg() {
		return msg;
	}

	public void setMsg(byte[] msg) {
		this.msg = msg;
	}

}
