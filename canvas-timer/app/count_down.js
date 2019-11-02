
var RADIUS = 8;
var BRIGDE = RADIUS + 1;
var MARGIN_LEFT = 30;
var MARGIN_TOP = 30;
var SPACE = 8;
var DAY_TIME = 86400;

const NOW = Date.now();
const END_TIME = new Date(NOW + DAY_TIME * 1000);

var updateId = 0;
var pass_time = 0;
var total_time = 0;

var context = null;
var canvas = null;

var SW = SH = 0;

var ballObj = {
  x: 0,
  y: 0,
  sx: 100,
  sy: -100,
  vy:0,
  gravity: 5,
  friction: 0.1,
  color: '#000'
}

var colose = ['#C2185B', '#F8BBD0', '#E91E63', '#8BC34A', '#212121', '#FFC107', '#388E3C'];
var balls = [];

window.onload = function () {
  canvas = document.getElementById('canvas');
  context = canvas.getContext("2d");
  updateId = window.requestAnimationFrame(update);
  SW = canvas.width;
  SH = canvas.height;
}

function update(time) {
  var process_time = time - pass_time;
  if (process_time > 0) {
    updateId = window.requestAnimationFrame(update);
    pass_time = time;
    run(process_time);
  }
}

function run(detail) {
  render(context, detail / 500);
}

var prevTime = 0;
var prevHour = 0;
var prevMinutes = 0;
var prevSecond = 0;

function render(ctx, detail) {
  var downTime = (END_TIME - (NOW + pass_time)) / 1000;
  if (downTime <= 0) return;
  if (!prevTime) prevTime = downTime;
  var dt = prevTime == downTime
    ? downTime
    : Math.max(0, prevTime - downTime);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // if (dt >= 1) {
    var day = Math.max(0, Math.floor(downTime / DAY_TIME) - 1);
    var today_time = (downTime - day * DAY_TIME);
    var hour = Math.floor(today_time / 60 / 60);
    var minutes = Math.floor(today_time / 60 % 60);
    var second = Math.floor(today_time % 60);

    if (!prevHour) prevHour = hour;
    if (!prevMinutes) prevMinutes = minutes;
    if (!prevSecond) prevSecond = second;

    var lHour = parseInt(hour / 10);
    var rHour = parseInt(hour % 10);

    var lMinutes = parseInt(minutes / 10);
    var rMinutes = parseInt(minutes % 10);

    var lSecond = parseInt(second / 10);
    var rSecond = parseInt(second % 10);

    
    renderdigit(MARGIN_LEFT, MARGIN_TOP, lHour, ctx);
    renderdigit(MARGIN_LEFT + 2 * SPACE * BRIGDE, MARGIN_TOP, rHour, ctx);

    renderdigit(MARGIN_LEFT + 4 * SPACE * BRIGDE, MARGIN_TOP, 10, ctx);

    renderdigit(MARGIN_LEFT + 5 * SPACE * BRIGDE, MARGIN_TOP, lMinutes, ctx);
    renderdigit(MARGIN_LEFT + 7 * SPACE * BRIGDE, MARGIN_TOP, rMinutes, ctx);

    renderdigit(MARGIN_LEFT + 9 * SPACE * BRIGDE, MARGIN_TOP, 10, ctx);

    renderdigit(MARGIN_LEFT + 10 * SPACE * BRIGDE, MARGIN_TOP, lSecond, ctx);
    renderdigit(MARGIN_LEFT + 12 * SPACE * BRIGDE, MARGIN_TOP, rSecond, ctx);

    if (parseInt(prevHour / 10) != lHour) {
      addBalls(lHour, MARGIN_LEFT, MARGIN_TOP);
    }

    if (parseInt(prevHour % 10) != rHour) {
      addBalls(rHour, MARGIN_LEFT + 2 * SPACE * BRIGDE, MARGIN_TOP)
    }

    if (parseInt(prevMinutes / 10) != lMinutes) {
      addBalls(lMinutes, MARGIN_LEFT + 5 * SPACE * BRIGDE, MARGIN_TOP);
    }

    if (parseInt(prevMinutes % 10) != rMinutes) {
      addBalls(rMinutes), MARGIN_LEFT + 7 * SPACE * BRIGDE, MARGIN_TOP;
    }

    if (parseInt(prevSecond / 10) != lSecond) {
      addBalls(lSecond, MARGIN_LEFT + 10 * SPACE * BRIGDE, MARGIN_TOP);
    }

    if (parseInt(prevSecond % 10) != rSecond) {
      addBalls(rSecond, MARGIN_LEFT + 12 * SPACE * BRIGDE, MARGIN_TOP);
    }

    prevSecond = hour;
    prevMinutes = minutes;
    prevSecond = second;
    prevTime = downTime;
  // }

  renderBalls(detail);
}

function addBalls(num, x, y) {
  var list = createBalls(num, x, y);
  list.forEach(function(item,index){
    if((index % 2) === 0) {
    }
    item.sx = 50 + Math.random() * 50;
    item.sy = -(50 + Math.random() * 50);
    if(Math.floor(Math.random() * 100 % 2)) {
      item.sx *= -1;
    }
    item.color = colose[Math.floor(Math.random() * colose.length)];
  })
  var max = 300;
  if(balls.length >= max) {
    balls.splice(0,max / 2);
  }
  balls.push(...list);
}

function createBalls(num, x, y) {
  var digitNum = digit[num];
  var list = [];
  for (var r = 0; r < digitNum.length; r++) {
    for (var c = 0; c < digitNum.length; c++) {
      if (digitNum[r][c] === 1) {
        var ball = Object.create(ballObj);
        ball.x = x + BRIGDE + 2 * BRIGDE * c;
        ball.y = y + BRIGDE + 2 * BRIGDE * r;
        list.push(ball);
      }
    }
  }
  return list;
}

function renderdigit(x, y, num, ctx) {
  var tBalls = createBalls(num, x, y);
  var len = tBalls.length;
  while (--len > -1) {
    tBalls[len].color = colose[3];
  }
  drawBalls(tBalls);
}

function renderBalls(detail) {
  var len = balls.length;
  while(--len > -1) {
    var b = balls[len];
    var vx = b.sx * detail;
    var vy = b.sy * detail;
    // vy += b.gravity * detail;
    // b.vy = vy;
    b.vy += b.gravity * detail;
    vy += b.vy;

    var dx = b.x + vx;
    var dy = b.y + vy;

    b.x = dx;
    b.y = dy;

    touchBragde(dx,dy,b);
  }

  drawBalls(balls);
}

function touchBragde(x,y,b) {
  if(x < BRIGDE || x > SW - BRIGDE) {
    if(x < BRIGDE) {
      b.x = BRIGDE;
    }
    else if(x > SW - BRIGDE) {
      b.x = SW - BRIGDE
    }
    b.sx *= -1;
  }
  if(y > SH - RADIUS) {
    b.y = SH - RADIUS - b.vy;
    b.vy = -b.vy * b.friction;
  }
}

function drawBalls(list) {
  var len = list.length;
  while (--len > -1) {
    context.fillStyle = list[len].color
    context.beginPath();
    context.arc(list[len].x, list[len].y, RADIUS, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
  }
}