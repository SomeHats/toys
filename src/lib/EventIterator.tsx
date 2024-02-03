import EventEmitter from "@/lib/EventEmitter";

type Event<T> = { type: "event"; value: T } | { type: "end" };
export class EventIterator<T> implements AsyncIterable<T> {
    private events = new EventEmitter<[Event<T>]>();
    private isDone = false;

    push(event: T) {
        this.events.emit({ type: "event", value: event });
    }

    end() {
        this.events.emit({ type: "end" });
        this.isDone = true;
    }

    async *[Symbol.asyncIterator]() {
        if (this.isDone) return;
        for await (const event of this.events) {
            if (event.type === "end") {
                return;
            }
            if (this.isDone) return;
            yield event.value;
        }
    }
}
