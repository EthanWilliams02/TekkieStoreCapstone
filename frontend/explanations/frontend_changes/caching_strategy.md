# Frontend Caching Strategy

## What we used
We implemented a custom React hook called `useShoes.ts` to manage the fetching and caching of the shoe catalogue data. The same pattern is repeated in three more hooks that back the admin Dashboard: `useShoeVariants.ts`, `useAdminOrders.ts`, and `useCustomerCount.ts`.

## Why we used it
Previously, every time a user navigated to a page like the Home page (Trending Section) or the Catalogue, the app would make a completely new network request (`fetchAllShoes()`) to the database. This was incredibly inefficient, caused slow loading times, and put unnecessary strain on the backend.

By using a custom hook with a simple global in-memory cache, the app only fetches the database **once** per session. Subsequent page visits load instantly from the cache, resulting in a lightning-fast UI display and saving backend resources.

## Dashboard hooks (same pattern, different data)
The admin Dashboard pulls from four separate endpoints (shoes, shoe variants, orders, customer count). Each has its own hook, all following the identical shape as `useShoes.ts`:
- module-level `cache` + `inFlight` promise, shared across every component using the hook
- fetches once per session; a second mount reads straight from `cache`
- `refresh()` clears the cache and refetches — wired to the Dashboard's Refresh button, which calls all four `refresh()`s in parallel
- a failed fetch doesn't poison the cache for next time — `cache` is only set on success

This means navigating away from the Dashboard and back doesn't refire all four requests; only the explicit Refresh button (or a hard page reload, which clears the module-level cache like any other in-memory state) does.

## References
- [React Hooks Documentation](https://react.dev/reference/react/hooks) - Official guide on creating and using custom hooks.
- [Client-Side Caching in React](https://web.dev/articles/reliable/caching-best-practices) - Best practices for persisting data to avoid redundant network calls.
