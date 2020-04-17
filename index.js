const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const myToken = core.getInput('githubToken');
  const octokit = new github.GitHub(myToken);
  const { data: pullRequest } = await octokit.pulls.get({
    owner: 'pickleheads',
    repo: 'cookbook',
    pull_number: 9,
    mediaType: {
      format: 'diff',
    },
  });
  console.log(pullRequest);
}

run().catch((error) => core.setFailed(error.message));
