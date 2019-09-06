# webpack-hot-release

single page application hot release with webpack && git

webpack.config.js

- should support git
- should

```js
const WebpackHotReleasePlugin = require('webpack-hot-release/plugin')

{
  plugins: [new WebpackHotReleasePlugin()]
}
```

browser

```js
/**
 * first script
 **/

import './hot-release.js'
```

hot-release.js

```js
import hotRelease from 'webpack-hot-release/client'

hotRelease({
  // how long to check update
  throttle: 20
})
```

### How it works?

1. webpack produce release.json in dist folder, like this,it will always the newest relase file

```json
{
  "NODE_ENV": "production",
  "GIT_COMMIT": "a9a834e",
  "GIT_MESSAGE": "test",
  "GIT_BRANCH": "master",
  "GIT_DATE": "2019-09-06T09:02:24.000Z"
}
```

2. webpack.DefinePlugin() to Define GIT args

```
'process.env.GIT_COMMIT'
'process.env.GIT_BRANCH'
'process.env.GIT_MESSAGE'
'process.env.GIT_DATE'
```

3. in client browser,it overriade pushState && replaceState function,make a request to fetch 'release.json'

4. in production it will 'location.reload()',in development,just output message
