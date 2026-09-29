/* The `shaders` package is licensed for evaluation only (Storybook review), so
 * it must not ship in the hosted EP Pay prototype. vite.eppay.config.js aliases
 * `shaders/vue` to this empty module; the prototype's sign-in uses a
 * pre-rendered video ground instead (see main.js), so nothing ever calls it. */
export default {}
