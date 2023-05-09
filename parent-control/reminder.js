const iconAlarmOn = "\0" + atob("GBiBAAAAAAAAAAYAYA4AcBx+ODn/nAP/wAf/4A/n8A/n8B/n+B/n+B/n+B/n+B/h+B/4+A/+8A//8Af/4AP/wAH/gAB+AAAAAAAAAA==");
const iconAlarmOff = "\0" + (g.theme.dark
  ? atob("GBjBAP////8AAAAAAAAGAGAOAHAcfjg5/5wD/8AH/+AP5/AP5/Af5/gf5/gf5wAf5gAf4Hgf+f4P+bYP8wMH84cD84cB8wMAebYAAf4AAHg=")
  : atob("GBjBAP//AAAAAAAAAAAGAGAOAHAcfjg5/5wD/8AH/+AP5/AP5/Af5/gf5/gf5wAf5gAf4Hgf+f4P+bYP8wMH84cD84cB8wMAebYAAf4AAHg="));
const firstDayOfWeek = (require("Storage").readJSON("setting.json", true) || {}).firstDayOfWeek || 0;

function getAlarms() {
  return require("Storage").readJSON("sched.json",1)||[];
}

function setAlarms(alarms) {
  return require("Storage").writeJSON("sched.json",alarms);
}

function setAlarm(id, alarm) {
  var alarms = getAlarms().filter(a=>a.id!=id);
  if (alarm !== undefined) {
    alarm.id = id;
    if (alarm.dow===undefined) alarm.dow = 0b1111111;
    if (alarm.on!==false) alarm.on=true;
    if (alarm.timer) { // if it's a timer, set the start time as a time from *now*
      var time = new Date();
      var currentTime = (time.getHours()*3600000)+(time.getMinutes()*60000)+(time.getSeconds()*1000);
      alarm.t = currentTime + alarm.timer;
    }
    alarms.push(alarm);
  }
  setAlarms(alarms);
}
var alarm1 = setAlarm("alarm1", {
  msg: "Wake",
  t: 12*3600000,
  rp: {interval:"dow", num:2},
  dow: 0b100010,
});

var alarm2 = setAlarm("alarm2", {
  msg: "Meeting",
  t: 23*3600000 + 19*60000,
  as: false,
  rp: true,  
});

var alarms = getAlarms();

function trimLabel(label, maxLength) {
  return (label.length > maxLength
      ? label.substring(0,maxLength-3) + "..."
      : label.substring(0,maxLength));
}

function getLabel(e) {
  const date = e.date && new Date(e.date);
  const dateStr = date && `${date.getFullYear()}-${padNumber(date.getMonth()+1)}-${padNumber(date.getDate())}`;
  return ((dateStr ? `${dateStr}${e.rp?"*":""} ${formatTime(e.t)}` : formatTime(e.t) + (e.rp ? ` ${decodeRepeat(e)}` : ""))
      ) + (e.msg ? ` ${e.msg}` : "");
}

function decodeRepeat(alarm) {
  if (!alarm.rp) {
    return /*LANG*/"Once";
  }

  if (alarm.date) {
    return `${alarm.rp.num}*${INTERVAL_LABELS[INTERVALS.indexOf(alarm.rp.interval)]}`;
  }

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const dowBinary = alarm.dow;
  let repeatString = "";
  for (let i = 0; i < 7; i++) {
    if (dowBinary & (1 << i)) {
      repeatString += daysOfWeek[(i + firstDayOfWeek) % 7];
    } else {
      repeatString += "_";
    }
  }
  return repeatString;
}


function formatTime(t) {
  const hours = Math.floor(t / 3600000);
  const minutes = Math.floor((t % 3600000) / 60000);
  return `${padNumber(hours)}:${padNumber(minutes)}`;
}

function padNumber(number) {
  return number.toString().padStart(2, "0");
}

// Show the alarms on startup
function showMainMenu() {
  const menu = {
    "": { "title": /*LANG*/"Reminders" },
    "< Back": () => load()
  };

  alarms.forEach((e, index) => {
    menu[trimLabel(getLabel(e),40)] = {
      value: e.on ? (e.timer ? iconTimerOn : iconAlarmOn) : (e.timer ? iconTimerOff : iconAlarmOff)    };
  });

  E.showMenu(menu);
}


showMainMenu();
Bangle.loadWidgets();
Bangle.drawWidgets();


var alarm3 = setAlarm("alarm3", {
  msg: "ahaha",
  t: 17*3600000 + 45*60000,
  date: "2022-06-04",
  rp: {interval:"month",num:2},
});

var alarm4 = setAlarm("alarm4", {
  msg: "mo",
  t: 1*3600000 + 45*60000,
  rp: {interval:"day",num:2},
});
