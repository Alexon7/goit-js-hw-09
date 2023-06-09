import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startBtn = document.querySelector('[data-start]');
const inputEl = document.querySelector('#datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startBtn.addEventListener('click', onClickStartTimer);

let selectedTime = null;
let interval = null;
let leftTime = 0;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    startBtn.disabled = false;
    if (selectedDates[0] <= Date.now()) {
      startBtn.disabled = true;
      Notiflix.Notify.failure('Please choose a date in the future');
      return;
    }
    selectedTime = selectedDates[0];

    if (leftTime) {
      clearInterval(interval);
      leftTime = 0;
    }
  },
};

flatpickr(inputEl, options);

function onClickStartTimer() {
  startBtn.disabled = true;

  interval = setInterval(() => {
    leftTime = selectedTime - Date.now();
    if (leftTime <= 0) {
      clearInterval(interval);
      return;
    }

    daysEl.textContent = addLeadingZero(convertMs(leftTime).days);
    hoursEl.textContent = addLeadingZero(convertMs(leftTime).hours);
    minutesEl.textContent = addLeadingZero(convertMs(leftTime).minutes);
    secondsEl.textContent = addLeadingZero(convertMs(leftTime).seconds);
  }, 1000);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
