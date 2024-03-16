const axios = require('axios');

const Data = {

}

const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
    auth: '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',
});
const token = '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';


 async function fetchDirectoryContents(owner, repo, path = '') {
    try {
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
            const headers = {
                'Authorization': `token ${token}`,
                'X-GitHub-Api-Version': '2022-11-28'
            };

        // const response = await axios.get(url, { headers });
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: owner,
            repo: repo,
            path: path,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
              'Authorization': `token ${token}`,
            }
          })

        for (const item of response.data) {
            if (item.type === 'dir' ) {
                Data[item.path] = "DIR"
                await fetchDirectoryContents(owner, repo, item.path); 
            } else if (item.type === 'file') {
                const fileContent = await fetchFileContents(owner, repo, item.path);
                Data[item.path] = fileContent
            }
        }
        return Data

    } catch (error) {
        console.error('Error fetching directory contents:', error.response ? error.response.data : error.message);
        return null
    }
}

async function fetchFileContents(owner, repo, filePath) {
    try {
        // const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`);
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: owner,
            repo: repo,
            path: filePath,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
              'Authorization': `token ${token}`,
            }
          })

        return Buffer.from(response.data.content, 'base64').toString();
    } catch (error) {
        console.error('Error fetching file content:', error.response ? error.response.data : error.message);
        return null;
    }
}

const owner = 'RishiKumarGade'; 
const repo = 'Cobalt';

console.log(fetchDirectoryContents(owner, repo)) 