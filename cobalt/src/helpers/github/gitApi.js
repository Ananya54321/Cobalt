const axios = require('axios');

const Data = {

}


const token = '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';
const headers = {
    'Authorization': `token ${token}`,
    'X-GitHub-Api-Version': '2022-11-28'
};

export default async function fetchDirectoryContents(owner, repo, path = '') {
    try {
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const response = await axios.get(url, { headers });
        

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
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        { headers }
        );

        return Buffer.from(response.data.content, 'base64').toString();
    } catch (error) {
        console.error('Error fetching file content:', error.response ? error.response.data : error.message);
        return null;
    }
}

const owner = 'RishiKumarGade'; 
const repo = 'Cobalt';