"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var timerDisplay = document.getElementById("timer");
var startBtn = document.getElementById("startButton");
var stopBtn = document.getElementById("stopButton");
var resetBtn = document.getElementById("resetButton");
var pomodoroBtn = document.getElementById("pomodoroButton");
var shortBreakBtn = document.getElementById("shortBreakButton");
var longBreakBtn = document.getElementById("longBreakButton");
var saveSettingsBtn = document.getElementById("saveSettingsBtn");
var settingsPomodoro = document.getElementById("settingsPomodoro");
var settingsShortBreak = document.getElementById("settingsShortBreak");
var settingslongBreak = document.getElementById("settingslongBreak");
var sounds = [new Audio("sounds/oldBell.mp3"), new Audio("sounds/alarmClock.mp3")];
var alarmSound = sounds[0];
var pomodoroPeriod = 25;
var shortBreakPeriod = 5;
var longBreakPeriod = 10;
startBtn.addEventListener("click", startCountdown);
stopBtn.addEventListener("click", stopCountdown);
resetBtn.addEventListener("click", resetCountdown);
pomodoroBtn.addEventListener("click", setPomodoro);
shortBreakBtn.addEventListener("click", setShortBreak);
longBreakBtn.addEventListener("click", setLongBreak);
saveSettingsBtn.addEventListener("click", updateTimerSettings);
resetSettingsBtn.addEventListener("click", resetTimerSettings);

for (var i = 0; i < sounds.length; i++) {
  sounds[i].addEventListener("playing", bootstrapBtnsStateHacker);
}

var Timer = /*#__PURE__*/function () {
  function Timer(timerDisplay, alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod) {
    _classCallCheck(this, Timer);

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

  _createClass(Timer, [{
    key: "setSettings",
    value: function setSettings(alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod) {
      this.pomodoroPeriod = pomodoroPeriod;
      this.shortBreakPeriod = shortBreakPeriod;
      this.longBreakPeriod = longBreakPeriod;
      this.alarmSound = alarmSound;
      this.mode = "pomodoro";
    }
  }, {
    key: "start",
    value: function start() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.countdown();
      } else return;
    }
  }, {
    key: "delayedStart",
    value: function delayedStart() {
      var _this = this;

      setTimeout(function () {
        _this.start();
      }, 500);
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.isReseted = false;
        this.timeLeftAtStopBtnPressed = this.timeLeft;
      } else return;
    }
  }, {
    key: "reset",
    value: function reset() {
      clearInterval(this.timerInterval);
      this.isRunning = false;
      this.isReseted = true;
      this.timeIsUp = false;
      this.updateDisplay();
    }
  }, {
    key: "restart",
    value: function restart() {
      this.reset();
      this.delayedStart();
    }
  }, {
    key: "setPomodoroMode",
    value: function setPomodoroMode() {
      this.mode = "pomodoro";
      this.restart();
    }
  }, {
    key: "setShortBreakMode",
    value: function setShortBreakMode() {
      this.mode = "shortBreak";
      this.restart();
    }
  }, {
    key: "setLongBreakMode",
    value: function setLongBreakMode() {
      this.mode = "longBreak";
      this.restart();
    }
  }, {
    key: "countdown",
    value: function countdown() {
      var _this2 = this;

      var startTime = new Date().getTime();
      var countDownFinishTime = new Date(startTime + this.getModeFinishTime() * 60000);
      this.timerInterval = window.setInterval(function () {
        var now = new Date();
        _this2.timeLeft = new Date(countDownFinishTime - now);

        _this2.updateDisplay();

        if (_this2.timeLeft <= 0) {
          _this2.timeIsUpHandler();
        }
      }, 200);
    }
  }, {
    key: "updateDisplay",
    value: function updateDisplay() {
      if (this.isReseted && !this.isRunning) {
        var minutes = this.formatTime(this.getModeFinishTime());
        var seconds = this.formatTime(0);
        this.showTime(minutes, seconds);
      } else {
        var _minutes = this.formatTime(this.timeLeft.getMinutes());

        var _seconds = this.formatTime(this.timeLeft.getSeconds());

        this.showTime(_minutes, _seconds);
      }
    }
  }, {
    key: "timeIsUpHandler",
    value: function timeIsUpHandler() {
      this.timeIsUp = true;
      this.isRunning = false;
      this.isReseted = true;
      this.alarm();
      clearInterval(this.timerInterval);
    }
  }, {
    key: "formatTime",
    value: function formatTime(value) {
      if (value < 10) {
        return value = '0' + value;
      } else {
        return value;
      }
    }
  }, {
    key: "alarm",
    value: function alarm() {
      this.alarmSound.play();
      this.timerDisplay.innerHTML = "00:00";
      document.title = "BUZZZ!!!";
    }
  }, {
    key: "showTime",
    value: function showTime(minutes, seconds) {
      this.timerDisplay.innerHTML = minutes + ':' + seconds;
      document.title = this.timerDisplay.innerHTML + " Pomodoro";
    }
  }, {
    key: "getModeFinishTime",
    value: function getModeFinishTime() {
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
  }]);

  return Timer;
}();

var timer = new Timer(timerDisplay, alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod);

function startCountdown() {
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
  timer.setSettings(alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod);
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
      setTimeout(function () {
        switchToStopBtn();
      }, 200);
      break;

    case 'restart':
      switchToResetBtn();
      setTimeout(function () {
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