#!/usr/bin/env bash
# Build command for Cloudflare Workers Builds.
#
# The site is served at alex.dytry.ch/toys/, so the build output goes into
# dist/toys/: the asset paths then match the URLs. _headers must be at the root
# of the assets directory, so it moves up to dist/.
set -euo pipefail

# The Workers Builds image has no Rust. Install it if it is missing.
if ! command -v cargo >/dev/null 2>&1; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs |
        sh -s -- -y --profile minimal --target wasm32-unknown-unknown
    # shellcheck disable=SC1091
    source "$HOME/.cargo/env"
fi
rustup target add wasm32-unknown-unknown

yarn build:rust
VITE_BASE=/toys/ yarn build
yarn check

mv dist dist-toys
mkdir dist
mv dist-toys dist/toys
mv dist/toys/_headers dist/_headers
