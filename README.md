like webu but for minimalists


```js
var provider = { sendAsync: function(params, cb){/* ... */} }
var query = new IrcQuery(provider)

query.getBalance(address, cb)
```