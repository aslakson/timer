import Timers from './timers';

const ready = (fn) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

ready(() => {
  const timers = new Timers('directions');
  const timerLink = document.getElementById('timers-trigger');
  timerLink.addEventListener('click', (e) => {
    e.preventDefault();
    timers.show();
  });
});
