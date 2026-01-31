# Git Conventions

## Branch Naming

| Branch Type | Pattern           | Example                   |
| ----------- | ----------------- | ------------------------- |
| Main        | `main`            | `main`                    |
| Feature     | `feature/<name>`  | `feature/dark-mode`       |
| Bugfix      | `fix/<name>`      | `fix/navbar-responsive`   |
| Hotfix      | `hotfix/<name>`   | `hotfix/contact-form`     |
| Refactor    | `refactor/<name>` | `refactor/skills-section` |

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>
```

### Types

| Type       | Description                |
| ---------- | -------------------------- |
| `feat`     | New feature                |
| `fix`      | Bug fix                    |
| `docs`     | Documentation only         |
| `style`    | Formatting, no code change |
| `refactor` | Code refactoring           |
| `perf`     | Performance improvement    |
| `test`     | Adding tests               |
| `chore`    | Maintenance tasks          |

### Examples

```bash
feat(hero): add animated background
fix(contact): resolve form validation error
docs(readme): update getting started guide
style(global): format css files
refactor(skills): extract skill card component
chore(deps): update next.js to v15.4
```

---

## Workflow

### 1. Create a New Branch

```bash
# From main branch
git checkout main
git pull origin main
git checkout -b feature/<name>
```

### 2. Make Changes & Commit

```bash
git add .
git commit -m "feat(section): description"
```

### 3. Push to Remote

```bash
git push origin feature/<name>
```

### 4. Create Pull Request

- Open PR on GitHub
- Add description of changes
- Request review (if applicable)

### 5. Merge to Main

```bash
# After PR approved
git checkout main
git pull origin main
git merge feature/<name>
git push origin main

# Delete feature branch
git branch -d feature/<name>
git push origin --delete feature/<name>
```

---

## Quick Commands

```bash
# Check current branch
git branch

# View commit history
git log --oneline -10

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Stash changes
git stash
git stash pop

# Sync with main
git checkout main
git pull origin main
git checkout <your-branch>
git merge main
```
