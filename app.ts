import {AudioScheduler} from './audio-scheduler'

const range = document.querySelector("#range");
const tempoText = document.querySelector("#tempo");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");


range.addEventListener("change", v => {
  tempoText.innerHTML = (v.target as any).value;
  // tempo = +(v.target as any).value;
});

var scheduler = new AudioScheduler(100);


let interval = null;

startButton.addEventListener("click", e => {interval = scheduler.startInterval()});
stopButton.addEventListener("click", e => scheduler.stopInterval(interval));

