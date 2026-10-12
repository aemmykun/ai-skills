# Tool: Maintenance and Engineering

## Tool ID

`maintenance-tool-v1`

## Version

1.0

## Status

Active

## Purpose

Provide the Hotel Operations AI Assistant with authorised access to maintenance requests, work orders, asset history, equipment status, and preventative-maintenance workflows.

## Connected Systems

- Engineering or maintenance management system
- Asset-management system
- IoT equipment-monitoring platform
- Housekeeping mobile application
- PMS room-status integration
- Supplier or contractor management system

## Data Scope

The tool may access only work orders, assets, rooms, and equipment data permitted for the requesting user’s property, department, and role.

| Data domain | Examples |
| --- | --- |
| Work orders | Work-order number, room, asset, issue, priority, status, assignee |
| Assets | Asset ID, type, location, installation date, service history |
| Rooms | Room number, floor, room type, operational status |
| Equipment | HVAC, lighting, locks, plumbing, appliances, elevators, kitchen equipment |
| IoT signals | Temperature, humidity, energy use, equipment alerts |
| Contractors | Contractor name, trade, availability, work-order history |

## Available Operations

### Read Operations

| Operation | Description | Permission |
| --- | --- | --- |
| `get_work_orders` | Retrieve work orders within authorised scope | Housekeeping, Front Office, Engineering, Manager |
| `get_work_order` | Retrieve details for an authorised work order | Authorised operational roles |
| `get_asset_history` | Retrieve service and defect history for an asset | Engineering, Supervisor, Manager |
| `get_room_issues` | Retrieve open maintenance issues for a room | Housekeeping, Front Office, Engineering, Manager |
| `get_equipment_alerts` | Retrieve IoT or equipment alerts | Engineering, Supervisor, Manager |
| `get_preventative_maintenance_schedule` | Retrieve scheduled maintenance activities | Engineering, Manager |
| `get_contractor_availability` | Retrieve approved contractor availability | Engineering, Manager |

### Write Operations

| Operation | Description | Approval requirement |
| --- | --- | --- |
| `create_maintenance_request` | Create a maintenance request or defect report | Housekeeping, Front Office, F&B, Engineering |
| `create_work_order` | Create a work order | Supervisor / Engineering approval |
| `assign_work_order` | Assign a work order to engineering staff or contractor | Engineering Supervisor / Manager |
| `update_work_order_status` | Update work-order progress or completion | Assigned Engineering user |
| `schedule_preventative_maintenance` | Schedule preventative maintenance | Engineering Supervisor / Manager |
| `block_room` | Mark a room out of order for maintenance | Engineering Supervisor / Manager |
| `close_work_order` | Close a completed work order | Assigned Engineering user / Supervisor |

## Work Order Model

Each work order must include:

```text
work_order_id
property_id
room_id
asset_id
issue_category
description
priority
status
reported_by
assigned_to
contractor_id
due_by_time
required_approval
created_at
updated_at
completed_at
```

## Priority Model

| Priority | Meaning | Response expectation |
| --- | --- | --- |
| `EMERGENCY` | Immediate risk to guest, staff, food, fire, security, or property safety | Immediate escalation |
| `URGENT` | Guest-facing failure or significant operational disruption | Same shift |
| `HIGH` | Issue affects room readiness, service quality, or asset reliability | Within 24 hours |
| `NORMAL` | Planned repair or non-urgent defect | Scheduled maintenance |
| `LOW` | Cosmetic or non-urgent improvement | Scheduled maintenance |

## Issue Categories

| Category | Examples |
| --- | --- |
| `ELECTRICAL` | Lighting, power outlet, switch, circuit fault |
| `PLUMBING` | Leak, blocked drain, toilet, tap, shower issue |
| `HVAC` | Air-conditioning, heating, ventilation, thermostat |
| `ACCESS_CONTROL` | Door lock, key card, safe, security door |
| `FURNITURE` | Damaged chair, desk, bed frame, mirror, fixture |
| `APPLIANCE` | Television, kettle, minibar, microwave, safe |
| `KITCHEN_EQUIPMENT` | Oven, refrigerator, freezer, dishwasher, cooking equipment |
| `BUILDING` | Roof, wall, floor, window, door, corridor issue |
| `SAFETY` | Fire, gas, water leak, electrical hazard, structural concern |

## Validation Rules

The tool must reject or escalate when:

- A safety-critical issue is not classified as `EMERGENCY`.
- A work order is assigned to an unqualified user or contractor.
- Required approval is missing for room closure, contractor engagement, or high-cost repair.
- Asset, room, or property identifiers are missing or invalid.
- A work order is closed without required completion evidence.
- The action cannot be recorded in the audit trail.

## Safety Escalation

The following issues must always be treated as `EMERGENCY` and escalated immediately:

- Fire, smoke, gas smell, or electrical burning smell
- Water leak affecting electrical equipment
- Structural damage
- Broken glass or sharp hazards in guest areas
- Lift entrapment or lift fault
- Gas leak
- Food-safety equipment failure
- Security or access-control failure
- Any condition that may harm a guest or employee

## Audit Requirements

For every write operation, retain:

- Requesting user and role
- Property, room, asset, and work-order identifier
- Issue description and category
- Priority and status transition
- Assigned user or contractor
- Approval record
- Photographs or completion evidence, where applicable
- Idempotency key
- System response or receipt
- Timestamp
- Failure reason, if applicable

## Failure Behaviour

Example:

```text
Unable to close Work Order WO-2291.

Reason:
The work order is marked as “In Progress” and does not include completion
evidence or technician confirmation.

Required next step:
Assigned engineering user must record completion details before closure.
```

## Security Rules

- Contractor contact and commercial information must be restricted to authorised roles.
- Asset warranty, cost, and contract data must not be exposed to frontline staff unless required.
- Safety-critical work orders must never be automatically closed by AI.
- Room closures must be reconciled with the PMS to prevent accidental guest allocation.
- All work-order changes must be attributable to an authenticated user or approved system action.
