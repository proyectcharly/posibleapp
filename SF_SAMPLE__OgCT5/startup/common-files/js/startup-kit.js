/**
 * JavaScript code for all ui-kit components.
 * Use namespaces.
 */

window.isRetina = (function() {
    var root = ( typeof exports == 'undefined' ? window : exports);
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
    if (root.devicePixelRatio > 1)
        return true;
    if (root.matchMedia && root.matchMedia(mediaQuery).matches)
        return true;
    return false;
})();
//nextOrFirst? prevOrLast?
jQuery.fn.nextOrFirst = function(selector) { var next = this.next(selector); return (next.length) ? next : this.prevAll(selector).last(); }
jQuery.fn.prevOrLast = function(selector){ var prev = this.prev(selector); return (prev.length) ? prev : this.nextAll(selector).last(); }

//preload images
$.fn.preload=function(){this.each(function(){$("<img/>")[0].src=this})}

window.startupKit = window.startupKit || {};

startupKit.hideCollapseMenu = function() {
    $('body > .navbar-collapse').css({
        'z-index': 1
    });
    $('html').removeClass('nav-visible');
    setTimeout(function() {
        $('body > .navbar-collapse').addClass('collapse');
        $('body > .colapsed-menu').removeClass('show-menu');
    }, 400)
}

$(function () {
    $('.page-wrapper, .navbar-fixed-top, .navbar-collapse a, .navbar-collapse button, .navbar-collapse input[type=submit]').on('click', function(e) {
        if($('html').hasClass('nav-visible')) {
            setTimeout(function(){
                startupKit.hideCollapseMenu();
            }, 200)
        }
    });
    $(window).resize(function() {
        if($(window).width() > 965) {
            startupKit.hideCollapseMenu();
        }
    });

    var menuCollapse = $('#header-dockbar > .colapsed-menu').clone(true);
    $('body').append(menuCollapse);

    $('#open-close-menu').on('click', function () {
        if($('html').hasClass('nav-visible')) {
            startupKit.hideCollapseMenu();
        } else {
            $('body > .colapsed-menu').addClass('show-menu');
            if($('#header-dockbar').length) {
                 $('body > .colapsed-menu').css({
                    top: $('#header-dockbar').height()
                });
            }
            setTimeout(function() {
                $('html').addClass('nav-visible');
            }, 1)
        }
    });
    if($('.social-btn-facebook').length){
        $('.social-btn-facebook').sharrre({
            share: {
                facebook: true
            },
            enableHover: false,
            enableCounter: false,
            click: function(api, options){
                api.simulateClick();
                api.openPopup('facebook');
            }
        });
    }

    if($('.social-btn-twitter').length){
        $('.social-btn-twitter').sharrre({
            share: {
                twitter: true
            },
            enableHover: false,
            enableCounter: false,
            buttons: {
                twitter: {
                    via: 'Designmodo',
                    url: false
                }
            },
            click: function(api, options){
                api.simulateClick();
                api.openPopup('twitter');
            }
        });
    }
});

/**
 *  Headers 
 * */
startupKit.uiKitHeader = startupKit.uiKitHeader || {};

startupKit.uiKitHeader._inFixedMode = function(headerClass) {
    var navCollapse = $(headerClass + ' .navbar-collapse').first().clone(true);
    navCollapse.attr('id', headerClass.substr(1));
    $('body').append(navCollapse);

    var fixedNavbar = $('.navbar-fixed-top');
        fixedNavbarHeader = fixedNavbar.closest('header');
        fixedNavbarHeaderClone = fixedNavbarHeader.clone(true);

    if(fixedNavbarHeader.hasClass('fake-header')) {
        var fakeHeader = $('<div class="fake-wrapper-header" style="width: 100%; height: ' + fixedNavbarHeader.outerHeight() + 'px;" />');
    }
    $('body').prepend(fakeHeader);
    $('body').prepend(fixedNavbarHeaderClone);
    fixedNavbarHeader.detach();

    $(headerClass + ' .navbar-toggle').on('click', function() {
        var $this = $(this);
        if($('html').hasClass('nav-visible')) {
            startupKit.hideCollapseMenu();
        } else {
            $('.navbar-collapse#' + headerClass.substr(1)).removeClass('collapse');
            if($('#header-dockbar').length) {
                $('.navbar-collapse#' + headerClass.substr(1)).css({
                    top: $('#header-dockbar').height()
                });
            }
            setTimeout(function() {
                $('html').addClass('nav-visible');
            }, 1)
            setTimeout(function() {
                $('body > .navbar-collapse').css({
                    'z-index': 101
                });
            }, 400)
        }
    });

    if ($(headerClass + ' .navbar').hasClass('navbar-fixed-top')) {
        var s1 = $(headerClass + '-sub'),
            s1StopScroll = s1.outerHeight() - 70,
            antiflickerStopScroll = 70;

        if($(headerClass).outerHeight()>0){
            var antiflickerColor = $(headerClass).css('background-color');
        }else if($(headerClass+'-sub').length > 0){
            var antiflickerColor = $(headerClass+'-sub').css('background-color');
        }else{
            var antiflickerColor='#fff';
        }

        var antiflicker = $('<div class="' + headerClass.slice(1) + '-startup-antiflicker header-antiflicker" style="opacity: 0.0001; position: fixed; z-index: 2; left: 0; top: 0; width: 100%; height: 70px; background-color: '+antiflickerColor+';" />');
        $('body').append(antiflicker);
        var s1FadedEls = $('.background, .caption, .controls > *', s1),
            header = $(headerClass);

        s1FadedEls.each(function() {
            $(this).data('origOpacity', $(this).css('opacity'));
        });

        var headerAniStartPos = s1.outerHeight() - 120, headerAniStopPos = s1StopScroll;

        $(window).scroll(function() {
            var opacity = (s1StopScroll - $(window).scrollTop()) / s1StopScroll;
            opacity = Math.max(0, opacity);

            if ($(window).scrollTop() > s1StopScroll - antiflickerStopScroll) {
                var opacityAntiflicker = (s1StopScroll - $(window).scrollTop()) / antiflickerStopScroll;
                opacityAntiflicker = Math.max(0, opacityAntiflicker);
            } else {
                opacityAntiflicker = 1
            }
            // 0..1

            s1FadedEls.each(function() {
                $(this).css('opacity', $(this).data('origOpacity') * opacity);
            });

            antiflicker.css({
                'background-color': $('.pt-page-current', s1).css('background-color'),
                'opacity': 1.0001 - opacityAntiflicker
            });
            
            var headerZoom = -(headerAniStartPos - $(window).scrollTop()) / (headerAniStopPos - headerAniStartPos);
            headerZoom = 1 - Math.min(1, Math.max(0, headerZoom));
            
            $(window).resize(function(){
               _navbarResize();
            });
            var _navbarResize = function(){
                if($(window).width()<767){
                    $('.navbar', header).css({
                        'top' : -6 + ((20 + 6) * headerZoom)
                    });
                } else if($(window).width()<480){
                    $('.navbar', header).css({
                        'top' : -6 + ((20 + 6) * headerZoom)
                    });
                } else{
                    $('.navbar', header).css({
                        'top' : -6 + ((45 + 6) * headerZoom)
                    });
                }
            };
            
            _navbarResize();
            
            $('.navbar .brand', header).css({
                'font-size' : 18 + ((25 - 18) * headerZoom),
                'padding-top' : 30 + ((23 - 30) * headerZoom)
            });
            $('.navbar .brand img', header).css({
                'width' : 'auto',
                'height' : 25 + ((50 - 25) * headerZoom),
                'margin-top' : -1 + ((-10 + 1) * headerZoom)
            });
            $('.navbar .btn-navbar', header).css({
                'margin-top' : 30 + ((28 - 30) * headerZoom)
            });

            if ($(window).width() > 979) {
                $(headerClass + '.navbar .nav > li > a', header).css({
                    'font-size' : 12 + ((14 - 12) * headerZoom)
                });
            } else {
                $(headerClass + '.navbar .nav > li > a', header).css({
                    'font-size' : ''
                });
            }

        });
    };
};

