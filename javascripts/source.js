$(function() {
  m = Math;
  // k = keyboard state object, reuse Math.abs to avoid an initializer
  // so k() = Math.abs(), but k[keycode] = down state
  k = m.abs;
  // s = score
  // q = quit, if 1 then game over
  // g = rate counter to generate enemy fighters
  g = s = q = 0;
  r = 53; // generate a fighter every this many frames, 1 frame per 40 ms
  // key state tracking
  this.onkeydown = this.onkeyup = function(e) { 
    // which is shorter than keyCode
    k[e.which] = (e.type == 'keydown');
    if (k[32] & !q) { 
      // d: inverted x direction travelling speed
      f.push({x: p.x, y: p.y, s: 4, d: -3, b: 1});
    };
  };

  with(document.getElementById('c')) {
    style.border = 'inset #999';
    width = w = 350; height = h = 150;
    c = getContext('2d');
    // fighters
    // s: delta x for drawing
    p = {x: 10, y: h/2, s: 8}; // player 1
    f = []; // enemy fighters and bullets, bullets have b: 1

    with (f) {
      // d = draw item
      // p.s = scale factor for flipping rendering across the x axis
      function d(p) {
        c.beginPath();
        c.moveTo(p.x, p.y);
        x=p.x-p.s; v = p.b?1:5;
        c.lineTo(x, p.y+v);
        c.lineTo(x, p.y-v);
        c.fill();
      }
      setInterval(function() {
        l=length;
        // update the position of the main fighter
        p.x += k[39]?2:0; // right
        p.x -= k[37]?2:0; // left
        p.y -= k[38]?2:0; // up
        p.y += k[40]?2:0; // down
        // should we generate an enemy fighter and enemy bullets?
        // value is inverted: g=0 -> generate fighter
        g %= m.max(10, r-=0.02)|0; // slowly increase the rate of fighters
        // generate enemy fighter
        if (!g++) push({x: w, y: h*m.random(), s: -8, d: 1});
        // draw everything
        t = c.fillStyle = c.createLinearGradient(0,0,w,h);
        t.addColorStop(0,'#170');
        t.addColorStop(1,'#010'); 
        c.fillRect(0,0,w,h);
        c.fillStyle = '#3F1';
        i=l;
        while (i--) {
          // animate enemy fighters and bullets
          x = (o=f[i]).x -= o.d;
          // if this is a player 1 bullet, 
          // do collision detection against enemy fighters
          // o.d < 0: player 1 object
          if (o.b & o.d<0) {
            // for every enemy fighter
            j=l;
            while (j--) {
              z=f[j];
              // if collision, remove bullet and fighter and increase score
              // !z.b = not a bullet
              if (z && !z.b && k(x-z.x-4)<4 && k(z.y-o.y)<4) {
                if (i>j) i--;
                splice(j, 1);
                splice(i, 1);
                s++;
              };
            }; // end while (j--)
          };
          // do collision detection between player 1 and enemy objects
          // o.d>0 : enemy object
          if (!q && o.d>0 && k(p.x-x-6)<4 && k(o.y-p.y)<5) {
            q=1;
            splice(i, 1);
          };
          // if this is a fighter, and not a bullet, 
          // and it's time to fire bullets, then fire a bullet
          // x%h -> fire bullets every h pixels
          if (!(o.b | x%h)) push({x: x, y: o.y, s: -4, d: 2, b: 1});
          // remove them if they go out of the screen
          if (k(x) > w+9) splice(i, 1);
          // draw all items
          d(o);
        }; // end while (i--)
        if (!q) d(p);
        c.fillText(s, 2, h-2);
      }, 40);
    }
  }
});