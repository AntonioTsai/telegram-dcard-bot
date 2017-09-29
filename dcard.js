const cheerio = require('cheerio');
const config = require('./config.js');
const request = require('request');
var rq = request.defaults({
    baseUrl: 'https://www.dcard.tw/_api/',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    },
    jar: true
});

// Return today's Dcard infomation
exports.getDcard;

// Send invitation request to Dcard
exports.sendInvitation;


const getCSRFToken = async () => {
    try {
        // Request '/_ping' to get x-csrf-token
        const options = {
            method: 'GET',
            uri: '/_ping',
        }
        const responses = await promiseRequest(options);

        if (responses.response.headers['x-csrf-token'] != undefined) {
            return responses.response.headers['x-csrf-token'];
        }
    } catch (e) {
        console.log(e);
    }

}

const login = async () => {
    try {
        // Request '/sessions' to login
        const options = {
            method: "POST",
            uri: '/sessions',
            headers: {
                'x-csrf-token': await getCSRFToken()
            },
            json: true,
            body: {
                email: config.email,
                password: config.password
            }
        }

        return await promiseRequest(options);
    } catch (e) {
        console.log(e);
    }
}

const promiseRequest = (options) => {
    return new Promise((reslove, reject) => {
        rq(options, (error, response, body) => {
            if (!error) {
                return reslove({
                    response: response,
                    body: body
                });
            }
            return reject(error);
        });
    });
}