/* Header 1*/
startupKit.uiKitHeader.header1 = function() {
    var pt = PageTransitions();
    pt.init('#pt-main');
    $('#pt-main .control-prev').on('click', function() {
        pt.gotoPage(5, 'prev');
        return false;
    });
    $('#pt-main .control-next').on('click', function() {
        pt.gotoPage(6, 'next');
        return false;
    });

    startupKit.uiKitHeader._inFixedMode('.header-1');

};

/* Header 2*/
startupKit.uiKitHeader.header2 = function() {
    startupKit.uiKitHeader._inFixedMode('.header-2');
};

/* Header 3*/
startupKit.uiKitHeader.header3 = function() {
    if ($('.header-3 .navbar').hasClass('navbar-fixed-top')) {
        $('.header-3').css('position', 'fixed').addClass('fake-header');
    };
    startupKit.uiKitHeader._inFixedMode('.header-3');
};

/* Header 4*/
startupKit.uiKitHeader.header4 = function() {};

/* Header 5*/
startupKit.uiKitHeader.header5 = function() {

    startupKit.uiKitHeader._inFixedMode('.header-5');
    // PageTransitions
    $(window).resize(function() {
        var maxH = 0;
        $('.header-5-sub .pt-page').css('height', 'auto').each(function() {
            var h = $(this).outerHeight();
            if (h > maxH)
                maxH = h;
        }).css('height', maxH + 'px');
        $('.header-5-sub .page-transitions').css('height', maxH + 'px');
    });
    var pt1 = PageTransitions();
    pt1.init('#h-5-pt-1');

    $('#h-5-pt-1 .pt-control-prev').on('click', function() {
        pt1.gotoPage(5, 'prev');
        return false;
    });

    $('#h-5-pt-1 .pt-control-next').on('click', function() {
        pt1.gotoPage(6, 'next');
        return false;
    });

    var navbar = $('.header-5 .navbar');
    $('.search', navbar).click(function() {
        if (!navbar.hasClass('search-mode')) {
            navbar.addClass('search-mode');
            setTimeout(function() {
                $('header .navbar .navbar-search input[type="text"]').focus();
            }, 1000);
        } else {

        }
        return false;
    });

    $('.close-search', navbar).click(function() {
        navbar.removeClass('search-mode');
        return false;
    });
};

/* Header 6*/
startupKit.uiKitHeader.header6 = function() {
    startupKit.uiKitHeader._inFixedMode('.header-6');
};

/* Header 7*/
startupKit.uiKitHeader.header7 = function() {
    startupKit.uiKitHeader._inFixedMode('.header-7');
    $(window).resize(function() {
        var maxH = 0;
        $('.header-7-sub section').css('height', $(this).height() + 'px').each(function() {
            var h = $(this).outerHeight();
            if (h > maxH)
                maxH = h;
        }).css('height', maxH + 'px');
        $('.header-7-sub .page-transitions').css('height', maxH + 'px');
        var ctrlsHeight = $('.header-7-sub .pt-controls').height();
        $('.header-7-sub .pt-controls').css('margin-top', (-1) * (maxH) / 2 - ctrlsHeight + 'px');
        $('.header-7-sub .pt-controls').css('padding-bottom', (maxH) / 2 - ctrlsHeight + 'px');
    });


    // PageTransitions
    var pt = PageTransitions();
    pt.init('#h-7-pt-main');

    $('.header-7-sub .pt-controls .pt-indicators > *').on('click', function() {

        if ($(this).hasClass('active'))
            return false;

        var curPage = $(this).parent().children('.active').index();
        var nextPage = $(this).index();
        $('.header-7-sub').css('background-color',$('#h-7-pt-main').children('.pt-page').eq(nextPage).find('section').css('background-color'));
        var ani = 5;
        if (curPage < nextPage) {
            ani = 6;
        }

        pt.gotoPage(ani, nextPage);
        $(this).addClass('active').parent().children().not(this).removeClass('active');
        return false;


    });

};

