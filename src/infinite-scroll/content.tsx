import foxUrl from "@/infinite-scroll/assets/fox.jpg";
import frogUrl from "@/infinite-scroll/assets/frog.jpg";
import React, { ReactNode } from "react";

export const DummyContent = React.memo(function DummyContent() {
    return (
        <>
            <P>
                A spectre is haunting Europe — the spectre of communism. All the
                powers of old Europe have entered into a holy alliance to
                exorcise this spectre: Pope and Tsar, Metternich and Guizot,
                French Radicals and German police-spies.
            </P>
            <P>
                Where is the party in opposition that has not been decried as
                communistic by its opponents in power? Where is the opposition
                that has not hurled back the branding reproach of communism,
                against the more advanced opposition parties, as well as against
                its reactionary adversaries?
            </P>
            <P>
                Unrelated to communism, here is a picture of a fox who lives
                near me:
            </P>
            <Img src={foxUrl} caption="Doesn't he look great?" />
            <P>Two things result from this fact:</P>
            <Ol>
                <Li>
                    Communism is already acknowledged by all European powers to
                    be itself a power.
                </Li>
                <Li>
                    It is high time that Communists should openly, in the face
                    of the whole world, publish their views, their aims, their
                    tendencies, and meet this nursery tale of the Spectre of
                    Communism with a manifesto of the party itself.
                </Li>
            </Ol>
            <P>
                To this end, Communists of various nationalities have assembled
                in London and sketched the following manifesto, to be published
                in the English, French, German, Italian, Flemish and Danish
                languages.
            </P>
            <H2>Bourgeois and Proletarians</H2>
            <P>
                The history of all hitherto existing society is the history of
                class struggles.
            </P>
            <P>
                Freeman and slave, patrician and plebeian, lord and serf,
                guild-master and journeyman, in a word, oppressor and oppressed,
                stood in constant opposition to one another, carried on an
                uninterrupted, now hidden, now open fight, a fight that each
                time ended, either in a revolutionary reconstitution of society
                at large, or in the common ruin of the contending classes.
            </P>
            <P>
                A while ago I went to Costa Rica and saw this frog it was
                awesome:
            </P>
            <Img src={frogUrl} caption="Isn't he cute?" />
            <P>
                In the earlier epochs of history, we find almost everywhere a
                complicated arrangement of society into various orders, a
                manifold gradation of social rank. In ancient Rome we have
                patricians, knights, plebeians, slaves; in the Middle Ages,
                feudal lords, vassals, guild-masters, journeymen, apprentices,
                serfs; in almost all of these classes, again, subordinate
                gradations.
            </P>
        </>
    );
});

export function H1({ children }: { children: ReactNode }) {
    return (
        <h1 className="pr-12 pt-6 text-5xl font-black tracking-wide">
            {children}
        </h1>
    );
}

export function H2({ children }: { children: ReactNode }) {
    return (
        <h2 className="pr-12 pt-6 text-3xl font-black tracking-wide">
            {children}
        </h2>
    );
}

export function Lead({ children }: { children: ReactNode }) {
    return <p className="my-3 text-justify text-lg leading-6">{children}</p>;
}

export function P({ children }: { children: ReactNode }) {
    return <p className="my-3 text-justify leading-6">{children}</p>;
}

export function Ol({ children }: { children: ReactNode }) {
    return <ol className="list-outside list-decimal">{children}</ol>;
}

export function Li({ children }: { children: ReactNode }) {
    return <li className="mb-3 ml-6 mr-4 text-justify">{children}</li>;
}

export function Img({ src, caption }: { src: string; caption: string }) {
    return (
        <figure className="my-6">
            <img src={src} className="w-full rounded shadow-md" />
            <figcaption className="pt-3 text-center font-serif text-sm text-stone-600">
                {caption}
            </figcaption>
        </figure>
    );
}
