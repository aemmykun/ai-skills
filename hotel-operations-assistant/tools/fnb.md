# Tool: Food & Beverage Operations

## Tool ID

`fnb-tool-v1`

## Version

1.0

## Status

Active

## Purpose

Provide the Food & Beverage Agent and Restaurant Manager AI with authorised access to orders, room-service tasks, tray collection, menu data, stock movements, temperature monitoring, waste records, and F&B performance data.

## Connected Systems

- Point-of-sale (POS) system
- Kitchen display system
- Room-service system
- Tray and beacon system
- Inventory management system
- Temperature-monitoring platform
- Guest-feedback system
- PMS room-status integration

## Data Scope

The tool may access only outlets, orders, trays, stock, equipment, and performance data permitted for the requesting user’s property, outlet, department, and role.

| Data domain | Examples |
| --- | --- |
| Orders | Order ID, outlet, table, room, items, status, timestamps |
| Room service | Room number, delivery status, tray status, collection status |
| Menu | Item name, category, price, availability, allergen information where authorised |
| Inventory | Stock item, quantity, par level, expiry date, movement history |
| Food safety | Temperature readings, equipment status, deviation alerts, corrective actions |
| Waste | Waste type, quantity, value, reason, location, recorded by |
| Performance | Sales, covers, order time, guest feedback, waste rate |

## Available Operations

### Read Operations

| Operation | Description | Permission |
| --- | --- | --- |
| `get_assigned_tasks` | Retrieve tasks assigned to the requesting F&B Agent | F&B Agent |
| `get_open_orders` | Retrieve open orders for an authorised outlet | F&B Agent, Supervisor, Manager |
| `get_room_service_orders` | Retrieve room-service orders and delivery status | F&B Agent, Supervisor, Manager |
| `get_tray_collection_queue` | Retrieve trays awaiting collection | F&B Agent, Supervisor, Manager |
| `get_menu_item` | Retrieve authorised menu and availability information | F&B Agent, Supervisor, Manager |
| `get_stock_levels` | Retrieve stock for authorised items and locations | F&B Agent, Supervisor, Manager |
| `get_temperature_readings` | Retrieve temperature data for authorised equipment | F&B Agent, Supervisor, Manager |
| `get_waste_records` | Retrieve waste and spoilage records | Supervisor, Manager |
| `get_fnb_kpis` | Retrieve sales, covers, waste, food cost, and service metrics | Supervisor, Manager |

### Write Operations

| Operation | Description | Approval requirement |
| --- | --- | --- |
| `update_order_status` | Update order preparation, delivery, or completion status | Assigned F&B Agent |
| `update_tray_status` | Mark a tray as collected, returned, or cleaned | Assigned F&B Agent |
| `record_temperature_reading` | Record a manual temperature check | Authorised F&B Agent |
| `report_temperature_deviation` | Create a food-safety deviation alert | F&B Agent, Supervisor, Manager |
| `record_waste` | Record food waste, spoilage, or return | Authorised F&B Agent |
| `record_stock_movement` | Record issue, transfer, adjustment, or spoilage | Authorised F&B role |
| `create_reorder_recommendation` | Create a recommended purchase quantity | Supervisor / Manager |
| `create_purchase_request` | Create a purchase request | Manager / Procurement |
| `dispose_stock` | Record disposal of unsafe or expired stock | Manager / Food Safety approval |

## Order Model

Each order must include:

```text
order_id
property_id
outlet_id
order_type
room_id
table_id
status
items
placed_at
prepared_at
delivered_at
completed_at
assigned_staff_id
special_instructions
```

## Order Status Model

| Status | Meaning |
| --- | --- |
| `RECEIVED` | Order received by the outlet |
| `IN_PREPARATION` | Order is being prepared |
| `READY` | Order is ready for delivery or pickup |
| `OUT_FOR_DELIVERY` | Order is being delivered to a guest |
| `DELIVERED` | Order has been delivered |
| `COMPLETED` | Order is closed |
| `CANCELLED` | Order was cancelled |
| `FAILED` | Order could not be completed |

## Tray Status Model

| Status | Meaning |
| --- | --- |
| `AWAITING_COLLECTION` | Tray is outside a guest room awaiting collection |
| `COLLECTED` | Tray has been collected |
| `RETURNED_TO_SERVICE_AREA` | Tray has been returned for cleaning |
| `CLEANED` | Tray has been cleaned and is ready for reuse |
| `MISSING` | Tray has not been returned or located |

## Temperature Compliance

The tool must support configurable safe ranges for each equipment type, for example:

| Equipment | Example safe range |
| --- | --- |
| Refrigerator | 1°C to 5°C |
| Freezer | -18°C or below |
| Hot-holding equipment | 60°C or above |
| Display cabinet | As defined by food-safety policy |

A temperature deviation must include:

- Equipment ID
- Location
- Current temperature
- Safe-range threshold
- Deviation start time
- Duration
- Affected stock, where identifiable
- Recommended corrective action
- Escalation recipient

## Validation Rules

The tool must reject or escalate when:

- An agent attempts to access an order, tray, or outlet outside their assignment.
- A temperature deviation is dismissed without a corrective action.
- Stock is disposed of without required food-safety approval.
- A waste record lacks a valid reason code.
- A purchase request exceeds the user’s approval limit.
- Required approval is missing.
- The action cannot be recorded in the audit trail.

## Audit Requirements

For every write operation, retain:

- Requesting user and role
- Property, outlet, order, tray, item, and equipment identifier
- Previous and new status
- Temperature reading or deviation details
- Waste quantity, value, and reason
- Approval record
- Idempotency key
- POS, inventory, or monitoring-system response
- Timestamp
- Failure reason, if applicable

## Failure Behaviour

Example:

```text
Unable to dismiss temperature deviation for Cold Room 2.

Reason:
The deviation has lasted 52 minutes and affected stock may require assessment.

Required next step:
Restaurant Manager or Food Safety Officer must inspect the equipment,
assess affected stock, and record the corrective action.
```

## Security Rules

- Guest room numbers and order details must only be visible to authorised F&B staff.
- Allergen and dietary information must be handled as safety-critical data.
- Supplier pricing and commercial terms must be restricted to authorised roles.
- Food-safety deviations must never be automatically closed by AI.
- Waste and spoilage records must be retained for food-safety, financial, and operational analysis.
- All order, tray, stock, and temperature actions must be attributable to an authenticated user or approved system action.
