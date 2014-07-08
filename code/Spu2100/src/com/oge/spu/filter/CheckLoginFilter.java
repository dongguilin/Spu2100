package com.oge.spu.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 用户是否登录过滤器
 */
public class CheckLoginFilter implements Filter {

	protected FilterConfig filterConfig = null;
	private String redirectURL = null;
	private List<String> notCheckURLList = new ArrayList<String>();
	private String sessionKey = null;

	/**
	 * Default constructor.
	 */
	public CheckLoginFilter() {
	}

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		notCheckURLList.clear();
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		// place your code here
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;

		HttpSession session = httpRequest.getSession();

		if (sessionKey == null) {
			chain.doFilter(request, response);
			return;
		}
		if ((!checkRequestURIIntNotFilterList(httpRequest))
				&& session.getAttribute(sessionKey) == null) {
			httpResponse.sendRedirect(httpRequest.getContextPath()
					+ redirectURL);
			return;
		}
		// pass the request along the filter chain
		chain.doFilter(request, response);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// redirectURL = filterConfig.getInitParameter("redirectURL");
		// sessionKey = filterConfig.getInitParameter("checkSessionKey");
		redirectURL = "/html/login_soft.html";
		sessionKey = "user";

		notCheckURLList.add("/html/login_soft.html");
		notCheckURLList.add("/LoginServlet");

		// String notCheckURLListStr = filterConfig
		// .getInitParameter("notCheckURLList");
		//
		// if (notCheckURLListStr != null) {
		// StringTokenizer st = new StringTokenizer(notCheckURLListStr, ";");
		// notCheckURLList.clear();
		// while (st.hasMoreTokens()) {
		// notCheckURLList.add(st.nextToken());
		// }
		// }
	}

	private boolean checkRequestURIIntNotFilterList(HttpServletRequest request) {
		String uri = request.getServletPath()
				+ (request.getPathInfo() == null ? "" : request.getPathInfo());
		return notCheckURLList.contains(uri);
	}

}
