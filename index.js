const _ = require('lodash');
const core = require('@actions/core');
const github = require('@actions/github');

const SO_CLEAN_IMAGE_URL =
  'https://lh3.googleusercontent.com/0Ca6E4Q-NwkhwwRIJWf2g4C9bUd7HmgvIgwzcREbiqkQwf0NNXA2uoxYeQs1W3s9AclXyVoniHsp0a7bZoU0-Uf1U9Rxy1mI1lzY2wzg7TSZobyeOaLm4IF-o_TAIg_pDs3RqbnmvkjbabpS7cKEoPqOeWtPFuD8aBF7iZXzgqMFkI6kPlYqwY9qqI8cGi13VFFMICIMfQSt1Bz7TLb7poc5xfKNyb07auCEMpikRamaxv_ucVEoggmaftmMiOrC2vJcCTRSfwmyE2D-BTEOp2wqSts37Im4XddIQx2_nyuq1SV0oEt4lXb4rtxU9d3mSi5xCUneeqc5TBUPfE9Ovq4KP8YyeXvZ0brJv3aKW5pDwlkXWrciZm1pqXpOtO5uOyrYQEITzKCL0BDsjqzxljKp5UTEpvDB4wYz9RgB8sUeSTvwjtKCIHtw9tazn820MCMKSGLKpLom6KTYAdrGu0ljfpYZ-pS8dXOex1XcptUclntiWrY2GeFV099-O-KTVhy0NSEmfNUbDuzpmSrj89gg_044lmTxLAiciHDRkuLrjNq1aMMnvkBqz8QVmuOKcyNZ4G4O1nGBaku_njo9ksJdWsikUZ-m9BC6KHcMah_2A4tBvLGRaNrDI1XaFED4AqmiLoy0RQ342NE_r7yX9mqUQtYFKed1qcibVFLaCcWIy35V5TkAJN0KQMFuMNeCcTCdogThhyKc2uyTwKqP8wt1T2jQG2d0cFAMxF9YTOiHs0zAHJ4rRg=w550-h366-no';
const SO_CLEAN_COMMENT_BODY = `### Clean!\n![So clean](${SO_CLEAN_IMAGE_URL})`;

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

async function action() {
  const myToken = core.getInput('githubToken');
  const octokit = new github.GitHub(myToken);
  const owner = github.context.payload.organization.login;
  const repo = github.context.payload.repository.name;
  const pullRequestNumber = github.context.payload.pull_request.number;
  const { data: comments } = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: pullRequestNumber,
  });
  console.log({author: comments[0].user})
  const mergeable = await fetchMergeableStatus(
    octokit,
    owner,
    repo,
    pullRequestNumber
  );
  if (mergeable) {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: pullRequestNumber,
      body: SO_CLEAN_COMMENT_BODY,
    });
  }
}

async function fetchMergeableStatus(octokit, owner, repo, pullRequestNumber) {
  let meregable = null;
  do {
    await sleep(500);
    const { data: pullRequest } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullRequestNumber,
    });
    meregable = pullRequest.mergeable;
    core.debug(`meregable=${meregable}`);
  } while (meregable === null);
  return meregable;
}

action().catch((error) => {
  console.error(error);
  core.setFailed(error.message);
});
