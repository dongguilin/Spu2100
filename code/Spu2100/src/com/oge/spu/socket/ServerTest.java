package com.oge.spu.socket;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketAddress;

public class ServerTest {

	private ServerSocket server;
	private boolean running = true;

	public ServerTest() {
		try {
			server = new ServerSocket();
			String host = "localhost";
			int port = 5000;
			SocketAddress address = new InetSocketAddress(host, port);
			server.bind(address);
			Socket socket = null;
			while (running) {
				System.out.println("Server监听连接...");
				socket = server.accept();
				MyThread thread = new MyThread(socket);
				System.out.println("连接到" + thread.getName());
				thread.start();

			}
			server.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private class MyThread extends Thread {

		private Socket socket;

		public MyThread(Socket socket) {
			this.socket = socket;
		}

		@Override
		public void run() {
			byte[] buff = new byte[1000];
			try {
				int length = -1;
				InputStream reader = socket.getInputStream();
				// while((length=reader.read(buff))!=-1){
				length = reader.read(buff);
				String str = new String(buff, 0, length);
				System.out.println("Server接收到:" + str);
				// }
				String msg = "这是server发送的消息" + Math.random() * 10;
//				socket.getOutputStream().write(msg.getBytes());
				
				socket.getOutputStream().write(0x02);
				socket.getOutputStream().write(0x03);
				socket.close();
				System.out.println("关闭连接" + this.getName());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

	}

	public void stop() {
		running = false;
	}

	public static void main(String[] args) {
		new ServerTest();

	}

}
