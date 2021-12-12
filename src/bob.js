const fetch = require('node-fetch');

module.exports = {
    fetchPeopleOut,
};

async function fetchPeopleOut(key, day) {
    let outUrl = 'outtoday';
    let people;
    let daysOff;
    if (day) {
        outUrl = `whosout?from=${day}&to=${day}`
    }
    try {
        people = await (await fetchBob(key, 'https://api.hibob.com/v1/people')).json();
    } catch {
        throw new Error('Could not get people, did you enabled "Full employee read" permission on the api key? And is the key correct?');
    }
    try {
        daysOff = await (await fetchBob(key, 'https://api.hibob.com/v1/timeoff/' + outUrl)).json();
    } catch {
        throw new Error('Could not get people off, did you enabled "Timeoff submit request & read who\'s out" permission on the api key?');
    }
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
    return Object.values(map).reduce((res, next) => {
        res[next.site] = res[next.site] || {in: [], out: []};
        if (next.outReason) {
            res[next.site].out.push(next.details.fullName.padEnd(40) + `(${next.outReason})`);
        } else {
            res[next.site].in.push(next.details.fullName);
        }
        return res;
    }, {});
}

function fetchBob(authKey, url, opts) {
    return fetch(url, Object.assign({}, opts, {
        headers: Object.assign({}, opts?.headers, {
            'Authorization': authKey
        })
    }))
}