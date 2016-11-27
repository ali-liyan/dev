/**
 * @author liyan
 */
var _onlineRank;
var _houseRank;
var _roomRanks;
var _roomIds;
var _alpha = [0.8, 0.8, 0.5, 0.8];
var _rankColor = ['rgb(0, 204, 153)', 'rgb(0, 176, 240)', 'rgb(255, 0, 0)', 'rgb(0, 32, 96)']
var _roomLoctionSize = [
	[{x:25,y:90},{x:195,y:90},{x:195,y:415},{x:25,y:415}],
	[
		[{x:210,y:24},{x:431,y:24},{x:431,y:118},{x:210,y:118}], 
		[{x:355,y:118},{x:431,y:118},{x:431,y:160},{x:355,y:160}]
	],
	[
		[{x:265,y:122},{x:350,y:122},{x:350,y:210},{x:265,y:210}],
		[{x:350,y:165},{x:431,y:165},{x:431,y:235},{x:350,y:235}], 
		[{x:386,y:235},{x:431,y:235},{x:431,y:300},{x:386,y:300}]
	],
	[
		[{x:210,y:215},{x:348,y:215},{x:348,y:248},{x:210,y:248}], 
		[{x:210,y:248},{x:374,y:248},{x:374,y:415},{x:210,y:415}]
	]
];

function drawHouseBg() {
	var imgRoom = new Image();
	imgRoom.onload = function() {
		var canvas = $('#bgCanvas')[0];
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(imgRoom, 0, 0);
		}
	}
	imgRoom.src = "img/P002/room.png?" + new Date().getTime();
}

function drawRoomBg() {
	var canvas = $('#fgCanvas')[0];
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		var i;
		var color;
		var alpha;
		var room;
		for (i = 0; i < _roomRanks.length; i++) {
			color = _rankColor[_roomRanks[i]];
			alpha = _alpha[_roomRanks[i]];
			room = _roomLoctionSize[i];
			drawRect(ctx, room, color, alpha);
		}
	}
}

function drawRect(ctx, points, color, alpha) {
	if (!points)
		return;
	if ( typeof (points[0]) == 'object' && points[0].constructor == Array) {
		for (var i = 0; i < points.length; i++) {
			drawRect(ctx, points[i], color, alpha);
		}
	} else {
		ctx.globalAlpha = alpha;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		for (var j = 1; j < points.length; j++) {
			ctx.lineTo(points[j].x, points[j].y);
		}
		ctx.closePath();
		ctx.fill();
	}
}

function setOnlineRankAndEnvRank() {
	var className = 'rank' + (_houseRank + 1);
	var houseRankText = '';
	if (_houseRank == 0) {
		houseRankText = '（健康舒适）';
	} else if (_houseRank == 1) {
		houseRankText = '（潜在风险）';
	} else if (_houseRank == 2) {
		houseRankText = '（关注风险）';
	} else {
		houseRankText = '（重大风险）';
	}

	$('#rankValue').text(_onlineRank);
	$('#rankStar').removeClass();
	$('#rankStar').addClass(className);
	$('#rankStar').text(houseRankText);
}

function checkPointWithInRect(p, points) {

	if ( typeof (points[0]) == 'object' && points[0].constructor == Array) {
		var i;
		for (i = 0; i < points.length; i++) {
			if (checkPointWithInRect(p, points[i])) {
				break;
			}
		}
		if (i < points.length) {
			return true;
		} else {
			return false;
		}
	} else {
		if (p.x >= points[0].x && p.x <= points[1].x && p.y >= points[0].y && p.y <= points[3].y) {
			return true;
		} else {
			return false;
		}
	}
}

function onRoomClick(e) {
	var clickPonit = {x:e.offsetX, y:e.offsetY};
	// alert('开发中 (' + clickPonit.x + ',' +clickPonit.y + ')');
	var room;
	var i;
	for ( i = 0; i < _roomLoctionSize.length; i++) {
		room = _roomLoctionSize[i];
		if (checkPointWithInRect(clickPonit, room)) {
			break;
		}
	}
	if (i < _roomLoctionSize.length)
		window.location.href = "P003.html?rid=" + _roomIds[i];
}

function onMousemove(e) {
	var movePonit = {x:e.offsetX, y:e.offsetY};
	// alert('mousemove (' + movePonit.x + ',' +movePonit.y + ')');
	var i;
	var room;
	for ( i = 0; i < _roomLoctionSize.length; i++) {
		room = _roomLoctionSize[i];
		if (checkPointWithInRect(movePonit, room)) {
			break;
		}
	}
	if (i < _roomLoctionSize.length) {
		$(this).css('cursor', 'pointer');
	} else {
		$(this).css('cursor', 'default');
	}
}

function onPageload() {
	drawHouseBg();

	_gPost('../res/summary', false, null, function(obj) {
		if (obj.errCode == 0) {
			_onlineRank = obj.olRank;
			_houseRank = obj.hRans[0];
			_roomRanks = [obj.hRans[1], obj.hRans[2], obj.hRans[3], obj.hRans[4]];
			_roomIds = obj.rIds;

			setOnlineRankAndEnvRank();
			drawRoomBg();
		}
	});
}

$(function() {
	_gUpdateLocalSystemTime();
	
	$('#fgCanvas').bind("click", onRoomClick);
	$('#fgCanvas').bind("mousemove", onMousemove);
}); 

