# Car parts delivery Inventory control system 🅰️

## Features

- UI based on user access level
- Delivery tracking on map (Leaflet + OpenStreetMap tiles)
- User settings
- Delivery history

## Technologies

- TypeScript
- Angular 21 (Angular CLI, `@angular/build:application`)
- SCSS
- Bootstrap 5 + ng-bootstrap
- ngx-translate, ngx-toastr, ng-select, Leaflet

## Scripts

| Command | Description |
|--------|-------------|
| `npm start` | Dev server (`ng serve`, development config) |
| `npm run build` | Production build (default CLI configuration) |
| `npm run build:prod` | Same as production file replacements (`environment.prod.ts`) |
| `npm run build:stage` | Build with `environment.stage.ts` |

## Configuration

API and optional HERE keys are set per environment (replaces the old webpack `DefinePlugin` global `config`):

- [`src/environments/environment.ts`](src/environments/environment.ts) — local dev defaults
- [`src/environments/environment.stage.ts`](src/environments/environment.stage.ts) — staging
- [`src/environments/environment.prod.ts`](src/environments/environment.prod.ts) — production

Edit `apiUrl`, `hereAppId`, and `hereApiKey` to match your backends before deploying.

## Static SPA hosting

The app uses the Angular router. Your server must serve `index.html` for unknown paths (same idea as the old `connect-history-api-fallback` / `lite-server` setup).

If the app is deployed under a subpath, build with a matching base href, for example:

```bash
npx ng build --configuration production --base-href /your-subpath/
```

## Migration notes (Angular 7 → 21)

- **Build**: Custom Webpack 4 was removed; use Angular CLI only.
- **Config**: `config.apiUrl` → `environment.apiUrl` (and related fields).
- **Gallery**: `ngx-gallery` was removed; route attachments use a simple thumbnail grid with links to full images.
- **Maps**: The status history map still uses Leaflet + OSM (no HERE SDK in code); `here*` env vars are reserved for future use or server-side tooling.
- **UI**: Templates still use some Bootstrap 4-style `badge-*` classes; Bootstrap 5 prefers `bg-*`. Visually verify badges and update classes if needed.

## Parity checklist (manual)

Verify against your backend:

1. Login / logout / `returnUrl` after login  
2. JWT refresh on `401` (`TokenInterceptor`)  
3. Routes list, filters, pagination, route detail, status update  
4. Status history list + map markers + hover  
5. Users list / add / edit, settings, language (ru / uk)  
6. Lazy-loaded `menu` route  
