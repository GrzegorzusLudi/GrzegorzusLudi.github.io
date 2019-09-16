window.ABCPopup = function (data)
{
    var checkerUrl = data.checkerUrl || 'http://www.checker.icinga-cba.cba.pl/';
    var element = data.element || document.body;
    var isLtr = data.isLtr || true;
    var fbText = data.facebookText || 'Like us on Facebook. Please don\'t click it twice, or you will remove your previous like! :)';
    var fbUrl = data.facebookUrl || 'https://www.facebook.com/hostingcba/';
    var expirationDays = data.expiration || 99999;
    var prefix = data.prefix || 'awesome';
    var cookieName = prefix + '_popup';
    var expTime = expirationDays  * 24 * 60 * 60 * 1000;
    var domain = data.domain || window.location.hostname;
    var closeImageUrl = data.closeImageUrl || "https://www.cba.pl/regions/common/userpage/img/close.png";
    var checkerCookieName = data.checkerCookie || "abcchecker";

    var getCookie = function (cname) {
        var match = document.cookie.match(new RegExp('(^| )' + cname + '=([^;]+)'));
        if (match) return match[2];
    };

    var setCookie = function (cname, cvalue, exp) {
        cvalue = typeof cvalue === 'object' ? JSON.stringify(cvalue) : cvalue;
        var d = new Date();
        d.setTime(exp);
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";domain=" + domain + ';' + expires + ";path=/";
    };

    var getPopupCookie = function () {
        return getCookie(cookieName);
    };

    var setPopupCookie = function () {
        setCookie(cookieName, 'true', new Date().getTime() + expTime);
    };

    var getCheckerCookie = function () {
        return getCookie(checkerCookieName);
    };

    var buildCloseImageNode = function () {
        var img = document.createElement('img');
        img.setAttribute('style', 'position: relative; width: 25px; height: 25px; right: -15px; filter: brightness(0) invert(1); cursor: pointer');
        img.src = closeImageUrl;

        return img;
    };

    var buildBackgroundNode = function () {
        var bg = document.createElement('div');
        bg.setAttribute('style', 'position: fixed; width: 100%; height: 100%; background-color: black; opacity: 0.8; top: 0; left: 0;');
        return bg;
    };

    var buildFacebookMediaStyleNode = function () {
        var css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML =
            '#dd-popup iframe {' +
                'transform: scale(9);' +
            '}' +
            '#dd-popup .fb-like-container > div {' +
                'flex-shrink: 0;' +
                'width: 100%;' +
                'text-align: center;' +
                'height: 50%;' +
                'font-size: calc(2rem + 1vw);' +
            '}' +
            '#dd-popup .fb-like-container div > img {' +
                'top: -25px;' +
            '}' +
            '@media only screen and (min-width: 1900px)  {' +
                '#dd-popup iframe {' +
                    'transform: scale(12);' +
                '}' +
                '#dd-popup .fb-like-container > div:first-of-type {' +
                    'align-items: center;' +
                '}' +
                '#dd-popup .fb-like-container div > img {' +
                    'top: -85px;' +
                '}' +
            '}' +
            '@media only screen and (max-width: 1200px)  {' +
                '#dd-popup iframe {' +
                    'transform: scale(8);' +
                '}' +
                '#dd-popup .fb-like-container > div {' +
                    'font-size: calc(1rem + 1vw);' +
                '}' +
            '}' +
            '@media only screen and (max-width: 800px)  {' +
                '#dd-popup iframe {' +
                    'transform: scale(5);' +
                '}' +
                '#dd-popup .fb-like-container > div {' +
                    'font-size: calc(0.6rem + 1vw);' +
                '}' +
            '}' +
            '@media only screen and (max-width: 480px)  {' +
                '#dd-popup iframe {' +
                    'transform: scale(2);' +
                '}' +
                '#dd-popup .fb-like-container > div:first-of-type {' +
                    'align-items: center;' +
                '}' +
            '}';
        return css;
    };

    var initFbSdk = function () {
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0&appId=1938369729569011&autoLogAppEvents=1";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };

    var buildFbButton = function (CloseButtonNode) {
        var container = document.createElement('div');
        container.setAttribute('class', 'fb-like-container');
        container.setAttribute('style', 'position: fixed; display: flex; flex-wrap: wrap; width: 100%; height: 100%; align-items: center; justify-content: center;');

        var text = document.createElement('div');
        text.setAttribute('style', 'font-weight: bold; width: 80%; color: white; margin-top: 5%; display: flex; align-items: top; justify-content: center; line-height: normal;');
        text.innerHTML = fbText;

        var likeBtn = document.createElement('div');
        likeBtn.setAttribute('class', 'fb-like');
        likeBtn.setAttribute('data-href', fbUrl);
        likeBtn.setAttribute('data-layout', 'button_count');
        likeBtn.setAttribute('data-action', 'like');
        likeBtn.setAttribute('data-size', 'large');
        likeBtn.setAttribute('data-show-faces', 'true');
        likeBtn.setAttribute('data-share', 'false');

        text.appendChild(CloseButtonNode);

        container.appendChild(text);
        container.appendChild(likeBtn);

        return container;
    };

    var appendMeta = function () {
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content= 'width=device-width, initial-scale=1';
        document.head.appendChild(meta);
    };

    var showPopup = function () {
        appendMeta();

        var popup = document.createElement('div');
        popup.id = 'dd-popup';
        popup.setAttribute('style', 'z-index: 9999; position: fixed; width: 100%; height: 100%; top: 0; left: 0; display: flex');

        var closeBtn = buildCloseImageNode();
        closeBtn.onclick = function () { popup.remove(); };

        popup.appendChild(document.createComment('googleoff: all'));
        popup.appendChild(document.createComment('noindex'));

        popup.appendChild(buildFacebookMediaStyleNode());
        popup.appendChild(buildBackgroundNode());
        popup.appendChild(buildFbButton(closeBtn));

        popup.appendChild(document.createComment('/noindex'));
        popup.appendChild(document.createComment('googleon: all'));

        var checkIframeLoaded = function () {
            setTimeout(function () {
                var iframe = popup.getElementsByClassName('fb_iframe_widget')[0];
                var onBlur = function() {
                    window.removeEventListener('blur', onBlur);
                    setInterval(function () {
                        popup.remove();
                    }, 500);
                };

                if (typeof iframe !== 'undefined') {
                    window.addEventListener('blur', onBlur);
                } else {
                    checkIframeLoaded();
                }
            }, 100);
        };

        element.appendChild(popup);
        initFbSdk();
        checkIframeLoaded();
    };

    this.show = function () {
        var cookie = getPopupCookie();
        var cookieChecker = getCheckerCookie();

        if (typeof cookie !== 'undefined' || typeof cookieChecker !== 'undefined')
            return;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                setPopupCookie();
                var data = JSON.parse(this.responseText);
                if (typeof data.isToShow === 'boolean' && data.isToShow)
                    showPopup();
            }
        };
        xhttp.withCredentials = true;
        xhttp.open("POST", checkerUrl, true);
        xhttp.send();
    };
};