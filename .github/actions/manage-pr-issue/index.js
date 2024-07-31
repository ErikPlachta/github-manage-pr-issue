const core = require('@actions/core');
const github = require('@actions/github');

function isSemanticTitle(title) {
  const semanticTitlePattern = /^(feat|fix|chore|docs|style|refactor|test|perf)(\(\w+\))?: .+$/;
  return semanticTitlePattern.test(title);
}

async function run() {
  try {
    const actor = core.getInput('actor');
    const branches = core.getInput('branches').split(',');
    const eventTypes = core.getInput('event_types').split(',');
    const titlePrefix = core.getInput('title_prefix') || '';
    const labels = core.getInput('labels') ? core.getInput('labels').split(',') : [];

    const context = github.context;
    const eventName = context.eventName;
    const branchName = context.payload.pull_request ? context.payload.pull_request.base.ref : context.payload.issue ? context.payload.issue.base.ref : '';

    if (!eventTypes.includes(eventName)) {
      core.info(`Skipping event: ${eventName}`);
      return;
    }

    if (!branches.includes(branchName)) {
      core.info(`Skipping branch: ${branchName}`);
      return;
    }

    if (actor !== "all" && context.actor !== actor) {
      core.info(`Skipping actor: ${context.actor}`);
      return;
    }

    const octokit = github.getOctokit(core.getInput('GITHUB_TOKEN'));

    if (context.payload.pull_request) {
      const pullRequest = context.payload.pull_request;
      let newTitle = pullRequest.title;

      if (isSemanticTitle(newTitle)) {
        newTitle = `${titlePrefix}${newTitle}`;

        await octokit.rest.pulls.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: pullRequest.number,
          title: newTitle,
        });

        core.info(`Pull request title updated to: ${newTitle}`);
      } else {
        core.info(`Pull request title is not semantic: ${newTitle}`);
      }

      if (labels.length > 0) {
        await octokit.rest.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: pullRequest.number,
          labels: labels,
        });
      }
    } else if (context.payload.issue) {
      const issue = context.payload.issue;
      let newTitle = issue.title;

      if (isSemanticTitle(newTitle)) {
        newTitle = `${titlePrefix}${newTitle}`;

        await octokit.rest.issues.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          title: newTitle,
        });

        core.info(`Issue title updated to: ${newTitle}`);
      } else {
        core.info(`Issue title is not semantic: ${newTitle}`);
      }

      if (labels.length > 0) {
        await octokit.rest.issues.addLabels({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: issue.number,
          labels: labels,
        });
      }
    }

    core.info(`Action completed successfully.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();