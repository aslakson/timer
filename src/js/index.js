import { utils } from './timer';

const ready = (fn) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

ready(() => {
  const counterEl = document.getElementById('timers');
  const formEl = document.getElementById('timer-form');
  formEl.addEventListener('submit', e => utils.handleFormSubmit(e, counterEl));
  utils.createTimersFromStore(counterEl);
});
