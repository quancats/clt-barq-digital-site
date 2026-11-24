# Permission Matrix

## Purpose

Define all roles, permissions, policies, and UI/API access rules.

## Roles

| Role        | Description | Notes |
| ----------- | ----------- | ----- |
| Super Admin |             |       |
| Admin       |             |       |
| Editor      |             |       |
| User        |             |       |

## Permissions

| Permission | Role  | Feature ID     | Domain | UI location   | API endpoint | Policy             | Notes |
| ---------- | ----- | -------------- | ------ | ------------- | ------------ | ------------------ | ----- |
| users.view | Admin | FEAT-USERS-001 | Users  | Admin > Users | GET /users   | UserPolicy@viewAny |       |

## Rules

- Do not rely only on UI hiding.
- Every sensitive backend operation needs authorization.
- Every admin action must map to a permission or documented policy rule.
