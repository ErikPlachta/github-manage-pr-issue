import * as core from '@actions/core';
import { validateSemanticTitle } from '../helpers/validation';
import { updateTitle } from '../helpers/title';
import { addLabels } from '../helpers/labels';

export async function handleIssue(octokit: any, context: any, titlePrefix: string, labels: string[]): Promise<void> {
  const issue = context.payload.issue;
  const isValidTitle = validateSemanticTitle(issue.title);

  if (isValidTitle) {
    await updateTitle(octokit, context, issue, titlePrefix);
  } else {
    core.info(`Issue title is not semantic: ${issue.title}`);
  }

  if (labels.length > 0) {
    await addLabels(octokit, context, issue.number, labels);
  }
}