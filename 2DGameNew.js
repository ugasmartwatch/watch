// starting and ending times
var startTime;
var endTime, timeDiff;

// starting point
var x,y;
x = y = 88;

// obstacles storage;
var border = [];
var badX, badY;
badX = [];
badY = [];

//heart
var hrmArr = [];
var bpmSum;
var bpmAvg;

function genObstacles () {
    for (let i = 0; i < 5; i++) {
        var x1, y1;
        x1 = y1 = 0;
        
        while (x1 == 0 || y1 == 0 || Math.abs(x1-88) < 10 || Math.abs(y1-88) < 10) {
            x1 = Math.random() * (156-20) + 20;
            y1 = Math.random() * (156-20) + 20;
        }
        // console.log(x, y);
        badX.push(x1-10,x1+10);
        badY.push(y1-10,y1+10);

        obstacles = [x1-10, y1-10, x1+10, y1-10, x1+10, y1+10, x1-10, y1+10]; 

        
        console.log(obstacles);
        // console.log("obstacles");
        border.push(obstacles);
    }
}

function drawAll () {
    Bangle.setLCDPower(1);
    let points = [10,10,166,10,166,166,10,166];
    g.drawPoly(points, true);
    for (let i = 0; i < border.length; i++) {
        g.drawPoly(border[i], true);
    }
}

function game(diff) {

    Bangle.setHRMPower(1);
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

    Bangle.on("accel", function(a) {
        var accel = [
            "accel",
            Math.round(a.x*100),
            Math.round(a.y*100)
        ];
        
        // update ball position      
        if (accel[1] >= 0) {
            dx = -Math.pow(accel[1],2)/2;
        } else {
            dx = Math.pow(accel[1],2)/2;
        }
        if (accel[2] >= 0) {
            dy = -Math.pow(accel[2],2)/2;
        } else {
            dy = Math.pow(accel[2],2)/2;
        }
        x = x + dx/150;
        y = y + dy/150;
        g.clear();
        drawAll();
        g.drawCircle(x,y,7);
      
        endTime = new Date();
        timeDiff = (endTime - startTime) / 1000;
        console.log("timeDiff " + timeDiff);
      
        // out of bounds
        if (x <= 10 || y <= 10 || x >= 166 || y >= 166) {
            Bangle.setHRMPower(0);
            reset();
            E.showMessage("You went out of bounds!");
        }

        // if time reaches 60 second
        if (timeDiff >= 60) {
            console.log("Time's up");
            Bangle.setHRMPower(0);
            reset();
            E.showMessage(
              "You've won! Your heartrate is: " + bpmAvg);
        }
        
        
        // hitting the obstacles
        if (diff == 2) {
          
            if ((badX[0] < x && x < badX[1]) || (badX[2] < x && x < badX[3]) || (badX[4] < x && x < badX[5]) || (badX[6] < x && x < badX[7]) || (badX[8] < x && x < badX[9])) {
                if ((badY[0] < y && y < badY[1]) || (badY[2] < y && y < badY[3]) || (badY[4] < y && y < badY[5]) || (badY[6] < y && y < badY[7]) || (badY[8] < y && y < badY[9])) {
                    console.log("hit the obstacle");
                    Bangle.setHRMPower(0);
                    reset();
                    E.showMessage("You've hit the obstacle!");
                }
            }
          
        }

    });
}

function begin(diff) {
    if (diff == 2) {
        genObstacles();
    }
    g.clear();
    drawAll();
    
    console.log("First x,y:" + x + " " + y);
    g.drawCircle(x,y,7);
    startTime = new Date();
    game(diff);
    
}

function menu() {
    let menu = {
      "":{value:"Difficulty?"},
      "Easy": () => begin(1),
      "Hard": () => begin(2)
    };
    E.showMenu(menu);
}

menu();