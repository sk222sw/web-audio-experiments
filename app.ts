import {startInterval, stopInterval} from './audio-scheduler'

const range = document.querySelector("#range");
const tempoText = document.querySelector("#tempo");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");


range.addEventListener("change", v => {
  tempoText.innerHTML = (v.target as any).value;
  // tempo = +(v.target as any).value;
});


let interval = null;

startButton.addEventListener("click", startInterval);
stopButton.addEventListener("click", stopInterval);

