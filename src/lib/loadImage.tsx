import { promiseFromEvents } from './utils';

export async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  const promise = promiseFromEvents(
    (resolve) => image.addEventListener('load', resolve, { once: true }),
    (reject) => image.addEventListener('error', reject, { once: true }),
  );
  image.src = src;
  await promise;
  return image;
}
