import { execSync } from 'child_process';

// Install dependencies at runtime
execSync('npm install @actions/core @actions/github', { stdio: 'inherit' });

import * as core from '@actions/core';
import * as github from '@actions/github';

import { handlePullRequest } from './handlers/handlePullRequest';
import { handleIssue } from './handlers/handleIssue';

async function run(): Promise<void> {
  try {
    const actor: string = core.getInput('actor');
    const branches: string[] = core.getInput('branches').split(',');
    const eventTypes: string[] = core.getInput('event_types').split(',');
    const titlePrefix: string = core.getInput('title_prefix') || '';
    const labels: string[] = core.getInput('labels') ? core.getInput('labels').split(',') : [];
    const githubToken: string = core.getInput('GITHUB_TOKEN');

    if (!githubToken) {
      throw new Error('GITHUB_TOKEN is required');
    }

    const context = github.context;
    const eventName: string = context.eventName;
    const branchName: string | undefined = context.payload.pull_request ? context.payload.pull_request.base.ref : context.payload.issue ? context.payload.issue.base.ref : undefined;

    if (!eventTypes.includes(eventName)) {
      core.info(`Skipping event: ${eventName}`);
      return;
    }

    if (!branches.includes(branchName!)) {
      core.info(`Skipping branch: ${branchName}`);
      return;
    }

    if (actor !== "all" && context.actor !== actor) {
      core.info(`Skipping actor: ${context.actor}`);
      return;
    }

    const octokit = github.getOctokit(githubToken);

    if (context.payload.pull_request) {
      await handlePullRequest(octokit, context, titlePrefix, labels);
    } else if (context.payload.issue) {
      await handleIssue(octokit, context, titlePrefix, labels);
    }

    core.info(`Action completed successfully.`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
}

run();