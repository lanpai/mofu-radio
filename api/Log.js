// MOFU-RADIO REQUIREMENTS
const { Config } = require('./Data.js');

function Log(log, verbosity) {
    if (Config('logging.verbosity') >= verbosity) {
        var output = '';
        switch (verbosity) {
            case -1:
                output += 'SYSTEM';
                break;
            case 0:
                output += 'FATAL';
                break;
            case 1:
                output += 'ERROR';
                break;
            case 2:
                output += 'WARNING';
                break;
            case 3:
                output += 'INFO';
                break;
            case 4:
                output += 'VERBOSE';
                break;
        }
        output = output.padStart(10, ' ');
        var date = new Date();
        output += ' [' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + '] : ' + log;
        console.log(output);

        if (verbosity === 0)
            process.exit();
    }
}

module.exports = Log;
