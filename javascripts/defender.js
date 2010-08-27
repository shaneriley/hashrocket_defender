$(function() {
  var canvas = $("canvas")[0],
      ctx = canvas.getContext("2d");
  var settings = {
    canvas_width: canvas.clientWidth,
    canvas_height: canvas.clientHeight,
    shot_interval : 400,
    shot_fired : false,
    shot_speed : 30,
    spawn_baddie : true,
    spawn_rate : 2000,
    baddie_speed : 5
  };
  var hr = {
    x : 20,
    y : 20,
    speed : 10,
    shots : []
  };
  var baddie = {
    x : settings.canvas_width + 20,
    y : Math.random() * settings.canvas_height,
    speed : settings.baddie_speed
  };
  var baddies = [];
  var key = [];
  this.onkeydown = this.onkeyup = function(e) {
    key[e.which] = (e.type == 'keydown');
  };
  setInterval(function() {
    hr.x += key[39]?hr.speed:0;
    hr.x -= key[37]?hr.speed:0;
    hr.y -= key[38]?hr.speed:0;
    hr.y += key[40]?hr.speed:0;
    if (key[32]) {
      if(!settings.shot_fired) {
        var shot = [hr.x + 68, hr.y + 36];
        hr.shots.push(shot);
        settings.shot_fired = true;
        setTimeout(function() { settings.shot_fired = false;}, settings.shot_interval);
      }
    }
    if(settings.spawn_baddie) {
      baddies.push($.extend({}, baddie));
      settings.spawn_baddie = false;
      setTimeout(function() { settings.spawn_baddie = true; }, settings.spawn_rate);
    }

    ctx.clearRect(0, 0, settings.canvas_width, settings.canvas_height);
    draw_bg();
    var i = 0;
    for(i=0; i<baddies.length; i++) {
      var b = baddies[i];
      if(b.x < 0) {
        baddies.splice(i, 1);
      } else {
        b.x -= b.speed;
        draw_baddie(b.x, b.y);
      }
    }
    $.each(hr.shots, function(i, s) {
      s[0] += settings.shot_speed;
      draw_shot(s[0], s[1]);
    });
    draw_hr(hr.x, hr.y);
  }, 30);

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
  var draw_baddie = function(x, y) {
    ctx.beginPath();
    ctx.fillStyle = "#00ffff";
    ctx.moveTo(x, y);
    ctx.fillRect(x, y, 10, 10);
  };
  var draw_hr = function(x, y) {
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