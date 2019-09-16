function appendFirst(element, childNode) {
    if(element.firstChild)
        element.insertBefore(childNode, element.firstChild);
    else
        element.appendChild(childNode);
}

var dd = document.createElement('div');
appendFirst(document.body, dd);

if (dd) {
    //new CBABanner(dd).show();
    new ABCPopup({
        prefix: 'cba',
        facebookUrl: 'https://www.facebook.com/hostingcba/',
        facebookText: 'Polub nas na Facebooku. Proszę nie klikaj dwa razy, albo usuniesz swoje poprzednie polubienie! :)',
        element: dd,
        checkerUrl: 'http://abcchecker.cba.pl'
    }).show();
}