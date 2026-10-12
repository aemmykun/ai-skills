# TenantSage Project Lineage

## Name
`tenantsage-project-lineage`

## Description
Trace, reconcile, and classify TenantSage artifacts across historical, architectural, schema, implementation, deployment, verification, research, and IP lineages. Use this skill to determine what an artifact is, where it came from, what it supersedes or implements, whether similarly named artifacts are actually equivalent, and what claims are justified by available evidence.

This skill is designed to prevent architecture drift, false equivalence, migration-lineage mistakes, unsupported verification claims, and retrospective rewriting of TenantSage history.

---

## Best For

Use this skill when the user asks questions such as:

- "Where did this TenantSage concept originate?"
- "Is this artifact canonical, superseded, legacy, or parallel?"
- "Does this database belong to the canonical TenantSage lineage?"
- "Can migration 025 safely continue from this deployed schema?"
- "Is this S0-S8 concept new or inherited from the patent/retrieval architecture?"
- "What is the lineage from Family-Tenant Governed RAG to the Authority-Native Control Plane?"
- "Which document is the earliest evidence of DAR, EEB, Real-Time Inheritance, Ghost Effect, or governance-before-retrieval?"
- "Does this code implement the frozen architecture, or is it an architectural deviation?"
- "Is this change a conformance repair, compatibility mapping, hardening, feature, or constitutional change?"
- "What evidence supports this public/project/patent claim?"
- "What can we call implemented, verified, deployed, production-eligible, or independently validated?"

---

## Do Not Use

Do not use this skill for:

- ordinary code debugging with no lineage or canonicality question;
- generic RAG or AI-governance explanations unrelated to TenantSage;
- schema design from scratch when no existing TenantSage lineage matters;
- legal conclusions about patent validity, priority, ownership, infringement, or inventorship;
- claims that require external legal-register verification unless those records are actually retrieved;
- deployment approval based only on source files, diagrams, or chat history;
- treating current memory as primary evidence when inspectable artifacts are available.

When the task is implementation-only, route to the relevant coding, database, migration, deployment, formal-verification, or testing skill after lineage is established.

---

# Core Principle

**Lineage is not filename similarity, table-name similarity, migration-number similarity, or chronological proximity.**

TenantSage lineage must be established from evidence showing identity, ordering, semantics, relationships, and verification state.

The skill must distinguish at least these dimensions:

1. **Historical provenance** — when and where an artifact/concept appears.
2. **Canonical relationship** — whether it is canonical, ancestral, superseded, parallel, transitional, or unrelated.
3. **Semantic equivalence** — whether two artifacts mean the same thing.
4. **Implementation relationship** — whether code/schema implements the canonical requirement.
5. **Deployment relationship** — whether the implementation exists in the declared runtime environment.
6. **Verification relationship** — what has actually been proven and at what evidence strength.
7. **Claim boundary** — what can be stated publicly, technically, operationally, or legally without overclaiming.

---

# Canonical Source-of-Truth Hierarchy

Resolve disputes by source class, not by whichever artifact is newest or easiest to access.

Use this order unless an explicitly versioned TenantSage governance rule states otherwise:

1. **Frozen constitutional contracts and explicitly versioned amendments**
2. **Canonical architecture/specification and steering documents**
3. **Versioned migration chain and database constraints**
4. **Runtime code implementing canonical contracts**
5. **Actual deployed database/runtime state and role configuration**
6. **Tests, receipts, attestations, and evidence bundles bound to an exact build/deployment**
7. **Research papers, implementation handbooks, diagrams, tickets, README files, comments, and chat summaries**

Important nuance:

- A lower-level artifact may reveal that an interpretation of a higher-level requirement was wrong.
- A lower-level artifact does **not** silently redefine a higher-level canonical requirement.
- If architecture defines semantics but not exact physical DDL, then the semantic requirement may be canonical while the physical SQL shape remains an implementation decision.

---

# Canonical TenantSage Control Model

Unless superseded by a later frozen constitutional version, use this canonical ordered control chain:

