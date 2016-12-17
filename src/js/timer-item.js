import sounds from './sounds';
import utils from './utils';

class TimerItem {
  constructor(name, totalSeconds, secondClock = null, active, timerList) {
    this.name = name;
    this.totalSeconds = totalSeconds;
    this.timerList = timerList;

    const [parsedMinutes, parsedSeconds] = utils.parseSeconds(secondClock || totalSeconds);
    this.minuteClock = parsedMinutes;
    this.secondClock = parsedSeconds;

    this.bingCount = 3;
    this.tickTimeout = null;
    this.alarmInterval = null;
    this.bingSound = new Audio(sounds.beep);
    this.boundBing = this.bing.bind(this);
    this.boundRun = this.run.bind(this);
    this.boundSpeak = this.speak.bind(this);
    this.boundClickHandler = this.handleClick.bind(this);

    this.el = this.createElement();
    this.counterEl = this.el.querySelector('.time-remaining');
    this.buttons = this.el.getElementsByTagName('button');
    this.el.addEventListener('click', this.boundClickHandler);

    this.deleted = false;
    this.pending = false;
    this.active = active;
    this.completed = parsedMinutes + parsedSeconds === 0;
  }

  handleClick(e) {
    const target = e.target.closest('button');
    if (target && typeof target.dataset.action !== 'undefined') {
      const action = target.dataset.action;
      if (typeof this[action] !== 'undefined') {
        this[action]();
      }
    }
  }

  toJSON() {
    const JSON = {
      active: this.active,
      secondClock: this.secondClock + (this.minuteClock * 60),
      name: this.name,
      totalSeconds: this.totalSeconds,
    };
    return JSON;
  }

  tickTemplate(min, sec) {
    return `${min}:${(sec < 10 ? '0' : '')}${sec}`;
  }

  timerTemplate(name, time) {
    return `
      <div class="times">
        <span class="timer-name">${name}:</span>
        <span class="clock">
          <span class="time-remaining">${time}</span>
        </span>
      </div>
      <div class="buttons">
        <button class="pause" data-action="pause"><svg width="10" height="10"><rect fill="#000" width="10" height="10" /></svg></button>
        <button class="unpause" data-action="unpause">&#x25BA;</button>
        <button class="reset" data-action="reset">&#x21ba;</button>
        <button class="delete" data-action="delete">✕</button>
      </div>
    `;
  }

  createElement() {
    const evenMinute = this.secondClock % 60 === 0;
    const timeHtml = this.tickTemplate(
      evenMinute ? this.minuteClock + 1 : this.minuteClock,
      evenMinute ? 0 : this.secondClock,
    );
    const timerEl = document.createElement('li');
    timerEl.innerHTML = this.timerTemplate(this.name, timeHtml);
    timerEl.classList.add('timer');
    return timerEl;
  }

  set deleted(isDeleted) {
    if (this.active || (this.deleted && isDeleted)) return;
    this._deleted = isDeleted;
    if (isDeleted) {
      this.el.classList.add('deleted');
    } else {
      this.el.classList.remove('deleted');
    }
  }

  get deleted() {
    return this._deleted;
  }

  delete() {
    if (this.active) return false;
    this.deleted = true;
  }

  undelete() {
    this.deleted = false;
  }

  reset() {
    if (this.deleted) return;
    const [parsedMinutes, parsedSeconds] = utils.parseSeconds(this.totalSeconds);
    this.minuteClock = parsedMinutes;
    this.secondClock = parsedSeconds;
    this.active = false;
    this.completed = false;

    const evenMinute = this.secondClock % 60 === 0;
    this.counterEl.innerHTML = this.tickTemplate(
      evenMinute ? this.minuteClock + 1 : this.minuteClock,
      evenMinute ? 0 : this.secondClock,
    );
  }

  set active(isActive) {
    if (this.deleted || (this.active && isActive)) return;
    this._active = isActive;
    if (isActive) {
      this.tick();
      this.el.classList.remove('paused');
      if (this.minuteClock === 0 && this.secondClock < 5) {
        this.pending = true;
      }
    } else {
      clearTimeout(this.tickTimeout);
      this.el.classList.add('paused');
      this.pending = false;
    }
  }

  get active() {
    return this._active;
  }

  pause() {
    this.active = false;
  }

  unpause() {
    this.active = true;
  }

  setMinutes() {
    this.secondClock = 60;
    this.minuteClock -= 1;
    this.tick();
  }

  set pending(isPending) {
    if (this.pending && isPending) return false;
    this._pending = isPending;
    if (isPending) {
      this.counterEl.classList.add('pending');
    } else {
      this.counterEl.classList.remove('pending');
    }
  }

  speak() {
    if (typeof window.speechSynthesis !== 'undefined') {
      const msg = new SpeechSynthesisUtterance(`${this.name} is done!`);
      window.speechSynthesis.speak(msg);
    }
  }

  bing() {
    this.bingCount -= 1;
    this.bingSound.play();
    if (this.bingCount <= 0) {
      clearInterval(this.alarmInterval);
      this.pending = false;
      this.bingCount = 3;
      setTimeout(this.boundSpeak, 400);
    }
  }

  set completed(isComplete) {
    if (this.completed && isComplete) return;
    this._completed = isComplete;
    if (isComplete) {
      this.alarmInterval = setInterval(this.boundBing, 400);
      this.el.classList.add('complete');
    } else {
      this.el.classList.remove('complete');
    }
  }

  get completed() {
    return this._completed;
  }

  tick() {
    this.tickTimeout = setTimeout(this.boundRun, 1000);
  }

  run() {
    this.secondClock -= 1;
    this.counterEl.innerHTML = this.tickTemplate(
      this.minuteClock,
      this.secondClock,
    );
    if (this.minuteClock === 0 && this.secondClock <= 10) {
      this.pending = true;
    }

    if (this.secondClock > 0) {
      this.tick();
    } else if (this.minuteClock > 0) {
      this.setMinutes();
    } else {
      this.completed = true;
    }
  }
}

export default TimerItem;
