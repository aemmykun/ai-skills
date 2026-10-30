---
name: http-json
description: Call an operator-configured HTTPS JSON service; requires configuration.
---

# http-json

Use this skill through the shared adapter, or inspect manifest.json for its input/output contract.

Requires HTTP_JSON_ENDPOINT (HTTPS) and HTTP_JSON_TOKEN. Sends POST JSON with a message string, expects JSON with a reply string. Do not claim success when the adapter returns an error. Endpoint configuration is operator-controlled, never taken from a user task.
