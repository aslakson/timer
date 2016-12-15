import sounds from './sounds';
import utils from './utils';

class TimerItem {
  constructor(name, totalSeconds, secondClock = null, active, timerList) {
    this.name = name;
    this.totalSeconds = totalSeconds;
    this.timerList = timerList;

    const [parsedMinutes, parsedSeconds] = utils.parseSeconds(secondClock || totalSeconds);
    this.minuteClock = parsedMinutes;
    this.secondClock = secondClock || parsedSeconds;

    this.active = active;
    this.bingCount = 3;
    this.tickTimeout = null;
    this.alarmInterval = null;
    this.bingSound = new Audio(sounds.beep);

    this.el = this.createElement();
    this.counterEl = this.el.querySelector('.time-remaining');
    this.buttons = this.el.getElementsByTagName('button');
    this.el.addEventListener('click', this.handleClick.bind(this));

    if (this.active) {
      this.unpause();
    } else {
      this.pause();
    }
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
    return {
      active: this.active,
      secondClock: this.secondClock,
      name: this.name,
      totalSeconds: this.totalSeconds,
    };
  }

  tickTemplate(min, sec) {
    return `${min}:${(sec < 10 ? '0' : '')}${sec}`;
  }

  timerTemplate(name, time) {
    return `
      <div class="times">
        <span class="timer-name">${name}:</span>
        <span class="time-remaining">${time}</span>
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

  delete() {
    if (this.active) return;
    this.deleted = true;
    this.el.classList.add('deleted');
  }

  undelete() {
    delete this.deleted;
    this.el.classList.remove('deleted');
  }

  reset() {
    if (this.deleted) return;
    const [parsedMinutes, parsedSeconds] = utils.parseSeconds(this.totalSeconds);
    this.minuteClock = parsedMinutes;
    this.secondClock = parsedSeconds;
    this.pause();

    const evenMinute = this.secondClock % 60 === 0;
    this.counterEl.innerHTML = this.tickTemplate(
      evenMinute ? this.minuteClock + 1 : this.minuteClock,
      evenMinute ? 0 : this.secondClock,
    );
  }

  pause() {
    if (this.deleted) return;
    this.active = false;
    clearTimeout(this.tickTimeout);
    this.el.classList.add('paused');
    if (this.counterEl.classList.contains('pending')) {
      this.makeunPending();
    }
  }

  unpause() {
    if (this.deleted) return;
    this.active = true;
    this.tick();
    this.el.classList.remove('paused');
    if (this.secondClock < 10) {
      this.makePending();
    }
  }

  setMinutes() {
    this.secondClock = this.minuteClock * 60;
    this.minuteClock -= 1;
    this.tick();
  }

  tick() {
    this.tickTimeout = setTimeout(this.run.bind(this), 1000);
  }

  makePending() {
    this.counterEl.classList.add('pending');
  }

  makeunPending() {
    this.counterEl.classList.remove('pending');
  }

  bing() {
    this.bingCount -= 1;
    this.bingSound.play();
    if (this.bingCount <= 0) {
      clearInterval(this.alarmInterval);
      this.counterEl.classList.remove('pending');
      this.bingCount = 3;
      if (typeof window.speechSynthesis !== 'undefined') {
        var msg = new SpeechSynthesisUtterance(`${this.name} is done!`);
        window.speechSynthesis.speak(msg);
      }
    }
  }

  finish() {
    this.alarmInterval = setInterval(this.bing.bind(this), 1000);
    this.el.classList.add('complete');
  }

  run() {
    this.secondClock -= 1;
    this.counterEl.innerHTML = this.tickTemplate(
      this.minuteClock,
      this.secondClock,
    );
    if (this.minuteClock === 0 && this.secondClock <= 10) {
      this.makePending();
    }

    if (this.secondClock > 0) {
      this.tick();
    } else if (this.minuteClock > 0) {
      this.setMinutes();
    } else {
      this.finish();
    }
  }
}

export default TimerItem;
