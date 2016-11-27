/**
 * @author liyan
 * start to learn
 * hello branch
 * hello jenkin
 */

function onReset() {
	$('input[type=text]').val('');
	$('input[type=password]').val('');
}

function onLogin() {
	var account = $('#usr').val();
	var password = $('#pwd').val();
	
	logon(account, password, 0);
}

function logon(usr, pwd, override) {
	var postData = "usr=" + usr + "&pwd=" + pwd + '&ovr=' + override;
	_gPost('../res/logon', false, postData, function(obj) {
		if (obj.errCode == 1) {
			alert("帐号不存在！");
			$('#usr').focus();
		} else if (obj.errCode == 2) {
			alert("密码错误！");
			$('#pwd').focus();
		} else if (obj.errCode == 3) {
			if (override == 0) {
				if (confirm('帐号已登录，是否继续？')) {
					logon(usr, pwd, 1);
				}
			}
		} else {
			if (obj.type == 'admin') {
				window.location.href = "P013.html";
			} else {
				window.location.href = "P001.html";
			}
		}
	});
}

function onSwitch() {
	_gPost('../res/logout', false, null, function(obj) {
		$('#center').show();
		$('#access').hide();
	});
}

function onUsrKeydown(e) {
	if (e.keyCode == 13) {
		$('#pwd').focus();	
	}
}

function onPwdKeydown(e) {
	if (e.keyCode == 13) {
		$('#login').trigger('click');
	}
}

$(function() {
	$('#center').show();
	$('#access').hide();
	
	$('#usr').bind('keydown', onUsrKeydown);
	$('#pwd').bind('keydown', onPwdKeydown);
	
	$('#reset').bind('click', onReset);
	$('#login').bind('click', onLogin);
	$('#switch').bind('click', onSwitch);
	
	
	_gPost('../res/logon/init', false, null, function(obj) {
		if (obj.errCode == 1) {
			alert("超时，请重新登录！");
			$('#usr').focus();
		} else if (obj.errCode == 2) {
			alert("帐号帐号已登录！");
			$('#usr').focus();
		} else if (obj.errCode == 3) {
			$('#center').hide();
			$('#access').show();
			$('#accessUsr').text(obj.account);
			if (obj.type == 'admin') {
				$('#accessUsr').attr('href', 'P013.html');
			} else {
				$('#accessUsr').attr('href', 'P001.html');
			}
		} else {
			$('#center').show();
			$('#access').hide();
		}
	});
}); 