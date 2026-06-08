# EcoGuard GitHub Workflow

## Branch Strategy

main
↓
develop
↓
feature branches

Feature branches:

- feature/tracker
- feature/carbon
- feature/privacy
- feature/ai-dashboard

---

## Rules

1. Never push directly to main.

2. Never merge your own pull request.

3. Work only on your assigned feature branch.

4. Create a pull request into develop.

5. Project Lead reviews and approves.

6. After testing, develop is merged into main.

---

## Commit Naming Convention

Feature:

feat: add carbon calculator

Bug Fix:

fix: correct privacy score logic

Documentation:

docs: update architecture

Testing:

test: add tracker tests

Refactor:

refactor: simplify dashboard rendering

---

## Pull Request Process

Feature Branch
↓
Pull Request
↓
develop
↓
Testing
↓
main

---

## Team Ownership

Tracker Developer:
feature/tracker

Carbon Developer:
feature/carbon

Privacy Developer:
feature/privacy

AI Developer:
feature/ai-dashboard

Project Lead:
develop
main
