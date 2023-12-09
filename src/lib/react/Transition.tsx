import { useEvent } from "@/lib/hooks/useEvent";
import { exhaustiveSwitchError, noop } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import classNames from "classnames";
import { TransitionEvent, memo, useLayoutEffect, useState } from "react";

type TransitionState =
    | "hidden"
    | "will-enter"
    | "entering"
    | "showing"
    | "will-leave"
    | "leaving";

export const Transition = memo(function Transition({
    show,
    asChild,
    className,
    appear = false,
    enter,
    enterFrom,
    enterTo,
    leave,
    leaveFrom,
    leaveTo,
    onBeforeEnter,
    onAfterEnter,
    onBeforeLeave,
    onAfterLeave,
    ...props
}: {
    show: boolean;
    asChild?: boolean;
    className?: string;
    appear?: boolean;
    enter?: string;
    enterFrom?: string;
    enterTo?: string;
    leave?: string;
    leaveFrom?: string;
    leaveTo?: string;
    onBeforeEnter?: () => void;
    onAfterEnter?: () => void;
    onBeforeLeave?: () => void;
    onAfterLeave?: () => void;
    children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">) {
    const Component = asChild ? Slot : "div";

    const [state, setState] = useState<TransitionState>(
        show ?
            appear ? "will-enter"
            :   "showing"
        :   "hidden",
    );

    const onBeforeLeaveEvent = useEvent(onBeforeLeave ?? noop);
    const onAfterLeaveEvent = useEvent(onAfterLeave ?? noop);
    const onBeforeEnterEvent = useEvent(onBeforeEnter ?? noop);
    const onAfterEnterEvent = useEvent(onAfterEnter ?? noop);

    useLayoutEffect(() => {
        if (show) {
            switch (state) {
                case "entering":
                case "showing":
                    return;
                case "hidden":
                case "leaving":
                case "will-leave":
                    setState("will-enter");
                    return;
                case "will-enter": {
                    const frame = requestAnimationFrame(() => {
                        onBeforeEnterEvent();
                        setState("entering");
                    });
                    return () => cancelAnimationFrame(frame);
                }
                default:
                    exhaustiveSwitchError(state);
            }
        } else {
            switch (state) {
                case "hidden":
                case "leaving":
                    return;
                case "entering":
                case "showing":
                case "will-enter":
                    setState("will-leave");
                    return;
                case "will-leave": {
                    const frame = requestAnimationFrame(() => {
                        onBeforeLeaveEvent();
                        setState("leaving");
                    });
                    return () => cancelAnimationFrame(frame);
                }
                default:
                    exhaustiveSwitchError(state);
            }
        }
    }, [onBeforeEnterEvent, onBeforeLeaveEvent, show, state]);

    const onTransitionEnd = useEvent((event: TransitionEvent) => {
        if (event.target !== event.currentTarget) return;

        switch (state) {
            case "entering":
                onAfterEnterEvent();
                setState("showing");
                break;
            case "leaving":
                onAfterLeaveEvent();
                setState("hidden");
                break;
        }
    });

    if (state === "hidden") return null;

    return (
        <Component
            className={classNames(
                className,
                (state === "will-enter" || state === "entering") && enter,
                state === "will-enter" && enterFrom,
                state === "entering" && enterTo,
                (state === "will-leave" || state === "leaving") && leave,
                state === "will-leave" && leaveFrom,
                state === "leaving" && leaveTo,
            )}
            onTransitionEnd={onTransitionEnd}
            {...props}
        />
    );
});
