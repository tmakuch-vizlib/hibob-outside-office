const http = require('http');
const app = require('express')();

const bob = require('./src/bob');
const print = require('./src/print');

app.get('/:key/:day?', async (req, res) => {
    try {
        const status = await bob.fetchPeopleOut(req.params.key, req.params.day);
        const table = print.getStatusTable(status);
        res.send(print.prettyPrint(table));
    } catch (e) {
        res.status(500).send(print.prettyPrint(e.message));
    }
});

app.use((req, res) => {
    res.status(404).send(print.prettyPrint(`
1. Go to hibob.com, click your user in top right corner and click "API access".
2. If you have it, click "Generate token".
3. Check "Full employee read" and "Timeoff submit request & read who's out".
4. Copy api token.
5. Get back here and go to url/api_key to see who's off today or /api_key/YYYY-MM-DD to see specified date (and replace api_key with your key).
    `));
})

http.createServer(app).listen(80, () => console.log('Server successfully started'))
