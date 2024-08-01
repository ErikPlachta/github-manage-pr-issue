export async function updateTitle(octokit: any, context: any, item: any, titlePrefix: string): Promise<void> {
  const newTitle = `${titlePrefix}${item.title}`;
  await octokit.rest.pulls.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: item.number,
    title: newTitle,
  });
  console.info(`Title updated to: ${newTitle}`);
} 