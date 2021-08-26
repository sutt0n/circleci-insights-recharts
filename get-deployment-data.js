/**
* get-deployment-data.js
* Usage: node ./get-deployment-data.js <circle ci token> <vcs slug> <workflow name>
* Example: node ./get-deployment-data.js abc123-def321-abc-1234 gh/flexion/ef-cms hourly
* Returns: Creates ./data/deployment-data.json
**/

const axios = require('axios');
const fs = require('fs').promises;

require('dotenv').config();

(async () => {
  const apiKey = process.argv[2] || process.env.CIRCLE_TOKEN;
  const vcsSlug = process.argv[3] || process.env.VCS_SLUG;
  const workflowName = process.argv[4] || process.env.DEPLOYMENT_WORKFLOW_NAME;

  const { data } = await axios.get(`https://circleci.com/api/v2/insights/${vcsSlug}/workflows/${workflowName}`, {
    headers: { 
      'Circle-Token': `${apiKey}`,
      'Access-Control-Allow-Origin': '*',
    },
  });

  data.items = data.items.map(item => {
    const dtCreated = new Date(item.created_at);

    return { 
      ...item,
      name: `${dtCreated.getMonth() + 1}/${dtCreated.getDate()}`,
    }
  });

  data.items.sort((a,b) => {
    const aDate = new Date(a.created_at);
    const bDate = new Date(b.created_at);

    return aDate > bDate || 0;
  })

  const jsonString = JSON.stringify(data.items);

  await fs.writeFile('./src/data/deployment-data.json', Buffer.from(jsonString, 'utf-8'));
})();
