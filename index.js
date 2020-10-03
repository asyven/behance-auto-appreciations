const fetch = require("node-fetch");
const prompts = require('prompts');
const util = require('util');
const sleep = util.promisify(setTimeout);
require('dotenv').config();

const ACCOUNT_TOKEN = process.env.ACCOUNT_TOKEN;

(async () => {
    const prompt = await prompts([{
        type: 'text',
        name: 'search',
        message: 'Search keywords:'
    }, {
        type: 'text',
        name: 'country',
        message: 'Country:',
        init: "",
    }, {
        type: 'number',
        name: 'timeout',
        message: 'Timeout (ms):',
        init: 1000,
    }]);

    let likedCounter = 1;
    let posts;
    let nextOrdinal;
    while (nextOrdinal || !posts) {
        posts = await search(prompt.search, prompt.country, nextOrdinal);
        nextOrdinal = posts.search.nextOrdinal;
        
        let projects = posts.search.content.projects;

        console.log(`Projects found on current page: ${projects.length}. Ordinal: ${posts.search.nextOrdinal}`);

        for (let project of projects) {
            let result = await like(project);
            console.log(`[${likedCounter}]`,result);
            await sleep(prompt.timeout);
            likedCounter += 1;
        }
    }

})();

async function search(search, country = "", count) {
    let url = "https://www.behance.net/search?content=projects";

    if (search) {
        url += "&search=" + search;
    }

    if (country) {
        url += "&country=" + country;
    }

    if (count) {
        url += "&ordinal=" + count;
    }

    url = encodeURI(url);
    
    console.log(`search link: `, url);

    let response = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "ru,en;q=0.9,uk;q=0.8,bg;q=0.7,und;q=0.6,it;q=0.5,pl;q=0.4,de;q=0.3,zh-CN;q=0.2,zh;q=0.1",
            "authorization": "Bearer " + ACCOUNT_TOKEN,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-bcp": "997a7b4e-7cbd-4031-92f3-2627da3c28c3",
            "x-newrelic-id": "VgUFVldbGwsFU1BRDwUBVw==",
            "x-requested-with": "XMLHttpRequest",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
    });

    return response.json();
}

async function like(post) {
    const url = `https://www.behance.net/v2/projects/${post.id}/appreciate`;
    console.log(`Liking ${url} (stats: ${JSON.stringify(post.stats)})`);
    let response = await fetch(url, {
        "headers": {
            "accept": "*/*",
            "accept-language": "ru,en;q=0.9,uk;q=0.8,bg;q=0.7,und;q=0.6,it;q=0.5,pl;q=0.4,de;q=0.3,zh-CN;q=0.2,zh;q=0.1",
            "authorization": "Bearer " + ACCOUNT_TOKEN,
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-bcp": "997a7b4e-7cbd-4031-92f3-2627da3c28c3",
            "x-newrelic-id": "VgUFVldbGwsFU1BRDwUBVw==",
            "x-requested-with": "XMLHttpRequest",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "POST",
        "mode": "cors"
    });

    return await response.json();
}