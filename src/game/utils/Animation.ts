type UpdateFunction = ({
  progress,
  finished,
  data,
}: {
  progress: number;
  finished: boolean;
  data?: any; // eslint-disable-line
}) => void;

class Animation {
  duration: number;
  durationElapsed: number;
  update?: UpdateFunction;
  data?: any; // eslint-disable-line

  constructor({
    duration,
    update,
    data,
  }: {
    duration: number;
    update?: UpdateFunction;
    data?: any; // eslint-disable-line
  }) {
    this.duration = duration;
    this.durationElapsed = 0;
    this.update = update;
    this.data = data;
  }
  animate(delta: number, update?: UpdateFunction) {
    const progress = Math.min(
      this.durationElapsed / this.duration,
      1,
    );
    const finished = progress >= 1;
    const updateFunction = update || this.update;
    if (updateFunction) {
      updateFunction({ progress, finished, data: this.data });
    }
    this.durationElapsed += delta;
  }
}

export default Animation;
