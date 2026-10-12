# Universal Adapter: Second Thought skill

A portable skill specification for adding bounded Second Thought-style auxiliary branches to an agent runtime. It is an adapter/specification, not a drop-in runtime plugin: each host must implement tool lifecycle hooks, parallel model calls, cancellation, parsing, budgeting, and context injection.

## Integration points

1. **Before dispatch:** retain a deterministic pre-execution authorization and policy gate. This is essential because the auxiliary branches start only after the current action is formed.
2. **Action dispatched / wait begins:** create a sanitized, tenant-scoped immutable snapshot and start configured branches asynchronously.
3. **Observation arrives:** cancel outstanding branches; harvest complete thoughts; validate schema and budget; annotate conflicts.
4. **Next model turn:** insert the notes as explicitly untrusted advisory context alongside—not in place of—the observation.
5. **Before the next action:** run normal authorization, policy, state/precondition checks again.

## Adapter API (host implementation)

```ts
export type BranchName = "CHECK" | "RECALL" | "REHEARSE" | "ALTERNATIVE";
export interface BranchInput {
  branch: BranchName;
  turnId: string;
  snapshotId: string;
  task: string;
  constraints: string[];
  evidenceRefs: Array<{ id: string; authority: string; observedAt?: string }>;
  actionSummary: string;
  outputTokenLimit: number;
  deadlineMs: number;
}
export interface AtomicThought {
  branch: BranchName;
  kind: "assumption" | "constraint" | "contingency" | "fallback" | "verification";
  confidence: "low" | "medium" | "high";
  text: string;
  sourceRefs: string[];
  turnId: string;
  snapshotId: string;
}
export interface BranchRunner {
  run(input: BranchInput, signal: AbortSignal): AsyncIterable<string>;
}
export interface Orchestrator {
  runBranches(input: Omit<BranchInput, "branch">[], names: BranchName[],
              observationSignal: AbortSignal): Promise<AtomicThought[]>;
}
```

Host-specific types may differ. Enforce tenant and role access before constructing `BranchInput`; never rely on prompt instructions alone for isolation.

## Reference prompts

Use `prompts/` as role templates. Render only the minimum authorized snapshot; include no secrets. Branch calls are read-only and must not invoke tools.

## Runtime limits (suggested defaults, tune empirically)

- Up to 4 standard branches; allow branch selection based on task eligibility and budget.
- At most 5 harvested thoughts/branch/turn.
- At most 25 words/thought.
- A strict output token budget and deadline per branch; cancellation on tool observation.
- A global context budget that reserves space for the next response.
- Run no branches if the current action is not safely authorized to dispatch.

These are operational defaults, not universal optimal values. Measure cost, wait-window distribution, task success, latency, and useful-harvest rate in the target model/runtime.

## Evaluation

Run baseline and adapter-enabled trials on representative tasks. Report task success, safety/policy violations, turns, main and auxiliary input/output tokens, cache use, total cost, end-to-end latency, harvest rate, stale/irrelevant thought rate, conflict detection/resolution, and human escalation. Stratify by tool-wait duration and risk level. Do not infer causality from a small unpaired sample.

## Provenance

This skill is synthesized from the user's discussion of Second Thought in this chat. It encodes research-inspired roles and interruption-safe harvesting, plus explicit governance, authorization, conflict, context-budget, observability, and adapter-interface recommendations. Those implementation additions should not be represented as features guaranteed by the research paper.