/* Header 8*/
startupKit.uiKitHeader.header8 = function() {
    if ($('.header-8 .navbar').hasClass('navbar-fixed-top')) {
        $('.header-8').css('position', 'fixed').addClass('fake-header');
    };
    startupKit.uiKitHeader._inFixedMode('.header-8');
};

/* Header 9*/
startupKit.uiKitHeader.header9 = function() {

    startupKit.uiKitHeader._inFixedMode('.header-9');

    $(window).resize(function() {
        var h = 0;
        $('body > section:not(.header-9-sub)').each(function() {
            h += $(this).outerHeight();
        });
        $('.sidebar-content').css('height', h + 'px');
    });
};

/* Header 10*/
startupKit.uiKitHeader.header10 = function() {
    if ($('.header-10 .navbar').hasClass('navbar-fixed-top')) {
        $('.header-10').css('position', 'fixed').addClass('fake-header');
    };
    startupKit.uiKitHeader._inFixedMode('.header-10');

    $('.header-10-sub .control-btn').on('click', function() {
        $.scrollTo($(this).closest('section').next(), {
            axis : 'y',
            duration : 500
        });
        return false;
    });
};

/* Header 11*/
startupKit.uiKitHeader.header11 = function() {
    if ($('.header-11 .navbar').hasClass('navbar-fixed-top')) {
        $('.header-11').css('position', 'fixed').addClass('fake-header');
    };
    startupKit.uiKitHeader._inFixedMode('.header-11');

    $(window).resize(function() {
        
        var headerContainer = $('.header-11-sub').not('pre .header-11-sub');
        var player = headerContainer.find('.player');
        if ($(window).width() < 751) {
            headerContainer.find('.signup-form').before(player);
            headerContainer.find('.player-wrapper').hide();
        } else {
            headerContainer.find('.player-wrapper').append(player).show();
        }
    });

};

/* Header 12*/
startupKit.uiKitHeader.header12 = function() {};

/* Header 13*/
startupKit.uiKitHeader.header13 = function() {};

/* Header 14*/
startupKit.uiKitHeader.header14 = function() {};

/* Header 15*/
startupKit.uiKitHeader.header15 = function() {
    if ($('.header-15 .navbar').hasClass('navbar-fixed-top')) {
        $('.header-15').css('position', 'fixed').addClass('fake-header');
    };
    startupKit.uiKitHeader._inFixedMode('.header-15');
};

/* Header 16*/
startupKit.uiKitHeader.header16 = function() {
    startupKit.uiKitHeader._inFixedMode('.header-16');
    var pt = PageTransitions();
    pt.init('#h-16-pt-main');
    $('#h-16-pt-main .pt-control-prev').on('click', function() {
        pt.gotoPage(2, 'prev');
        return false;
    });
    $('#h-16-pt-main .pt-control-next').on('click', function() {
        pt.gotoPage(1, 'next');
        return false;
    });

    $('.header-16-sub .scroll-btn a').on('click', function(e) {
        e.preventDefault();
        $.scrollTo($(this).closest('section').next(), {
            axis : 'y',
            duration : 500
        });
        return false;
    });
    $(window).resize(function() {
        $('.header-16-sub').css('height', $(this).height() + 'px');
    });
    $(window).resize().scroll();
};

/* Header 17*/
startupKit.uiKitHeader.header17 = function() {
    if ($('.header-17 .navbar').hasClass('navbar-fixed-top')) {
        $('.header-17').css('position', 'fixed').addClass('fake-header');
    };
    startupKit.uiKitHeader._inFixedMode('.header-17');
    
    var pt = PageTransitions();
    pt.init('#h-17-pt-1');

    $('.pt-controls .pt-indicators > *').on('click', function() {
        if ($(this).hasClass('active'))
            return false;

        var curPage = $(this).parent().children('.active').index();
        var nextPage = $(this).index();
        var ani = 44;
        if (curPage < nextPage) {
            ani = 45;
        }

        pt.gotoPage(ani, nextPage);
        $(this).addClass('active').parent().children().not(this).removeClass('active');
        return false;
    });

    $(window).resize(function() {
        $('.header-17-sub .page-transitions').each(function() {
            var maxH = 0;
            $('.pt-page', this).css('height', 'auto').each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            }).css('height', maxH + 'px');
            $(this).css('height', maxH + 'px');
            if(!$(this).hasClass('calculated')){
                $(this).addClass('calculated');
            }
        });
    });

};

/* Header 18*/
startupKit.uiKitHeader.header18 = function() {
    $(window).resize(function() {
        maxH = $(window).height(); 
        $('.header-18 .page-transitions').css('height', maxH + 'px');
    });

    // PageTransitions
    var pt = PageTransitions();
    pt.init('#h-18-pt-main');

    $('.header-18 .pt-control-prev').on('click', function() {
        pt.gotoPage(5, 'prev');
        return false;
    });

    $('.header-18 .pt-control-next').on('click', function() {
        pt.gotoPage(6, 'next');
        return false;
    });

};

/* Header 19*/
startupKit.uiKitHeader.header19 = function() {
    startupKit.uiKitHeader._inFixedMode('.header-19');
};

/* Header 20*/
startupKit.uiKitHeader.header20 = function() {
    if ($('.header-20 .navbar').hasClass('navbar-fixed-top')) {
        $('.header-20').css('position', 'fixed').addClass('fake-header');
    };
    startupKit.uiKitHeader._inFixedMode('.header-20');
};

