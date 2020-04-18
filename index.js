const _ = require('lodash');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const myToken = core.getInput('githubToken');
  const octokit = new github.GitHub(myToken);
  console.log(github.context);
  const owner = github.context.payload.organization.login;
  const repo = github.context.payload.repository.name;
  const pullRequestNumber = github.context.payload.pull_request.number;
  const { data: pullRequest } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: pullRequestNumber,
  });
  console.log(pullRequest)
  // const ref = pullRequest.head.ref;
  // const { data: pullRequestChecks } = await octokit.checks.listForRef({
  //   owner,
  //   repo,
  //   ref,
  // });
  // const wereChecksSuccessful = _.every(pullRequestChecks.check_runs, {
  //   conclusion: 'status',
  // });
  // const shouldPostGif = wereChecksSuccessful;
  // console.log({ shouldPostGif });
}

run().catch((error) => core.setFailed(error.message));
