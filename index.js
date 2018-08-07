const extend         = require('xtend');
const createRandomId = require('json-rpc-random-id')();

module.exports = IrcQuery;

function IrcQuery(provider) {
  const self           = this;
  self.currentProvider = provider;
}

//
// base queries
//

// default block
IrcQuery.prototype.getBalance                          = generateFnWithDefaultBlockFor(2, 'irc_getBalance');
IrcQuery.prototype.getCode                             = generateFnWithDefaultBlockFor(2, 'irc_getCode');
IrcQuery.prototype.getTransactionCount                 = generateFnWithDefaultBlockFor(2, 'irc_getTransactionCount');
IrcQuery.prototype.getStorageAt                        = generateFnWithDefaultBlockFor(3, 'irc_getStorageAt');
IrcQuery.prototype.call                                = generateFnWithDefaultBlockFor(2, 'irc_call');
// standard
IrcQuery.prototype.protocolVersion                     = generateFnFor('irc_protocolVersion');
IrcQuery.prototype.syncing                             = generateFnFor('irc_syncing');
IrcQuery.prototype.coinbase                            = generateFnFor('irc_coinbase');
IrcQuery.prototype.mining                              = generateFnFor('irc_mining');
IrcQuery.prototype.hashrate                            = generateFnFor('irc_hashrate');
IrcQuery.prototype.gasPrice                            = generateFnFor('irc_gasPrice');
IrcQuery.prototype.accounts                            = generateFnFor('irc_accounts');
IrcQuery.prototype.blockNumber                         = generateFnFor('irc_blockNumber');
IrcQuery.prototype.getBlockTransactionCountByHash      = generateFnFor('irc_getBlockTransactionCountByHash');
IrcQuery.prototype.getBlockTransactionCountByNumber    = generateFnFor('irc_getBlockTransactionCountByNumber');
IrcQuery.prototype.getUncleCountByBlockHash            = generateFnFor('irc_getUncleCountByBlockHash');
IrcQuery.prototype.getUncleCountByBlockNumber          = generateFnFor('irc_getUncleCountByBlockNumber');
IrcQuery.prototype.sign                                = generateFnFor('irc_sign');
IrcQuery.prototype.sendTransaction                     = generateFnFor('irc_sendTransaction');
IrcQuery.prototype.sendRawTransaction                  = generateFnFor('irc_sendRawTransaction');
IrcQuery.prototype.estimateGas                         = generateFnFor('irc_estimateGas');
IrcQuery.prototype.getBlockByHash                      = generateFnFor('irc_getBlockByHash');
IrcQuery.prototype.getBlockByNumber                    = generateFnFor('irc_getBlockByNumber');
IrcQuery.prototype.getTransactionByHash                = generateFnFor('irc_getTransactionByHash');
IrcQuery.prototype.getTransactionByBlockHashAndIndex   = generateFnFor('irc_getTransactionByBlockHashAndIndex');
IrcQuery.prototype.getTransactionByBlockNumberAndIndex = generateFnFor('irc_getTransactionByBlockNumberAndIndex');
IrcQuery.prototype.getTransactionReceipt               = generateFnFor('irc_getTransactionReceipt');
IrcQuery.prototype.getUncleByBlockHashAndIndex         = generateFnFor('irc_getUncleByBlockHashAndIndex');
IrcQuery.prototype.getUncleByBlockNumberAndIndex       = generateFnFor('irc_getUncleByBlockNumberAndIndex');
IrcQuery.prototype.getCompilers                        = generateFnFor('irc_getCompilers');
IrcQuery.prototype.compileLLL                          = generateFnFor('irc_compileLLL');
IrcQuery.prototype.compileSolidity                     = generateFnFor('irc_compileSolidity');
IrcQuery.prototype.compileSerpent                      = generateFnFor('irc_compileSerpent');
IrcQuery.prototype.newFilter                           = generateFnFor('irc_newFilter');
IrcQuery.prototype.newBlockFilter                      = generateFnFor('irc_newBlockFilter');
IrcQuery.prototype.newPendingTransactionFilter         = generateFnFor('irc_newPendingTransactionFilter');
IrcQuery.prototype.uninstallFilter                     = generateFnFor('irc_uninstallFilter');
IrcQuery.prototype.getFilterChanges                    = generateFnFor('irc_getFilterChanges');
IrcQuery.prototype.getFilterLogs                       = generateFnFor('irc_getFilterLogs');
IrcQuery.prototype.getLogs                             = generateFnFor('irc_getLogs');
IrcQuery.prototype.getWork                             = generateFnFor('irc_getWork');
IrcQuery.prototype.submitWork                          = generateFnFor('irc_submitWork');
IrcQuery.prototype.submitHashrate                      = generateFnFor('irc_submitHashrate');

// network level

IrcQuery.prototype.sendAsync = function(opts, cb) {
  const self = this;
  self.currentProvider.sendAsync(createPayload(opts), function(err, response) {
    if (!err && response.error) err = new Error('IrcQuery - RPC Error - ' + response.error.message);
    if (err) return cb(err);
    cb(null, response.result);
  });
};

// util

function generateFnFor(methodName) {
  return function() {
    const self = this;
    var args   = [].slice.call(arguments);
    var cb     = args.pop();
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb);
  };
}

function generateFnWithDefaultBlockFor(argCount, methodName) {
  return function() {
    const self = this;
    var args   = [].slice.call(arguments);
    var cb     = args.pop();
    // set optional default block param
    if (args.length < argCount) args.push('latest');
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb);
  };
}

function createPayload(data) {
  return extend({
    // defaults
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data);
}