/* Header 21*/
startupKit.uiKitHeader.header21 = function() {
    startupKit.uiKitHeader._inFixedMode('.header-21');
    maxH = $(window).height();
    if($('.navbar-fixed-top').length!=0){
        maxH = maxH - $('.navbar-fixed-top').outerHeight();
    }
    if($('.header-21').length!=0){
        maxH = maxH - $('.header-21').outerHeight();
    }
    if((maxH / 90) < 3){
        $('.header-21-sub .control-btn').css('bottom', 0);
    }
    $('.header-21-sub').height(maxH);

    $('.header-21-sub .control-btn').on('click', function() {
        $.scrollTo($(this).closest('section').next(), {
            axis : 'y',
            duration : 500
        });
        return false;
    });

};

/* Header 22*/
startupKit.uiKitHeader.header22 = function() {
    if ($('.header-22 .navbar').hasClass('navbar-fixed-top')) {
        $('.header-22').css('position', 'fixed').addClass('fake-header');
    };
    startupKit.uiKitHeader._inFixedMode('.header-22');
};

/* Header 23*/
startupKit.uiKitHeader.header23 = function() {

    startupKit.attachBgVideo();
    startupKit.uiKitHeader._inFixedMode('.header-23');

    $('body').prepend($('.mask, .popup-video').not('pre .mask, pre .popup-video'));
    $('header-23 .mask, header-23 .popup-video').not('pre .mask, pre .popup-video').detach();

    var iframe = $('#pPlayer')[0];
    var player = $f(iframe);
    player.addEvent('ready', function() {});

    function addEvent(element, eventName, callback) {
        if (element.addEventListener) {
            element.addEventListener(eventName, callback, false);
        } else {
            element.attachEvent(eventName, callback, false);
        }
    }

    $('#play').on('click', function(evt) {
        evt.preventDefault();
        $('.popup-video').addClass('shown');
        $('.popup-video, .mask').fadeIn('slow', function() {
            player.api('play')
        });
        $('.mask').on('click', function() {
            player.api('pause');
            $('.popup-video, .mask').fadeOut('slow', function() {
                $('.popup-video').removeClass('shown');
            });
        });
    });
    $('.header-23-sub .control-btn').on('click', function() {
        $.scrollTo($(this).closest('section').next(), {
            axis : 'y',
            duration : 500
        });
        return false;
    });
};

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

/* Video background  */
startupKit.attachBgVideo = function() {
    var videBgDiv = $('#bgVideo');
    if (!isMobile.any() && videBgDiv) {
        var videobackground = new $.backgroundVideo(videBgDiv, {
            "holder": "#bgVideo",
            "align" : "centerXY",
            "path" : "video/",
            "width": 854,
            "height": 480,
            "filename" : "preview",
            "types" : ["mp4", "ogg", "webm"]
        });
    }
}


/**
 *  Contents 
 * */

startupKit.uiKitContent = startupKit.uiKitContent || {};


/* Content 1*/
startupKit.uiKitContent.content1 = function() {};

/* Content 2*/
startupKit.uiKitContent.content2 = function() {};

/* Content 3*/
startupKit.uiKitContent.content3 = function() {};

/* Content 4*/
startupKit.uiKitContent.content4 = function() {};

/* Content 5*/
startupKit.uiKitContent.content5 = function() {};

/* Content 6*/
startupKit.uiKitContent.content6 = function() {};

/* Content 7*/
startupKit.uiKitContent.content7 = function() {
    
    (function(el) {
        if (el.length != 0) {
            $('img:first-child', el).css('left', '-29.7%');
            $(window).resize(function() {
                if (!el.hasClass('ani-processed')) {
                    el.data('scrollPos', el.offset().top - $(window).height() + el.outerHeight());
                }
            }).scroll(function() {
                if (!el.hasClass('ani-processed')) {
                    if ($(window).scrollTop() >= el.data('scrollPos')) {
                        el.addClass('ani-processed');
                        $('img:first-child', el).animate({
                            left : 0
                        }, 500);
                    }
                }
            });

        }

    })($('.screen'));

    
    

};

/* Content 8*/
startupKit.uiKitContent.content8 = function() {};

/* Content 9*/
startupKit.uiKitContent.content9 = function() {};

/* Content 10*/
startupKit.uiKitContent.content10 = function() {};

/* Content 11*/
startupKit.uiKitContent.content11 = function() {};

/* Content 12*/
startupKit.uiKitContent.content12 = function() {};

/* Content 13*/
startupKit.uiKitContent.content13 = function() {};

/* Content 14*/
startupKit.uiKitContent.content14 = function() {};

/* Content 15*/
startupKit.uiKitContent.content15 = function() {};

/* Content 16*/
startupKit.uiKitContent.content16 = function() {
    
    $('.content-16 .control-btn').on('click', function() {
        $.scrollTo($(this).closest('section').next(), {
            axis : 'y',
            duration : 500
        });
        return false;
    });

};

/* Content 17*/
startupKit.uiKitContent.content17 = function() {

    // Carousel auto height
    $(window).resize(function() {
        $('#c-17_myCarousel').each(function() {
            var maxH = 0;
            $('.item', this).each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            });
            $('#c-17_myCarousel .carousel-inner', this).css('height', maxH + 'px');
        });
    });

    // Carousel start
    $('#c-17_myCarousel').carousel({
        interval : 4000
    });

};

/* Content 18*/
startupKit.uiKitContent.content18 = function() {

    // Carousel auto height
    $(window).resize(function() {
        $('#c-18_myCarousel').each(function() {
            var maxH = 0;
            $('.item', this).each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            });
            $('.carousel-inner', this).css('height', maxH + 'px');
        });
    });

    $('#c-18_myCarousel').bind('slid.bs.carousel', function() {
        $('.carousel-control', this).removeClass('disabled').attr('href', '#c-18_myCarousel');
        if ($('.item.active', this).index() == 0) {
            $('.carousel-control.left', this).addClass('disabled').attr('href', '#');
        } else if ($('.item.active', this).index() == ($('.item', this).length - 1)) {
            $('.carousel-control.right', this).addClass('disabled').attr('href', '#');
        }
    });

};

