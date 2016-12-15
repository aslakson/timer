import cookie from 'js-cookie';

import constants from './constants';
import TimerItem from './timer-item';
import TimerFinder from './timer-finder';

class TimerList {
  constructor(containerId, directionsId, manager) {
    this.el = document.getElementById(containerId);
    this.timers = this.getStoredTimers();
    this.timers.forEach(this.drawTimer.bind(this));
    window.addEventListener('beforeunload', this.handleUnload.bind(this));
    this.suggestionFinder = new TimerFinder(directionsId, this);
    this.manager = manager;
  }

  handleUnload() {
    this.timers.forEach(t => t.pause());
    this.storeTimers();
  }

  addTimerFromForm(formObj) {
    const newTimer = this.createTimer(formObj);
    this.timers.push(newTimer);
    this.drawTimer(newTimer);
    this.storeTimers();
    this.manager.onTimerListChange();
  }

  createTimer({ name, totalSeconds, secondClock = null, active = true }) {
    return new TimerItem(
      name,
      totalSeconds,
      secondClock,
      active,
      this,
    );
  }

  storeTimers() {
    const timersJSON = this.timers.reduce((timers, t) => {
      if (!t.deleted) {
        timers.push(t.toJSON());
      }
      return timers;
    }, []);
    if (timersJSON.length) {
      cookie.set(constants.cookieName, timersJSON);
    } else {
      cookie.remove(constants.cookieName);
    }
  }

  drawTimer(timer) {
    this.el.appendChild(timer.el);
  }

  getStoredTimers() {
    const timers = cookie.getJSON(constants.cookieName) || [];
    return timers.map(this.createTimer);
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const {
      name: { value: name },
      seconds: { value: secondsVal },
      minutes: { value: minutesVal },
    } = form;
    const totalSeconds = ((+minutesVal * 60) + +secondsVal);
    const newTimer = this.createTimer({
      name,
      active: true,
      totalSeconds
    });
    this.timers.push(newTimer);
    this.drawTimer(newTimer);
    this.storeTimers();
  }

  handleSuggestion(...args) {
    this.manager.acceptSuggestion(...args);
  }
}

export default TimerList;
