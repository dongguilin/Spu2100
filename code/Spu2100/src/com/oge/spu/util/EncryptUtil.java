package com.oge.spu.util;


public class EncryptUtil {
	

	/**
	 * 加密解密算法 执行一次加密，两次解密
	 */ 
	public static String encryptStr(String inStr){

//		char[] a = inStr.toCharArray();
//		for (int i = 0; i < a.length; i++){
//			a[i] = (char) (a[i] ^ '5');
//		}
//		String s = new String(a);
//		return s;
		return inStr;

	}

	// 测试主函数
	public static void main(String args[]) {
		String s = new String("tangfuqiang");
		System.out.println("原始：" + s);
		System.out.println("加密的：" + encryptStr(s));
		System.out.println("解密的：" + encryptStr(encryptStr(s)));

	}

}
