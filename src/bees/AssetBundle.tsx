import { PromiseType } from 'utility-types';
import { assert } from '../lib/assert';
import { entries, mapObjectValues } from '../lib/utils';

export class AssetBundle<AssetMap extends Record<string, any>> {
  private loadedAssets: AssetMap | null = null;
  private loadingPromise: Promise<unknown> | null = null;

  constructor(
    private readonly loaders: {
      [K in keyof AssetMap]: () => Promise<AssetMap[K]>;
    },
  ) {}

  async loadAll(): Promise<void> {
    if (!this.loadingPromise) {
      this.loadingPromise = (async () => {
        const loadedEntries = await Promise.all(
          entries(this.loaders).map(
            async ([key, load]): Promise<[string, unknown]> => [
              key,
              await load(),
            ],
          ),
        );

        this.loadedAssets = Object.fromEntries(loadedEntries) as any;
      })();
    }
    await this.loadingPromise;
  }

  get<K extends keyof AssetMap>(key: K): AssetMap[K] {
    assert(
      this.loadedAssets,
      'must call AssetBundle.loadAll before accessing assets',
    );
    return this.loadedAssets[key];
  }
}
