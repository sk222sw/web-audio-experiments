import { first, last } from "./util";

export class AudioScheduler {
  scheduleAheadTime = 0.1;
  tempo: number;
  msTempo: number;
  context: AudioContext;
  startTime = 0;
  noteTimes: number[] = [];
  initialNoteTimes: number[] = [];

  constructor(tempo, initialNoteTimes, context?) {
    this.initialNoteTimes = initialNoteTimes;
    this.tempo = tempo;
    this.context = context || new AudioContext();
  }
  
  init() {
    this.startTime = this.context.currentTime;
    this.msTempo = 60000 / this.tempo;
    this.noteTimes = this.setTimeForNote(this.initialNoteTimes)
  }

  get tempoInMs() {
    return this.msTempo / 1000;
  }

  setTempo(newTempo) {
    this.tempo = newTempo;
    this.msTempo = 60000 / this.tempo;
  }
  
  scheduler(currentTime, cb) {
    const next = this.calculateNextTime(first(this.noteTimes));
    const shouldBeScheduled = currentTime + this.scheduleAheadTime;
    if (next < shouldBeScheduled) {
      this.runCallback(next, cb);
    }
  }

  calculateNextTime(noteTime) {
    return this.startTime + noteTime * this.tempoInMs;
  }

  runCallback(time, cb) {
    this.noteTimes = this.noteTimes.slice(1, this.noteTimes.length);
    cb(time);
  }

  startInterval(cb) {
    this.init();
      
    this.runCallback(this.context.currentTime + first(this.noteTimes), cb)
    
    const interval = setInterval(
      _ => this.scheduler(this.context.currentTime, cb),
      50
    );
    
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