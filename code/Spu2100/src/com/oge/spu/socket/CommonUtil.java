package com.oge.spu.socket;

public class CommonUtil {
	
	/**
	 * 将int转为低字节在前，高字节在后的byte数组
	 */
	public static byte[] intToByte(int n) {
		byte[] b = new byte[4];
		b[0] = (byte) (n & 0xff);
		b[1] = (byte) (n >> 8 & 0xff);
		b[2] = (byte) (n >> 16 & 0xff);
		b[3] = (byte) (n >> 24 & 0xff);
		return b;
	}
	
	/**
	 * 将short转为低字节在前，高字节在后的byte数组
	 */
	public static byte[] shortToByte(int n) {
		byte[] b = new byte[2];
		b[0] = (byte) (n & 0xff);
		b[1] = (byte) (n >> 8 & 0xff);
		return b;
	}

}
