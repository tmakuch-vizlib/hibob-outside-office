module.exports = {
    prettyPrint,
    getStatusTable,
};

function prettyPrint(raw) {
    return `
    <html lang="en">
        <head>
            <title>Bob hacking</title>
            <style>
             * { background-color: black; color: green; }
            </style>
        </head>
        <body>
            <pre><code>${raw}</code></pre>
        </body>
    </html>
    `;
}

function getStatusTable(status) {
    return Object.keys(status).reduce((result, name) => {
        const site = status[name];
        result += `** ${name.toUpperCase()} `.padEnd(120, '*') + "\n";
        result += getPrintLine('IN', 'OUT');
        for (let i = 0; i < Math.max(site.in.length, site.out.length); i++) {
            result += getPrintLine(site.in[i] ?? '', site.out[i] ?? '')
        }
        result += "".padEnd(120, '*') + "\n\n";
        return result;
    }, '');
}

function getPrintLine(cell1, cell2) {
    return `** ${cell1}`.padEnd(30) + `|  ${cell2}`.padEnd(88) + '**\n';
}