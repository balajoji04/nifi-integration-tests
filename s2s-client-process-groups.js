var nifiUtils = require('./lib/nifi-api-utils.js');

var trace = false;
var debug = false;

var s2sClientProcessGroupIds = {
  's2s-raw-rpg': '01581009-4fef-19ed-a436-d6e03e567935',
  's2s-http-rpg': '0158100b-4fef-19ed-9bee-95e8e0f85cdf'
};

var usage = () => {
  console.log('Command is missing, start|stop');
  process.exit(1);
}

if (process.argv.length < 3) {
  usage();
}

var cmd = process.argv[2];
if (cmd !== 'start' && cmd !== 'stop') {
  usage();
}

nifiUtils.forEachEndpoint((nifiApi, nifiApiBack) => {
  console.log('got an API', nifiApi.endpoint);

  var pgs = Object.keys(s2sClientProcessGroupIds).map((name) => {
    return {name: name, id: s2sClientProcessGroupIds[name]};
  });

  var running = 'start' === cmd;
  nifiUtils.visitArray(pgs, (pg, pgBack) => {
    console.log(running ? 'Starting' : 'Stopping', pg.id, pg.name);
    nifiApi.updateProcessGroupState(pg.id, running, pgBack);
  }, nifiApiBack);

}, (err) => {
  if (err) return console.log(err);

  console.log('Stopped S2S client ProcessGroups!');
});
