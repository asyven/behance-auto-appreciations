![application overview](https://i.imgur.com/1akVbvZ.png)

### Guide for setup:

-    clone repo (manual or by git clone command)
-    rename `.env.example` to `.env` and setting up your token
-    token you can get from the browser console, just paste this command: `JSON.parse(localStorage.getItem(Object.keys(localStorage)[0])).access_token;` when you are located and authorized on any behance page. ![get token feom console](https://i.imgur.com/N0EBrk3.png)
-    run `npm install`
-    run `node index.js`
