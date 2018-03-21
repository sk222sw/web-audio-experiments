import { first, last } from "./util";

interface SchedulerOptions {
  tempo: number;
  intervalLengths: number[];
  context?: AudioContext;
  infinite?: boolean;
}

enum ScheduleMode {
  Infinite,
  Finite
}

export class AudioScheduler {
  private scheduleAheadTime = 0.1;
  private tempo: number;
  private msTempo: number;
  private context: AudioContext;
  private startTime = 0;
  private noteTimes: number[] = [];
  private initialNoteTimes: number[] = [];
  private interval: number;
  private mode: ScheduleMode;

  constructor(options: SchedulerOptions) {
    this.mode = options.infinite
      ? ScheduleMode.Infinite
      : ScheduleMode.Finite;

    console.log(this.mode)
    this.initialNoteTimes = options.intervalLengths;

    this.tempo = options.tempo;
    this.context = options.context || new AudioContext();
  }

  _init() {
    this.startTime = this.context.currentTime;
    this.msTempo = 60000 / this.tempo;
    this.noteTimes = this._setTimeForNote(this.initialNoteTimes);
  }

  _noteLengthInMs() {
    const res = this.msTempo / 1000;
    return res;
  }

  setTempo(newTempo) {
    this.tempo = newTempo;
    this.msTempo = 60000 / this.tempo;
  }

  _scheduler(currentTime, cb) {
    if (!first(this.noteTimes)) {
      if (this.mode === ScheduleMode.Infinite) {
        this._init;
      }
      else {
        this.stopInterval(this.interval)
        return;
      }
    }

    const next = this._calculateNextTime(first(this.noteTimes));

    const shouldBeScheduled = currentTime + this.scheduleAheadTime;

    if (next < shouldBeScheduled) {
      this._runCallback(next, cb);
    }
  }

  _calculateNextTime(noteTime) {
    return this.startTime + noteTime * this._noteLengthInMs();
  }

  _runCallback(time, cb) {
    this.noteTimes = this.noteTimes.slice(1, this.noteTimes.length);
    cb(time);
  }

  startInterval(cb: Function) {
    this._init();

    this._runCallback(this.context.currentTime + first(this.noteTimes), cb);

    const interval = setInterval(
      _ => this._scheduler(this.context.currentTime, cb),
      50
    );

    this.interval = interval;
    return interval;
  }

  stopInterval(interval) {
    clearInterval(interval);
  }

  _setTimeForNote(notes) {
    return notes.reduce((acc, curr) => {
      return [...acc, curr + last(acc) || 0];
    }, []);
  }
}