/* Content 19*/
startupKit.uiKitContent.content19 = function() {};

/* Content 20*/
startupKit.uiKitContent.content20 = function() {};

/* Content 21*/
startupKit.uiKitContent.content21 = function() {

    $(window).resize(function() {
        $('.content-21 .features').each(function() {
            var maxH = 0;
            $('.features-body', this).css('height', 'auto').each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            }).css('height', maxH + 'px');
            $('.features-bodies', this).css('height', maxH + 'px');
            if(!$('.features-bodies', this).hasClass('calculated')){
                $('.features-bodies', this).addClass('calculated');
            }
        });
    });

    $('.content-21 .features .features-header .box').click(function() {
        $(this).addClass('active').parent().children().not(this).removeClass('active');
        $(this).closest('.features').find('.features-body').removeClass('active').eq($(this).index()).addClass('active');
        return false;
    });

};

/* Content 22*/
startupKit.uiKitContent.content22 = function() {

    (function(el) {
        if (isRetina) {
            $('.img img', el).each(function() {
                $(this).attr('src', $(this).attr('src').replace(/.png/i, '@2x.png'));
            });
        }

        $(window).resize(function() {
            if (!el.hasClass('ani-processed')) {
                el.data('scrollPos', el.offset().top - $(window).height() + el.outerHeight() - parseInt(el.css('padding-bottom'), 10));
            }
        }).scroll(function() {
            if (!el.hasClass('ani-processed')) {
                if ($(window).scrollTop() >= el.data('scrollPos')) {
                    el.addClass('ani-processed');
                }
            }
        });
    })($('.content-22'));

};
/* Content 23*/
startupKit.uiKitContent.content23 = function() {

    $('.content-23 .control-btn').on('click', function() {
        $.scrollTo($(this).closest('section').next(), {
            axis : 'y',
            duration : 500
        });
        return false;
    });

};
/* Content 24*/
startupKit.uiKitContent.content24 = function() {

    $(window).resize(function() {
        $('.content-24 .features').each(function() {
            var maxH = 0;
            $('.features-body', this).css('height', 'auto').each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            }).css('height', maxH + 'px');
            $('.features-bodies', this).css('height', maxH + 'px');
        });
    });

    $('.content-24 .features .features-header .box').click(function() {
        $(this).addClass('active').parent().children().not(this).removeClass('active');
        $(this).closest('.features').find('.features-body').removeClass('active').eq($(this).index()).addClass('active');
        return false;
    });

};
/* Content 25*/
startupKit.uiKitContent.content25 = function() {

    if ((!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) || (window.mobile)) {
        $('.svg').remove();
        $('.nosvg').attr('style', 'display:block;');
    }

    (function(el) {
        el.css('opacity', 0);
        $svg = $('#spaceship', el);
        $('#rocket-raw', $svg).attr('transform', 'translate(-100,100)');
        $('#rocketmask1', $svg).attr('transform', 'translate(100,-100)');

        $(window).resize(function() {
            if (!el.hasClass('ani-processed')) {
                el.data('scrollPos', el.offset().top - $(window).height() + el.outerHeight());
            }
            var svg = $('.content-25 .svg');
            var nosvg = $('.content-25 .nosvg');
            $('.content-25 .col-sm-6:nth-child(2)').show();
            $('.content-25 .col-sm-6:nth-child(2)').append(nosvg);
        }).scroll(function() {
            if (!el.hasClass('ani-processed')) {
                if ($(window).scrollTop() >= el.data('scrollPos')) {
                    el.addClass('ani-processed');
                    el.animate({
                        opacity : 1
                    }, 600);
                    $('#rocket-raw, #rocketmask1', $svg).clearQueue().stop().animate({
                        svgTransform : 'translate(0,0)'
                    }, {
                        duration : 800,
                        easing : "easeInOutQuad"
                    });
                }
            }
        });
    })($('.content-25 .col-sm-6 + .col-sm-6'));

};
/* Content 26*/
startupKit.uiKitContent.content26 = function() {};

