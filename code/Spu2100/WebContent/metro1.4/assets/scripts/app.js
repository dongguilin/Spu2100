/**
Core script to handle the entire layout and base functions
**/

/* BEGIN : GRP_EXPAND */

	var GRP_BASE = "/cengrp";							//GRP����·��
	var UI_BASE = "/cenui/metro/1.4/assets";		//UI����·��
	
/* END : GRP_EXPAND */

var App = function () {

    // IE mode
    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;

    var sidebarWidth = 225;
    var sidebarCollapsedWidth = 35;

    var responsiveHandlers = [];
    
    /* BEGIN : GRP_EXPAND */
    var AppName = "";
    /* END : GRP_EXPAND */
    
    // theme layout color set
    var layoutColorCodes = {
        'blue': '#4b8df8',
        'red': '#e02222',
        'green': '#35aa47',
        'purple': '#852b99',
        'grey': '#555555',
        'light-grey': '#fafafa',
        'yellow': '#ffb848'
    };

    // last popep popover
    var lastPopedPopover;

    var handleInit = function() {

        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !! navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !! navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !! navigator.userAgent.match(/MSIE 10.0/);
        
        if (isIE10) {
            jQuery('html').addClass('ie10'); // detect IE10 version
        }
    }

    var handleDesktopTabletContents = function () {
        // loops all page elements with "responsive" class and applies classes for tablet mode
        // For Metronic  1280px or less set as tablet mode to display the content properly
        if ($(window).width() <= 1280 || $('body').hasClass('page-boxed')) {
            $(".responsive").each(function () {
                var forTablet = $(this).attr('data-tablet');
                var forDesktop = $(this).attr('data-desktop');
                if (forTablet) {
                    $(this).removeClass(forDesktop);
                    $(this).addClass(forTablet);
                }
            });
        }

        // loops all page elements with "responsive" class and applied classes for desktop mode
        // For Metronic  higher 1280px set as desktop mode to display the content properly
        if ($(window).width() > 1280 && $('body').hasClass('page-boxed') === false) {
            $(".responsive").each(function () {
                var forTablet = $(this).attr('data-tablet');
                var forDesktop = $(this).attr('data-desktop');
                if (forTablet) {
                    $(this).removeClass(forTablet);
                    $(this).addClass(forDesktop);
                }
            });
        }
    }

    var handleSidebarState = function () {
        // remove sidebar toggler if window width smaller than 900(for table and phone mode)
        if ($(window).width() < 980) {
            $('body').removeClass("page-sidebar-closed");
        }
    }

    var runResponsiveHandlers = function () {
        // reinitialize other subscribed elements
        for (var i in responsiveHandlers) {
            var each = responsiveHandlers[i];
            each.call();
        }
    }

    var handleResponsive = function () {
        handleTooltips();
        handleSidebarState();
        handleDesktopTabletContents();
        handleSidebarAndContentHeight();
        handleChoosenSelect();
        handleFixedSidebar();
        runResponsiveHandlers();
    }

    var handleResponsiveOnInit = function () {
        handleSidebarState();
        handleDesktopTabletContents();
        handleSidebarAndContentHeight();
    }

    var handleResponsiveOnResize = function () {
        var resize;
        if (isIE8) {
            var currheight;
            $(window).resize(function() {
                if(currheight == document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }                
                if (resize) {
                    clearTimeout(resize);
                }   
                resize = setTimeout(function() {
                    handleResponsive();    
                }, 50); // wait 50ms until window resize finishes.                
                currheight = document.documentElement.clientHeight; // store last body client height
            });
        } else {
            $(window).resize(function() {
                if (resize) {
                    clearTimeout(resize);
                }   
                resize = setTimeout(function() {
                    handleResponsive();    
                }, 50); // wait 50ms until window resize finishes.
            });
        }   
    }

    //* BEGIN:CORE HANDLERS *//
    // this function handles responsive layout on screen size resize or mobile device rotate.
  
    var handleSidebarAndContentHeight = function () {
        var content = $('.page-content');
        var sidebar = $('.page-sidebar');
        var body = $('body');
        var height;

        if (body.hasClass("page-footer-fixed") === true && body.hasClass("page-sidebar-fixed") === false) {
            var available_height = $(window).height() - $('.footer').height();
            if (content.height() <  available_height) {
                content.attr('style', 'min-height:' + available_height + 'px !important');
            }
        } else {
            if (body.hasClass('page-sidebar-fixed')) {
                height = _calculateFixedSidebarViewportHeight();
            } else {
                height = sidebar.height() + 20;
            }
            if (height >= content.height()) {
                content.attr('style', 'min-height:' + height + 'px !important');
            } 
        }          
    }

    var handleSidebarMenu = function () {
        jQuery('.page-sidebar').on('click', 'li > a', function (e) {
                if ($(this).next().hasClass('sub-menu') == false) {
                    if ($('.btn-navbar').hasClass('collapsed') == false) {
                        $('.btn-navbar').click();
                    }
                    return;
                }

                var parent = $(this).parent().parent();
                var the = $(this);

                parent.children('li.open').children('a').children('.arrow').removeClass('open');
                parent.children('li.open').children('.sub-menu').slideUp(200);
                parent.children('li.open').removeClass('open');

                var sub = jQuery(this).next();
                var slideOffeset = -200;
                var slideSpeed = 200;

                if (sub.is(":visible")) {
                    jQuery('.arrow', jQuery(this)).removeClass("open");
                    jQuery(this).parent().removeClass("open");
                    sub.slideUp(slideSpeed, function () {
                        if ($('body').hasClass('page-sidebar-fixed') == false && $('body').hasClass('page-sidebar-closed') == false) {
                            App.scrollTo(the, slideOffeset);
                        }                       
                        handleSidebarAndContentHeight();
                    });
                } else {
                    jQuery('.arrow', jQuery(this)).addClass("open");
                    jQuery(this).parent().addClass("open");
                    sub.slideDown(slideSpeed, function () {
                        if ($('body').hasClass('page-sidebar-fixed') == false && $('body').hasClass('page-sidebar-closed') == false) {
                            App.scrollTo(the, slideOffeset);
                        }
                        handleSidebarAndContentHeight();
                    });
                }

                e.preventDefault();
            });

        // handle ajax links
        jQuery('.page-sidebar').on('click', ' li > a.ajaxify', function (e) {
                e.preventDefault();
                App.scrollTop();

                var url = $(this).attr("href");
                var menuContainer = jQuery('.page-sidebar ul');
                var pageContent = $('.page-content');
                var pageContentBody = $('.page-content .page-content-body');

                menuContainer.children('li.active').removeClass('active');
                menuContainer.children('arrow.open').removeClass('open');

                $(this).parents('li').each(function () {
                        $(this).addClass('active');
                        $(this).children('a > span.arrow').addClass('open');
                    });
                $(this).parents('li').addClass('active');

                App.blockUI(pageContent, false);

                $.ajax({
                    type: "GET",
                    cache: false,
                    url: url,
                    dataType: "html",
                    success: function(res) 
                    {
                        App.unblockUI(pageContent);
                        pageContentBody.html(res);
                        App.fixContentHeight(); // fix content height
                        App.initUniform(); // initialize uniform elements
                    },
                    error: function(xhr, ajaxOptions, thrownError)
                    {
                        pageContentBody.html('<h4>Could not load the requested content.</h4>');
                        App.unblockUI(pageContent);
                    },
                    async: false
                });
        });
    }

    var _calculateFixedSidebarViewportHeight = function () {
        var sidebarHeight = $(window).height() - $('.header').height() + 1;
        if ($('body').hasClass("page-footer-fixed")) {
            sidebarHeight = sidebarHeight - $('.footer').height();
        }

        return sidebarHeight; 
    }

    var handleFixedSidebar = function () {
        var menu = $('.page-sidebar-menu');

        if (menu.parent('.slimScrollDiv').size() === 1) { // destroy existing instance before updating the height
            menu.slimScroll({
                destroy: true
            });
            menu.removeAttr('style');
            $('.page-sidebar').removeAttr('style');            
        }

        if ($('.page-sidebar-fixed').size() === 0) {
            handleSidebarAndContentHeight();
            return;
        }

        if ($(window).width() >= 980) {
            var sidebarHeight = _calculateFixedSidebarViewportHeight();

            menu.slimScroll({
                size: '7px',
                color: '#a1b2bd',
                opacity: .3,
                position: isRTL ? 'left' : ($('.page-sidebar-on-right').size() === 1 ? 'left' : 'right'),
                height: sidebarHeight,
                allowPageScroll: false,
                disableFadeOut: false
            });
            handleSidebarAndContentHeight();
        }
    }

    var handleFixedSidebarHoverable = function () {
        if ($('body').hasClass('page-sidebar-fixed') === false) {
            return;
        }

        $('.page-sidebar').off('mouseenter').on('mouseenter', function () {
            var body = $('body');

            if ((body.hasClass('page-sidebar-closed') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
                return;
            }

            body.removeClass('page-sidebar-closed').addClass('page-sidebar-hover-on');
            $(this).addClass('page-sidebar-hovering');                
            $(this).animate({
                width: sidebarWidth
            }, 400, '', function () {
                $(this).removeClass('page-sidebar-hovering');
            });
        });

        $('.page-sidebar').off('mouseleave').on('mouseleave', function () {
            var body = $('body');

            if ((body.hasClass('page-sidebar-hover-on') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
                return;
            }

            $(this).addClass('page-sidebar-hovering');
            $(this).animate({
                width: sidebarCollapsedWidth
            }, 400, '', function () {
                $('body').addClass('page-sidebar-closed').removeClass('page-sidebar-hover-on');
                $(this).removeClass('page-sidebar-hovering');
            });
        });
    }

    var handleSidebarToggler = function () {
        // handle sidebar show/hide
        $('.page-sidebar').on('click', '.sidebar-toggler', function (e) {            
            var body = $('body');
            var sidebar = $('.page-sidebar');

            if ((body.hasClass("page-sidebar-hover-on") && body.hasClass('page-sidebar-fixed')) || sidebar.hasClass('page-sidebar-hovering')) {
                body.removeClass('page-sidebar-hover-on');
                sidebar.css('width', '').hide().show();
                e.stopPropagation();
                runResponsiveHandlers();
                return;
            }

            $(".sidebar-search", sidebar).removeClass("open");

            if (body.hasClass("page-sidebar-closed")) {
                body.removeClass("page-sidebar-closed");
                if (body.hasClass('page-sidebar-fixed')) {
                    sidebar.css('width', '');
                }
            } else {
                body.addClass("page-sidebar-closed");
            }
            runResponsiveHandlers();
        });

        // handle the search bar close
        $('.page-sidebar').on('click', '.sidebar-search .remove', function (e) {
            e.preventDefault();
            $('.sidebar-search').removeClass("open");
        });

        // handle the search query submit on enter press
        $('.page-sidebar').on('keypress', '.sidebar-search input', function (e) {
            if (e.which == 13) {
                window.location.href = "extra_search.html";
                return false; //<---- Add this line
            }
        });

        // handle the search submit
        $('.sidebar-search .submit').on('click', function (e) {
            e.preventDefault();
          
                if ($('body').hasClass("page-sidebar-closed")) {
                    if ($('.sidebar-search').hasClass('open') == false) {
                        if ($('.page-sidebar-fixed').size() === 1) {
                            $('.page-sidebar .sidebar-toggler').click(); //trigger sidebar toggle button
                        }
                        $('.sidebar-search').addClass("open");
                    } else {
                        window.location.href = "extra_search.html";
                    }
                } else {
                    window.location.href = "extra_search.html";
            }
        });
    }

    var handleHorizontalMenu = function () {
        //handle hor menu search form toggler click
        $('.header').on('click', '.hor-menu .hor-menu-search-form-toggler', function (e) {
                if ($(this).hasClass('hide')) {
                    $(this).removeClass('hide');
                    $('.header .hor-menu .search-form').hide();
                } else {
                    $(this).addClass('hide');
                    $('.header .hor-menu .search-form').show();
                }
                e.preventDefault();
            });

        //handle hor menu search button click
        $('.header').on('click', '.hor-menu .search-form .btn', function (e) {
                window.location.href = "extra_search.html";
                e.preventDefault();
            });

        //handle hor menu search form on enter press
        $('.header').on('keypress', '.hor-menu .search-form input', function (e) {
                if (e.which == 13) {
                    window.location.href = "extra_search.html";
                    return false;
                }
            });
    }

    var handleGoTop = function () {
        /* set variables locally for increased performance */
        jQuery('.footer').on('click', '.go-top', function (e) {
            App.scrollTo();
            e.preventDefault();
        });
    }

    var handlePortletTools = function () {
        jQuery('body').on('click', '.portlet > .portlet-title > .tools > a.remove', function (e) {
            e.preventDefault();
            jQuery(this).closest(".portlet").remove();
        });

        jQuery('body').on('click', '.portlet > .portlet-title > .tools > a.reload', function (e) {
            e.preventDefault();
            var el = jQuery(this).closest(".portlet").children(".portlet-body");
            App.blockUI(el);
            window.setTimeout(function () {
                App.unblockUI(el);
            }, 1000);
        });

        jQuery('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function (e) {
            e.preventDefault();
            var el = jQuery(this).closest(".portlet").children(".portlet-body");
            if (jQuery(this).hasClass("collapse")) {
                jQuery(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
            } else {
                jQuery(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
            }
        });
    }

    var handleUniform = function () {
        if (!jQuery().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
        if (test.size() > 0) {
            test.each(function () {
                if ($(this).parents(".checker").size() == 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    }

    var handleAccordions = function () {
        $(".accordion").collapse().height('auto');
        var lastClicked;
        //add scrollable class name if you need scrollable panes
        jQuery('body').on('click', '.accordion.scrollable .accordion-toggle', function () {
            lastClicked = jQuery(this);
        }); //move to faq section

        jQuery('body').on('shown', '.accordion.scrollable', function () {
            jQuery('html,body').animate({
                scrollTop: lastClicked.offset().top - 150
            }, 'slow');
        });
    }

    var handleTabs = function () {

        // function to fix left/right tab contents
        var fixTabHeight = function(tab) {
            $(tab).each(function() {
                var content = $($($(this).attr("href")));
                var tab = $(this).parent().parent();
                if (tab.height() > content.height()) {
                    content.css('min-height', tab.height());    
                } 
            });            
        }

        // fix tab content on tab shown
        $('body').on('shown', '.nav.nav-tabs.tabs-left a[data-toggle="tab"], .nav.nav-tabs.tabs-right a[data-toggle="tab"]', function(){
            fixTabHeight($(this)); 
        });

        $('body').on('shown', '.nav.nav-tabs', function(){
            handleSidebarAndContentHeight();
        });

        //fix tab contents for left/right tabs
        fixTabHeight('.nav.nav-tabs.tabs-left > li.active > a[data-toggle="tab"], .nav.nav-tabs.tabs-right > li.active > a[data-toggle="tab"]');

        //activate tab if tab id provided in the URL
        if(location.hash) {
            var tabid = location.hash.substr(1);
            $('a[href="#'+tabid+'"]').click();
        }
    }

    var handleScrollers = function () {
        $('.scroller').each(function () {
                var height;
                if ($(this).attr("data-height")) {
                    height = $(this).attr("data-height");
                } else {
                    height = $(this).css('height');
                }
                $(this).slimScroll({
                        size: '7px',
                        color: '#a1b2bd',
                        position: isRTL ? 'left' : 'right',
                        height:  height,
                        alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                        railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                        disableFadeOut: true
                    });
            });
    }

    var handleTooltips = function () {
        if (App.isTouchDevice()) { // if touch device, some tooltips can be skipped in order to not conflict with click events
            jQuery('.tooltips:not(.no-tooltip-on-touch-device)').tooltip();
        } else {
            jQuery('.tooltips').tooltip();
        }
    }

    var handleDropdowns = function () {
        $('body').on('click', '.dropdown-menu.hold-on-click', function(e){
            e.stopPropagation();
        })
    }

    var handleModal = function () {
        // this function adds .modal-open class to body element for select2 and chosen dropdown hacks
        if (jQuery().modalmanager) {
            return; // skip if Extended Modal plugin is used
        }

        $('body').on('shown', '.modal', function(e){
            $('body').addClass('modal-open');
        });

        $('body').on('hidden', '.modal', function(e){
            if ($('.modal').size() === 0) {
                $('body').removeClass('modal-open');
            }
        });
    }

    var handlePopovers = function () {
        jQuery('.popovers').popover();

        // close last poped popover

        $(document).on('click.popover.data-api',function(e) {
            if(lastPopedPopover){
                lastPopedPopover.popover('hide');
            } 
        });
    }

    var handleChoosenSelect = function () {
        if (!jQuery().chosen) {
            return;
        }

        $(".chosen").each(function () {
            $(this).chosen({
                allow_single_deselect: $(this).attr("data-with-deselect") == "1" ? true : false
            });
        });
    }

    var handleFancybox = function () {
        if (!jQuery.fancybox) {
            return;
        }

        if (jQuery(".fancybox-button").size() > 0) {
            jQuery(".fancybox-button").fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
    }
    
    /* BEGIN : GRP_EXPAND */
    var handlePassword = function () {

    	var panel  = $(".password-panel");
    	
		//��ʼ�����������������
    	panel.html(
			   '<div class="password-mode">'
			  +'  <p>�����µ�����</p>'
			  +'<div class="">'
			  +'	<button class="btn blue">��ǰ����</button>'
			  +'	<input id="old-password" class="m-wrap small" type="password" />'
			  +'</div>'
			  +'<div class="">'
			  +'	<button class="btn green">�µ�����</button>'
			  +'	<input id="new-password" class="m-wrap small" type="password" />'
			  +'</div>'
			  +'<div class="">'
			  +'	<button class="btn green">�ظ�����</button>'
			  +'	<input id="renew-password" class="m-wrap small" type="password" />'
			  +'</div>'
			  +'<div class="center">'
			  +'	<button id="update-password-btn" type="submit" class="btn red">'
			  +'		<i class="icon-ok"></i> ȷ��'
			  +'	</button>'
			  +'	<button id="close-password-panel" type="button" class="btn">'
			  +'		<i class="icon-close"></i>�ر�'
			  +'	</button>'
			  +'</div>'
			  +'</div>'
		);

		//ȡ���޸��������
		$("#close-password-panel",panel).click(function(){
		  	$('.password-mode input').attr("value","");
		  	$('.password-mode .alert').remove();
		  	$('.password-mode').hide();
		});
				
			//�ύ�޸��������
		$("#update-password-btn",panel).click(function(){
		  	//�ж��Ƿ�����ɵ�����
			 
		  	var old_pass = $("#old-password",panel).val();
		  	var new_pass = $("#new-password",panel).val();
		  	var renew_pass = $("#renew-password",panel).val();
		  	
		  	if (old_pass=="" ){
		  		$(".password-mode p",panel).after(App.warningHtml("�����뵱ǰ����."));
		  		$("#old-password",panel)[0].focus();
		  		return;
		  	}
		  	//�ж��Ƿ������µ�����
		  	if (new_pass==""){
		  		$(".password-mode p",panel).after(App.warningHtml("�������µ�����."));
		  		$("#new-password",panel)[0].focus();
		  		return;
		  	}
		  	//�ж��Ƿ��ٴ������µ�����
		  	if (renew_pass==""){
		  		$(".password-mode p",panel).after(App.warningHtml("���ظ�����������."));
		  		$("#renew-password",panel)[0].focus();
		  		return;
		  	}
		  	//�ж���������ľ������Ƿ���ͬ
		  	if (new_pass!=renew_pass){
		  		$(".password-mode p",panel).after(App.warningHtml("��������������벻��ͬ."));
		  		$("#renew-password",panel)[0].focus();
		  		return;
		  	}
		  	$.ajax({
		    	type : "get",
		    	url : GRP_BASE + "/main/sitemesh/system/change_pwd.jsp"+"?old=" + old_pass + "&new=" + new_pass + "&renew=" + renew_pass,
		    	success:function(msg){
		    		if (msg.indexOf("�ɹ�")>=0){
		    			$(".password-mode p",panel).after(App.successHtml(msg));
		    			$('.password-mode input',panel).attr("value","");
		    		}else{
		    			$(".password-mode p",panel).after(App.errorHtml(msg));
		    		}
		    	}
		  	});
		});
    }
    /* END : GRP_EXPAND */
    
    var handleTheme = function () {

        var panel = $('.color-panel');
        /* BEGIN : GRP_EXPAND */
        var themeCssHref = $("#style_color").attr("href");
        //themeCssHref = "./ui/metro-1.3/assets/css/themes/blue.css"
        var p1 = themeCssHref.indexOf("themes") + 7;
        var p2 = themeCssHref.indexOf(".css");
        var themeStr = themeCssHref.substring(p1,p2);
        panel.html(
        		  ' <div class="color-mode-icons icon-color hide"></div>'
				+ '   <div class="color-mode-icons icon-color-close"></div>'
				+ '   <div class="color-mode">'
				+ '	   <p>��ѡ���µ�Ƥ��</p>'
				+ '	   <ul class="inline">'
				+ '		<li class="color-black  color-default" data-style="default"></li>'
				+ '		<li class="color-blue" data-style="blue"></li>'
				+ '		<li class="color-brown"  data-style="brown"></li>'
				+ '		<li class="color-purple"  data-style="purple"></li>'
				+ '		<li class="color-white color-light"  data-style="light"></li>'
				+ '	   </ul>'
				+ '  </div>'
        );
        $('li.color-' + themeStr, panel).addClass("current");
        /* END : GRP_EXPAND */
        
        if ($('body').hasClass('page-boxed') == false) {
            $('.layout-option', panel).val("fluid");
        }
        
        $('.sidebar-option', panel).val("default");
        $('.header-option', panel).val("fixed");
        $('.footer-option', panel).val("default"); 

        //handle theme layout
        var resetLayout = function () {
            $("body").
                removeClass("page-boxed").
                removeClass("page-footer-fixed").
                removeClass("page-sidebar-fixed").
                removeClass("page-header-fixed");

            $('.header > .navbar-inner > .container').removeClass("container").addClass("container-fluid");

            if ($('.page-container').parent(".container").size() === 1) {
                $('.page-container').insertAfter('.header');
            } 

            if ($('.footer > .container').size() === 1) {                        
                $('.footer').html($('.footer > .container').html());                        
            } else if ($('.footer').parent(".container").size() === 1) {                        
                $('.footer').insertAfter('.page-container');
            }

            $('body > .container').remove(); 
        }

        var lastSelectedLayout = '';

        var setLayout = function () {

            var layoutOption = $('.layout-option', panel).val();
            var sidebarOption = $('.sidebar-option', panel).val();
            var headerOption = $('.header-option', panel).val();
            var footerOption = $('.footer-option', panel).val(); 

            if (sidebarOption == "fixed" && headerOption == "default") {
                alert('Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.');
                $('.sidebar-option', panel).val("default");
                sidebarOption = 'default';
            }

            resetLayout(); // reset layout to default state

            if (layoutOption === "boxed") {
                $("body").addClass("page-boxed");

                // set header
                $('.header > .navbar-inner > .container-fluid').removeClass("container-fluid").addClass("container");
                var cont = $('.header').after('<div class="container"></div>');

                // set content
                $('.page-container').appendTo('body > .container');

                // set footer
                if (footerOption === 'fixed' || sidebarOption === 'default') {
                    $('.footer').html('<div class="container">'+$('.footer').html()+'</div>');
                } else {
                    $('.footer').appendTo('body > .container');
                }            
            }

            if (lastSelectedLayout != layoutOption) {
                //layout changed, run responsive handler:
                runResponsiveHandlers();
            }
            lastSelectedLayout = layoutOption;

            //header
            if (headerOption === 'fixed') {
                $("body").addClass("page-header-fixed");
                $(".header").removeClass("navbar-static-top").addClass("navbar-fixed-top");
            } else {
                $("body").removeClass("page-header-fixed");
                $(".header").removeClass("navbar-fixed-top").addClass("navbar-static-top");
            }

            //sidebar
            if (sidebarOption === 'fixed') {
                $("body").addClass("page-sidebar-fixed");
            } else {
                $("body").removeClass("page-sidebar-fixed");
            }

            //footer 
            if (footerOption === 'fixed') {
                $("body").addClass("page-footer-fixed");
            } else {
                $("body").removeClass("page-footer-fixed");
            }

            handleSidebarAndContentHeight(); // fix content height            
            handleFixedSidebar(); // reinitialize fixed sidebar
            handleFixedSidebarHoverable(); // reinitialize fixed sidebar hover effect
        }

        // handle theme colors
        var setColor = function (color) {

            /* BEGIN : GRP_EXPAND */
        	
        	// $('#style_color').attr("href", "assets/css/themes/" + color + ".css");
            $('#style_color').attr("href",  UI_BASE + "/css/themes/" + color + ".css");
            $('#grp_style_color').attr("href", UI_BASE + "/css/themes/" + color + "-grp.css");
            //�����еĿ��ҳ��ѭ�������ÿ��ҳ���ڵ���ʽ
            $("iframe").each(function(i,o){
            	try{
            		$(o).contents().find("#style_color").attr("href", UI_BASE + "/css/themes/" + color + ".css");
            		$(o).contents().find("#grp_style_color").attr("href", UI_BASE + "/css/themes/" + color + "-grp.css");
            	}catch(e){}
            });

            /* END : GRP_EXPAND */
            
            $.cookie('style_color', color);
            
        }

        $('.icon-color', panel).click(function () {
            $('.color-mode').show();
            $('.icon-color-close').show();
        });

        $('.icon-color-close', panel).click(function () {
            $('.color-mode').hide();
            $('.icon-color-close').hide();
        });

        $('li', panel).click(function () {
            var color = $(this).attr("data-style");
            setColor(color);
            $('.inline li', panel).removeClass("current");
            $(this).addClass("current");
            
            /* BEGIN : GRP_EXPAND */
            //�û�����µ�Ƥ����ر�Ƥ��ѡ�����
            $('.color-mode').hide();
            //����ajax��������Ƥ�����Ʊ��浥ϵͳ���ݿ�
            $.ajax({
            	type : "get",
            	url : GRP_BASE + "/main/sitemesh/system/set_skin.jsp",
            	data:"skinType=" + color,
            	success:function(msg){}
          	});
            /* END : GRP_EXPAND */
        });

        $('.layout-option, .header-option, .sidebar-option, .footer-option', panel).change(setLayout);
    }

    var handleFixInputPlaceholderForIE = function () {
        //fix html5 placeholder attribute for ie7 & ie8
        if (isIE8 || isIE9) { // ie7&ie8
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            jQuery('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {

                var input = jQuery(this);

                if(input.val()=='' && input.attr("placeholder") != '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function () {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function () {                         
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    }

    /* BEGIN : GRP_EXPAND */
    //�������ݲ��ֵ���С�߶�
    var setContentMinHeight = function(){
    	if ($("#main").length<=0) return;
    	var height1 = function(){
         	return $(window).height() - $("#main").offset().top - $(".footer").height() - 35;	
        }();
        $("#main").height(height1);
        
    }
     
     //��������iframe�ĸ߶�
     var setIframeHeight = function(){
     	
     	var iframe = $("#main_if");
     	
     	//iframe���ʺϵĸ߶�=�����ҳ����ø߶� - iframe��y����ƫ���� - footer�߶� - ����ֵ
     	var iframeFixHeight = function(){
         	return $(window).height() - iframe.offset().top - $(".footer").height() - 35;	
         }();
         
         //iframe����ҳ��ĸ߶ȣ����ڿ����ҳ�棬�޷���ȡ���᷵��0
     	var iframeContentHeight = function(){
         	
     		try{
     			if (iframeFixHeight == 0) iframeFixHeight = getIframeFixHeight();
     			iframe.height(iframeFixHeight);
     			
     			return iframe[0].contentWindow.document.body.scrollHeight;
     		}catch(e)
     		{
     			return 0;
     		}
         }();
         
         //����ҳ���Լ������ĸ߶ȣ���Ҫ�ڱ�������ҳ��������javascript������getHeight()�����û�ж���ú���������0
         var iframeContentDefineHeight = function(){
         	
         	var iframeSrc = iframe[0].contentWindow.location.href;
 			if (typeof(iframeSrc)== "undefined" || iframeSrc == "" || iframeSrc.indexOf("javascript")==0 ||  iframeSrc.indexOf("about:blank")==0){
 				return 0;
 			}
 			try{
 				return  iframe[0].contentWindow.getHeight();
 			}catch(e)
 			{
 				return 0;
 			}
         }();
 		
     	$("#main_if").height(Math.max(iframeContentDefineHeight,$(".page-sidebar").height(),iframeFixHeight,iframeContentHeight));
     	/*
     	alert("fix�߶ȣ�" + iframeFixHeight 
         		+ "\n" + "���ݸ߶ȣ�" + iframeContentHeight
         		+ "\n" + "������߶ȣ�" + $(".page-sidebar").height()
         		+ "\n" + "IFRAME�߶ȣ�"  + $("#main_if").height()
         		+ "\n"
         		+ "\n" + "page-content�߶ȣ�"  + $(".page-content").height()
         		
         	);
         */
     }

     var handleMainMenu_for_framePage = function () {
         jQuery('.page-sidebar .has-sub > a').click(function () {

             var handleContentHeight = function () {
                 var content = $('.page-content');
                 var sidebar = $('.page-sidebar');

                 if (!content.attr("data-height")) {
                     content.attr("data-height", content.height());
                 }

                 setIframeHeight();

             }

             var last = jQuery('.has-sub.open', $('.page-sidebar'));
             if (last.size() == 0) {
                 //last = jQuery('.has-sub.active', $('.page-sidebar'));
             }
             last.removeClass("open");
             jQuery('.arrow', last).removeClass("open");
             jQuery('.sub', last).slideUp(200);

             var sub = jQuery(this).next();
             if (sub.is(":visible")) {
                 jQuery('.arrow', jQuery(this)).removeClass("open");
                 jQuery(this).parent().removeClass("open");
                 sub.slideUp(200, function () {
                     handleContentHeight();
                 });
             } else {
                 jQuery('.arrow', jQuery(this)).addClass("open");
                 jQuery(this).parent().addClass("open");
                 sub.slideDown(200, function () {
                     handleContentHeight();
                 });
             }
         });
     }
     
     
     
     //handle Frame Page. 
     //censoft add.
     var handleFramePage = function() {
 		
     	setIframeHeight();
     	
     	$(window).resize(function(){
     		setIframeHeight();
     	});
     	
     	$("#main_if").load(function(){
     		
     	});
 		
 		$("#main_if").load(
 			function(){
 	    		setIframeHeight();
 			}
 		);
 		//�˵��е�Ԫ�أ������������м������������
 		$(".menu-a").click(function(){
 			var _id = $(this).attr("id");
 			if (_id ==null || _id.indexOf("m") !=0){
 				return;
 			}else{
 				var _code = _id.substring(1);
 				$(".active").removeClass("active");
 				$(".active").remove();
 				if (_code.length==6){
 					
 					$(this).parent().addClass("active");
 					$(this).children(".title").append("<span class=\"selected\"></span>");
 					//$(this).children(".title").append("<span class=\"selected\"></span>");
 				}else{
 					var _code1 = _code.substring(0,6);
 					$("#m" + _code1).parent().addClass("active");
 					$("#m" + _code1).children(".title").after("<span class=\"selected\"></span>");
 					$(this).parent().addClass("active");

 				}

 				//����·����Ϣ�����м��
 				var bc = "<li>"
 					+ "<i class='icon-home'></i>"
 					+ "&nbsp;&nbsp;"+AppName+"";
 					+ "</li>"
 				
 				for (var i = 6 ; i <= _code.length ; i+=3){
 					var menuName = $("#m" + _code.substring(0,i)).text();
 					bc += "<li><i class='icon-angle-right'></i>";
 					bc += "" + menuName + "</li>";
 				}
 				$(".breadcrumb").html(bc);
 				
 			}
 		});

 		
 		//����iframe����С�߶�
 		var iframeMinHeightSet = 200;			//����iframe����С�߶�
 		var iframeDefaultHeight = -1;
 		var iframe = $("#main_if");
 		function setIframeDefaultHeight()
 		{
 			//ȱʡ�߶�����Ϊpage-content�ĸ߶�
 			var $height ;
 			try{
 				$height = $(".page-content").attr("data-height")-$(".breadcrumb").height()-30;
 				
 			}catch(e){
 				$height = iframeMinHeightSet;
 			}
 			iframeDefaultHeight = $height > iframeMinHeightSet ? $height : iframeMinHeightSet  ;
 			iframe.height(iframeDefaultHeight);
 		};
 		
 		//����iframe�ĺ��ʸ߶ȣ�ʹ֮�����ֹ�������ͬʱ�ֳ���������Ļ
 		function fixIframeHeight()
 		{
 			//����޷���ȡiframe�������ĸ߶ȣ���������߶�Ϊȱʡ�߶�
 			var isOtherSiteUrl = false; 		//����ָʾiframe�д��ڵ������Ƿ���������վ�����ݣ�����ǣ����޷���ȡ��߶�
 			var iframeContentHeight ;
 			var iframeSrc = iframe[0].contentWindow.location.href;
 			
 			if (typeof(iframeSrc)== "undefined" || iframeSrc == "" || iframeSrc.indexOf("javascript")==0)			//�����ȡ����iframe�е�src����srcΪ�ջ�����javascript����
 			{
 				iframe.height(iframeDefaultHeight);			//ֱ������Ĭ�ϸ߶�
 			}else
 			{
 				//��ȡiframe�е�ʵ�����ݵĸ߶�
 				var pageDefinedHeight ;		//����ҳ�Լ������ĸ߶�
 				var pageContentHeight ;		//����ҳ����ó��ĸ߶�
 				//alert("�Ȱ�iframe�ĸ߶Ȼָ���ȱʡ�߶�"+iframeDefaultHeight
 				//	+ "\npage-content�ĸ߶���"+$(".page-content").height());
 				iframe.height(iframeDefaultHeight);		//�Ȱ�iframe�ĸ߶Ȼָ���ȱʡ�߶�
 				
 				//���Ի�ȡҳ��ĸ߶ȣ����ڿ����ҳ�棬�޷���ȡ����ֱ����ת���쳣
 				try{
 					pageContentHeight =iframe.contents().height();
 				}catch(e)
 				{
 					pageContentHeight = -1;
 				}
 				
 				//���Ի�ȡ����ҳ���Լ������ĸ߶ȣ���Ҫ�ڱ�������ҳ��������javascript������getHeight()�����û�ж���ú���������ת���쳣
 				try{
 					pageDefinedHeight = iframe[0].contentWindow.getHeight();
 				}catch(e)
 				{
 					pageDefinedHeight = -1;
 				}

 				//�Ƚ����漸���߶ȣ��ó����ĸ߶ȣ�
 				//  1) ��iframe������ҳ�������ĸ߶�
 				//  2) ��iframe������ҳ�����ĸ߶�
 				
 				var theMaxHeight = -1;
 				if (pageDefinedHeight > theMaxHeight) {theMaxHeight = pageDefinedHeight;}
 				if (pageContentHeight > theMaxHeight) {theMaxHeight = pageContentHeight;}
 				//if ($(".page-container").height()>theMaxHeight) {theMaxHeight = $(".page-container").height();}
 				//alert( $(".page-container").height());
 				//theMaxHeight +=20;
 				
 				//���ͨ�����ַ�������ó������߶ȶ���-1��������iframe�ĸ߶�Ϊȱʡ�߶ȣ�iframeDefaultHeight������������������ֹ�����
 				if (theMaxHeight == -1)
 				{
 					iframe.height(iframeDefaultHeight);
 					iframe.removeClass("if_overflow_hidden").addClass("if_overflow_auto");				//����iframe�а���������
 				}else		//�Ա����߶ȣ�theMaxHeight����ȱʡ�߶ȣ�iframeDefaultHeight��������iframe��ʵ�ʸ߶�Ϊ�����нϴ���
 				{
 					iframe.height(theMaxHeight > iframeDefaultHeight ? theMaxHeight : iframeDefaultHeight );
 					iframe.removeClass("if_overflow_auto").addClass("if_overflow_hidden");				//����iframe�в�����������
 				}
 				
 				//alert(" ҳ���Լ������߶� : " + pageDefinedHeight + "\n ҳ�����ݼ���߶� : "  + pageContentHeight + "\n ��������߶�   : " + theMaxHeight + "\n ---------------------" + "\n iframeȱʡ�߶�   : " + iframeDefaultHeight + "\n\n����iframe���ø߶� : " + $(iframeID).height() );
 			}
 		}
 		
 		var resize_page_content_height = function(){
     		var footer_height = $(".footer").height();
     		var header_height = $(".header").height();
     		var breadcrumb_height = $(".breadcrumb").height();
     		var bheight = document.body.scrollHeight;
     		var dheight = document.documentElement.scrollHeight;
     		var height = bheight>dheight?bheight:dheight;
     		$(".page-content").height(height-header_height-footer_height-breadcrumb_height);
     	}
     	
     	//resize_page_content_height();
     	
 		/*
     	$(window).resize(function(){
     		
     		resize_page_content_height();
     		setIframeDefaultHeight();
 			fixIframeHeight();
     	});
     	
     	*/
 	}
     /* END : GRP_EXPAND */ 
    
    var handleFullScreenMode = function() {
        // mozfullscreenerror event handler
       
        // toggle full screen
        function toggleFullScreen() {
          if (!document.fullscreenElement &&    // alternative standard method
              !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
              document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
          } else {
            if (document.cancelFullScreen) {
              document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            }
          }
        }

        $('#trigger_fullscreen').click(function() {
            toggleFullScreen();
        });
    }

    //* END:CORE HANDLERS *//

    return {

        //main function to initiate template pages
        init: function () {

            //IMPORTANT!!!: Do not modify the core handlers call order.

            //core handlers
            handleInit();
            handleResponsiveOnResize(); // set and handle responsive    
            handleUniform();        
            handleScrollers(); // handles slim scrolling contents 
            handleResponsiveOnInit(); // handler responsive elements on page load

            //layout handlers
            handleFixedSidebar(); // handles fixed sidebar menu
            handleFixedSidebarHoverable(); // handles fixed sidebar on hover effect 
            handleSidebarMenu(); // handles main menu
            handleHorizontalMenu(); // handles horizontal menu
            handleSidebarToggler(); // handles sidebar hide/show            
            handleFixInputPlaceholderForIE(); // fixes/enables html5 placeholder attribute for IE9, IE8
            handleGoTop(); //handles scroll to top functionality in the footer
            handleTheme(); // handles style customer tool

            //ui component handlers
            handlePortletTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
            handleDropdowns(); // handle dropdowns
            handleTabs(); // handle tabs
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleAccordions(); //handles accordions
            handleChoosenSelect(); // handles bootstrap chosen dropdowns     
            handleModal();

            App.addResponsiveHandler(handleChoosenSelect); // reinitiate chosen dropdown on main content resize. disable this line if you don't really use chosen dropdowns.
            handleFullScreenMode() // handles full screen
		 /* BEGIN : GRP_EXPAND */
            handlePassword();
            
            setContentMinHeight();	//���������������С�߶�
            
            //�����û��˵������Ͻ��û���������Ĳ˵���
        	//�޸�Ƥ���˵�
  
            $("#change_style_menu").click(function(){
	          	$('.color-mode').show();
	          });
	          
	          //�޸�����˵�
	          $("#change_password_menu").click(function(){
	  	          $('.password-mode').show();
	          });

	          /* END : GRP_EXPAND */
        },

        fixContentHeight: function () {
            handleSidebarAndContentHeight();
        },

        setLastPopedPopover: function (el) {
            lastPopedPopover = el;
        },

        addResponsiveHandler: function (func) {
            responsiveHandlers.push(func);
        },

        // useful function to make equal height for contacts stand side by side
        setEqualHeight: function (els) {
            var tallestEl = 0;
            els = jQuery(els);
            els.each(function () {
                    var currentHeight = $(this).height();
                    if (currentHeight > tallestEl) {
                        tallestColumn = currentHeight;
                    }
                });
            els.height(tallestEl);
        },

        // wrapper function to scroll to an element
        scrollTo: function (el, offeset) {
            pos = el ? el.offset().top : 0;
            jQuery('html,body').animate({
                    scrollTop: pos + (offeset ? offeset : 0)
                }, 'slow');
        },

        scrollTop: function () {
            App.scrollTo();
        },

        // wrapper function to  block element(indicate loading)
        blockUI: function (el, centerY) {
            var el = jQuery(el); 
            el.block({
            	
            		/* BEGIN : GRP_EXPAND */
                    /*   ԭ������䣺message: '<img src="./assets/img/ajax-loading.gif" align="">',  */
            		message: '<img src= UI_BASE + "/img/ajax-loading.gif" align="">',
                    /* END : GRP_EXPAND */
            		
                    centerY: centerY != undefined ? centerY : true,
                    css: {
                        top: '10%',
                        border: 'none',
                        padding: '2px',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: '#000',
                        opacity: 0.05,
                        cursor: 'wait'
                    }
                });
        },

        // wrapper function to  un-block element(finish loading)
        unblockUI: function (el) {
            jQuery(el).unblock({
                    onUnblock: function () {
                        jQuery(el).removeAttr("style");
                    }
                });
        },

        // initializes uniform elements
        initUniform: function (els) {

            if (els) {
                jQuery(els).each(function () {
                        if ($(this).parents(".checker").size() == 0) {
                            $(this).show();
                            $(this).uniform();
                        }
                    });
            } else {
                handleUniform();
            }

        },

        updateUniform : function(els) {
            $.uniform.update(els);
        },

        // initializes choosen dropdowns
        initChosenSelect: function (els) {
            $(els).chosen({
                    allow_single_deselect: true
                });
        },

        initFancybox: function () {
            handleFancybox();
        },

        getActualVal: function (el) {
            var el = jQuery(el);
            if (el.val() === el.attr("placeholder")) {
                return "";
            }

            return el.val();
        },

        getURLParameter: function (paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },

        // check for device touch support
        isTouchDevice: function () {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        },

        isIE8: function () {
            return isIE8;
        },

        isRTL: function () {
            return isRTL;
        },
        
        /* BEGIN : GRP_EXPAND */
        
        setAppName: function(name){
        	AppName = name;
        },
        
        //����·����Ϣ�����м��
        setPathCrumb : function(menuCode){
			var bc = "<li>"
				+ "<i class='icon-home'></i>"
				+ "&nbsp;&nbsp;"+AppName+"";
				+ "</li>";
			
			for (var i = 6 ; i <= menuCode.length ; i+=3){
				var menuName = $("#m" + menuCode.substring(0,i)).text();

				bc += "<li><i class='icon-angle-right'></i>";
				bc += "" + $.trim(menuName) + "</li>";
			}
			$(".breadcrumb").html(bc);
		},
		 warningHtml:function(info){
        	var s = "<div class='alert'><button class='close' data-dismiss='alert'></button><strong>����!</strong>"+info+"</div>";
        	return s;
        },
        
        // ������Ϣ��ʾ����html�ַ���
        errorHtml:function(info){
        	var s = "<div class='alert  alert-error'><button class='close' data-dismiss='alert'></button><strong>����!</strong>"+info+"</div>";
        	return s;
        },
				
				successHtml:function(info){
        	var s = "<div class='alert  alert-success'><button class='close' data-dismiss='alert'></button><strong>�ɹ�!</strong>"+info+"</div>";
        	return s;
        },
        
        infoHtml:function(info){
        	var s = "<div class='alert  alert-info'><button class='close' data-dismiss='alert'></button><strong>��ʾ!</strong>"+info+"</div>";
        	return s;
        },
		/* END : GRP_EXPAND */
		
        getLayoutColorCode: function (name) {
            if (layoutColorCodes[name]) {
                return layoutColorCodes[name];
            } else {
                return '';
            }
        }

    };

}();