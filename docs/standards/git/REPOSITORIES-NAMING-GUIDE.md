# Repository Naming Guide

## Purpose

This guide defines the standard for naming repositories across internal systems, company-owned products, client projects, mobile applications, websites, APIs, admin panels, and shared packages.

The goal is to ensure that repository names are:

- clear
- consistent
- scalable
- easy to understand
- easy to search and manage

This guide covers **naming only**. It does not define repository structure, architecture, or splitting rules.

---

# 1. Naming Format

Use the following format:

`[scope]-[project]-[surface]`

If the same surface exists on multiple platforms, use:

`[scope]-[project]-[surface]-[platform]`

---

# 2. Naming Rules

All repository names must follow these rules:

- use lowercase only
- use hyphens `-` between words
- do not use spaces
- do not use underscores `_`
- do not include technology names unless explicitly justified
- do not include versions such as `v2`, `v3`
- do not include years such as `2026`
- do not use vague names like `new`, `main`, `test`, `frontend`, `backend`, or `dashboard` unless they match the approved naming standard
- keep names short, stable, and descriptive

---

# 3. Naming Components

## 3.1 Scope

The `scope` defines the ownership or type of repository.

Approved values:

- `prd` = company-owned product
- `clt` = client project
- `int` = internal system
- `shr` = shared library, shared toolkit, shared SDK, or reusable package

### Examples

- `prd-chatify-api`
- `clt-alraya-site`
- `int-hr-portal`
- `shr-ui-kit`

---

## 3.2 Project

The `project` is the project or product identifier.

Rules:

- must be short and clear
- must be lowercase
- may contain multiple words separated by hyphens
- should stay stable over time
- should not include framework or language names

### Good examples

- `chatify`
- `billing`
- `delivery`
- `academy`
- `fiber-guide`

### Avoid

- `chatify-v2`
- `academy-2026`
- `billing-laravel`
- `new-project`

---

## 3.3 Surface

The `surface` identifies the business-facing component or system area.

Approved standard values:

- `site`
- `app`
- `portal`
- `admin`
- `cms`
- `api`
- `automation`
- `db`
- `infra`
- `docs`

### Surface meanings

#### `site`

Public marketing or informational website.

#### `app`

Main product experience or main user-facing application.

#### `portal`

Self-service area such as account, billing, or service access.

#### `admin`

Internal administration panel for managing the product or system.

#### `cms`

Content management system for pages, articles, banners, and similar content.

#### `api`

Main backend service or API layer.

#### `automation`

Background workflows, jobs, integration services, or event-driven automation processes.

#### `db`

Database-specific repository.

#### `infra`

Infrastructure and deployment repository.

#### `docs`

Documentation repository.

---

## 3.4 Persona-Based Surfaces

When a product has separate interfaces for clearly different user groups, a persona-based surface may be used instead of a generic one.

Examples:

- `customer`
- `driver`
- `merchant`
- `doctor`
- `patient`
- `agent`
- `operator`
- `vendor`

### Examples

- `prd-delivery-customer-flutter`
- `prd-delivery-driver-flutter`
- `prd-clinic-doctor-web`
- `prd-clinic-patient-flutter`

Use persona-based surfaces only when they represent truly separate product experiences.

---

## 3.5 Platform

The `platform` is used only when the same surface exists on multiple platforms.

Approved values:

- `web`
- `flutter`
- `ios`
- `android`

Do not add a platform suffix unless it is needed.

### Good examples

- `prd-chatify-app-web`
- `prd-chatify-app-flutter`
- `prd-chatify-app-ios`
- `prd-chatify-app-android`

### No platform needed

- `prd-chatify-api`
- `prd-chatify-admin`
- `prd-chatify-db`
- `prd-chatify-automation`

---

# 4. Standard Examples

## 4.1 Company-owned product

- `prd-chatify-site`
- `prd-chatify-app-web`
- `prd-chatify-app-flutter`
- `prd-chatify-app-ios`
- `prd-chatify-app-android`
- `prd-chatify-admin`
- `prd-chatify-api`
- `prd-chatify-automation`

---

## 4.2 Client project

- `clt-alraya-site`
- `clt-alraya-cms`
- `clt-alraya-api`

---

## 4.3 Internal system

- `int-hr-portal`
- `int-hr-admin`
- `int-hr-api`

---

## 4.4 Shared repositories

- `shr-ui-kit`
- `shr-auth-sdk`
- `shr-core-types`
- `shr-mobile-design-system`

---

## 4.5 Multi-persona product

- `prd-delivery-site`
- `prd-delivery-customer-flutter`
- `prd-delivery-driver-flutter`
- `prd-delivery-merchant-web`
- `prd-delivery-admin`
- `prd-delivery-api`

---

# 5. Approved Naming Patterns

## 5.1 Basic format

`[scope]-[project]-[surface]`

### Examples

- `prd-billing-api`
- `clt-alraya-site`
- `int-ops-admin`

---

## 5.2 Extended format with platform

`[scope]-[project]-[surface]-[platform]`

### Examples

- `prd-chatify-app-web`
- `prd-chatify-app-flutter`
- `prd-chatify-app-ios`
- `prd-chatify-app-android`

---

# 6. What to Avoid

The following naming patterns are not allowed unless explicitly approved.

## 6.1 Technology-based names

Avoid:

- `project-laravel`
- `project-vue`
- `project-nuxt`
- `project-filament`

Reason: repository names should describe product responsibility, not implementation technology.

---

## 6.2 Ambiguous names

Avoid:

- `project-web`
- `project-dashboard`
- `project-frontend`
- `project-backend`

Reason: these become unclear as the project grows.

---

## 6.3 Versioned names

Avoid:

- `project-v2`
- `project-v3`

Reason: versions should be handled in Git, releases, and migration planning, not in the repository name.

---

## 6.4 Temporary or unclear names

Avoid:

- `new-project`
- `main-project`
- `test-repo`
- `temp-api`

Reason: repository names must be stable and meaningful.

---

# 7. Quick Naming Decision Guide

## If it is a public informational website

Use:

- `site`

Example:

- `clt-alraya-site`

---

## If it is the main product interface

Use:

- `app`

Example:

- `prd-chatify-app-web`

---

## If it is a self-service customer area

Use:

- `portal`

Example:

- `prd-billing-portal-web`

---

## If it is an internal administration panel

Use:

- `admin`

Example:

- `prd-chatify-admin`

---

## If it is for managing content

Use:

- `cms`

Example:

- `clt-alraya-cms`

---

## If it is the backend service

Use:

- `api`

Example:

- `prd-chatify-api`

---

## If it is background workflows or integrations

Use:

- `automation`

Example:

- `prd-chatify-automation`

---

## If it is database-specific

Use:

- `db`

Example:

- `prd-chatify-db`

---

## If it is infrastructure-specific

Use:

- `infra`

Example:

- `prd-chatify-infra`

---

## If it is documentation-specific

Use:

- `docs`

Example:

- `prd-chatify-docs`

---

# 8. Final Standard Summary

## Approved formula

Primary format:

`[scope]-[project]-[surface]`

Extended format:

`[scope]-[project]-[surface]-[platform]`

---

## Approved scopes

- `prd`
- `clt`
- `int`
- `shr`

---

## Approved surfaces

- `site`
- `app`
- `portal`
- `admin`
- `cms`
- `api`
- `automation`
- `db`
- `infra`
- `docs`

Persona-based surfaces are allowed when clearly justified.

---

## Approved platforms

- `web`
- `flutter`
- `ios`
- `android`

---

# 9. One-Line Rule

**Name repositories by ownership, project, and product surface, and add platform only when needed.**
