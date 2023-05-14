# Celestia PayForBlob UI

UI for Submitting  Celestia PayForBlob transactions, power by Vue.js

![VZcP1d.jpeg](https://i.328888.xyz/2023/05/15/VZcP1d.jpeg)
## Project setup
```
npm install
cp .env.example .env
```
and edit .env file to set your own config. 
* PROXYPORT: the proxy server port, default is 4454.
* VUE_APP_PROXYPORT：Should be same as PROXYPORT
* VUE_APP_SERVERDOMAIN: The ip or domain of the proxy server, default is http://localhost , if ip ,you can set it as http://xxx.xxx.xxx.xxx
* NODE_URL: gateway API url, default is http://localhost:26659 , you can set it to your own. Remember the gateway should be open to public and the wallet should have balance to excute the transaction.
* VUE_APP_NODE_URL: Should be same as NODE_URL

## Run in dev mode
We need run a proxy server to avoid CORS problem
```
npm run proxy
```
Then open another terminal, run the UI
```
npm run serve
```
## Run in production mode


### Compiles and minifies for production
```
npm run build

```

### Run 
```
npm start 
```

## Test website 
http://37.27.10.186:8080

