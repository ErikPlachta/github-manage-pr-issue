export async function addLabels(octokit: any, context: any, issueNumber: number, labels: string[]): Promise<void> {
  await octokit.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNumber,
    labels: labels,
  });
  console.info(`Labels added: ${labels.join(', ')}`);
}