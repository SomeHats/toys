import { ReactNode } from "react";

export function Post({
    name = "Charlie Yeti",
    funZone,
}: {
    name?: string;
    funZone?: ReactNode;
}) {
    return (
        <div className="bg-white rounded-md shadow-sm text-sm">
            <div className="flex items-center gap-3 px-5 py-2 pt-5">
                <div className="flex-none aspect-square rounded-full bg-gray-300 w-8 flex items-center justify-center">
                    {initials(name)}
                </div>
                <div className="flex-auto text-xs">
                    <div className="font-semibold">{name}</div>
                    <div className="text-gray-600">Jan 2 at 7:46pm</div>
                </div>
            </div>
            <div className="flex flex-col gap-2 px-5 py-2">
                <p>
                    A spectre is haunting Europe — the spectre of communism. All
                    the powers of old Europe have entered into a holy alliance
                    to exorcise this spectre: Pope and Tsar, Metternich and
                    Guizot, French Radicals and German police-spies.
                </p>
                <p>
                    Where is the party in opposition that has not been decried
                    as communistic by its opponents in power? Where is the
                    opposition that has not hurled back the branding reproach of
                    communism, against the more advanced opposition parties, as
                    well as against its reactionary adversaries?
                </p>
            </div>
            <div className="flex border-t mt-2 mx-5 py-3">
                {funZone}
                <button className="ml-auto text-xs hover:bg-gray-100 rounded px-3 py-2">
                    0 comments
                </button>
            </div>
        </div>
    );
}

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .join("")
        .slice(0, 2);
}
