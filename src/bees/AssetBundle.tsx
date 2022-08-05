import { BaseTexture } from "pixi.js";
import { assert } from "../lib/assert";
import { loadImage } from "../lib/load";
import { has, keys } from "../lib/utils";

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

export class AssetBundle<AssetMap extends Record<string, any> = {}> {
    static async loadBaseTexture(url: URL): Promise<BaseTexture> {
        const image = await loadImage(url);
        return new BaseTexture(image);
    }

    loaders: {
        [K in keyof AssetMap]: (
            dep: <Dep extends keyof AssetMap>(dep: Dep) => Promise<AssetMap[Dep]>,
        ) => Promise<AssetMap[K]>;
    };
    private loadedAssets: Partial<AssetMap> = {};
    private loadAllPromise: Promise<unknown> | null = null;
    private loadPromises = new Map<keyof AssetMap, Promise<void>>();

    constructor() {
        this.loaders = {} as any;
    }

    add<Key extends string, Type>(
        key: Key,
        loader: (
            dep: <Dep extends keyof AssetMap>(dep: Dep) => Promise<AssetMap[Dep]>,
        ) => Promise<Type>,
    ): AssetBundle<Id<AssetMap & { [K in Key]: Type }>> {
        assert(!has(this.loaders, key));
        (this.loaders as any)[key] = loader;
        return this as any;
    }

    async load<K extends keyof AssetMap>(key: K): Promise<void> {
        let loadPromise = this.loadPromises.get(key);
        if (!loadPromise) {
            loadPromise = (async () => {
                const asset = await this.loaders[key]((dep) => this.getAsync(dep));
                this.loadedAssets[key] = asset;
            })();
            this.loadPromises.set(key, loadPromise);
        }
        await loadPromise;
    }

    async loadAll(): Promise<void> {
        if (!this.loadAllPromise) {
            this.loadAllPromise = Promise.all(keys(this.loaders).map((key) => this.load(key)));
        }
        await this.loadAllPromise;
    }

    async getAsync<K extends keyof AssetMap>(key: K): Promise<AssetMap[K]> {
        await this.load(key);
        return this.get(key);
    }

    get<K extends keyof AssetMap>(key: K): AssetMap[K] {
        const asset = this.loadedAssets[key];
        assert(asset !== undefined, `asset ${String(key)} is not loaded`);
        return asset!;
    }
}
