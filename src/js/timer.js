import cookie from 'js-cookie';
import sounds from './sounds';

const tickTemplate = (min, sec) => `${min}:${(sec < 10 ? '0' : '')}${sec}`;
const timerTemplate = (name, time) => `<span class="timer-name">${name}:</span> <span class="time-remaining">${time}</span>`;

function parseSeconds(totalSeconds) {
  const secondMod = totalSeconds % 60;
  const seconds = secondMod || 60;
  const minutes = totalSeconds > 60 ? Math.ceil(totalSeconds / 60) - 1 : 0;
  return [minutes, seconds];
}

// based on https://gist.github.com/adhithyan15/4350689
function countdown(domEl, totalSeconds, active) {
  const counterEl = domEl;
  const [currentMinutes, currentSeconds] = parseSeconds(totalSeconds);
  let secondClock = currentSeconds;

  function tick() {
    secondClock -= 1;
    counterEl.innerHTML = tickTemplate(currentMinutes, secondClock);
    if (currentMinutes === 0 && secondClock <= 10) {
      counterEl.classList.add('pending');
    }

    if (secondClock > 0) {
      setTimeout(tick, 1000);
    } else if (currentMinutes > 0) {
      countdown(counterEl, currentMinutes * 60);
    } else {
      let beepCount = 3;
      const beep = new Audio(sounds.beep);
      const alarm = setInterval(() => {
        beepCount -= 1;
        // beep.play();
        if (beepCount === 0) {
          clearInterval(alarm);
          counterEl.classList.remove('pending');
        }
      }, 1000);
    }
  }
  if (active) {
    setTimeout(tick, 1000);
  }
}

function createTimer(parentEl, name, totalSeconds, active) {
  const [currentMinutes, currentSeconds] = parseSeconds(totalSeconds);
  const evenMinute = currentSeconds === 0;
  const timeHtml = tickTemplate(
    evenMinute ? currentMinutes + 1 : currentMinutes,
    evenMinute ? 0 : currentSeconds,
  );
  const timerEl = document.createElement('li');
  timerEl.innerHTML = timerTemplate(name, timeHtml);
  parentEl.appendChild(timerEl);
  countdown(timerEl.querySelector('.time-remaining'), totalSeconds, active);
}

const constants = {
  cookieName: 'timers',
};

const utils = {
  addStoredTimer: function addTimer(name, seconds) {
    const timers = utils.getStoredTimers();
    timers.push({
      active: true,
      createdAt: Date.now(),
      name,
      seconds,
    });
    cookie.set(constants.cookieName, timers);
  },
  createTimersFromStore(counterEl) {
    utils.getStoredTimers().forEach((timerObj) => {
      const { active, createdAt, name, seconds } = timerObj;
      let timerSeconds = seconds;
      const diff = Date.now() - createdAt;
      if (diff > 0 && diff < seconds) {
        timerSeconds = diff;
      }
      createTimer(counterEl, name, timerSeconds, active);
    });
  },
  getStoredTimers: function getStoredTimers() {
    return cookie.getJSON(constants.cookieName) || [];
  },
  handleFormSubmit: function handleFormSubmit(e, counterEl) {
    e.preventDefault();
    const form = e.target;
    const {
      name: { value: timerName },
      seconds: { value: secondsVal },
      minutes: { value: minutesVal },
    } = form;
    const totalSeconds = ((+minutesVal * 60) + +secondsVal);
    utils.addStoredTimer(timerName, totalSeconds);
    createTimer(counterEl, timerName, totalSeconds);
  },
};

export default createTimer;

export { constants, utils };
