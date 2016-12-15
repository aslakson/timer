class TimerForm {
  constructor(timerList) {
    this.timerList = timerList;
    this.el = document.createElement('form');
    this.el.classList.add('timer-form');
    this.el.innerHTML = this.template();
    this.el.addEventListener('submit', this.handleFormSubmit.bind(this));
    this.closeLink = this.el.querySelector('.timer-close-link');
    this.closeLink.addEventListener('click', this.handleCloseClick.bind(this));
    document.body.appendChild(this.el);
  }

  template(error, minutes = 5, seconds = 0) {
    return `
      <a href="#close" class="timer-close-link">✕</a>
      ${error ? `<p class="error">${error}</p>` : ''}
      <div class="fieldset">
        <div class="control">
          <input name="name"type="text" autocomplete="off" required />
          <label>Timer Name</label>
        </div>
      </div>
      <div class="fieldset time-fields">
        <div class="control">
          <input name="minutes" type="number" min="0" max="59" size="3" value="${minutes}" />
          <label>Minutes</label>
        </div>
        <div class="control">
          <input name="seconds" type="number" min="0" max="59" value="${seconds}" required />
          <label>Seconds</label>
        </div>
      </div>
      <input type="submit" value="Start Timer" />
    `;
  }

  show() {
    this.el.classList.add('active');
  }

  hide() {
    this.el.classList.remove('active');
  }

  acceptSuggestion(minutes, seconds) {
    this.setFormValues(minutes, seconds);
    this.show();
  }

  setFormValues(minutes = 5, seconds = 0, name = '') {
    this.el.minutes.value = minutes;
    this.el.seconds.value = seconds;
    this.el.name.value = name;
  }

  handleCloseClick(e) {
    e.preventDefault();
    this.setFormValues();
    this.hide();
  }

  getValues() {
    const {
      name: { value: name },
      seconds: { value: seconds },
      minutes: { value: minutes },
    } = this.el;
    return { name, minutes, seconds };
  }

  validate() {
    const { name, seconds, minutes } = this.getValues();
    if (+seconds + +minutes === 0) {
      throw new Error('Please enter a value for minutes or seconds');
    }
    if (this.timerList.timers.find(t => t.name.toUpperCase() === name.toUpperCase())) {
      throw new Error(`Timer named ${name} already exists`);
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    try {
      this.validate();
      const { name, seconds, minutes } = this.getValues();
      const totalSeconds = ((+minutes * 60) + +seconds);
      this.timerList.addTimerFromForm({
        name,
        active: true,
        totalSeconds,
      });
      this.setFormValues();
      this.hide();
    } catch (err) {
      this.el.innerHTML = this.template(err.message);
      console.error(err);
    }
  }
}

export default TimerForm;
