---
name: create-skill
description: How to author a new agent skill (SKILL.md) that routes correctly and stays useful. Use when asked to create, write, review or restructure a skill, or when deciding whether something should be a skill at all.
---

# Creating a skill

A skill is a directory containing `SKILL.md` plus optional sibling files. Only the frontmatter is always loaded; the body loads when the description matches. Write accordingly.

## 1. Decide if it should be a skill

Create one only if it contains at least one non-negotiable or failure mode an agent would violate without reading it. If it only restates the README or generic knowledge the model already has ("how to use React"), do not create it.

One skill = one concern. Do not merge overlapping scopes: an agent facing two similar skills picks arbitrarily. Partition by purpose (e.g. how to change / how to prove / one specific integration).

## 2. Frontmatter (the routing layer)

```yaml
---
name: kebab-case-name
description: <what it does> — <when to use it>. Use for <trigger phrases>.
---
```

- `name`: kebab-case, identical to the directory name.
- `description`: write the trigger, not an abstract summary. Name concrete verbs, nouns, endpoints, commands. Agents match on this alone.
  - Good: "the initiate/verify-evidence endpoints, permit lifecycle, evidence-verification checklist. Use when wiring a new adapter."
  - Bad: "documentation about adapters" / "use for database work" (over-fires on everything).

## 3. Body content

1. **Lead with invariants an agent would otherwise get wrong.** Not tutorials. Examples of the right shape:
   - "Table X is actor-self scoped, so test queries return nothing without request context."
   - "PENDING admission must commit before adapter retrieval."
   - "A snapshot hash is never a freshness comparator (it includes a transient timestamp)."
2. **Point at code, don't copy it.** Cite paths and commit SHAs (`packages/tool-gateway/ at commit abc1234`). Inlined implementations rot silently. Small snippets (wire shape, required checklist) are fine.
3. **Use status labels, not promises.** Distinguish `IMPLEMENTED` from `PRODUCTION_CONFORMANCE_OPEN`. Never write `COMPLETE` unless the durable/enforcement gates are evidenced.
4. **Include the verification command.** e.g. "Run `npm run test:integration` after `db:test:up`." This turns prose into an executable procedure.
5. **Ordered checklists for procedures, bullets for facts.** Steps are numbered and imperative ("1. Recompute signature. Mismatch: fail closed."). Do not mix "how it works" narration into "what you must do" instructions; agents follow the latter.

## 4. Structure and size

- Keep `SKILL.md` under ~150 lines: routing, invariants, checklist.
- Move long references (migration details, taxonomy tables) to sibling files such as `REFERENCE.md` or `examples/`, and link them from SKILL.md. Context window is the scarce resource.

## 5. Ship it

- Commit skills like code: same commit as the control they describe, one concern per commit, message like `docs: add <name> skill`.
- Untracked skills are lost skills.

## Anti-patterns

- Restating the README (zero marginal value).
- Generic how-to knowledge the model already has.
- Copy-pasted code that drifts (a doc that predates a later migration becomes misleading).
- Vague triggers that over-fire.
- Merging two similar skills, or splitting one concern across several.

## Pre-commit checklist

1. Name matches directory, kebab-case.
2. Description names concrete triggers and says when to use.
3. At least one failure mode or non-negotiable appears near the top.
4. Code is referenced by path + SHA, not pasted.
5. Status labels are honest and a verification command is present.
6. Under ~150 lines; long material moved to sibling files.
7. One concern only; no overlap with existing skills.
