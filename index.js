const fetchBob = (authKey, url, opts) => require('node-fetch')(url, Object.assign({}, opts, {
    headers: Object.assign({}, opts?.headers, {
        'Authorization': authKey
    })
}));


(async () => {

    try {
        const people = await (await fetchBob('esfRezXC7CUQKwIUQg0Xl9rprlM1ZFNGf37M6t6T', 'https://api.hibob.com/v1/people')).json();
        const daysOff = await (await fetchBob('esfRezXC7CUQKwIUQg0Xl9rprlM1ZFNGf37M6t6T', 'https://api.hibob.com/v1/timeoff/outtoday')).json();
        const map = people.employees.reduce((res, next) => {
            res[next.id] = {
                name: next.fullName,
                site: next.work.site,
                details: next,
            };
            return res;
        }, {});
        daysOff.outs.forEach(out => {
            map[out.employeeId].outReason = out.policyTypeDisplayName;
        })
        const sitesStatus = Object.values(map).reduce((res, next) => {
            res[next.site] = res[next.site] || {in: [], out: []};
            if (next.outReason) {
                res[next.site].out.push(next.details.fullName.padEnd(40) + `(${next.outReason})`);
            } else {
                res[next.site].in.push(next.details.fullName);
            }
            return res;
        }, {});
        prettyPrint(sitesStatus);
    } catch (e) {
        console.error(e);
        console.error(await e.json());
    }

})();

function prettyPrint(status) {
    Object.keys(status).forEach(name => {
        const site = status[name];
        console.log(`** ${name} `.padEnd(120, '*'));
        prettyPrintLine('IN', 'OUT');
        for (let i = 0; i < Math.max(site.in.length, site.out.length); i++) {
            prettyPrintLine(site.in[i] ?? '', site.out[i] ?? '')
        }
        console.log('');
    });
}

function prettyPrintLine(cell1, cell2) {
    console.log(`** ${cell1}`.padEnd(30) + `|  ${cell2}`.padEnd(88) + '**')
}