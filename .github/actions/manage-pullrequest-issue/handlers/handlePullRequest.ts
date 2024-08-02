import * as core from '@actions/core';
import { validateSemanticTitle } from '../helpers/validation';
import { updateTitle } from '../helpers/title';
import { addLabels } from '../helpers/labels';

export async function handlePullRequest(octokit: any, context: any, titlePrefix: string, labels: string[], dependabotPrefix: string): Promise<void> {
  const pullRequest = context.payload.pull_request;
  const actor = core.getInput('actor');
  let newTitle = pullRequest.title;

  if (actor === 'dependabot[bot]') {
    newTitle = `${dependabotPrefix}${newTitle}`;
  }

  const isValidTitle = validateSemanticTitle(newTitle);

  if (isValidTitle) {
    await updateTitle(octokit, context, pullRequest, titlePrefix);
  } else {
    if (actor !== 'dependabot[bot]') {
      core.setFailed(`Pull request title is not semantic: ${pullRequest.title}`);
    } else {
      newTitle = `${titlePrefix}${pullRequest.title}`;
      await updateTitle(octokit, context, pullRequest, titlePrefix);
    }
  }

  if (labels.length > 0) {
    await addLabels(octokit, context, pullRequest.number, labels);
  }
}