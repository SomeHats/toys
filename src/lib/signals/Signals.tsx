import EventEmitter, { Unsubscribe } from '../EventEmitter';
import { assert } from '../assert';
import {
  mapRange,
  getLocalStorageItem,
  debounce,
  setLocalStorageItem,
  clamp,
} from '../utils';

export abstract class Signal {
  private currentValue: number | null = null;

  constructor(public readonly manager: SignalManager) {}

  protected abstract update(): number;

  clear() {
    this.currentValue = null;
  }

  read(): number {
    if (this.currentValue === null) {
      this.currentValue = this.update();
    }
    return this.currentValue;
  }
}

export class ControlledSignal extends Signal {
  constructor(manager: SignalManager, private value: number) {
    super(manager);
  }

  protected update() {
    return this.value;
  }

  set(newValue: number) {
    this.value = newValue;
  }
}

function _clamp(
  value: number,
  range: [number, number] | null | undefined,
): number {
  if (range) {
    return clamp(range[0], range[1], value);
  }
  return value;
}
export class ControllableSignal extends ControlledSignal {
  public readonly range: [number, number] | null;
  constructor(
    manager: SignalManager,
    private readonly key: string,
    initialValue: number,
    range?: [number, number],
  ) {
    super(
      manager,
      _clamp(
        getLocalStorageItem(`signalSetting.${key}`, initialValue) as number,
        range,
      ),
    );

    this.range = range || null;
  }

  set(newValue: number) {
    newValue = _clamp(newValue, this.range);
    super.set(newValue);
    this.saveDebounced(newValue);
  }

  private saveDebounced = debounce(200, (newValue: number) =>
    setLocalStorageItem(`signalSetting.${this.key}`, newValue),
  );
}

export class ComputedSignal extends Signal {
  constructor(manager: SignalManager, private compute: () => number) {
    super(manager);
  }

  protected update() {
    return this.compute();
  }
}

export class SignalManager {
  public signalsByName = new Map<string, Signal>();
  private readonly signalChangeEvent = new EventEmitter<undefined>();
  private readonly updateEvent = new EventEmitter<undefined>();

  private readonly _driver: ControlledSignal;
  // private readonly reboundLooper = new rebound.SteppingSimulationLooper();
  // private readonly springSystem = new rebound.SpringSystem(this.reboundLooper);

  constructor() {
    this._driver = this.controlled('internal.driver', 0);
  }

  onSignalsChange(cb: () => void): Unsubscribe {
    return this.signalChangeEvent.listen(cb);
  }

  onUpdate(cb: () => void): Unsubscribe {
    return this.updateEvent.listen(cb);
  }

  update(dt: number) {
    this._driver.set(Math.min(dt, 0.03));
    for (const signal of this.signalsByName.values()) {
      signal.clear();
    }
    for (const signal of this.signalsByName.values()) {
      signal.read();
    }

    this.updateEvent.emit();
    // this.reboundLooper.step(dt);
  }

  get driver(): Signal {
    return this._driver;
  }

  private optionalName<T>(
    name: string | null | T,
    value: T | undefined,
  ): [string | null, T] {
    if (value === undefined) {
      return [null, name] as [string | null, T];
    } else {
      return [name, value] as [string | null, T];
    }
  }

  controlled(
    name: string | null | number,
    initialValue?: number,
  ): ControlledSignal {
    const [_name, _initialValue] = this.optionalName(name, initialValue);
    return this.addSignal(_name, new ControlledSignal(this, _initialValue));
  }

  computed(
    name: string | null | (() => number),
    compute?: () => number,
  ): ComputedSignal {
    const [_name, _compute] = this.optionalName(name, compute);
    return this.addSignal(_name, new ComputedSignal(this, _compute));
  }

  input(name: string, value: number, range?: [number, number]): Signal {
    return this.addSignal(
      name,
      new ControllableSignal(this, name, value, range),
    );
  }

  sin(
    name: string | null,
    {
      min = 0,
      max = 1,
      frequency = 1,
      driver = this.driver,
      offset = 0,
    }: {
      min?: Signal | number;
      max?: Signal | number;
      frequency?: Signal | number;
      driver?: Signal;
      offset?: Signal | number;
    } = {},
  ): Signal {
    const minSignal = this.toSignal(min);
    const maxSignal = this.toSignal(max);
    const frequencySignal = this.toSignal(frequency);
    const offsetSignal = this.toSignal(offset);

    let accumulator = 0;
    return this.computed(name, () => {
      const frequency = frequencySignal.read();
      accumulator += driver.read() * frequency;
      return mapRange(
        -1,
        1,
        minSignal.read(),
        maxSignal.read(),
        Math.cos((offsetSignal.read() + accumulator) * Math.PI * 2),
      );
    });
  }

