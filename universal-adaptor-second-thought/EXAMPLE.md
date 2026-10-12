# Example

Scenario: An agent has dispatched a test run after proposing a code patch.

```xml
<thought branch="CHECK" confidence="medium" kind="assumption|verification">
The plan assumes this command covers the changed module; verify the test configuration before interpreting a pass.
</thought>
<thought branch="RECALL" confidence="high" kind="constraint">
Earlier requirement preserves the public API; review the diff for signature changes. Source: turn-12.
</thought>
<thought branch="REHEARSE" confidence="medium" kind="contingency">
If tests fail, inspect the first relevant assertion and stack trace before changing more code.
</thought>
<thought branch="ALTERNATIVE" confidence="low" kind="fallback">
If the compatibility test fails, consider an adapter wrapper while retaining the old interface.
</thought>
```

These notes are hypotheses/advice, not evidence. The next turn checks the actual test observation and source code, then proceeds through the normal policy gate.