- **S0 — Ingress**: normalize request, verify required ingress inputs, bind request identity.
- **S1 — Authority / DAR**: resolve verified principal, customer boundary, explicit active scope, assignment, and role.
- **S2 — Governance**: apply action, purpose, temporal validity, retention, legal hold, classification, approval, and policy constraints.
- **S3 — Eligible Evidence Boundary (EEB)**: materialize and seal the only evidence universe eligible for retrieval.
- **S4 — Governed Retrieval**: rank or reduce only within the sealed EEB; retrieval may not enlarge eligibility.
- **S5 — Governed Context**: sanitize, minimize, and assemble context only from governed retrieved evidence.
- **S6 — Generation**: generate only from admitted governed context.
- **S7 — Validation**: validate provenance, disclosure, policy, and action constraints.
- **S8 — Execution**: execute only after required approval/validation and emit durable proof.

Core invariants include:

- No valid authority -> no retrieval.
- No valid governance state -> no EEB.
- No sealed/fresh EEB -> no retrieval.
- Retrieval may reduce or rank eligible evidence but may not enlarge it.
- No governed evidence -> no generation.
- No approval/validation -> no execution.
- Ambiguity fails closed.
- Customer isolation is distinct from internal AuthorityScope hierarchy.
- Source records are authoritative for evidence eligibility; derived chunks do not independently expand permissions.
- Missing, stale, malformed, contradictory, or unverifiable artifacts fail closed.

---

# Known Architectural Lineage Pattern

Use the following as a **navigation model**, not as proof by itself. Every material claim still requires artifact evidence.

```text
NOV 2025
Hospitality / knowledge / multi-tenant product lineage
        |
        v
FEB 2026
TenantSage IP + governed-retrieval architecture
        |
        |-- parent-authoritative inheritance
        |-- legal-hold enforcement
        |-- role/scope constraints
        |-- controlled override
        `-- governance-before-similarity
        |
        v
MAR 2026
Governor / Governance Gateway / AI Plane
        |
        v
APR-JUN 2026
Governance-first RAG / infrastructure / formalisation / PostgreSQL
        |
        v
JUN-JUL 2026
DAR + EEB / governance-plane separation
        |
        v
JUL-AUG 2026
Authority-Native Control Plane
        |
        v
