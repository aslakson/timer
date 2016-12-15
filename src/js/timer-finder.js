class TimerFinder {
  constructor(directionsId, timerList) {
    this.el = document.getElementById(directionsId);
    this.timerList = timerList;
    this.boundClickHandler = this.handleSuggestionClick.bind(this);
    this.enableSuggestions();
  }

  enableSuggestions() {
    let text = this.el.innerHTML;
    const matches = text.match(/[\d]+[\s]+(minutes|seconds)/g);

    if (matches.length) {
      text = matches.reduce((rawText, m) => {
        rawText = rawText.replace(m, `<a href="#" class="suggestion">${m}</a>`);
        return rawText;
      }, text);
    }
    this.findSuggestions().map(this.unbindClickEvent.bind(this));
    this.el.innerHTML = text;
    this.findSuggestions().map(this.bindClickEvent.bind(this));
  }

  findSuggestions() {
    return [...this.el.getElementsByClassName('suggestion')];
  }

  bindClickEvent(el) {
    el.addEventListener('click', this.boundClickHandler);
  }

  unbindClickEvent(el) {
    el.removeEventListener('click', this.boundClickHandler);
  }

  handleSuggestionClick(e) {
    e.preventDefault();
    const suggestion = e.currentTarget;
    const suggestionText = suggestion.innerText;
    let minutes = 0;
    let seconds = 0;
    if (suggestionText.includes('minute')) {
      minutes = parseInt(suggestionText.replace(/([\d]+)[\s]+minute(s)?/, '$1'), 10);
    }
    if (suggestionText.includes('seconds')) {
      seconds = parseInt(suggestionText.replace(/([\d]+)[\s]+second(s)?/, '$1'), 10);
    }
    this.timerList.handleSuggestion(minutes, seconds);
  }
}

export default TimerFinder;
