import { useMergedRefs } from "@/lib/hooks/useMergedRefs";
import { tailwindEasings } from "@/lib/theme";
import { useVfxAnimation, Vfx, VfxActionName } from "@/splatapus/editor/Vfx";
import { useSquircleClipPath } from "@/splatapus/ui/useSquircle";
import classNames from "classnames";
import {
    ComponentPropsWithoutRef,
    forwardRef,
    ReactNode,
    useState,
} from "react";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(
        { children, className, iconLeft, iconRight, ...props },
        ref,
    ) {
        return (
            <PlainButton
                className={classNames(
                    className,
                    "justify-center gap-2 px-4 py-1",
                )}
                ref={ref}
                {...props}
            >
                {iconLeft}
                <BouncyLabel>{children}</BouncyLabel>
                {iconRight}
            </PlainButton>
        );
    },
);

export function BouncyLabel({ children }: { children: ReactNode }) {
    return (
        <span className="inline-block transition-transform duration-200 ease-out-back-md group-hover:scale-110 group-active:scale-95">
            {children}
        </span>
    );
}

export const PlainButton = forwardRef<
    HTMLButtonElement,
    ComponentPropsWithoutRef<"button"> & { href?: string }
>(function PlainButton({ className, style, ...props }, ref) {
    const [element, setElement] = useState<null | HTMLButtonElement>(null);
    const clipPath = useSquircleClipPath(element);

    const finalRef = useMergedRefs(setElement, ref);
    const finalClassName = classNames(
        "group inline-flex items-center rounded text-center font-bold tracking-wide text-stone-400 hover:bg-stone-300/25 hover:text-stone-500 focus:outline-none focus-visible:text-stone-600",
        className,
    );
    const finalStyle = { ...style, clipPath };

    if (props.href) {
        return (
            <a
                // @ts-expect-error im just hacking in link support tbh
                ref={finalRef}
                className={finalClassName}
                style={finalStyle}
                {...props}
            />
        );
    }
    return (
        <button
            ref={finalRef}
            className={finalClassName}
            style={finalStyle}
            {...props}
        />
    );
});

export function ActionButton({
    children,
    actionName,
    vfx,
    ...props
}: { actionName: VfxActionName; vfx: Vfx } & ButtonProps) {
    const ref = useVfxAnimation(vfx, actionName, () => ({
        keyFrames: { transform: ["scale(1)", "scale(0.8)", "scale(1)"] },
        duration: 300,
        easing: tailwindEasings.outBackMd,
    }));
    return (
        <Button {...props}>
            <span className="inline-block" ref={ref}>
                {children}
            </span>
        </Button>
    );
}
