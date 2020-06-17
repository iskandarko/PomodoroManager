
class Timer {

    isRunning = false;
    isReseted = true;
    timeIsUp = false;
    mode = "pomodoro";

    constructor(timerDisplay, alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod) {
        this.timerDisplay = timerDisplay;
        this.alarmSound = alarmSound;
        this.pomodoroPeriod = pomodoroPeriod;
        this.shortBreakPeriod = shortBreakPeriod;
        this.longBreakPeriod = longBreakPeriod;
    }

    start() {
        if (!this.isRunning) {
            setTimeout(() => {            
                this.isRunning = true;
                this.countdown();
            }, 500);
        } else return;
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
        this.start();
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
        this.timerDisplay.innerHTML = ("BUZZZ!!!");
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


let isReadingTimerState = false;
let alarmSound = new Audio ('oldschoolRing.mp3');
let pomodoroPeriod = 25;
let shortBreakPeriod = 5;
let longBreakPeriod = 10;

let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let stopBtn = document.getElementById("stopBtn");
let resetBtn = document.getElementById("resetBtn");
let pomodoroBtn = document.getElementById("pomodoroBtn");
let shortBreakBtn = document.getElementById("shortBreakBtn");
let longBreakBtn = document.getElementById("longBreakBtn");

startBtn.addEventListener("click", startCountdown);
stopBtn.addEventListener("click", stopCountdown);
resetBtn.addEventListener("click", resetCountdown);
pomodoroBtn.addEventListener("click", setPomodoro);
shortBreakBtn.addEventListener("click", setShortBreak);
longBreakBtn.addEventListener("click", setLongBreak);

let timer = new Timer(timerDisplay, alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod);

function startCountdown(){
    timer.start();
}

function stopCountdown() {
    timer.stop();
}

function resetCountdown() {
    timer.reset();
    bootstrapBtnsStateManager('reset');
}

function setPomodoro() {
    timer.setPomodoroMode();
    bootstrapBtnsStateManager('restart');
}

function setShortBreak() {
    timer.setShortBreakMode();
    bootstrapBtnsStateManager('restart');
}

function setLongBreak() {
    timer.setLongBreakMode();
    bootstrapBtnsStateManager('restart');
}

function bootstrapBtnsStateManager(state) {
    switch (state) {
        // case 'initial':
        //     stopBtn.checked = true;
        //     stopBtn.parentNode.classList.add("active");
        //     break;
        case 'reset':
            setTimeout(() => {
                resetBtn.checked = false;
                stopBtn.checked = true;
                resetBtn.parentNode.classList.remove("active");
                stopBtn.parentNode.classList.add("active");
                stopBtn.parentNode.focus();
            }, 200);
            break;
        case 'restart':
            stopBtn.parentNode.classList.remove("active");
            startBtn.parentNode.classList.remove("active");
            resetBtn.parentNode.classList.add("active");
            setTimeout(() => {
                resetBtn.parentNode.classList.remove("active");
                stopBtn.checked = false;
                stopBtn.parentNode.classList.remove("active");
                startBtn.checked = true;
                startBtn.parentNode.classList.add("active");
            }, 200);
            break;
        default:
            break;
    }
}