SEP 2026
Canonical executable S0-S8
```

Do not convert this navigation model into a legal priority claim without primary evidence.

---

# Required Operating Procedure

## Step 1 — Parse the Lineage Question

Classify the user's request into one or more of these question types:

- concept origin;
- artifact provenance;
- canonicality;
- supersession;
- schema/migration lineage;
- architecture-to-code traceability;
- deployment lineage;
- verification status;
- patent/research lineage;
- public-claim substantiation;
- change classification.

State internally what must be proven before answering.

---

## Step 2 — Identify the Target Artifact(s)

For each target, capture as many of these as available:

- title/name;
- path/location;
- file ID or repository path;
- version;
- created/modified timestamp;
- commit SHA;
- branch/tag;
- migration ID;
- database project/branch;
- schema/table/function names;
- document revision identifier;
- deployment/environment identifier;
- related evidence-bundle ID.

Never infer identity from filename alone when exact IDs are available.

---

## Step 3 — Retrieve Primary Evidence First

Prefer contemporaneous primary artifacts:

- frozen specs/contracts;
- original design documents;
- revision history;
- source commits;
- migrations;
- database definitions;
- formal specs;
- deployment manifests;
- CI/attestation evidence;
- exact test output;
- patent/research originals;
- signed/hash-bound receipts.

Use retrospective summaries only as navigation aids or corroboration.

If evidence is missing, say what is missing. Do not promote memory, chat summaries, or later documents into primary evidence.

---

## Step 4 — Build an Artifact Ledger

Create a normalized ledger before drawing conclusions.

Recommended fields:

```yaml
artifact_id: stable identifier
name: human-readable title
artifact_type: contract | architecture | patent | paper | code | migration | db_state | test | evidence_bundle | deployment | note
created_at: exact timestamp if known
modified_at: exact timestamp if material
version: version string if present
commit_sha: exact SHA if applicable
source_location: repository/path/file ID
status: draft | frozen | canonical | superseded | deployed | verified | unknown
predecessors: []
successors: []
implements: []
supersedes: []
superseded_by: []
semantic_scope: what the artifact actually defines
evidence_strength: HIGH | MEDIUM | LOW
limitations: []
```

Do not collapse multiple revisions into one artifact when revision timing matters.

---

## Step 5 — Establish Historical Provenance

Determine:

- earliest located evidence;
- earliest high-confidence evidence;
- later consolidations/formalisations;
- public corroboration;
- implementation generations;
- possible parallel or abandoned branches.

Use careful wording:

- **earliest located** = earliest artifact found in the searched corpus;
- **earliest proven** = earliest artifact supported by strong primary evidence;
- **origin** should be reserved for cases where evidence actually supports that conclusion;
- never claim legal priority from project chronology alone.

---

## Step 6 — Determine Canonical Relationship

Classify each artifact using one of these canonical relationships:

- **CANONICAL** — currently authoritative for the relevant requirement.
- **ANCESTOR** — earlier artifact whose semantics materially survive in the canonical design.
- **SUPERSEDED** — formerly authoritative but replaced by a later canonical artifact.
- **TRANSITIONAL** — bridge implementation/specification used during architectural migration.
- **PARALLEL** — related but separate lineage; cannot be treated as canonical continuation without mapping.
- **LEGACY** — historical deployed/product lineage not automatically compatible with the canonical chain.
- **IMPLEMENTATION_OF** — code/schema realization of a canonical concept.
- **EVIDENCE_FOR** — test/receipt/attestation proving a specific claim.
- **UNRELATED** — insufficient semantic or historical continuity.
- **UNKNOWN** — evidence is insufficient.

Never force a relationship when UNKNOWN is the correct result.

---

## Step 7 — Test Semantic Equivalence

Two artifacts are not equivalent merely because they share a name.

For database/schema lineage, compare at minimum:

- migration ledger identity and ordering;
- checksums if available;
- columns and data types;
- primary keys;
- foreign keys;
- indexes relevant to semantics;
- ownership;
- RLS state;
- FORCE RLS state;
- policy definitions;
- trigger definitions;
- installed extensions if relevant;
- runtime role ownership;
- BYPASSRLS state;
- temporal behavior;
- status/lifecycle semantics;
- canonical vocabulary mapping.

For code/spec equivalence, compare:

- inputs;
- outputs;
- invariants;
- ordering constraints;
- failure behavior;
- authority source;
- trust boundary;
- mutable vs immutable state;
- receipt/proof obligations;
- bypass paths.

Use this rule:

```text
same name != same schema
same schema != same semantics
same semantics != same lineage
same migration number != same migration history
same behavior in one test != canonical conformance
```

---

## Step 8 — Classify Proposed Changes

Every proposed TenantSage change must be assigned exactly one primary classification before implementation:

### CONFORMANCE REPAIR
Restores an already-defined canonical requirement that is missing, lost, or incorrectly implemented.

Example:
Durable EEB persistence is required by the frozen architecture, but the repository lineage lacks physical persistence.

### COMPATIBILITY MAPPING
Preserves canonical semantics over legacy/transitional physical structures.

Example:
Mapping canonical `activeScopeId` to an older physical scope table after semantic equivalence is explicitly proven.

### HARDENING
Strengthens enforcement without changing canonical semantics.

Examples:
Negative tests, additional role checks, stricter immutability enforcement.

### FEATURE
Adds behavior not required by the frozen architecture.

### CONSTITUTIONAL CHANGE
Changes a canonical invariant, lifecycle, vocabulary, source of authority, control ordering, or trust boundary.

Constitutional changes require explicit design approval/versioning and must never arrive accidentally through a migration or bug fix.

---

## Step 9 — Apply Fail-Closed Lineage Rules

Stop and classify as unresolved/conflicting when any of the following occurs:

- deployed migration ledger does not match repository migration history;
- an expected predecessor artifact cannot be identified;
- a table/object exists with conflicting semantics;
- a canonical concept is being inferred only from a legacy name;
- the runtime role differs from the role used in tests;
- exact commit/deployment identity is missing for a verification claim;
- the artifact is stale, unsigned, malformed, or contradicts higher-authority material;
- a supposedly canonical migration depends on manual production patches not represented in the repository lineage;
- evidence from different branches/environments is being mixed into a single claim.

Do not "continue from the nearest migration number."
Do not use `IF NOT EXISTS` or equivalent convenience behavior to conceal constitutional schema conflicts.

---

# Database Lineage Procedure

When a task concerns Neon/PostgreSQL/schema/migrations, collect this minimum evidence before recommending migration continuation:

```yaml
database_project: required
branch_or_environment: required
database_name: required
schema: required
migration_ledger_table: required
ordered_migration_ids: required
migration_checksums: preferred
tables: required
referenced_table_definitions: required
rls_state: required
force_rls_state: required
runtime_role: required
runtime_role_owner_status: required
runtime_role_bypassrls: required
relevant_policies: required
relevant_triggers: required
relevant_extensions: when applicable
repository_sha: required
```

If the deployed ledger does not match the canonical chain, classify it as a separate lineage until proven otherwise.

Recommended default topology when legacy and canonical lineages diverge:

```text
LEGACY DEPLOYMENT
Historical product/database lineage
Preserved independently
No automatic canonical continuation

          !=

