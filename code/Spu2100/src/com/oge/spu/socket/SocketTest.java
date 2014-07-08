package com.oge.spu.socket;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;

public class SocketTest {

	private static String host = "localhost";
	private static int port = 5000;

	public static void main(String[] args) {
		test1();

	}

	// 请求测试开关
	public static void test1() {
		Socket socket = new Socket();
		int timeout = 10000;
		SocketAddress address = new InetSocketAddress(host, port);
		try {
			System.out.println("正在连接服务器...");
			socket.connect(address, timeout);
			System.out.println("成功建立连接");
			System.out.println("请求测试开关");
			writeMsg(socket.getOutputStream());

			byte[] buff = new byte[100];
			System.out.println("收到：");
			socket.getInputStream().read(buff, 0, 100);
			for (byte b : buff) {
				System.out.print(b);
			}
			socket.close();
			System.out.println("\n关闭连接");
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
	
	public static void writeMsg(OutputStream write) throws IOException {
		int length=13;
		byte version =1;
		int type_id_int=0x22;
		short type_id=(short) type_id_int;
		Msg msg = new Msg(length,version,type_id,0,CommonUtil.intToByte(0x22));
		
		write.write(msg.getBuff());
		write.close();
	}

//	public static void write(OutputStream write) throws IOException {
//		// 包头
//		byte[] length = new byte[13];
//		length[0] = 0x01;
//		write.write(length, 0, length.length);
//
//		write.write(1);
//
//		write.write(0x01);
//		write.write(0);
//
//		write.write(0);
//		write.write(0);
//		write.write(0);
//		write.write(0);
//
//		// 包体
//		write.write(0x01);
//		write.write(0);
//
//		write.close();
//	}
	
	
	

}
