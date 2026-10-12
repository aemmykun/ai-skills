# Tool: Housekeeping Operations

## Tool ID

`housekeeping-tool-v1`

## Version

1.0

## Status

Active

## Purpose

Provide the Housekeeping Agent and Housekeeping Manager AI with access to room tasks, cleaning workflows, staff assignments, room-status updates, supply requests, and housekeeping performance data.

## Connected Systems

- Housekeeping mobile application
- Housekeeping management portal
- Room-status service
- Task allocation service
- Quality-inspection service
- Linen and amenity management system
- PMS room-status integration

## Data Scope

The tool may access only rooms, tasks, staff, and performance data permitted for the requesting user’s property, department, role, and assignment scope.

| Data domain | Examples |
| --- | --- |
| Room tasks | Room number, task type, priority, status, assigned attendant |
| Room context | Room type, floor, departure time, arrival time, special requests |
| Staff context | Assigned attendant, availability, skills, workload |
| Cleaning data | Start time, completion time, checklist completion, inspection result |
| Supplies | Linen, towels, amenities, chemicals, minibar items |
| Performance | Rooms cleaned, turnaround time, rework rate, quality pass rate |

## Available Operations

### Read Operations

| Operation | Description | Permission |
| --- | --- | --- |
| `get_assigned_tasks` | Retrieve tasks assigned to the requesting Housekeeping Agent | Housekeeping Agent |
| `get_room_task` | Retrieve details for an authorised room task | Housekeeping Agent, Supervisor, Manager |
| `get_room_queue` | Retrieve prioritised cleaning queue | Supervisor, Manager |
| `get_staff_workload` | Retrieve workload and availability for authorised staff | Supervisor, Manager |
| `get_cleaning_history` | Retrieve historical cleaning duration and quality data | Supervisor, Manager |
| `get_quality_inspections` | Retrieve inspection results | Supervisor, Manager |
| `get_supply_usage` | Retrieve linen, amenity, and chemical consumption | Supervisor, Manager |
| `get_housekeeping_kpis` | Retrieve turnaround time, rooms per attendant, and quality metrics | Supervisor, Manager |

### Write Operations

| Operation | Description | Approval requirement |
| --- | --- | --- |
| `start_room_task` | Mark an assigned room task as started | Assigned Housekeeping Agent |
| `complete_room_task` | Mark an assigned room task as completed | Assigned Housekeeping Agent |
| `update_room_status` | Update room status through approved workflow | Assigned Agent or Supervisor |
| `report_maintenance_issue` | Create a maintenance report | Housekeeping Agent, Supervisor, Manager |
| `request_supplies` | Create a supply request | Housekeeping Agent, Supervisor, Manager |
| `assign_task` | Assign a room task to an available attendant | Supervisor / Manager |
| `reassign_task` | Move a task from one attendant to another | Supervisor / Manager |
| `approve_room_ready` | Approve a room as ready after required checks | Supervisor / Manager |

## Task Model

Each housekeeping task must include:

```text
task_id
property_id
room_id
room_type
task_type
priority
status
assigned_attendant_id
required_by_time
special_instructions
checklist_template_id
created_at
updated_at
```

## Task Types

| Task type | Description |
| --- | --- |
| `DEPARTURE_CLEAN` | Full turnover clean after guest departure |
| `STAYOVER_CLEAN` | Refresh clean for a continuing guest |
| `DEEP_CLEAN` | Scheduled or corrective deep clean |
| `INSPECTION` | Quality inspection before room readiness |
| `MAINTENANCE_CHECK` | Room check related to a maintenance issue |
| `AMENITY_DELIVERY` | Delivery of requested guest amenities |
| `MINIBAR_REFILL` | Minibar check or refill |
| `TRAY_COLLECTION` | Collection of a room-service tray |
| `TURN_DOWN_SERVICE` | Evening turn-down service |

## Task Status Model

| Status | Meaning |
| --- | --- |
| `PENDING` | Task created but not started |
| `ASSIGNED` | Task allocated to an attendant |
| `IN_PROGRESS` | Task started |
| `BLOCKED` | Task cannot proceed due to supplies, access, maintenance, or another dependency |
| `COMPLETED` | Task finished |
| `CANCELLED` | Task no longer required |
| `FAILED_INSPECTION` | Task completed but did not pass quality inspection |

## Validation Rules

The tool must reject or escalate when:

- An agent attempts to access a room or task not assigned to them.
- A task is completed without required checklist items.
- A room is marked ready without inspection where inspection is mandatory.
- A task is assigned to an unavailable or unqualified attendant.
- A room-status transition is invalid.
- Required approval is missing.
- The action cannot be recorded in the audit trail.

## Audit Requirements

For every write operation, retain:

- Requesting user and role
- Property, room, and task identifier
- Previous and new task or room status
- Assigned attendant
- Checklist evidence
- Photographs or notes, where applicable
- Approval record
- Idempotency key
- System response or receipt
- Timestamp
- Failure reason, if applicable

## Failure Behaviour

Example:

```text
Unable to complete Room 412 departure clean.

Reason:
Required checklist item “Bathroom sanitation” has not been completed.

Required next step:
Complete the outstanding checklist item or escalate to the Housekeeping Supervisor.
```

## Security Rules

- Housekeeping Agents may view only their assigned tasks unless explicitly authorised otherwise.
- Employee location data may be used only for operational dispatch and must be governed by a clear workplace policy.
- Guest data must be limited to the minimum required to complete the assigned task.
- Performance data must not be used as the sole basis for disciplinary action.
- All task and status changes must be attributable to an authenticated user or approved system action.
