# Tool: Inventory and Procurement

## Tool ID

`inventory-tool-v1`

## Version

1.0

## Status

Active

## Purpose

Provide the Hotel Operations AI Assistant with authorised access to stock levels, supplier deliveries, consumption data, par levels, reorder recommendations, and purchase-request workflows.

## Connected Systems

- Inventory management system
- Procurement or purchasing system
- Supplier portal or EDI integration
- Warehouse or storeroom system
- POS system
- Housekeeping supply system
- F&B stock system

## Data Scope

The tool may access only inventory, supplier, and procurement data permitted for the requesting user’s property, department, outlet, and role.

| Data domain | Examples |
| --- | --- |
| Stock items | Item name, SKU, category, unit, current quantity, par level |
| Locations | Storeroom, kitchen, housekeeping store, outlet, property |
| Movements | Receipt, issue, transfer, adjustment, waste, spoilage |
| Suppliers | Supplier name, catalogue, lead time, price, delivery history |
| Purchasing | Purchase request, purchase order, approval status, receipt |
| Forecasting | Historical usage, forecast demand, recommended order quantity |

## Available Operations

### Read Operations

| Operation | Description | Permission |
| --- | --- | --- |
| `get_stock_levels` | Retrieve current stock for authorised items and locations | Housekeeping, F&B, Supervisor, Manager |
| `get_item_details` | Retrieve SKU, unit, par level, and stock movement history | Authorised operational roles |
| `get_low_stock_items` | Identify items below reorder threshold | Supervisor, Manager |
| `get_expiry_risks` | Identify items approaching expiry | F&B, Supervisor, Manager |
| `get_stock_movements` | Retrieve receipts, issues, transfers, adjustments, and waste | Supervisor, Manager |
| `get_supplier_delivery` | Retrieve delivery and receipt history | Supervisor, Manager |
| `get_reorder_recommendation` | Generate recommended order quantity | Supervisor, Manager |
| `get_inventory_accuracy` | Compare system stock with physical count results | Supervisor, Manager |

### Write Operations

| Operation | Description | Approval requirement |
| --- | --- | --- |
| `record_stock_movement` | Record issue, transfer, adjustment, waste, or spoilage | Authorised operational role |
| `create_supply_request` | Request housekeeping or F&B supplies | Housekeeping / F&B Agent |
| `create_reorder_recommendation` | Create a recommended purchase quantity | Supervisor / Manager |
| `create_purchase_request` | Create a purchase request for approval | Manager / Procurement |
| `approve_purchase_request` | Approve a purchase request | Authorised Manager / Procurement |
| `record_delivery_receipt` | Confirm receipt of delivered goods | Authorised receiving role |

## Inventory Movement Model

Each stock movement must include:

```text
movement_id
property_id
location_id
item_sku
movement_type
quantity
unit_of_measure
reason_code
requested_by
approved_by
related_task_id
related_work_order_id
created_at
```

## Movement Types

| Movement type | Description |
| --- | --- |
| `RECEIPT` | Goods received from a supplier |
| `ISSUE` | Stock issued for operational use |
| `TRANSFER` | Stock moved between locations |
| `ADJUSTMENT` | Stock corrected after count or reconciliation |
| `WASTE` | Stock discarded due to spoilage, damage, or expiry |
| `RETURN` | Stock returned to a supplier or storeroom |

## Reorder Logic

A reorder recommendation should consider:

- Current stock quantity
- Par level or reorder point
- Forecast demand
- Historical consumption
- Supplier lead time
- Open purchase orders
- Seasonality and local events
- Expiry risk
- Minimum order quantity
- Budget and approval limits

The tool must clearly distinguish between:

- A **recommendation**
- A **purchase request**
- An **approved purchase order**

## Validation Rules

The tool must reject or escalate when:

- The requesting user lacks permission for the item, location, or property.
- Stock quantity would become negative.
- A movement lacks a valid reason code.
- A purchase request exceeds the user’s approval limit.
- Required approval has not been obtained.
- Supplier, item, location, or quantity data is missing or invalid.
- The action cannot be recorded in the audit trail.

## Audit Requirements

For every write operation, retain:

- Requesting user and role
- Property, location, item, and quantity
- Movement or purchase type
- Reason code
- Approval record
- Idempotency key
- Supplier or procurement response
- Timestamp
- Failure reason, if applicable

## Failure Behaviour

Example:

```text
Unable to create purchase order.

Reason:
The requested purchase value exceeds the requesting manager’s approval limit.

Required next step:
Escalate to the Procurement Manager or Financial Controller for approval.
```

## Security Rules

- Supplier pricing, margins, and commercial terms must be restricted to authorised roles.
- Purchase approvals must be separated from purchase creation where possible.
- Inventory adjustments require a reason and an auditable approver.
- Waste and spoilage records must be retained for food-safety and financial analysis.
- Do not expose supplier contract terms or pricing to frontline staff unless required.