CANONICAL TENANTSAGE DEPLOYMENT
Fresh deployment identity
Apply canonical migrations from 001 onward
Verify hosted/runtime behavior before promotion
```

---

# Research, Patent, and IP Lineage Rules

This skill may reconstruct technical and documentary lineage, but must distinguish technical evidence from legal conclusions.

Allowed outputs:

- earliest located artifact;
- earliest high-confidence private artifact;
- public corroboration date;
- concept continuity;
- relationship between patent-era retrieval concepts and later S0-S8 architecture;
- implementation generations;
- evidence strength and gaps.

Do not independently conclude:

- patent validity;
- inventorship;
- ownership;
- priority date;
- infringement;
- enforceability;
- novelty as a legal conclusion.

When public patent metadata matters, distinguish:

```text
publication date
!=
filing date
!=
priority date
!=
invention date
```

Use legal-register records for legal metadata when available.

---

# Verification and Status Vocabulary

Never collapse design, implementation, deployment, and verification into one status.

Use the strongest justified status only.

Recommended statuses:

- `SPECIFIED`
- `IMPLEMENTED_AT_<SHA>`
- `LOCAL_VERIFIED_AT_<SHA>`
- `HOSTED_VERIFIED_AT_<SHA>`
- `DEPLOYED_AT_<SHA>`
- `PRODUCTION_ELIGIBLE_AT_<SHA>`
- `INDEPENDENTLY_VALIDATED` only when independent evidence genuinely exists

TenantSage-specific examples may include:

- `LEGACY_NEON_LINEAGE_CONFIRMED`
- `CANONICAL_NEON_DEPLOYMENT_NOT_ESTABLISHED`
- `CANONICAL_MIGRATION_CHAIN_LOCAL_VERIFIED_AT_<SHA>`
- `CANONICAL_NEON_TEST_DEPLOYMENT_VERIFIED_AT_<SHA>`
- `DURABLE_EEB_PERSISTENCE_IMPLEMENTED_AT_<SHA>`
- `DURABLE_EEB_RUNTIME_VERIFIED_AT_<SHA>`
- `PRODUCTION_ELIGIBLE_AT_<SHA>`

Rule:

**Never use VERIFIED when only source code, a migration file, or a diagram exists.**

---

# Four-Dimensional Lineage Result

Every substantive lineage conclusion should emit these four independent dimensions:

```yaml
lineage_result:
  historical_provenance:
    status: PROVEN | PARTIAL | UNKNOWN
    evidence: []

  canonical_relationship:
    status: CANONICAL | ANCESTOR | SUPERSEDED | TRANSITIONAL | PARALLEL | LEGACY | UNRELATED | UNKNOWN
    basis: []

  implementation_state:
    status: NOT_IMPLEMENTED | SPECIFIED | IMPLEMENTED | DEPLOYED | UNKNOWN
    exact_sha_or_version: null

  verification_state:
    status: UNVERIFIED | LOCAL_VERIFIED | HOSTED_VERIFIED | INDEPENDENTLY_VERIFIED | UNKNOWN
    evidence_bundle: null
