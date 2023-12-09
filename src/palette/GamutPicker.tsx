import { Gamut } from "@/palette/schema";
import { useSupport } from "@/palette/support";
import { RadioGroup } from "@headlessui/react";
import { FaExclamationTriangle } from "react-icons/fa";

export function GamutPicker({
    value,
    onChange,
}: {
    value: Gamut;
    onChange: (gamut: Gamut) => void;
}) {
    const support = useSupport();
    return (
        <RadioGroup
            value={value}
            onChange={onChange}
            className="flex items-center justify-center gap-1 rounded border border-neutral-700 p-0.5 text-sm text-neutral-400"
        >
            <GamutPickerOption value="srgb" label="sRGB" supported={true} />
            <GamutPickerOption
                value="p3"
                label="P3"
                supported={support.p3Gamut}
            />
            <GamutPickerOption
                value="rec2020"
                label="Rec2020"
                supported={support.rec2020Gamut}
            />
        </RadioGroup>
    );
}

function GamutPickerOption({
    value,
    label,
    supported,
}: {
    value: Gamut;
    label: string;
    supported: boolean;
}) {
    return (
        <RadioGroup.Option
            value={value}
            className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-0.5 hover:text-neutral-300 ui-checked:bg-neutral-700 ui-checked:text-neutral-300"
            title={
                supported ? undefined : (
                    "Your browser does not support this color gamut"
                )
            }
        >
            {!supported && <FaExclamationTriangle className="text-red-600" />}
            {label}
        </RadioGroup.Option>
    );
}
