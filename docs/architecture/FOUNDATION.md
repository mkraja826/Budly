# Budly Production Foundation

## Repository audit

The repository was empty at initialization, so there is no legacy implementation, database, navigation system, authentication flow, or UI to preserve.

## V1 architecture direction

Budly begins as a modular monolith with clear domain boundaries. We will not introduce microservices until scale or operational boundaries justify them.

### Mobile

React Native + Expo + TypeScript is the intended client stack. Expo SDK 57 is the current stable project target documented by Expo for new projects as of August 2026. The mobile client will contain child and parent presentation layers, a local persistence/sync layer, and typed API contracts. It will not contain server secrets or authoritative entitlement/mastery logic.

### Backend

Initial backend target: Supabase/PostgreSQL with server-side authorization, RLS, object storage, and server/edge functions where appropriate. Core learning state will be modeled relationally. High-volume learning evidence will be append-oriented and immutable after acceptance.

### Core architectural invariant

Learning evidence is immutable. Mastery, confidence, recommendations, reviews, and parent summaries are derived state.

This allows learning algorithms to evolve without rewriting historical child interactions.

## Module boundaries

- AUTH — parent/guardian identity and sessions.
- FAMILY — families, memberships, ownership and access rules.
- CHILD PROFILE — privacy-minimized child configuration.
- CONTENT — lessons, activities, media and versions.
- LOCALIZATION — locale resolution and localized content selection.
- LEARNING ENGINE — skill prerequisites and deterministic learning decisions.
- PERFORMANCE ENGINE — evidence evaluation, mastery and confidence.
- REVIEW ENGINE — spaced review scheduling and retention evidence.
- REWARDS — healthy progression independent of mastery persistence.
- PARENT DASHBOARD — derived, actionable progress explanations.
- SUBSCRIPTIONS — server-controlled entitlements.
- AI GATEWAY — future optional, server-only AI enhancement boundary.
- VOICE — provider-independent TTS/STT abstractions.
- SYNC — offline event queue and idempotent synchronization.
- ANALYTICS — privacy-conscious product analytics and protected learning analytics.
- SAFETY — consent, age/development rules and child-safe policies.
- ADMIN/CMS — staff content workflow with RBAC and approvals.

## Developmental stages

- SEED: ages 3–4
- SPROUT: ages 5–6
- EXPLORER: ages 7–8
- CREATOR: ages 9–10

The stage is a behavior/input to presentation and orchestration, not a separate application.

## First implementation milestone

1. Establish stable developmental-stage and mastery domain types.
2. Establish locale/curriculum-independent identifiers.
3. Define deterministic mastery transition contract.
4. Scaffold Expo SDK 57 using the official default TypeScript template.
5. Add localization and RTL foundation before production UI strings are introduced.
6. Add initial parent/child navigation shells.
7. Introduce persistence/backend only after contracts and migration strategy are documented.

## Data direction

Initial entities to design before migration creation:

- users / auth identities
- families
- family_memberships
- child_profiles
- languages / locales / regions
- curricula / curriculum_skill_mappings
- domains
- skills
- skill_prerequisites
- lessons
- activities
- activity_skills
- content_versions
- localized_content
- learning_sessions
- activity_attempts
- skill_evidence
- child_skill_states
- mastery_history
- review_schedule
- consents
- parent_settings
- devices
- audit_events

Not all of these should be created immediately. The first database migration should cover only identity/family/child ownership plus the minimum learning taxonomy needed by the first activities.

## Security baseline

- Never trust role, family, child ownership, subscription state, or mastery supplied solely by the client.
- Never place service-role/database secrets in the app bundle.
- Enforce family/child isolation server-side and with RLS where supported.
- AI provider credentials remain server-side.
- Child data collection is minimized from the first schema.

## Scale strategy

Stage 1 should remain a modular monolith. Static educational assets use object storage/CDN. Learning-event ingestion must be idempotent so the same offline event cannot create duplicate evidence.

Potential future separations at high scale: media/content delivery, learning-event ingestion, recommendation processing, analytics pipelines, AI gateway and notifications. They should not be split prematurely.
