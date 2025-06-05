const axios = require('axios');
const fs = require('fs');

const FormData = require('form-data');

const {
  BITBUCKET_USER_NAME,
  BITBUCKET_APP_PASSWORD,
  WORKSPACE,
  REPO_SLUG,
  BITBUCKET_PR_ID,
} = process.env;

const client = axios.create({
  baseURL: 'https://api.bitbucket.org/2.0',
  headers: { 'Content-Type': 'application/json' },
  auth: {
    username: BITBUCKET_USER_NAME,
    password: BITBUCKET_APP_PASSWORD,
  },
});

const getPrDetails = async () => {
  const url = `/repositories/${WORKSPACE}/${REPO_SLUG}/pullrequests/${BITBUCKET_PR_ID}`;
  console.log(url);
  try {
    const res = await client.get(
      `/repositories/${WORKSPACE}/${REPO_SLUG}/pullrequests/${BITBUCKET_PR_ID}`,
    );

    return res.data;
  } catch (error) {
    console.log(error.response.data);
    throw error;
  }
};

const downloadUrl = `/repositories/${WORKSPACE}/${REPO_SLUG}/downloads`;

async function getArtifactFile() {
  try {
    const res = await client.get(
      `${downloadUrl}/commentId_${BITBUCKET_PR_ID}.txt`,
    );
    return res.data.trim();
  } catch (error) {
    console.error(
      'Error fetching comment ID:',
      error.response?.data || error.message,
    );
    return null;
  }
}

async function uploadArtifact(commentID, commentFilePath) {
  try {
    fs.writeFileSync(commentFilePath, commentID, 'utf8');
    const formData = new FormData();
    formData.append('files', fs.createReadStream(commentFilePath));

    await client.post(downloadUrl, formData, {
      headers: { ...formData.getHeaders() },
    });

    console.log(`Comment ID ${commentID} uploaded successfully.`);
  } catch (error) {
    console.error(
      'Error uploading comment ID:',
      error.response?.data || error.message,
    );
  }
}

async function postOrUpdateComment(commentID, commentFilePath, bodyData) {
  try {
    let res;
    if (!commentID) {
      res = await client.post(
        `/repositories/${WORKSPACE}/${REPO_SLUG}/pullrequests/${BITBUCKET_PR_ID}/comments`,
        bodyData,
      );
      await uploadArtifact(res.data.id, commentFilePath);
    } else {
      res = await client.put(
        `/repositories/${WORKSPACE}/${REPO_SLUG}/pullrequests/${BITBUCKET_PR_ID}/comments/${commentID}`,
        bodyData,
      );
      console.log('Comment updated:', res.data.id);
    }
  } catch (error) {
    console.error(
      'Error posting/updating comment:',
      error.response?.data || error.message,
    );
  }
}

module.exports = {
  getPrDetails,
  getArtifactFile,
  uploadArtifact,
  postOrUpdateComment,
};
