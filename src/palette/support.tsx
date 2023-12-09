import { assertExists } from "@/lib/assert";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { createContext, useContext } from "react";

interface Support {
    p3Gamut: boolean;
    rec2020Gamut: boolean;
    oklchSyntax: boolean;
}

const SupportContext = createContext<Support | null>(null);

export function SupportProvider({ children }: { children: React.ReactNode }) {
    const p3Gamut = useMediaQuery("(color-gamut: p3)");
    const rec2020Gamut = useMediaQuery("(color-gamut: rec2020)");
    const oklchSyntax = CSS.supports("color", "oklch(0 0 0)");

    if (p3Gamut === null || rec2020Gamut === null) {
        return null;
    }

    return (
        <SupportContext.Provider value={{ p3Gamut, rec2020Gamut, oklchSyntax }}>
            {children}
        </SupportContext.Provider>
    );
}

export function useSupport(): Support {
    return assertExists(useContext(SupportContext));
}