```

Optional fifth dimension:

```yaml
claim_boundary:
  safe_public_claim: "..."
  unsafe_or_unproven_claims: []
```

---

# Confidence Model

Use evidence strength, not intuition.

### HIGH
Primary artifact with reliable timestamp, revision, commit, migration identity, or direct runtime evidence.

### MEDIUM
Credible evidence exists, but one or more material provenance details are incomplete; or evidence is retrospective rather than contemporaneous.

### LOW
Inference from summaries, naming, memory, indirect references, or incomplete chronology.

Do not convert LOW-confidence inference into canonical fact.

---

# Output Format

For substantial lineage work, produce sections in this order:

## 1. Question Being Resolved
State exactly what lineage/canonicality decision is being made.

## 2. Evidence Examined
List primary artifacts first, then corroborating artifacts.

## 3. Lineage Reconstruction
Show chronology and predecessor/successor relationships.

## 4. Canonical Mapping
Map historical concepts to current TenantSage architecture where justified.

## 5. Conflicts / Divergence
Identify schema, semantic, architectural, branch, or deployment conflicts.

## 6. Change Classification
If a modification is proposed, label it as conformance repair, compatibility mapping, hardening, feature, or constitutional change.

## 7. Four-Dimensional Lineage Result
Return historical provenance, canonical relationship, implementation state, and verification state separately.

## 8. Operator Decision
Give the action that follows from evidence.

## 9. Evidence Required Next
List only evidence still needed to promote the decision or status.

## 10. Claim Boundary
State what can safely be claimed and what remains unproven.

---

# Example — Canonical vs Legacy Neon Lineage

### User Prompt

> We found an older TenantSage Neon database containing `families`, `children`, `user_assignments`, `rag_sources`, and retrieval-related tables. Migration 025 adds durable EEB persistence. Can we continue the canonical migration chain against this database, or does it belong to a different TenantSage lineage?

### Correct Skill Behavior

1. Retrieve the canonical migration chain and deployed migration ledger.
2. Compare ordering and checksums.
3. Compare referenced table shapes and semantics.
4. Verify ownership, RLS, FORCE RLS, policies, triggers, runtime role, and BYPASSRLS.
5. Do not infer equivalence from names.
6. If the migration ledger diverges, classify the deployed database as a separate/legacy lineage.
7. Determine whether migration 025 restores an already-defined EEB requirement.
8. If yes, classify 025 as a `CONFORMANCE REPAIR`, not a new architectural invention.
9. Prefer a fresh canonical deployment identity initialized from migration 001 when the legacy lineage cannot be proven equivalent.
10. Require hosted runtime-role verification before granting VERIFIED or PRODUCTION_ELIGIBLE status.

### Example Decision

```text
DECISION
Do not apply canonical migration 025 directly to the historical database merely because similarly named objects exist.

Reason:
Migration/schema-name similarity does not establish lineage or semantic equivalence.

