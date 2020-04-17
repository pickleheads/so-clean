const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const myToken = core.getInput('githubToken');
  const octokit = new github.GitHub(myToken);
  const owner = 'pickleheads';
  const repo = 'cookbook';
  const { data: pullRequest } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: 9,
  });
  const ref = pullRequest.head.ref;
  const { response } = await octokit.checks.listForRef({
    owner,
    repo,
    ref,
  });
  console.log({ data: JSON.stringify(response, null, 2) });
}

run().catch((error) => core.setFailed(error.message));
