// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
require("clock_info").load();
// position on screen
const X = 135, Y = 150;

function draw() {
  // work out how to display the current time
  var d = new Date();
  var h = d.getHours()%12, m = d.getMinutes();
  var time = (" "+h).substr(-2) + ":" + m.toString().padStart(2,0);
  // Reset the state of the graphics library
  g.reset();
  // draw the current time (4x size 7 segment)
  g.setFont("7x11Numeric7Seg",4);
  g.setFontAlign(1,1); // align right bottom
  g.drawString(time, X, Y, true /*clear background*/);
  // draw the seconds (2x size 7 segment)
  g.setFont("7x11Numeric7Seg",2);
  g.drawString(("0"+d.getSeconds()).substr(-2), X+30, Y, true /*clear background*/);
  // draw the date, in a normal font
  g.setFont("6x8");
  g.setFontAlign(0,1); // align center bottom
  // pad the date - this clears the background if the date were to change length
  var dateStr = "    "+require("locale").date(d)+"    ";
  g.drawString(dateStr, g.getWidth()/2, Y+15, true /*clear background*/);
}

// Clear the screen once, at startup
g.clear();
// draw immediately at first
draw();
// now draw every second
var secondInterval = setInterval(draw, 1000);
// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
  if (secondInterval) clearInterval(secondInterval);
  secondInterval = undefined;
  if (on) {
    secondInterval = setInterval(draw, 1000);
    draw(); // draw immediately
  }
});
/* Show launcher when middle button pressed
This should be done *before* Bangle.loadWidgets so that
widgets know if they're being loaded into a clock app or not */
Bangle.setUI("clock");
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();


// Load the clock infos
let clockInfoItems = require("clock_info").load();
// Add the
let clockInfoMenu = require("clock_info").addInteractive(clockInfoItems, {
  // Add the dimensions we're rendering to here - these are used to detect taps on the clock info area
  x : 20, y: 20, w: 140, h:80,
  // You can add other information here you want to be passed into 'options' in 'draw'
  // This function draws the info
  draw : (itm, info, options) => {
    // itm: the item containing name/hasRange/etc
    // info: data returned from itm.get() containing text/img/etc
    // options: options passed into addInteractive
    // Clear the background
    g.reset().clearRect(options.x, options.y, options.x+options.w-2, options.y+options.h-1);
    // indicate focus - we're using a border, but you could change color?
    if (options.focus) g.drawRect(options.x, options.y, options.x+options.w-2, options.y+options.h-1); // show if focused
    // we're drawing center-aligned here
    var midx = options.x+options.w/2;
    if (info.img) g.drawImage(info.img, midx-12,options.y+4); // draw the image
    g.setFont("6x8:2").setFontAlign(0,1).drawString(info.text, midx,options.y+44); // draw the text
  }
});
