# Tool: Property Management System (PMS)

## Tool ID

`pms-tool-v1`

## Version

1.0

## Status

Active

## Purpose

Provide the Hotel Operations AI Assistant with authorised access to reservations, guest-stay context, room inventory, occupancy, arrivals, departures, and room-status information.

## Connected Systems

This tool may integrate with one or more PMS platforms, including:

- Opera Cloud
- Mews
- Cloudbeds
- RMS Cloud
- Little Hotelier
- Custom hotel PMS platforms

The tool must normalise PMS-specific data into a consistent internal operational model.

## Data Scope

The tool may access only data permitted for the requesting user’s property, department, role, and authority scope.

| Data domain | Examples |
| --- | --- |
| Reservations | Booking reference, arrival date, departure date, room type, rate plan |
| Stay context | Guest name where authorised, loyalty tier, preferences, special requests |
| Room inventory | Room number, room type, floor, attributes, status |
| Room status | Dirty, cleaning, clean, inspected, ready, occupied, out of order |
| Occupancy | Current and forecast occupancy, arrivals, departures, stayovers |
| Billing context | Charges and folio data only where explicitly authorised |

## Available Operations

### Read Operations

| Operation | Description | Permission |
| --- | --- | --- |
| `get_arrivals` | Retrieve expected arrivals for a date or date range | Front Office, Supervisor, Manager |
| `get_departures` | Retrieve expected departures for a date or date range | Housekeeping, Front Office, Supervisor, Manager |
| `get_room_status` | Retrieve current status for one or more rooms | Housekeeping, Front Office, Supervisor, Manager |
| `get_room_details` | Retrieve room type, floor, attributes, and current status | Authorised operational roles |
| `get_reservation` | Retrieve an authorised reservation and stay context | Front Office, Supervisor, Manager |
| `get_occupancy_forecast` | Retrieve current and forecast occupancy | Supervisor, Manager |
| `search_available_rooms` | Find rooms matching status, type, floor, and attribute filters | Front Office, Supervisor, Manager |

### Write Operations

| Operation | Description | Approval requirement |
| --- | --- | --- |
| `update_room_status` | Update room status in the PMS | Must follow approved housekeeping workflow |
| `assign_room` | Assign an available room to a reservation | Front Office permission and room-readiness rules |
| `add_guest_request` | Record an approved guest request | Front Office permission |
| `add_reservation_note` | Add an operational note to a reservation | Authorised Front Office / Manager |
| `block_room` | Mark a room as out of order or out of service | Supervisor / Engineering approval |

## Room Status Model

The tool must support the following canonical room statuses:

| Status | Meaning |
| --- | --- |
| `DIRTY` | Room requires cleaning |
| `CLEANING` | Room is currently being serviced |
| `CLEAN` | Room has been cleaned but not inspected |
| `INSPECTED` | Room has passed quality inspection |
| `READY` | Room is available for allocation |
| `OCCUPIED` | Room is currently occupied by a guest |
| `OUT_OF_ORDER` | Room is unavailable due to maintenance or operational reasons |
| `OUT_OF_SERVICE` | Room is temporarily unavailable but may return to service without major work |

## Validation Rules

The tool must reject or escalate a write operation when:

- The requesting user lacks permission for the property or room.
- The room status transition is invalid.
- A room is assigned while it is not `READY`.
- A room is marked `READY` without required inspection, where inspection is mandatory.
- Reservation, room, or property identifiers are missing or invalid.
- Required approval has not been obtained.
- The action cannot be recorded in the audit trail.

## Invalid Status Transitions

| From | Invalid direct transition |
| --- | --- |
| `OCCUPIED` | `READY` |
| `OUT_OF_ORDER` | `READY` |
| `DIRTY` | `READY` without cleaning completion |
| `CLEAN` | `READY` without inspection, where inspection is required |

## Audit Requirements

For every write operation, retain:

- Requesting user and role
- Property and room identifier
- Previous status
- New status
- Request context
- Approval record, where applicable
- Idempotency key
- PMS response or receipt
- Timestamp
- Failure reason, if applicable

## Failure Behaviour

If PMS data is unavailable, incomplete, or conflicting, the tool must fail closed.

Example:

```text
Unable to assign Room 508.

Reason:
Room 508 is marked as “Clean” in the housekeeping system but remains
“Occupied” in the PMS.

Required next step:
Housekeeping Supervisor must verify the physical room status and reconcile
the systems before allocation.
```

## Security Rules

- Never expose payment-card data, full identification-document images, or sensitive guest data unless explicitly authorised and necessary.
- Enforce property-level isolation for all queries and writes.
- Use scoped service credentials; do not allow user-level credentials to widen access.
- Log all read operations involving sensitive guest data.
- Require explicit approval for any operation that affects guest stay, room availability, billing, or revenue.