/* Content 27*/
startupKit.uiKitContent.content27 = function() {
    if ((!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) || (window.mobile)) {
        $('.svg').remove();
        $('.nosvg').attr('style', 'display:block;');
    }

    $(window).resize(function() {
        var svg = $('.content-27 .svg');
        var nosvg = $('.content-27 .nosvg');
        $('.content-27 .col-sm-4:first-child').show();
        $('.content-27 .col-sm-4:first-child').append(nosvg);
    });
};
/* Content 28*/
startupKit.uiKitContent.content28 = function() {};
/* Content 29*/
startupKit.uiKitContent.content29 = function() {};
/* Content 30*/
startupKit.uiKitContent.content30 = function() {

    $(window).resize(function() {
        var boxes = $('.content-30 .col-sm-3');
        for (var t = 0; t <= boxes.length; t++) {
            var descTop = $(boxes[t]).find('.description-top');
            if ($(window).width() <= 480) {
                $(boxes[t]).find('.img').after(descTop);

            } else {
                $(boxes[t]).find('.img').before(descTop);
            }
        }
    });

};
/* Content 31*/
startupKit.uiKitContent.content31 = function() {
    (function(el) {
        $(window).scroll(function() {
            if ($(window).width() > 480) {
                $('.row', el).each(function(idx) {
                    if ($(window).scrollTop() >= ($(this).offset().top - $(window).height() + $(window).height() / 2 + 100)) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
            }
        });
        $(window).resize(function() {
            $('.page-transitions', el).each(function() {
                var maxH = 0;
                $('.pt-page', this).css('height', 'auto').each(function() {
                    var h = $(this).outerHeight();
                    if (h > maxH)
                        maxH = h;
                }).css('height', maxH + 'px');
                $(this).css('height', maxH + 'px');
            });
        });
        $('.page-transitions', el).each(function() {
            var pt = PageTransitions();
            pt.init(this);

            $('.pt-control-prev', this).on('click', function() {
                pt.gotoPage(68, 'prev');
                return false;
            });

            $('.pt-control-next', this).on('click', function() {
                pt.gotoPage(68, 'next');
                return false;
            });
        });
    })($('.content-31'));
};

/* Content 32*/
startupKit.uiKitContent.content32 = function() {}

/* Content 33*/
startupKit.uiKitContent.content33 = function() {}

/* Content 34*/
startupKit.uiKitContent.content34 = function() {
    $(window).resize(function() {
        var maxH = 0;
        $('.content-34 section').each(function() {
            var h = $(this).outerHeight();
            if (h > maxH)
                maxH = h;
        });
        $('.content-34 .page-transitions').css('height', maxH + 'px');
        var ctrlsHeight = $('.content-34 .pt-controls').height();
        $('.content-34 .pt-controls').css('margin-top', (-1) * ctrlsHeight / 2 + 'px');
    });
    // PageTransitions
    var pt = PageTransitions();
    pt.init('#content-34-pt-main');
    $('.content-34 .pt-controls .pt-indicators > *').on('click', function() {
        if ($(this).hasClass('active'))
            return false;
        var curPage = $(this).parent().children('.active').index();
        var nextPage = $(this).index();
        var ani = 5;
        if (curPage < nextPage) {
            ani = 6;
        }
        pt.gotoPage(ani, nextPage);
        $(this).addClass('active').parent().children().not(this).removeClass('active');        
        return false;
    });
}

/* Content 35*/
startupKit.uiKitContent.content35 = function() {
    if($(".content-35-slider").length) {
        $('.content-35-slider').bxSlider({
            'controls': false,
            'pagerCustom': '.content-35-customPager',
            'adaptiveHeight': true,
            'infiniteLoop': false
        });
    }
    var pager = $('.content-35-customPager');
    pager.find($('.menuicon')).on('mouseenter', function(){
        $(this).parent().addClass('showmenu');
    })
    pager.on('mouseleave', function(){
        $(this).removeClass('showmenu');
    })
    pager.find($('.menuicon')).on('click', function(){
        var menu = $(this).parent();
        if(menu.hasClass('showmenu')) {
            menu.removeClass('showmenu');
        } else {
            menu.addClass('showmenu');
        }
    })
}

/* Content 36*/
startupKit.uiKitContent.content36 = function() {}
/* Content 37*/
startupKit.uiKitContent.content37 = function() {}
/* Content 38*/
startupKit.uiKitContent.content38 = function() {
    //samples grid
    var samplesGrid = $('.samples-grid');
    setTimeout(function () {
        samplesGrid.masonry({itemSelector: '.sample-box'});
    }, 3000);

    //show images on scroll
    if (!isMobile.any()) {
        $(document).scroll(function () {
            var samples = $('.samples-holder');
            var samplesCont = samples.offset();
            var scrollTop = $(document).scrollTop();
            if (scrollTop >= samplesCont.top - $(window).height() + 200) {
                samplesGrid.masonry({itemSelector: '.sample-box'})
            }

            //samples
            if ($(document).scrollTop() >= samplesCont.top - $(window).height() / 2) {
                if (!$('.samples-holder').hasClass('shown')) {
                    if (!isMobile.any()) {
                        addSamplesInt = setInterval(function () {
                            var elements = $('.sample-box:not(.visible)');
                            var random = Math.round(Math.random() * elements.size());
                            var el = elements.eq(random);
                            el.addClass('visible');
                            if (elements.size() == 0) {
                                clearInterval(addSamplesInt);
                            }
                        }, 50);
                    }
                    $('.samples-holder').addClass('shown');
                }
            }
        });
    }
    else{
        $('.samples-holder').addClass('shown');
        $('.sample-box').addClass('visible');
    }
    //can I see the real pixels?
    $('.samples-holder img').click(function () {
        var imgsrc = $(this).attr('src');
        var file = imgsrc.split('/');
        var filename = file[file.length - 1];
        var structure = $(this).data('structure');
        var path = imgsrc.split('/' + filename);
        path = path[0];
        showLargeImage(filename, path + '-large/', $(this), 'next', structure);
    });

    if (window.location.hash.indexOf(".samples-holder") != -1) {
        var id = window.location.hash;
        $(id).click();
    }

    $(document).keydown(function (e) {
        if (e.keyCode == 37) {
            $('.largeScreenshots .prev').click();
            return false;
        }
        if (e.keyCode == 39) {
            $('.largeScreenshots .next').click();
            return false;
        }
        if (e.keyCode == 38) {
            $('.largeScreenshots').clearQueue().animate({ scrollTop: $('.largeScreenshots').scrollTop() - 500 + "px"}, 250);
            return false;
        }
        if (e.keyCode == 40) {
            $('.largeScreenshots').clearQueue().animate({ scrollTop: $('.largeScreenshots').scrollTop() + 500 + "px"}, 250);
            return false;
        }
        if (e.keyCode == 27) {
            $('.close').click();
            return false;
        }
    });

    function showLargeImage(file, prefix, obj, direction, structure) {

        //dark screen, add elements
        if (!$('body').hasClass('largescreenshotsopened')) {
            $('body').addClass('noscroll').addClass('largescreenshotsopened').append('<div class="largeScreenshots"><div class="picHolder"><h1></h1><span></span><div class="imgHolder"><img/></div></div><div class="prev"></div><div class="next"></div><div class="close"></div></div>');
            $('.largeScreenshots .close, .largeScreenshots span').click(function (e) {
                $('body').removeClass('noscroll').removeClass('largescreenshotsopened');
                $('.largeScreenshots').remove();
                window.location.hash = "/";
            });
        }

        //show me the image
        $('.largeScreenshots .imgHolder img').attr('src', prefix + file);
        $('.largeScreenshots .imgHolder img').ready(function (e) {
            $('.largeScreenshots').scrollTop(0);
            $('.largeScreenshots .imgHolder img');
            $('.largeScreenshots h1').text(obj.attr('alt'));

            window.location.hash=obj.attr('id');

            var speed = '0.75s cubic-bezier(.27,1.64,.32,.95)';
            $('.picHolder, .picHolder h1').css('-webkit-animation', direction + " " + speed).css('-moz-animation', direction + " " + speed).css('-ms-animation', direction + " " + speed).css("-o-animation", direction + " " + speed).css("animation", direction + " " + speed);
            setTimeout(function () {
                $('.picHolder, .picHolder h1').removeAttr('style');
            }, 750);
        });

        //set nice position for arrows

        function setNicePosition(){
            var p = $(".largeScreenshots .picHolder");
            var position = p.position();
            var size = $('.largeScreenshots img').outerHeight();
            var scrolltop = $(".largeScreenshots").scrollTop()
            if (position.top+192> 0) {
                $('.largeScreenshots .prev, .largeScreenshots .next').css('top', position.top+192).css('height', $(window).height() - position.top  - 192);
            } else if (scrolltop + $(window).height() > size+192+36) {
                var posFromBottom = (scrolltop + $(window).height()) - (size+192+36);
                $('.largeScreenshots .prev, .largeScreenshots .next').css('top', 0).css('height', $(window).height()-posFromBottom);
            } else {
                $('.largeScreenshots .prev, .largeScreenshots .next').css('top', 0).css('height', $(window).height());
            }
        }
        setNicePosition()

        $('.largeScreenshots').scroll(function () {
            setNicePosition();
        });

        //preload pics
        var newObj = obj.parent().nextOrFirst('.samples-holder .sample-box').find('img');
        var imgsrc = newObj.attr('src');
        var file = imgsrc.split('/');
        var filename = file[file.length - 1];
        var path = imgsrc.split('/' + filename);
        path = path[0];
        $([path + '-large/' + filename]).preload();

        var newObj = obj.parent().prevOrLast('.samples-holder .sample-box').find('img');
        var imgsrc = newObj.attr('src');
        var file = imgsrc.split('/');
        var filename = file[file.length - 1];
        var path = imgsrc.split('/' + filename);
        path = path[0];
        $([path + '-large/' + filename]).preload();

        //get next picure and show next
        $('.largeScreenshots .prev,.largeScreenshots .next, .largeScreenshots .imgHolder img').unbind();
        setTimeout(function () {
            $('.largeScreenshots .prev').click(function () {
                var newObj = obj.parent().prevOrLast('.samples-holder .sample-box').find('img');
                var structure = obj.data('structure');
                var imgsrc = newObj.attr('src');
                var file = imgsrc.split('/');
                var filename = file[file.length - 1];
                var path = imgsrc.split('/' + filename);
                path = path[0];

                showLargeImage(filename, path + '-large/', newObj, "prev",structure);
            });

            $('.largeScreenshots .next, .largeScreenshots .imgHolder img').click(function () {

                var newObj = obj.parent().nextOrFirst('.samples-holder .sample-box').find('img');
                var structure = newObj.data('structure');
                var imgsrc = newObj.attr('src');
                var file = imgsrc.split('/');
                var filename = file[file.length - 1];
                var path = imgsrc.split('/' + filename);
                path = path[0];

                showLargeImage(filename, path + '-large/', newObj, "next",structure);
            });
        },750);

        //add swipe gesture for mobile
         if (isMobile.any()){
             $('.largeScreenshots .imgHolder img').touchwipe({
                  wipeLeft: function() { $('.largeScreenshots .next').click(); },
                 wipeRight: function(){ $('.largeScreenshots .prev').click(); },
                 min_move_x: 20,
                  min_move_y: 20,
                 preventDefaultEvents: false
             });
         }
    }
};


/**
 * Blogs 
 */

startupKit.uiKitBlog = startupKit.uiKitBlog || {};

/* Blog 1*/
startupKit.uiKitBlog.blog1 = function() {

    $(window).resize(function() {
        $('.page-transitions').each(function() {
            var maxH = 0;
            $('.pt-page', this).css('height', 'auto').each(function() {
                var h = $(this).outerHeight();
                if (h > maxH)
                    maxH = h;
            }).css('height', maxH + 'px');
            $(this).css('height', maxH + 'px');
        });
    });

    var pt1 = PageTransitions();
    pt1.init($('#b1-pt-1'));

    $('#b1-pt-1 .pt-control-prev').on('click', function() {
        pt1.gotoPage(28, 'prev');
        return false;
    });

    $('#b1-pt-1 .pt-control-next').on('click', function() {
        pt1.gotoPage(29, 'next');
        return false;
    });

};

/* Blog 2*/
startupKit.uiKitBlog.blog2 = function() {};
/* Blog 3*/
startupKit.uiKitBlog.blog3 = function() {};
/* Blog 4*/
startupKit.uiKitBlog.blog4 = function() {};
/* Blog 5*/
startupKit.uiKitBlog.blog5 = function() {

    var pt2 = PageTransitions();
    pt2.init($('#b5-pt-2'));

    $('#b5-pt-2 .pt-control-prev').on('click', function() {
        pt2.gotoPage(28, 'prev');
        return false;
    });

    $('#b5-pt-2 .pt-control-next').on('click', function() {
        pt2.gotoPage(29, 'next');
        return false;
    });

};

/**
 * Crews 
 */

startupKit.uiKitCrew = startupKit.uiKitCrew ||
function() {
    $('.member .photo img').each(function() {
        $(this).hide().parent().css('background-image', 'url("' + this.src + '")');
    });
};


/**
 * Projects 
 */
startupKit.uiKitProjects = startupKit.uiKitProjects || {};

/* project-1 */
startupKit.uiKitProjects.project1 = function() {};

/* project-2 */
startupKit.uiKitProjects.project2 = function() {};

/* project-3 */
startupKit.uiKitProjects.project3 = function() {};

/* project-4 */
startupKit.uiKitProjects.project4 = function() {
    $('.overlay').on('hover', function() {
        $(this).closest('.project').find('.name').toggleClass('hover');
    });
};



/**
 * Footers 
 */
startupKit.uiKitFooter = startupKit.uiKitFooter || {};

/* Footer 1*/
startupKit.uiKitFooter.footer1 = function() {};

/* Footer 2*/
startupKit.uiKitFooter.footer2 = function() {};

/* Footer 3*/
startupKit.uiKitFooter.footer3 = function() {};

/* Footer 4*/
startupKit.uiKitFooter.footer4 = function() {};

/* Footer 5*/
startupKit.uiKitFooter.footer5 = function() {};

/* Footer 6*/
startupKit.uiKitFooter.footer6 = function() {};

/* Footer 7*/
startupKit.uiKitFooter.footer7 = function() {};

/* Footer 8*/
startupKit.uiKitFooter.footer8 = function() {};

/* Footer 9*/
startupKit.uiKitFooter.footer9 = function() {};

/* Footer 10*/
startupKit.uiKitFooter.footer10 = function() {};

/* Footer 11*/
startupKit.uiKitFooter.footer11 = function() {};

/* Footer 12*/
startupKit.uiKitFooter.footer12 = function() {};

/* Footer 13*/
startupKit.uiKitFooter.footer13 = function() {};

/* Footer 14*/
startupKit.uiKitFooter.footer14 = function() {};

/* Footer 15*/
startupKit.uiKitFooter.footer15 = function() {};


/** 
 * Global part of startup-kit
 * */
(function($) {
    $(function() {
        /* implementing headers */
        for (header in startupKit.uiKitHeader) {
            headerNumber = header.slice(6);
            if (jQuery('.header-' + headerNumber).length != 0) {
                startupKit.uiKitHeader[header]();
            };
        }

        /* implementing contents */
        for (content in startupKit.uiKitContent) {
            contentNumber = content.slice(7);
            if (jQuery('.content-' + contentNumber).length != 0) {
                startupKit.uiKitContent[content]();
            };
        }
        
        /* implementing blogs */
        for (blog in startupKit.uiKitBlog) {
            blogNumber = blog.slice(4);
            if (jQuery('.blog-' + blogNumber).length != 0) {
                startupKit.uiKitBlog[blog]();
            };
        }
        
        /* implementing projects */
        for (project in startupKit.uiKitProjects) {
            projectNumber = project.slice(7);
            if (jQuery('.projects-' + projectNumber).length != 0) {
                startupKit.uiKitProjects[project]();
            };
        }

        /* implementing crew */
        startupKit.uiKitCrew();

        /* implementing footers */
        for (footer in startupKit.uiKitFooter) {
            footerNumber = footer.slice(6);
            if (jQuery('.footer-' + footerNumber).length != 0) {
                startupKit.uiKitFooter[footer]();
            };
        }
    
        /* function on load */
        $(window).load(function() {
            $('html').addClass('loaded');
            $(window).resize();
        });

        /* ie fix images */
        if (/msie/i.test(navigator.userAgent)) {
            $('img').each(function() {
                $(this).css({
                    width : $(this).attr('width') + 'px',
                    height : 'auto'
                });
            });
        }

        // Focus state for append/prepend inputs
        $('.input-prepend, .input-append').on('focus', 'input', function() {
            $(this).closest('.control-group, form').addClass('focus');
        }).on('blur', 'input', function() {
            $(this).closest('.control-group, form').removeClass('focus');
        });

        // replace project img to background-image
        $('.project .photo img').each(function() {
            $(this).hide().parent().css('background-image', 'url("' + this.src + '")');
        });

        // Tiles
        var tiles = $('.tiles');

        // Tiles phone mode
        $(window).resize(function() {
            if ($(this).width() < 768) {
                if (!tiles.hasClass('phone-mode')) {
                    $('td[class*="tile-"]', tiles).each(function() {
                        $('<div />').addClass(this.className).append($(this).contents()).appendTo(tiles);
                    });

                    tiles.addClass('phone-mode');
                }
            } else {
                if (tiles.hasClass('phone-mode')) {
                    $('> [class*="tile-"]', tiles).each(function(idx) {
                        $('td[class*="tile-"]', tiles).eq(idx).append($(this).contents());
                        $(this).remove();
                    });

                    tiles.removeClass('phone-mode');
                }
            }
        });

        tiles.on('mouseenter', '[class*="tile-"]', function() {
            $(this).removeClass('faded').closest('.tiles').find('[class*="tile-"]').not(this).addClass('faded');
        }).on('mouseleave', '[class*="tile-"]', function() {
            $(this).closest('.tiles').find('[class*="tile-"]').removeClass('faded');
        });
        
        
    });
    //add some smooth for scroll


})(jQuery);
//swipe
(function($){$.fn.touchwipe=function(settings){var config={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},preventDefaultEvents:true};if(settings)$.extend(config,settings);this.each(function(){var startX;var startY;var isMoving=false;function cancelTouch(){this.removeEventListener('touchmove',onTouchMove);startX=null;isMoving=false}function onTouchMove(e){if(config.preventDefaultEvents){e.preventDefault()}if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startX-x;var dy=startY-y;if(Math.abs(dx)>=config.min_move_x){cancelTouch();if(dx>0){config.wipeLeft();e.preventDefault()}else{config.wipeRight();e.preventDefault()}}else if(Math.abs(dy)>=config.min_move_y){cancelTouch();if(dy>0){config.wipeDown()}else{config.wipeUp()}}}}function onTouchStart(e){if(e.touches.length==1){startX=e.touches[0].pageX;startY=e.touches[0].pageY;isMoving=true;this.addEventListener('touchmove',onTouchMove,false)}}if('ontouchstart'in document.documentElement){this.addEventListener('touchstart',onTouchStart,false)}});return this}})(jQuery);
