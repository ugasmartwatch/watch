# Important Functions
- Create a reminder (with all data structure)

        var alarm = setAlarm('alarmID', { // id: alarmID
            t : 23400000,                 // Time of day since midnight in ms (if a timer, this is set automatically when timer starts)
            dow : 0b1111111,              // Binary encoding for days of the week to run alarm on
                                          //  SUN = 1
                                          //  MON = 2
                                          //  TUE = 4
                                          //  WED = 8
                                          //  THU = 16
                                          //  FRI = 32
                                          //  SAT = 64
            date : "2022-04-04",          // OPTIONAL date for the alarm, in YYYY-MM-DD format
            msg : "Eat food",             // message to display.
            last : 0,                     // last day of the month we alarmed on - so we don't alarm twice in one day!
            rp : true,                    // repeat the alarm every day? If date is given, pass an object instead of a boolean,
                                          // e.g. repeat every 2 months: { interval: "month", num: 2 }.
                                          // Supported intervals: day, week, month, year
            del : false,                  // if true, delete the timer after expiration
        };
- Get all alarms (users can see the alarm information (date, time, message) but can't edit anything from the watch)

        var alarms = getAlarms();
- The display: 
<img width="313" alt="image" src="https://github.com/ugasmartwatch/watch/assets/82740685/20f2dfd9-ee15-4063-8319-5821826a9611">
<img width="313" alt="image" src="https://github.com/ugasmartwatch/watch/assets/82740685/42935096-438f-43cf-b095-4ae95077c2a4">
        
# Documentation
    I initially worked on the website that collects values and creates alarms using "sched" libraries.
    However, the libraries did not work well so I deployed it with all needed functions from "sched" libraries.
    In the last month of the semester, I worked on the alarm app that ONLY displays the list of reminders.
    I used alarm app as reference to creates this.
    I modified most code, so the variables are not dependent to sched, date_util, time_uitl modules.
    If the showAlarm function is added to Victor's watchface, we can swipe the screen to see the reminder list.

# References
    sched libraries: https://github.com/espruino/BangleApps/tree/master/apps/sched
    alarm app: https://github.com/espruino/BangleApps/blob/master/apps/alarm/app.js
