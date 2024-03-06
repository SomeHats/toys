import { Emoji, characters, colors, emotions } from "@/emoji/Emoji";
import { keys } from "@/lib/utils";
import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, useState } from "react";

export function EmojiListing() {
    const [emoji, setEmoji] = useState<Emoji>({
        character: "blob",
        emotion: 0,
        color: { name: "auto", level: 40 },
    });

    return (
        <>
            <div className="flex p-1 gap-1">
                <RadioGroup
                    value={emoji.character}
                    onChange={(character) => setEmoji({ ...emoji, character })}
                    className="flex bg-stone-200 rounded p-1 gap-1"
                >
                    {characters.map((character, index) => (
                        <RadioGroup.Option
                            key={index}
                            value={character}
                            className="rounded-sm px-2 ui-checked:bg-stone-50 hover:bg-stone-100 cursor-pointer"
                        >
                            {character}
                        </RadioGroup.Option>
                    ))}
                </RadioGroup>
                <RadioGroup
                    value={emoji.color.name}
                    onChange={(color) =>
                        setEmoji({
                            ...emoji,
                            color: { ...emoji.color, name: color },
                        })
                    }
                    className="flex bg-stone-200 rounded p-1 gap-1"
                >
                    {[...keys(colors)].map((color, index) => (
                        <RadioGroup.Option
                            key={index}
                            value={color}
                            className="rounded-sm px-2 ui-checked:bg-stone-50 hover:bg-stone-100 cursor-pointer"
                        >
                            {color}
                        </RadioGroup.Option>
                    ))}
                </RadioGroup>
                <RadioGroup
                    value={emoji.emotion}
                    onChange={(emotion) =>
                        setEmoji({
                            ...emoji,
                            emotion,
                        })
                    }
                    className="flex bg-stone-200 rounded p-1 gap-1"
                >
                    {emotions.map((emotion, index) => (
                        <RadioGroup.Option
                            key={index}
                            value={emotion}
                            className="rounded-sm px-2 ui-checked:bg-stone-50 hover:bg-stone-100 cursor-pointer"
                        >
                            {emotion}
                        </RadioGroup.Option>
                    ))}
                </RadioGroup>
            </div>
            <CrossFade
                value={emoji}
                render={(emoji) => <Emoji sizePx={256} emoji={emoji} />}
            />
            <div className="flex">
                {[...keys(colors)].map((color, index) => (
                    <div key={index} className="flex flex-col">
                        {characters.map((character, index) => (
                            <Fragment key={index}>
                                {emotions.map((emotion, index) => (
                                    <div key={index}>
                                        <Emoji
                                            sizePx={128}
                                            emoji={{
                                                color: {
                                                    name: color,
                                                    level: 40,
                                                },
                                                character,
                                                emotion,
                                            }}
                                        />
                                    </div>
                                ))}
                            </Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

function CrossFade<T>({
    value,
    render,
    className = "relative",
    itemClassName = "bg-stone-100",
}: {
    value: T;
    render: (value: T) => JSX.Element;
    className?: string;
    itemClassName?: string;
}) {
    const [state, setState] = useState({
        items: [{ value, index: 0 }],
        index: 0,
    });

    if (state.items[state.items.length - 1].value !== value) {
        setState({
            items: [...state.items, { value, index: state.index + 1 }],
            index: state.index + 1,
        });
    }

    return (
        <div className={className}>
            {state.items.map((item, i) => {
                const isLast = i === state.items.length - 1;
                return (
                    <div
                        key={item.index}
                        className={classNames(
                            "animate-[fade_0.2s_both]",
                            itemClassName,
                            isLast ? "relative z-10" : (
                                "absolute top-0 left-0 z-0"
                            ),
                        )}
                        onAnimationEnd={() => {
                            setState((prev) => ({
                                ...prev,
                                items: prev.items.filter(
                                    (i) => i.index >= item.index,
                                ),
                            }));
                        }}
                    >
                        {render(item.value)}
                    </div>
                );
            })}
        </div>
    );
}
