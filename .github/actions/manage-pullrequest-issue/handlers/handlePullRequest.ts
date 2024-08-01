import * as core from '@actions/core';
import { validateSemanticTitle } from '../helpers/validation';
import { updateTitle } from '../helpers/title';
import { addLabels } from '../helpers/labels';

export async function handlePullRequest(octokit: any, context: any, titlePrefix: string, labels: string[]): Promise<void> {
  const pullRequest = context.payload.pull_request;
  const isValidTitle = validateSemanticTitle(pullRequest.title);

  if (isValidTitle) {
    await updateTitle(octokit, context, pullRequest, titlePrefix);
  } else {
    core.info(`Pull request title is not semantic: ${pullRequest.title}`);
  }

  if (labels.length > 0) {
    await addLabels(octokit, context, pullRequest.number, labels);
  }
}