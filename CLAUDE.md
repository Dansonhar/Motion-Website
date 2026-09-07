# CLAUDE.md

Project instructions for this folder. Add new sections below; do not remove
existing ones.

## Progress Reporting Rule

For EVERY task or prompt given in this project, show visible progress while
working.

Use progress increments of exactly 10%:

`10% → 20% → 30% → 40% → 50% → 60% → 70% → 80% → 90% → 100%`

### Required behavior

- At the start of every task, show: `Progress: 10%`
- Continue updating the progress as meaningful parts of the task are completed.
- Do not jump directly from 10% to 100% for coding tasks.
- Keep each progress update short.
- Include a very short description of what was completed.

Example:

`Progress: 10% — Reviewing the current implementation.`

`Progress: 20% — Identified the affected components and data flow.`

`Progress: 30% — Implementing the main change.`

Continue until:

`Progress: 100% — Implementation completed and verified.`

### Important rules

1. This applies automatically to every future prompt in this folder.
2. The user should NOT need to ask for progress to be shown.
3. For code changes, inspect the existing implementation before modifying
   anything.
4. Do not mark 100% until the requested work is actually completed.
5. If tests or verification are relevant, they must happen before 100%.
6. If something blocks completion, clearly state the blocker and do NOT falsely
   report 100%.
7. Do not use fake progress based on time. Progress must represent actual
   completed work.
8. Keep progress messages concise so they do not clutter the conversation.
9. Preserve this rule when updating `CLAUDE.md` in the future.
10. This rule applies regardless of whether the prompt is a bug fix, feature, UI
    change, refactor, investigation, or configuration change.
