# AI Skills — shared adapter, independent skills

This repository exposes independent skills through one root adapter. An AI host can
discover skill contracts and invoke a selected skill using a local CLI, JavaScript,
or an authenticated loopback HTTP API.

```text
AI host / application
          |
       adapter/  <-- skills.json
          |
          +-- instruction skill --> guidance for the calling AI
          +-- module skill ------> independent JavaScript handler
          +-- HTTP skill --------> configured HTTPS service
```

The adapter does not select a model, run an LLM, or automatically connect itself to
ChatGPT/Codex. The AI host must have shell access or an HTTP tool configured for this
API. Skill instructions are task data to the host and do not override its policies.

## Quick start

Requires Node.js 24+ and npm. From this repository:

```sh
npm ci
npm run validate
npm test
npm run skills -- list
npm run skills -- describe text-statistics
npm run skills -- invoke text-statistics examples/text-input.json
npm run skills -- invoke json-format examples/json-input.json
npm run skills -- invoke housekeeping-agent-skill-v1 examples/task-input.json
```

`text-statistics` returns character (Unicode code point), whitespace-delimited word,
and line counts. `json-format` returns formatted JSON. These modules share no code
or state with one another. Their input/output schemas live in their manifests.

Instruction skills return `status: "instructions_ready"`, not an execution claim.
The calling AI applies the returned guidance to the supplied task within its own
authorization and tool boundaries. Hotel/PMS integrations are not implemented.

## HTTP API

Set `SKILLS_ADAPTER_TOKEN` to a securely generated credential of at least 32
characters, then run `npm start`. Do not commit or print credentials. The server
binds **127.0.0.1:8787**; `PORT` can select another local port. The CLI uses the
current OS user's authority and does not need this server credential.

Every route requires `Authorization: Bearer <SKILLS_ADAPTER_TOKEN>`:

| Method | Route | Result |
|---|---|---|
| GET | `/health` | Process health (not upstream-provider health) |
| GET | `/v1/skills` | IDs, versions, modes, descriptions, input/output JSON Schemas |
| GET | `/v1/skills/{id}` | One skill contract |
| POST | `/v1/skills/{id}/invoke` | Validated invocation; body is the skill input JSON |

Example using an already-configured environment credential:

```js
const response = await fetch('http://127.0.0.1:8787/v1/skills/text-statistics/invoke', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SKILLS_ADAPTER_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ text: 'Hello world' })
});
const result = await response.json();
if (!response.ok) throw new Error(result.error.code);
console.log(result);
```

```json
{
  "skill": "text-statistics",
  "version": "1.0.0",
  "mode": "module",
  "status": "completed",
  "output": { "characters": 11, "words": 2, "lines": 1 }
}
```

Failures use `{ "error": { "code": "...", "message": "..." } }`. Codes include
`UNAUTHORIZED` (401), `SKILL_NOT_FOUND` (404), `INVALID_INPUT` (422),
`SKILL_NOT_CONFIGURED` (503), `UPSTREAM_ERROR` and `INVALID_OUTPUT` (502).
Bodies and invocation responses are capped at 1 MiB. API responses are not cached.
Browser-origin requests are rejected; no CORS access is provided.

## Configure an API-backed skill

The `http-json` skill demonstrates the HTTP contract. Set `HTTP_JSON_ENDPOINT` to
an operator-approved **HTTPS** endpoint and `HTTP_JSON_TOKEN` to its bearer
credential. It posts `{ "message": "..." }` and expects `{ "reply": "..." }`.
Missing configuration fails closed. It is a generic connector example, not a
connection to an existing hotel system. No external provider is enabled by default.

Endpoint and credential environment-variable names are declared in the skill's
manifest. Caller input cannot select the destination URL, headers, or HTTP method.
Redirects and embedded URL credentials are refused. Timeout includes response-body
reading. Errors do not expose upstream response bodies or credentials. Response
JSON must satisfy the skill's output schema.

Operator-configured endpoints are trusted configuration. Do not map untrusted user
input into environment variables. Use network egress controls when needed; this is
not a sandbox or a general SSRF filtering proxy.

## Add an independent skill

1. Create `skills/my-skill/SKILL.md` with a name, description and usage instructions.
2. Add `manifest.json` with `id`, `version`, `description`, `mode`, `instructions`,
   `inputSchema` and `outputSchema` (JSON Schema draft-07 supported by Ajv).
3. For `module`, add `handler` pointing to a file exporting `async run(input)` or
   `run(input)`. For `http`, add `http.endpointEnv`, `http.tokenEnv`, `http.timeoutMs`.
   For `instructions`, neither handler nor HTTP configuration is permitted.
4. Add its manifest path to root `skills.json`, then run validation and tests.

Restart the adapter after changing the registry. IDs must be unique. Instruction
and handler paths must resolve inside the skill directory, including symlink
resolution. Register only trusted code and schemas; local handlers run with the
adapter process's OS privileges and are not isolated from other process state.
No caller-supplied module, file path, or executable command is accepted.

Each skill can also be distributed independently with its manifest and files. A
receiving host can register only that skill. No sibling skill is required by the
provided examples. A malformed registered skill prevents startup so registration
errors are visible; this adapter does not provide per-skill process isolation.

## Existing skills and provenance

The original `CreateSkill.skill` and six hotel `.skill` archives remain unchanged.
Their `SKILL.md` contents are extracted byte-for-byte into the corresponding new
`skills/` directories for adapter loading. These directories become the adapter's
maintained sources; changing an archive does not silently update the extracted
skill. Publish a new version deliberately if either distribution changes.

The existing `universal-adaptor-second-thought` directory is registered in place.
Despite its historical name, it supplies advisory instructions, not this executable
router or automatic parallel agents. Its source content is preserved.

## Trust and limits

The server token grants access to **all registered skills**. It is intended for a
single trusted local operator, not multiple tenants. The host must authorize the
task and any external side effects before invoking a skill. The adapter does not
implement per-user RBAC, approval workflows, durable audit storage, model calls,
automatic retries, or background agent orchestration. Trusted local modules have
no enforced execution deadline; use a separate process/container for untrusted or
long-running code. Keep the service on loopback. Remote hosting requires TLS,
identity controls, authorization and deployment-specific hardening.

Tests cover actual loopback API requests, schema and path boundaries, module
execution, guidance delivery and mocked outbound HTTP success/failure. They do not
establish live-provider compatibility or production readiness.
