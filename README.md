# Celestia PayForBlob UI

UI for Submitting  Celestia PayForBlob transactions, power by Vue.js
## Project setup
```
npm install
cp .env.example .env
```
and edit .env file to set your own config. 
* PROXYPORT: the proxy server port, default is 4454.
* NODE_URL: gateway API url, default is http://localhost:26659 , you can set it to your own. Remember the gateway should be open to public and the wallet should have balance to excute the transaction.

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


