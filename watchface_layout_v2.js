// Load fonts
require("Font7x11Numeric7Seg").add(Graphics);
// require("clock_info").load();
// position on screen
const X = 135, Y = 150;

var img1 = {
  width : 64, height : 64, bpp : 1,
  transparent : 0,
  palette : new Uint16Array([65535,0]),
  buffer : atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgwAAAAAAAAPjAAAgAAAAB+AAAHAA4AAHYAAAIADAfwfgD+AAAAP/48B//AAAD//4Af//AAAfAHwD4A+AADwAHgeAA8AAcAAPDwAA4ADgAAcOAABwAcAAA5wAADgBwAAB+AAAOAOAAAH4AAAcA4AAAPAAABwDAAAAYAAADAMAAABgT+AMBwAAAADv4A4HAAAAAEfADgcf8AAAAAAOBx/wAAAAAA4HAAAAwAA/DgMAAAHAAD8MAwAAAcAAHgwDgAADwAAAHAOAAAPgAAAcAcAAA+AAADgBwABH4AAAOADgAOZgAABwAOAB7mMAAHAAcAH8c5///gH//7x3v//+Af//PHfwA4AAHwAYN/AHAAAPAAA/4A8AAAeAAD7gHAAAAcAAPsA4AABA8AA+APAAAOB4ABwB4MAAADwAHAPD8AAAHgAcB4fwAAAHABwOBjgAAAPAGDwOGAAAAeAAeAY4AAAA8ADwB/gAHwB4AeAD8AA/ABwDgAHgAHOADgcAAAAAc4AHngAAAAA/AAP8AAAgAD8DAfgMAHAADgMA8AwAIAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")
};


var img2 = {
  width : 50, height : 50, bpp : 1,
  transparent : 0,
  palette : new Uint16Array([65535,0]),
  buffer : atob("AAAAAAAAAAAAAAAAAAAAeGZmAAAAPxm9gAAADOAPAAAABhgH4AAAAYcD/AAAAGDA2wAAABgwBgAAAAYMAYAAAAGDAGAAAABgwBgAAAAP4AYAAAAD+AGAAAAAAABgAAAAAAAYAAAAD+AGAAAAA/gBgAAAAMYAYAAAADGAGAAAAA7ABgAAAAHwAYAAAAA4AGAAAAAAANsAAAAAAD/AAAAAAAfgAAAAAADwAADxmZm9gAB+ZmZmYAA5gAAAAAAMMAAAAAAHDAAAAAABgwAAAAAAYMAAAAAAGDAAAAAABgwAAAAAAYcAAAAAAD+AAAAAAA/gAAAAAAAAAAAAAAAAAAAAAAA/gAAAAAAP4AAAAAADGAAAAAAAxgAAAAAAG4AAAAAAB8AAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAA==")
};

var img3 = {
  width : 50, height : 50, bpp : 1,
  transparent : 0,
  palette : new Uint16Array([65535,0]),
  buffer : atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAMAAAAAAADAAAAAAAAwAAAAAAAMAAAAABgDAGAAAAcAwDgAAADgABwAAAAcAA4AAAADB8MAAAAAD/wAAAAAB4cAAAAAA4BD8AAAAMAD/wAAAHADwOAAABgBwAwAD+YAYAGAA/mAMAAwAABgDAAMAAAcBgAB/AADAYAAf8AA4GAAEDgAHBgAAAcAAw4AAADgDA+AAAAYBwcAAAADA4MAAAAAwcHAAAAAMGBgAAAADAAYAAAAAwAGAAAAAMABgAAAAGAAcAAAADgADAAAABwAAcAAAA4AAD////8AAAf///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==")
};

// record heart rate (Called every 5 min)
var hrmArr = [];
var bpmAvg = 0, bpmSum = 0;

function measure() {
  
  Bangle.setHRMPower(1);
  setTimeout(() => {
    Bangle.setHRMPower(0);
  }, 60000); // records for 1 and a half min for accurate measurement
  
  Bangle.on("HRM", function(h) {
    var heartRate = [
        "hrm",
        h.bpm,
        h.confidence
    ];

    console.log(heartRate);

    if (heartRate[2] >= 55) {
        console.log("recording heartRate");
        hrmArr.push(heartRate[1]);
        bpmSum = hrmArr.reduce(function (x, y) {
          return x + y;
        }, 0);

        bpmAvg = bpmSum / hrmArr.length;
        bpmAvg = Math.round(bpmAvg);
        console.log("bpm: " + bpmAvg);
    }
  });
}

measure();
setInterval('measure();', 500000); 



const x1 = 30, y1 = 30, x2 = 88, y2 = 88;
const midx1 = (x1 + x2)/2;
const midy1 = (y1 + y2)/2;

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
  
  var health_D = Bangle.getHealthStatus('day');
  var stepCount = health_D.steps;
  g.setFont("6x8",2);
  g.setFontAlign(0,0);
  g.clearRect(x1-20, y1-20, x2+5, y2+5);
  g.drawImage(img2, 10, 20, {scale:4/5});
  g.drawString(stepCount, midx1+15, midy1-20);
  g.drawImage(img1, 10, 60, {scale:2/3});
  g.drawString(bpmAvg, midx1+10, midy1+20);
  
  g.drawImage(img3, 100, 45, {scale:4/5});
  g.drawString('70º', 150, midy1-15);
  g.drawString('50º', 150, midy1+35);
  
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
setInterval(draw, 1000);
/* Show launcher when middle button pressed
This should be done *before* Bangle.loadWidgets so that
widgets know if they're being loaded into a clock app or not */
Bangle.setUI("clock");
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();

/*
let storage = require("Storage");
let stepGoal = undefined;
// Load step goal from health app and pedometer widget
let d = storage.readJSON("health.json", true) || {};
stepGoal = d.stepGoal;
if (stepGoal == undefined) {
  d = storage.readJSON("wpedom.json", true) || {};
  stepGoal = d != undefined && d.settings != undefined ? d.settings.goal : 10000;
}
*/


// Load the clock infos
/*
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
*/

