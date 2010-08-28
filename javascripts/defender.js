$(function() {
  var canvas = $("canvas")[0],
      ctx = canvas.getContext("2d");
  var settings = {
    canvas_width: canvas.clientWidth,
    canvas_height: canvas.clientHeight,
    spawn_baddie : true,
    spawn_rate : 2000,
    default_baddie_speed : 3,
    default_shot_speed : 30,
    pause: false
  };
  var hr = {
    x : 20,
    y : 20,
    speed : 8,
    width : 74,
    height: 68,
    dead : false,
    shot_interval : 400,
    shot_fired : false,
    shots : []
  };
  var baddie = {
    x : settings.canvas_width + 20,
    y : 0,
    speed : settings.default_baddie_speed,
    width: 20,
    height: 20,
    color: "#00ff00",
    shot_interval : 1500,
    shot_fired : true,
    shot_initial_delay : 500
  };
  var shot = {
    x : 0,
    y : 0,
    speed : settings.default_shot_speed
  };
  var baddies = [];
  var baddie_shots = [];
  var key = [];
  this.onkeydown = this.onkeyup = function(e) {
    key[e.which] = (e.type == 'keydown');
    if((e.type == 'keydown') && (e.keyCode == 80)) {
      settings.pause = !settings.pause;
      ctx.font = "bold 26px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText("PAUSED", settings.canvas_width / 2, settings.canvas_height / 2);
    }
  };
  setInterval(function() {
    if(settings.pause) { return; }
    move_hr();

    if(!hr.shot_fired) {
      if (key[32] && !hr.dead) {
        hr.shoot();
      }
    }
    if(settings.spawn_baddie) {
      if(!hr.dead) {
        var newBaddie = $.extend({}, baddie);
        baddie.y = Math.random() * settings.canvas_height;
        baddie.shot_interval = Math.random() * 4000 + 1000;
        baddie.shot_initial_delay = Math.random() * 1500 + 1000;
        baddies.push(newBaddie);
        settings.spawn_baddie = false;
        setTimeout(function() { settings.spawn_baddie = true; }, settings.spawn_rate);
      }
    }

    ctx.clearRect(0, 0, settings.canvas_width, settings.canvas_height);
    draw_bg();
    check_collisions();
    var i = 0;
    for(i=0; i<hr.shots.length; i++) {
      var s = hr.shots[i];
      if(s.x > settings.canvas_width) {
        hr.shots.splice(i, 1);
      } else {
        s.x += s.speed;
        draw_shot(s.x, s.y);
      }
    }
    for(i=0; i<baddies.length; i++) {
      var b = baddies[i];
      if(b.x < 0) {
        baddies.splice(i, 1);
      } else {
        if(!hr.dead) {
          b.x -= b.speed;
          baddie_shoot(b);
          var j;
        }
        draw_baddie(b);
      }
    }
    for(j=0; j<baddie_shots.length; j++) {
      var bs = baddie_shots[j];
      bs.x -= bs.speed;
      draw_baddie_shot(bs);
    }
    draw_hr();
  }, 15);
  var move_hr = function() {
    if(hr.dead) {return;}
    if(hr.x > 0) {
      hr.x -= key[37]?hr.speed:0;
    }
    if(hr.x < (settings.canvas_width - 100)) {
      hr.x += key[39]?hr.speed:0;
    }
    if(hr.y > 0) {
      hr.y -= key[38]?hr.speed:0;
    }
    if(hr.y < (settings.canvas_height - 68)) {
      hr.y += key[40]?hr.speed:0;
    }
  };
  var check_collisions = function() {
    if(hr.dead) {return;}
    var i = 0;
    for(i=0; i<baddies.length; i++) {
      var b = baddies[i];
      if((b.x < (hr.x + hr.width)) && (b.x > hr.x)) {
        if(((b.y + b.height) > hr.y) && (b.y < (hr.y + hr.height))) {
          kill_hr();
        }
      }
      var j = 0;
      for(j=0; j<hr.shots.length; j++) {
        var s = hr.shots[j];
        if((s.y > b.y) && (s.y < (b.y + b.height)) && (s.x > b.x)) {
          kill_baddie(i);
          hr.shots.splice(j, 1);
        }
      }
    };
    for(i=0; i<baddie_shots.length; i++) {
      s = baddie_shots[i];
      if((s.x < (hr.x + hr.width)) && (s.x > hr.x)) {
        if((s.y < (hr.y + hr.height)) && (s.y > hr.y)) {
          kill_hr();
          baddie_shots.splice(i, 1);
        }
      }
    }
  };
  hr.shoot = function() {
    var hr = this;
    var newShot = $.extend({}, shot);
    newShot.x = hr.x + 74;
    newShot.y = hr.y + 34;
    hr.shots.push(newShot);

    hr.shot_fired = true;
    setTimeout(function() { hr.shot_fired = false;}, hr.shot_interval);
  };
  var baddie_shoot = function(b) {
    if(b.shot_initial_delay) {
      setTimeout(function() { b.shot_fired = false; }, b.shot_initial_delay);
      b.shot_initial_delay = false;
    }
    if(!b.shot_fired) {
      var newShot = $.extend({}, shot);
      newShot.x = b.x;
      newShot.y = b.y + (b.height/2);
      newShot.speed = 8;
      baddie_shots.push(newShot);
      b.shot_fired = true;
      setTimeout(function() { b.shot_fired = false;}, b.shot_interval);
    }
  };
  var kill_hr = function() {
    hr.dead = true;
    setTimeout(function() {
      hr.x = 20;
      hr.y = settings.canvas_height/2 - hr.height/2;
      hr.dead = false;
    }, 1050);
    var original_y = hr.y;
    var i = 0;
    for(i=0; i<10; i++) {
      setTimeout(function() {
        hr.y = -500;
        draw_hr();
      }, 100*i);
      setTimeout(function() {
        hr.y = original_y;
        draw_hr();
      }, (100*i)+50);
    }
  };
  var kill_baddie = function(i) {
    var b = baddies[i];
    b.color = "#cc0000";
    b.speed = 0;
    setTimeout(function() {
      baddies.splice(i, 1);
    }, 50);
  };
  var draw_bg = function() {
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.moveTo(0, 0);
    ctx.fillRect(0, 0, settings.canvas_width, settings.canvas_height);
  };
  var draw_shot = function(x, y) {
    ctx.beginPath();
    ctx.fillStyle = "#ae1f23";
    ctx.moveTo(x, y);
    ctx.fillRect(x, y, 10, 2);
  };
  var draw_baddie_shot = function(s) {
    ctx.beginPath();
    ctx.fillStyle = "#aaffff";
    ctx.moveTo(s.x, s.y);
    ctx.fillRect(s.x, s.y, 4, 4);
  };
  var draw_baddie = function(b) {
    ctx.beginPath();
    ctx.fillStyle = b.color;
    ctx.moveTo(b.x, b.y);
    ctx.fillRect(b.x, b.y, b.width, b.height);
  };
  var draw_hr = function() {
    var x = hr.x;
    var y = hr.y;
    ctx.beginPath();
    ctx.fillStyle = "#ae1f23";
    ctx.moveTo(x += 26, y);
    ctx.lineTo(x += 15, y);
    ctx.lineTo(x += 33, y += 34);
    ctx.lineTo(x -= 33, y += 34);
    ctx.lineTo(x -= 15, y);
    ctx.lineTo(x, y -= 8);
    ctx.lineTo(x -= 13, y -= 2);
    ctx.lineTo(x += 3, y -= 11);
    ctx.lineTo(x -= 16, y -= 12);
    ctx.lineTo(x += 16, y -= 12);
    ctx.lineTo(x -= 3, y -= 11);
    ctx.lineTo(x += 13, y -= 2);
    ctx.fill();
    ctx.moveTo(x -= 4, y += 15);
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, 16, 7);
    ctx.moveTo(x, y += 12);
    ctx.fillRect(x, y, 16, 7);
    ctx.beginPath();
    ctx.moveTo(x += 21, y -= 22);
    ctx.lineTo(x += 19, y += 19);
    ctx.lineTo(x -= 20, y += 20);
    ctx.lineTo(x -= 5, y -= 5);
    ctx.lineTo(x += 15, y -= 15);
    ctx.lineTo(x -= 14, y -= 14);
    ctx.fill();
  };
});