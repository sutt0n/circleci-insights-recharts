/**
* get-build-data.js
* Usage: node ./get-build-data.js <circle ci token> <vcs slug> <workflow name>
* Example: node ./get-build-data.js abc123-def321-abc-1234 gh/flexion/ef-cms hourly
* Returns: Creates ./data/build-data.json
**/

const axios = require('axios');
const axiosRetry = require('axios-retry');
const fs = require('fs').promises;

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay, retries: 10 });

require('dotenv').config();

(async () => {
  const apiKey = process.argv[2] || process.env.CIRCLE_TOKEN;
  const vcsSlug = process.argv[3] || process.env.VCS_SLUG;

  const results = [];

  let offset = 0;

  for(let i = 0; i <= 10; i++) {
    offset += 100 * i;
    let { data } = await axios.get(`https://circleci.com/api/v1.1/project/${vcsSlug}?shallow=true&limit=100&offset=${offset}`, {
      headers: { 
        'Circle-Token': `${apiKey}`,
        'Access-Control-Allow-Origin': '*',
      },
    });

    results.push(...data);
  }

  const branches = results.map(result => {
    if(result.workflows.workflow_name !== 'hourly' && result.lifecycle === 'finished') {
      return result.branch;
    }

    return null;
  }).filter((x,idx,self) => x && self.indexOf(x) === idx); 

  const allResults = [];

  for(const branch of branches) {
    const {data} = await axios.get(`https://circleci.com/api/v2/insights/${vcsSlug}/workflows/build-and-deploy?branch=${branch}`, {
      headers: { 
        'Circle-Token': `${apiKey}`,
        'Access-Control-Allow-Origin': '*',
      },
    });

    allResults.push(...data.items);
  }

  const jsonString = JSON.stringify(allResults.filter(x => x.status === 'success'));

  await fs.writeFile('./src/data/build-data.json', Buffer.from(jsonString, 'utf-8'));
})();