Canonical action:
- preserve legacy lineage independently;
- establish a fresh canonical TenantSage target;
- apply the full canonical chain from 001;
- verify the actual restricted runtime role;
- verify RLS/FORCE RLS, EEB lifecycle, receipt ordering, and bypass resistance;
- bind evidence to an exact SHA;
- promote status only to the level proven.
```

---

# Example — Patent / Architecture Lineage

### User Prompt

> Did S0-S8 replace the original TenantSage patent architecture, or is it a continuation of it?

### Correct Skill Behavior

Trace primary artifacts chronologically and compare technical semantics.

A justified result may show continuity such as:

```text
Earlier governed-retrieval concept      Current canonical concept
-----------------------------------------------------------------
verified identity/scope                  S0 / S1
parent-authoritative access              S1 DAR
legal/role/temporal governance           S2
Governance-Approved Set                  S3 EEB
filter-before-rank                       S4 Governed Retrieval
```

Then distinguish later extensions:

```text
S5 Governed Context
S6 Generation
S7 Validation
S8 Execution
```

Conclusion wording should be evidence-bound, for example:

> The available technical lineage supports S0-S8 as an expansion and formalisation of the earlier governed-retrieval architecture rather than an unrelated replacement. The earlier protected retrieval concepts remain materially visible in S1-S4, while S5-S8 extend governance downstream. This is a technical-lineage conclusion, not a legal patent-scope determination.

---

# Anti-Patterns

Never:

- infer deployed schema from repository files;
- infer repository lineage from table names;
- infer canonicality from recency alone;
- infer legal priority from project chronology alone;
- treat a wire contract as physical DDL;
- treat a nullable FK as proof of a conceptual relationship;
- create authoritative chunk permissions when source inheritance is canonical;
- trust caller-supplied EEB membership;
- rely on application-side filtering after unrestricted retrieval;
- use owner/superuser tests as proof that runtime RLS works;
- call self-authored tests "independent validation";
- merge evidence from different SHAs/environments into one status claim;
- let an implementation convenience silently redefine architecture;
- call a system verified because the code exists;
- claim an exact historical phrase was found when only equivalent intent was located;
- rewrite predecessor artifacts to match current terminology.

---

# Escalation / Routing

After lineage is established, route the next task according to the result:

- schema mismatch -> database/migration analysis;
- runtime mismatch -> implementation/conformance remediation;
- missing tests -> test-driven development / conformance testing;
- missing hosted proof -> deployment verification;
- architecture conflict -> constitutional review before coding;
- formal invariant question -> Alloy/TLA+/formal verification workflow;
- public/research claim -> evidence packaging and claim-boundary review;
- patent/legal question -> legal professional / authoritative patent register for legal conclusions.

Do not implement a constitutional change merely because the user asked to "fix the code" if the fix would alter a frozen invariant.

---

# Definition of Done

A lineage analysis is complete only when:

- the target artifact(s) are unambiguously identified;
- primary evidence has been preferred over summaries;
- chronology is separated from legal priority;
- canonical relationship is classified;
- semantic equivalence is tested rather than assumed;
- implementation and deployment state are separated;
- verification status is evidence-bound;
- conflicts and unknowns are explicit;
- proposed changes are classified;
- operator action follows from evidence;
- the final claim does not exceed the evidence.

---

# Short Operator Checklist

```text
IDENTIFY
  -> What exact artifact/environment/version?

RETRIEVE
  -> What primary evidence exists?

TRACE
  -> What came before and after it?

COMPARE
  -> Same name, or actually same semantics?

CLASSIFY
  -> Canonical, ancestor, superseded, parallel, legacy, unknown?

CHANGE TYPE
  -> Repair, mapping, hardening, feature, constitutional change?

VERIFY
  -> Implemented, deployed, locally verified, hosted verified?

BIND
  -> Exact SHA/version/environment/evidence bundle?

DECIDE
  -> Continue, isolate, repair, remap, reject, or escalate?

CLAIM
  -> What can safely be said without overclaiming?
```

---

## Skill Philosophy

TenantSage project history is itself governed evidence.

The purpose of this skill is not to produce a persuasive timeline. Its purpose is to make **artifact identity, authority, ancestry, equivalence, implementation, and proof independently inspectable** so that neither humans nor AI agents can silently rewrite the architecture through convenience, memory, naming collisions, or incomplete evidence.
