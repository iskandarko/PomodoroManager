import Timer from "./timer.js";

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
let settingsLongBreak = document.getElementById("settingslongBreak");
let settingsNotifications = document.getElementById("settingsNotifications");
let alertAboutNotifications = document.getElementById("alertAboutNotifications");
let notificationsAllowBtn = document.getElementById("notificationsAllowBtn");

let sounds = [new Audio("public/sounds/oldBell.mp3"), new Audio("public/sounds/alarmClock.mp3")];
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
notificationsAllowBtn.addEventListener("click", requestNotificationPermission);

const timer = new Timer(timerDisplay, alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod, callWhenTimeIsUpFunc);

window.onload = () => {
    manageNotificationsSettings();
}

function startCountdown(){
    timer.start();
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

function callWhenTimeIsUpFunc() {
    notify();
    bootstrapBtnsStateHacker();
}

function manageNotificationsSettings() {
    if (("Notification" in window) && (Notification.permission === "default")) {
        notificationsSettingsShow();
        alertAboutNotificationsShow();
    } else {
        notificationsSettingsHide();
        alertAboutNotificationsHide();
    }
}    

function notificationsSettingsShow() {
    settingsNotifications.style.display = "block";
}

function notificationsSettingsHide() {
    settingsNotifications.style.display = "none";
}

function alertAboutNotificationsShow() {
    alertAboutNotifications.style.display = "block";
}

function alertAboutNotificationsHide() {
    alertAboutNotifications.style.display = "none";
}


function notify() {
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            let title = "PomodoroManager";
            let options = {
                body: "Buzzz!!!"
            }
            let notification = new Notification(title, options);
        }
    }
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
        manageNotificationsSettings(); 
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

function requestNotificationPermission() {
    Notification.requestPermission()
        .then((result) => {
            if(!('permission' in Notification)) {
            Notification.permission = result;
        } 
        })
        .catch((err) => {
            console.log(err);
        });
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
