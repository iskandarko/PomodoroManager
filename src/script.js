
let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startButton");
let stopBtn = document.getElementById("stopButton");
let resetBtn = document.getElementById("resetButton");
let pomodoroBtn = document.getElementById("pomodoroButton");
let shortBreakBtn = document.getElementById("shortBreakButton");
let longBreakBtn = document.getElementById("longBreakButton");
let saveSettingsBtn = document.getElementById("saveSettingsBtn");
let settingsPomodoro = document.getElementById("settingsPomodoro");
let settingsShortBreak = document.getElementById("settingsShortBreak");
let settingslongBreak = document.getElementById("settingslongBreak");

let sounds = [new Audio("sounds/oldBell.mp3"), new Audio("sounds/alarmClock.mp3")]
let alarmSound = sounds[0];
let pomodoroPeriod = 25;
let shortBreakPeriod = 5;
let longBreakPeriod = 10;

startBtn.addEventListener("click", startCountdown);
stopBtn.addEventListener("click", stopCountdown);
resetBtn.addEventListener("click", resetCountdown);
pomodoroBtn.addEventListener("click", setPomodoro);
shortBreakBtn.addEventListener("click", setShortBreak);
longBreakBtn.addEventListener("click", setLongBreak);
saveSettingsBtn.addEventListener("click", updateTimerSettings);
resetSettingsBtn.addEventListener("click", resetTimerSettings);

for (let i = 0; i < sounds.length; i++) {
    sounds[i].addEventListener("playing", bootstrapBtnsStateHacker);
}


class Timer {

    constructor(timerDisplay, alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod) {
        this.timerDisplay = timerDisplay;
        this.alarmSound = alarmSound;
        this.pomodoroPeriod = pomodoroPeriod;
        this.shortBreakPeriod = shortBreakPeriod;
        this.longBreakPeriod = longBreakPeriod;
        this.isRunning = false;
        this.isReseted = true;
        this.timeIsUp = false;
        this.mode = "pomodoro";
    }

    setSettings(alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod) {
        this.pomodoroPeriod = pomodoroPeriod;
        this.shortBreakPeriod = shortBreakPeriod;
        this.longBreakPeriod = longBreakPeriod;
        this.alarmSound = alarmSound;
        this.mode = "pomodoro";
    }

    start() {
        if (!this.isRunning) {   
            this.isRunning = true;
            this.countdown();
        } else return;
    }
    
    delayedStart() {
        setTimeout(() => {
            this.start();
        }, 500);
    }

    stop() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.isReseted = false;
            this.timeLeftAtStopBtnPressed = this.timeLeft;
        } else return;
    }

    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isReseted = true;
        this.timeIsUp = false;
        this.updateDisplay();
    }

    restart() {
        this.reset();
        this.delayedStart();
    }

    setPomodoroMode() {
        this.mode = "pomodoro";
        this.restart();
    }

    setShortBreakMode() {
        this.mode = "shortBreak";
        this.restart();
    }

    setLongBreakMode() {
        this.mode = "longBreak";
        this.restart();
    }

    countdown() {
        let startTime = new Date().getTime();
        let countDownFinishTime = new Date(startTime + this.getModeFinishTime() * 60000);

        this.timerInterval = window.setInterval(() => {
            let now = new Date();
            this.timeLeft = new Date(countDownFinishTime - now);
            this.updateDisplay(); 
            if ((this.timeLeft) <= 0) {
                this.timeIsUpHandler();
            } 
        }, 200);
    }

    updateDisplay() { 
        if (this.isReseted && !this.isRunning) {
            let minutes = this.formatTime(this.getModeFinishTime());
            let seconds = this.formatTime(0);
            this.showTime(minutes, seconds);
        } else {
            let minutes = this.formatTime(this.timeLeft.getMinutes());
            let seconds = this.formatTime(this.timeLeft.getSeconds());
            this.showTime(minutes, seconds);
        }
    }

    timeIsUpHandler() {
        this.timeIsUp = true;
        this.isRunning = false;
        this.isReseted = true;
        this.alarm();
        clearInterval(this.timerInterval);
    }

    formatTime(value) {
        if (value < 10) {
            return value = '0' + value;
        } else {
            return value;
        }
    }

    alarm() {
        this.alarmSound.play();
        this.timerDisplay.innerHTML = ("00:00");
        document.title = ("BUZZZ!!!");
    }

    showTime(minutes, seconds) {
        this.timerDisplay.innerHTML = minutes + ':' + seconds;
        document.title = this.timerDisplay.innerHTML + " Pomodoro";
    }

    getModeFinishTime() {
        if (this.isReseted) {
            switch (this.mode) {
                case 'pomodoro':
                    return this.pomodoroPeriod;
                    break;
                case 'shortBreak':
                    return this.shortBreakPeriod;
                    break;
                case 'longBreak':
                    return this.longBreakPeriod;
                    break;
                default:
                    break;
            } 
        } else {
            return this.timeLeftAtStopBtnPressed.getTime() / 60000;
        }
    }
}



