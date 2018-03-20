import { lastWithDefault, first, last } from "./util";


export class AudioScheduler {
scheduleAheadTime = 0.1;
tempo = 100;
quarter;

msTempo;
context: AudioContext;
startTime = 0;
  noteTimes: number[]
  
  constructor() {
    this.tempo = 60000 / this.tempo;
    this.quarter = this.tempo / this.tempo;
    this.context = new AudioContext();
    this.noteTimes = this.setTimeForNote([]);
  }

  scheduler(currentTime) {
    const next = this.calculateNextTime(first(this.noteTimes))
    const shouldBeScheduled = currentTime + this.scheduleAheadTime
    if (next < shouldBeScheduled) {
      this.playNote(next);
    }
  }
  
  calculateNextTime(noteTime) {
    return this.startTime + (noteTime * this.msTempo / 1000)
  }
  
  playNote(time) {
    this.noteTimes = this.noteTimes.slice(1, this.noteTimes.length);
      
    const osc = this.context.createOscillator();
    osc.connect(this.context.destination);
  
    const stopTime = time + 0.1;
    osc.start(time);
    osc.stop(stopTime);
  }
  
  startInterval() {
    const firstNote = first(this.noteTimes);
    this.startTime = this.context.currentTime
    this.playNote(this.context.currentTime + first(this.noteTimes));
    const interval = setInterval(_ => this.scheduler(this.context.currentTime), 50);
    return interval;
  }

  stopInterval(interval) {
    clearInterval(interval);
  }

  setTimeForNote(notes) {
    return notes.reduce((acc, curr) => {
      return [...acc, curr + last(acc) || 0];
    }, []);
  }

}


