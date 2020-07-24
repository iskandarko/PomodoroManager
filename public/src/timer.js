export default class Timer {

    constructor(timerDisplay, alarmSound, pomodoroPeriod, shortBreakPeriod, longBreakPeriod, callWhenTimeIsUpFunc) {
        this.timerDisplay = timerDisplay;
        this.alarmSound = alarmSound;
        this.pomodoroPeriod = pomodoroPeriod;
        this.shortBreakPeriod = shortBreakPeriod;
        this.longBreakPeriod = longBreakPeriod;
        this.isRunning = false;
        this.isReseted = true;
        this.timeIsUp = false;
        this.mode = "pomodoro";
        this.callWhenTimeIsUpFunc = callWhenTimeIsUpFunc;
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
        this.callWhenTimeIsUpFunc();
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
