# Git Branching Strategy

This project follows the GitFlow branching model to manage development, releases, and maintenance.

## Branch Types

### Main Branches

- **main**: Production-ready code that has been released
- **develop**: Latest delivered development changes for the next release

### Supporting Branches

- **feature/**: New features and non-emergency bug fixes
- **release/**: Preparation for a new production release
- **hotfix/**: Urgent fixes to the production version
- **bugfix/**: Non-urgent bug fixes that will be merged into develop

## Branch Naming Conventions

- Feature branches: `feature/[issue-number]-descriptive-name`
- Bug fix branches: `bugfix/[issue-number]-descriptive-name`
- Hot fix branches: `hotfix/[issue-number]-descriptive-name`
- Release branches: `release/vX.Y.Z`

## Workflow Processes

### Feature Development

1. Create a feature branch from `develop`:
   ```
   git checkout develop
   git pull origin develop
   git checkout -b feature/123-add-search-functionality
   ```

2. Work on the feature, committing changes regularly:
   ```
   git add .
   git commit -m "feat: implement search bar component"
   ```

3. Push the feature branch to remote:
   ```
   git push -u origin feature/123-add-search-functionality
   ```

4. When the feature is complete, create a pull request to `develop` branch
5. After code review and approval, merge the feature into `develop`

### Release Process

1. Create a release branch from `develop` when ready to release:
   ```
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```

2. Make any last-minute fixes or version updates:
   ```
   git add .
   git commit -m "chore: bump version to 1.0.0"
   ```

3. Create a pull request to merge `release/v1.0.0` into `main`
4. After approval, merge to `main`
5. Tag the release on `main`:
   ```
   git checkout main
   git pull origin main
   git tag -a v1.0.0 -m "Version 1.0.0"
   git push origin v1.0.0
   ```

6. Merge `release/v1.0.0` back into `develop` to ensure all changes are captured

### Hotfix Process

1. Create a hotfix branch from `main`:
   ```
   git checkout main
   git pull origin main
   git checkout -b hotfix/456-fix-critical-login-bug
   ```

2. Fix the issue:
   ```
   git add .
   git commit -m "fix: resolve critical login issue"
   ```

3. Create a pull request to merge into `main`
4. After approval, merge to `main`
5. Tag the hotfix:
   ```
   git checkout main
   git pull origin main
   git tag -a v1.0.1 -m "Hotfix v1.0.1"
   git push origin v1.0.1
   ```

6. Merge the hotfix into `develop` as well to ensure the fix is in the next release

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- test: Adding missing tests or correcting existing tests
- chore: Changes to the build process or auxiliary tools

## Environments

- **Development**: Connected to the `develop` branch
- **Staging/QA**: Connected to `release/*` branches for testing
- **Production**: Connected to the `main` branch

## Code Review Guidelines

- All code changes must be reviewed before merging
- At least one approval is required for each pull request
- All CI/CD checks must pass before merging
- Resolve all comments before merging 