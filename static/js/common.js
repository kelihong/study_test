var urlData = 'http://49.232.130.71:2512/'
// var urlData = 'http://localhost:2512/'

// 验证是否登录：
function checkLogin() {
    if(getCookie('sessionid')) {
        console.log(1)
    } else {
        setCookie('sessionid', '12345')
    }
}


checkLogin()

function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    console.log( cname+"="+cvalue+"; "+expires)
    document.cookie = cname+"="+cvalue+"; "+expires;
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
         }
        if (c.indexOf(name)  == 0) {
            return c.substring(name.length, c.length);
         }
    }
    return "";
}
