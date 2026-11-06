# Modern NPM Package Standards & Best Practices

To build a professional, maintainable, and reliable NPM package in 2026, follow these industry standards:

---

## 1. Module Compatibility (Dual ESM & CommonJS)

Modern ecosystems use native **ESM** (`import`/`export`), but legacy projects and some tools still require **CommonJS** (`require`).

- **Standard**: Provide dual ESM (`dist/index.mjs`) and CJS (`dist/index.cjs`) outputs with TypeScript declaration maps (`dist/index.d.ts`, `dist/index.d.cts`).
- **Tooling**: Use [`tsup`](https://tsup.egoist.dev/) or [`unbuild`](https://github.com/unjs/unbuild) for fast, zero-config dual builds with bundled TypeScript definitions.

---

## 2. Modern `package.json` Exports Map

Use modern conditional exports instead of only relying on `"main"`:

```json
{
  "name": "algoman",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": {
        "import": "./dist/index.d.ts",
        "require": "./dist/index.d.cts"
      },
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "files": ["dist"]
}
```

---

## 3. Strict Package Hygiene

- **`files` field**: Whitelist only compiled output (`dist/`) to prevent leaking tests, internal docs, CI configs, and raw source code to the npm registry.
- **`.npmignore` / `.gitignore`**: Ensure node_modules, build caches, and test artifacts are excluded.
- **Provenance**: Enable build provenance on publish (`npm publish --provenance`) for signed supply-chain security.

---

## 4. Code Quality & Tooling

- **TypeScript**: Strict mode enabled (`"strict": true`, `"moduleResolution": "bundler"`, `"declaration": true`).
- **Testing**: Modern, fast runner like [Vitest](https://vitest.dev/).
- **Linting & Formatting**: ESLint/Prettier or Biome.
- **Git Hooks / Release**: Standardized commit conventions (Conventional Commits) and automated releases (Changesets or Release Please).

---

## 5. Recommended Directory Layout

```text
algoman/
├── .github/
│   └── workflows/
│       ├── test.yml          # CI tests across Node versions
│       └── release.yml       # Automated npm publish & provenance
├── dist/                     # Compiled bundles & typings (generated)
├── src/
│   ├── index.ts              # Package entry point
│   ├── core.ts               # Core logic / utilities
│   └── types.ts              # Exported type definitions
├── tests/
│   └── index.test.ts         # Vitest unit & integration tests
├── .gitignore
├── .npmignore                # Fallback safeguard for publishing
├── package.json              # Metadata, dependencies, and export maps
├── README.md                 # Documentation, installation, and examples
├── LICENSE                   # Open source license (MIT, Apache-2.0, etc.)
├── tsconfig.json             # TypeScript configuration
├── tsup.config.ts            # Build configuration (ESM + CJS + d.ts)
└── vitest.config.ts          # Test runner configuration
```
