# Manage PRs and Issues with Custom GitHub Action

This repository contains a custom GitHub Action to manage PRs and Issues dynamically. The action supports checking for semantic titles, adding prefixes, and labeling issues and PRs based on configurable inputs.

## Action Inputs

- **`actor`**: The GitHub actor to check for (e.g., `dependabot[bot]`).
- **`branches`**: Comma-separated list of branches to check (e.g., `main,develop`).
- **`event_types`**: Comma-separated list of event types to check (e.g., `pull_request,issues`).
- **`title_prefix`**: (Optional) Prefix to add to PR/Issue titles (default is empty).
- **`labels`**: (Optional) Comma-separated list of labels to add (default is empty).
- **`GITHUB_TOKEN`**: GitHub token to authenticate with the GitHub API.

## Usage

### Custom Action

The custom action is defined in `.github/actions/manage-pr`. It checks if PRs and Issues have semantic titles, adds prefixes, and labels them as specified.

#### Example `action.yml`

\```yaml
name: “Manage PR and Issues”
description: “Custom action to manage PRs and Issues with dynamic inputs”
author: “YOUR_NAME”

inputs:
  actor:
    description: “The GitHub actor to check for”
    required: true
  branches:
    description: “Comma-separated list of branches to check”
    required: true
  event_types:
    description: “Comma-separated list of event types to check”
    required: true
  title_prefix:
    description: “Prefix to add to PR/Issue titles”
    required: false
    default: “”
  labels:
    description: “Comma-separated list of labels to add”
    required: false
    default: “”
  GITHUB_TOKEN:
    description: “GitHub token to authenticate with the GitHub API”
    required: true

runs:
  using: “node16”
  main: “index.js”

permissions:
  pull-requests: write
  issues: write
\```

### Workflows

#### Workflow for Dependabot PRs

This workflow manages PRs created by Dependabot. It prefixes the titles and adds labels as specified.

Save the following configuration as `.github/workflows/dependabot-prs.yml`:

\```yaml
name: Manage Dependabot PRs

on:
  pull_request:
    types: [opened, edited]
    branches:
      - ‘*’

jobs:
  manage-dependabot-prs:
    runs-on: ubuntu-latest

    if: github.actor == ‘dependabot[bot]’

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Run custom action for Dependabot
        uses: ./.github/actions/manage-pr
        with:
          actor: “dependabot[bot]”
          branches: “main,develop”
          event_types: “pull_request”
          title_prefix: “chore(deps): “
          labels: “dependencies,automated”
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
\```

#### Workflow for General PRs and Issues

This workflow manages all other PRs and issues. It ensures semantic titles, adds prefixes, and labels them as specified.

Save the following configuration as `.github/workflows/general-prs-issues.yml`:

\```yaml
name: Manage General PRs and Issues

on:
  pull_request:
    types: [opened, edited]
    branches:
      - ‘*’
  issues:
    types: [opened, edited]

jobs:
  manage-general-prs-issues:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Run custom action for general PRs and issues
        uses: ./.github/actions/manage-pr
        with:
          actor: “all”  # Use a wildcard or manage actor differently in the custom action
          branches: “main,develop”
          event_types: “pull_request,issues”
          title_prefix: “”
          labels: “general”
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
\```

### Example Repository Structure

\```
.github/
  actions/
    manage-pr/
      action.yml
      index.js
      package.json
  workflows/
    dependabot-prs.yml
    general-prs-issues.yml
README.md
\```

### Semantic Title Pattern

The custom action checks if the titles follow this semantic pattern: `type(scope): description`.

- **Types**: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`
- **Scope**: Optional, in parentheses (e.g., `fix(auth): ...`)
- **Description**: Required, follows the colon

### Development

To develop and test this action locally:

1. Clone the repository.
2. Navigate to the `.github/actions/manage-pr` directory.
3. Install dependencies with `npm install`.
4. Make changes to `index.js` as needed.
5. Commit and push your changes to test with GitHub Actions.

### Contributions

Contributions are welcome! Please open an issue or submit a pull request with improvements.

### License

This project is licensed under the MIT License.