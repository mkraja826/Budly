<div align="center">

# Budly 🌱

### Learn. Play. Grow.

**An international learning platform for children aged 3–10.**

Designed around safe, adaptive, developmentally appropriate learning that grows with each child.

</div>

---

## Vision

Budly is being designed as a personalized learning companion that can support a child from age 3 through age 10 across different countries, languages, cultures, and education systems.

Instead of treating lesson completion as learning, Budly is designed around evidence of what a child actually understands and can apply.

The core learning cycle is:

```text
DISCOVER → PLAY → UNDERSTAND → PRACTICE → APPLY → REMEMBER → EVALUATE → ADAPT
```

## Learning Philosophy

Budly's foundation follows several principles:

- learning experiences should match a child's developmental stage;
- progress should be based on demonstrated understanding rather than screen time;
- parents or guardians control accounts and child profiles;
- child data should be privacy-minimized;
- the learning engine should remain deterministic and explainable;
- internationalization and right-to-left language support belong in the foundation;
- offline learning should preserve progress and synchronize safely;
- rewards should encourage learning rather than addictive engagement;
- AI may enhance the experience, but should not become the core learning engine.

## Developmental Stages

Budly is architected around age-appropriate experiences rather than one interface stretched across all children.

| Stage | Ages | Experience |
|---|---:|---|
| **Seed** | 3–4 | Picture-first, voice-first, short playful activities |
| **Sprout** | 5–6 | Early literacy, numeracy, discovery and guided practice |
| **Explorer** | 7–8 | Deeper concepts, problem solving and independent practice |
| **Grower** | 9–10 | Advanced application, reasoning and mastery-oriented learning |

The initial product work focuses on the youngest stage before expanding the content and interaction system across older age groups.

## Adaptive Learning Model

Budly is intended to maintain a private learning profile for each child based on learning evidence.

```text
Activity
   │
   ▼
Learning Evidence
   │
   ▼
Skill Mastery State
   │
   ├── needs support → reinforce / simplify
   ├── progressing   → continue practice
   └── mastered      → introduce harder applications
```

A child who progresses quickly can receive more challenging activities, while a child who needs additional practice can remain at an appropriate pace without being pushed forward simply because a lesson was completed.

## Platform Direction

The broader platform is being designed to support:

- age-specific learning interfaces;
- interactive games and activities;
- adaptive skill progression;
- reusable skill taxonomy;
- parent/guardian controls;
- child-safe profiles;
- multilingual and international content;
- offline-capable learning;
- learning evidence and mastery tracking;
- healthy rewards and progression;
- interactive characters and visual learning experiences;
- scalable curriculum and content delivery.

## Architecture Principles

```text
Child Experience
      │
      ▼
Activities & Games
      │
      ▼
Learning Evidence
      │
      ▼
Mastery Engine
      │
      ▼
Adaptive Progression
      │
      ├── Content System
      ├── Parent Experience
      ├── Offline Sync
      └── Analytics / Safety Controls
```

The universal skill model is intentionally decoupled from any single country's curriculum so regional curricula can map onto shared underlying skills.

## Child Safety & Privacy

Budly is intended for young children, so safety and privacy are product architecture concerns rather than optional features.

Key principles include guardian-controlled accounts, subordinate child profiles, minimized personal information, age-appropriate interaction design, controlled communication surfaces, and avoiding engagement mechanics designed primarily to maximize screen time.

## Status

**Active development — production foundation stage.**

The project is currently establishing the architecture, learning model, child-safety boundaries, content structure, and initial age-3 experience before expanding into the full 3–10 platform.

Implementation should evolve incrementally through reviewed feature work rather than prematurely building the entire platform at once.

See `docs/architecture/FOUNDATION.md` for the architecture boundary and roadmap when working inside the repository.

## Long-Term Goal

Budly's goal is to become a learning environment where children can discover, play, practice, apply knowledge, and progress at a pace supported by evidence of their understanding—not simply by age or lesson completion.

---

<div align="center">

**Budly — Learn. Play. Grow. 🌱**

A MiCirql product.

</div>
