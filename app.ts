import {AudioScheduler} from './audio-scheduler'

const range = document.querySelector("#range");
const tempoText = document.querySelector("#tempo");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");

var scheduler = new AudioScheduler(100);

range.addEventListener("change", v => {
  tempoText.innerHTML = (v.target as any).value;
  scheduler.setTempo((v.target as any).value);
});



let interval = null;

startButton.addEventListener("click", e => {interval = scheduler.startInterval()});
stopButton.addEventListener("click", e => scheduler.stopInterval(interval));