const timer = new Timer(timerDisplay, alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod);

function startCountdown(){
    timer.start();
    notifyMe();
}

function stopCountdown() {
    timer.stop();
}

function resetCountdown() {
    timer.reset();
    bootstrapBtnsStateHacker('reset');
}

function setPomodoro() {
    timer.setPomodoroMode();
    bootstrapBtnsStateHacker('restart');
}

function setShortBreak() {
    timer.setShortBreakMode();
    bootstrapBtnsStateHacker('restart');
}

function setLongBreak() {
    timer.setLongBreakMode();
    bootstrapBtnsStateHacker('restart');
}

function updateTimerSettings() {
    if (!isProperValue(settingsPomodoro.value) || !isProperValue(settingsShortBreak.value) || !isProperValue(settingsLongBreak.value)) {
        alert("Please set a positive integer between 0 and 60 minutes");
    } else {
        stopCountdown();
        applyNewSettings(getSelectedSound(), settingsPomodoro.value, settingsShortBreak.value, settingsLongBreak.value);
        resetCountdown();
        bootstrapBtnsStateHacker('pomodoro');
        $('#settingsModal').modal('toggle');
    }
}

function applyNewSettings(newAlarmSound, newPomodoroPeriod, newShortBreakPeriod, newlongBreakPeriod) {
    alarmSound = newAlarmSound;
    pomodoroPeriod = newPomodoroPeriod;
    shortBreakPeriod = newShortBreakPeriod;
    longBreakPeriod = newlongBreakPeriod;

    timer.setSettings(alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod)
}

function isProperValue(num) {
    return Math.floor(num) == num && num > 0 && num <= 60;
}

function getSelectedSound() {
    return sounds[document.querySelector('input[name="sounds"]:checked').value];
}

function resetTimerSettings() {
    settingsPomodoro.value = 25;
    settingsShortBreak.value = 5;
    settingsLongBreak.value = 10;
    document.getElementById("oldBell").checked = true;
}

function bootstrapBtnsStateHacker(state) {
    switch (state) {
        case 'reset':
            setTimeout(() => {
                switchToStopBtn();
            }, 200);
            break;
        case 'restart':
            switchToResetBtn();
            setTimeout(() => {
                switchResetToStartBtn();
            }, 500);
            break;
        case 'pomodoro':
            switchModeToPomodoro();
        default:
            switchToStopBtn();
            break;
    }
}

function switchToStopBtn() {
    startBtn.checked = false;
    resetBtn.checked = false;
    stopBtn.checked = true;
    startBtn.parentNode.classList.remove("active");
    resetBtn.parentNode.classList.remove("active");
    stopBtn.parentNode.classList.add("active");
    stopBtn.parentNode.focus();
}

function switchToResetBtn() {
    stopBtn.checked = false;
    startBtn.checked = false;
    resetBtn.checked = true;
    stopBtn.parentNode.classList.remove("active");
    startBtn.parentNode.classList.remove("active");
    resetBtn.parentNode.classList.add("active");
}

function switchResetToStartBtn() {
    resetBtn.checked = false;
    stopBtn.checked = false;
    startBtn.checked = true;
    resetBtn.parentNode.classList.remove("active");
    stopBtn.parentNode.classList.remove("active");
    startBtn.parentNode.classList.add("active");
}

function switchModeToPomodoro() {
    longBreakBtn.checked = false;
    shortBreakBtn.checked = false;
    pomodoroBtn.checked = true;
    longBreakBtn.parentNode.classList.remove("active");
    shortBreakBtn.parentNode.classList.remove("active");
    pomodoroBtn.parentNode.classList.add("active");
}






function notifyMe() {
    // Let's check if the browser supports notifications
    console.log('started');

    if ("Notification" in window) {
        console.log("notifications supported");
        console.log("notifications permission status: " + Netification.permission)
        
        if (Notification.permission !== "denied") {
            console.log("notifications not denied condition")
            let title = "Testing";
            let options = {
                body: "hi there!"
            }
            let notification = new Notification(title, options);
        } else {
            console.log("request notification condition")
            Notification.requestPermission()
                .then((result) => {
                    if(!('permission' in Notification)) {
                    Notification.permission = result;
                }
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}