  spring(
    name: string | null,
    opts: {
      target: Signal;
      tension?: Signal | number;
      friction?: Signal | number;
      driver?: Signal;
    },
  ) {
    const targetSignal = opts.target;
    const driverSignal = opts.driver ?? this._driver;
    const tensionSignal = this.toSignal(opts.tension ?? 230);
    const frictionSignal = this.toSignal(opts.friction ?? 22);

    let currentPosition = targetSignal.read();
    let currentVelocity = 0;

    return this.computed(name, () => {
      const targetPosition = targetSignal.read();
      const timeStep = driverSignal.read();
      const tension = tensionSignal.read();
      const friction = frictionSignal.read();

      let tempPosition = currentPosition;
      let tempVelocity = currentVelocity;

      const aVelocity = currentVelocity;
      const aAcceleration =
        tension * (targetPosition - tempPosition) - friction * currentVelocity;

      tempPosition = currentPosition + aVelocity * timeStep * 0.5;
      tempVelocity = currentVelocity + aAcceleration * timeStep * 0.5;
      const bVelocity = tempVelocity;
      const bAcceleration =
        tension * (targetPosition - tempPosition) - friction * tempVelocity;

      tempPosition = currentPosition + bVelocity * timeStep * 0.5;
      tempVelocity = currentVelocity + bAcceleration * timeStep * 0.5;
      const cVelocity = tempVelocity;
      const cAcceleration =
        tension * (targetPosition - tempPosition) - friction * tempVelocity;

      tempPosition = currentPosition + cVelocity * timeStep;
      tempVelocity = currentVelocity + cAcceleration * timeStep;
      const dVelocity = tempVelocity;
      const dAcceleration =
        tension * (targetPosition - tempPosition) - friction * tempVelocity;

      const dxdt =
        (1.0 / 6.0) * (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity);
      const dvdt =
        (1.0 / 6.0) *
        (aAcceleration + 2.0 * (bAcceleration + cAcceleration) + dAcceleration);

      currentPosition += dxdt * timeStep;
      currentVelocity += dvdt * timeStep;

      return currentPosition;
    });
  }

  add(name: string | null, a: Signal | number, b: Signal | number): Signal {
    const aSignal = this.toSignal(a);
    const bSignal = this.toSignal(b);
    return this.computed(name, () => aSignal.read() + bSignal.read());
  }

  subtract(
    name: string | null,
    a: Signal | number,
    b: Signal | number,
  ): Signal {
    const aSignal = this.toSignal(a);
    const bSignal = this.toSignal(b);
    return this.computed(name, () => aSignal.read() - bSignal.read());
  }

  multiply(
    name: string | null,
    a: Signal | number,
    b: Signal | number,
  ): Signal {
    const aSignal = this.toSignal(a);
    const bSignal = this.toSignal(b);
    return this.computed(name, () => aSignal.read() * bSignal.read());
  }

  divide(name: string | null, a: Signal | number, b: Signal | number): Signal {
    const aSignal = this.toSignal(a);
    const bSignal = this.toSignal(b);
    return this.computed(name, () => aSignal.read() / bSignal.read());
  }

  switch(
    name: string | null,
    control: Signal | number,
    a: Signal | number,
    b: Signal | number,
  ): Signal {
    const controlSignal = this.toSignal(control);
    const aSignal = this.toSignal(a);
    const bSignal = this.toSignal(b);
    return this.computed(name, () => {
      if (controlSignal.read()) {
        return aSignal.read();
      } else {
        return bSignal.read();
      }
    });
  }

  private addSignal<T extends Signal>(name: string | null, signal: T) {
    const nameString = typeof name === 'string' ? name : `_${Math.random()}`;

    assert(
      !this.signalsByName.has(nameString),
      `signal called ${name} already exists`,
    );
    this.signalsByName = new Map(this.signalsByName);
    this.signalsByName.set(nameString, signal);
    this.signalChangeEvent.emit();
    return signal;
  }

  private toSignal(source: Signal | number): Signal {
    if (typeof source === 'number') {
      return this.controlled(null, source);
    }
    return source;
  }

  private appendName(name: string | null, suffix: string): string | null {
    if (name === null) {
      return null;
    }
    return `${name}.${suffix}`;
  }
}
