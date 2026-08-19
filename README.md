# Loan Calculator

The purpose of this is to build a better loan calculator for cars and home mortages.

Accessible at https://aizatto.github.io/loan-calculator

Features I want:

- Automatic preview
- Save into storage
- Receive values from query param
- Reverse Calculator. Based on a budget, what can you afford?

# Contributing

## Development

Requires Node >= 24 (see `.nvmrc`) and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev
```

## Install git hooks

```sh
git config core.hooksPath .githooks
```

## Run prettier

```sh
./scripts/prettier.sh all
```

## Deployment

The app is deployed to GitHub Pages (the `gh-pages` branch) from the built
`dist/` output:

```sh
pnpm run deploy
```

This runs the production build and publishes it with `gh-pages`. Use
`pnpm run deploy`, not `pnpm deploy` — the latter is a built-in pnpm command
that ignores the script.
