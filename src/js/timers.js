import TimerList from './timer-list';
import TimerForm from './timer-form';

class Timers {
  constructor(directionsId) {
    this.el = document.createElement('section');
    this.el.classList.add('timers-container');
    this.el.innerHTML = this.template();
    this.headingEl = this.el.querySelector('.timer-heading');
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.addEl = this.el.querySelector('.add');
    this.closeLink = this.el.querySelector('.timer-close-link');
    this.closeLink.addEventListener('click', this.handleCloseClick.bind(this));
    this.boundAddClick = this.handleAddClick.bind(this);
    this.addEl.addEventListener('click', this.boundAddClick);
    this.initializeDrag();
    document.body.appendChild(this.el);

    const { top, left, width } = this.el.getBoundingClientRect();
    this.position = { x: left, y: top, width };

    this.timerList = new TimerList('timers', directionsId, this);
    if (this.timerList.timers.length) {
      this.show();
    }
    this.timerForm = new TimerForm(this.timerList);
  }

  handleCloseClick(e) {
    e.preventDefault();
    this.hide();
  }

  show() {
    this.el.classList.add('active');
  }

  hide() {
    this.el.classList.remove('active');
  }

  template() {
    return `
      <header>
        <h3 class="timer-heading">My Timers</h3>
        <a class="add timer-link" href="add" title="Add timer">
          <svg width="23" height="23" version="1">
            <g fill="none" stroke="#FF0000">
              <path stroke-width="1" d="M20.694 11.64c0 5.068-4.112 9.18-9.18 9.18-5.066 0-9.178-4.112-9.178-9.18 0-5.065 4.112-9.177 9.18-9.177 5.066 0 9.178 4.112 9.178 9.178z"/>
              <path d="M11.604 11.91L7.63 7.89"/>
              <path stroke-width="1" d="M17.218 6.105l-5.93 6.067"/>
            </g>
          </svg>
          New
        </a>
        <a href="#close" class="timer-close-link">✕</a>
      </header>
      <ul class="timers" id="timers"></ul>
    `;
  }

  initializeDrag() {
    this.headingEl.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  acceptSuggestion(...args) {
    this.timerForm.acceptSuggestion(...args);
  }

  handleAddClick(e) {
    e.preventDefault();
    this.timerForm.show();
  }

  onTimerListChange() {
    if (this.timerList.timers.some(t => !t.deleted)) {
      this.show();
    } else {
      this.hide();
    }
  }

  handleMouseDown() {
    this.headingEl.classList.add('active');
    document.addEventListener('mousemove', this.boundMouseMove);
  }

  handleMouseUp() {
    this.headingEl.classList.remove('active');
    document.removeEventListener('mousemove', this.boundMouseMove);
  }

  onMouseMove(e) {
    const x = e.clientX - this.position.x - (this.position.width / 2);
    const y = e.clientY - this.position.y - 25;

    const style = `translate3d(${x}px, ${y}px, 0px)`;
    this.el.style.transform = style;
  }
}

export default Timers;
