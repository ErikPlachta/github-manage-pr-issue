export function validateSemanticTitle(title: string): boolean {
  const semanticTitlePattern = /^(feat|fix|chore|docs|style|refactor|test|perf)(\(\w+\))?: .+$/;
  return semanticTitlePattern.test(title);
}