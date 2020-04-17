const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const myToken = core.getInput('githubToken');
  const octokit = new github.GitHub(myToken);
  const { data } = await octokit.pulls.get({
    owner: 'pickleheads',
    repo: 'cookbook',
    pull_number: 9,
  });
  // const response = await octokit.checks.listForRef({
  //   owner,
  //   repo,
  //   ref,
  // });
  console.log({ data: JSON.stringify(data) });
}

run().catch((error) => core.setFailed(error.message));
