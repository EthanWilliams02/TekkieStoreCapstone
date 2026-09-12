# Frontend Caching Strategy

## What we used
We implemented a custom React hook called `useShoes.ts` to manage the fetching and caching of the shoe catalogue data.

## Why we used it
Previously, every time a user navigated to a page like the Home page (Trending Section) or the Catalogue, the app would make a completely new network request (`fetchAllShoes()`) to the database. This was incredibly inefficient, caused slow loading times, and put unnecessary strain on the backend.

By using a custom hook with a simple global in-memory cache, the app only fetches the database **once** per session. Subsequent page visits load instantly from the cache, resulting in a lightning-fast UI display and saving backend resources.

## References
- [React Hooks Documentation](https://react.dev/reference/react/hooks) - Official guide on creating and using custom hooks.
- [Client-Side Caching in React](https://web.dev/articles/reliable/caching-best-practices) - Best practices for persisting data to avoid redundant network calls.
