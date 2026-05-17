# Data Model: Trail & Campsite Intelligence Platform

## Entity: User

- Description: Registered platform user account.
- Fields:
  - id: ObjectId, required, unique.
  - email: string, required, unique, lowercase, valid email format.
  - displayName: string, required, min 2, max 50.
  - passwordHash: string, required.
  - role: enum(`user`, `admin`), required, default `user`.
  - accountStatus: enum(`active`, `disabled`), required, default `active`.
  - createdAt: datetime, required.
  - updatedAt: datetime, required.
- Validation rules:
  - Email uniqueness enforced with unique index.
  - Password hashes only; plaintext prohibited.

## Entity: Trail

- Description: Discoverable hiking destination.
- Fields:
  - id: ObjectId, required, unique.
  - name: string, required, min 2, max 120.
  - location: object, required.
    - region: string, required.
    - latitude: number, optional.
    - longitude: number, optional.
  - difficulty: enum(`easy`, `moderate`, `hard`), required.
  - distanceKm: number, required, min 0.
  - elevationGainM: number, required, min 0.
  - description: string, required, max 5000.
  - ratingSummary: object, required.
    - averageRating: number, min 0, max 5.
    - reviewCount: integer, min 0.
  - archiveStatus: enum(`active`, `archived`), required, default `active`.
  - nearbyCampsiteIds: ObjectId[], default [].
  - createdAt: datetime, required.
  - updatedAt: datetime, required.
- Validation rules:
  - Name + region indexed for discovery queries.

## Entity: Campsite

- Description: Discoverable camping destination.
- Fields:
  - id: ObjectId, required, unique.
  - name: string, required, min 2, max 120.
  - location: object, required.
    - region: string, required.
    - latitude: number, optional.
    - longitude: number, optional.
  - amenities: string[], default [].
  - accessNotes: string, optional, max 2000.
  - description: string, required, max 5000.
  - ratingSummary: object, required.
    - averageRating: number, min 0, max 5.
    - reviewCount: integer, min 0.
  - archiveStatus: enum(`active`, `archived`), required, default `active`.
  - relatedTrailIds: ObjectId[], default [].
  - createdAt: datetime, required.
  - updatedAt: datetime, required.
- Validation rules:
  - Name + region indexed for discovery queries.

## Entity: Review

- Description: User-submitted rating/comment attached to a trail or campsite.
- Fields:
  - id: ObjectId, required, unique.
  - userId: ObjectId(User), required.
  - targetType: enum(`trail`, `campsite`), required.
  - targetId: ObjectId, required.
  - rating: integer, required, min 1, max 5.
  - comment: string, required, min 1, max 3000.
  - moderationState: enum(`visible`, `hidden`, `removed`), default `visible`.
  - createdAt: datetime, required.
  - updatedAt: datetime, required.
- Validation rules:
  - Unique compound index `(userId, targetType, targetId)` enforces one review per user per entity.
  - Reject write if target entity is archived or not found.

## Entity: ConditionReport

- Description: Time-sensitive status update for a trail or campsite.
- Fields:
  - id: ObjectId, required, unique.
  - userId: ObjectId(User), required.
  - targetType: enum(`trail`, `campsite`), required.
  - targetId: ObjectId, required.
  - status: enum(`muddy`, `snowy`, `blocked`, `closed`), required.
  - notes: string, optional, max 1000.
  - submittedAt: datetime, required.
  - visibilityState: enum(`visible`, `hidden`, `removed`), default `visible`.
- Validation rules:
  - Reject write if target entity is archived or not found.
  - "Recent" report window is `submittedAt >= now - 14 days` for detail-page recent section.

## Entity: Favorite

- Description: Saved user-to-entity relationship.
- Fields:
  - id: ObjectId, required, unique.
  - userId: ObjectId(User), required.
  - targetType: enum(`trail`, `campsite`), required.
  - targetId: ObjectId, required.
  - savedAt: datetime, required.
- Validation rules:
  - Unique compound index `(userId, targetType, targetId)` prevents duplicate favorites.
  - Favoriting archived entities is disallowed.

## Entity: ModerationRecord

- Description: Audit log for admin moderation/archive actions.
- Fields:
  - id: ObjectId, required, unique.
  - actionType: enum(`archive`, `restore`, `remove-review`, `remove-report`, `update-review`, `update-report`), required.
  - actorAdminId: ObjectId(User), required.
  - targetType: enum(`trail`, `campsite`, `review`, `report`), required.
  - targetId: ObjectId, required.
  - reason: string, optional, max 1000.
  - createdAt: datetime, required.
- Validation rules:
  - `actorAdminId` must map to user role `admin`.

## Relationships

- User 1:N Review
- User 1:N ConditionReport
- User 1:N Favorite
- Trail 1:N Review (polymorphic via targetType/targetId)
- Campsite 1:N Review (polymorphic via targetType/targetId)
- Trail 1:N ConditionReport (polymorphic via targetType/targetId)
- Campsite 1:N ConditionReport (polymorphic via targetType/targetId)
- Trail M:N Campsite via `nearbyCampsiteIds` and `relatedTrailIds`
- Admin User 1:N ModerationRecord

## Data Integrity and Orphan Prevention

- Strategy: Soft delete via `archiveStatus` on trails/campsites.
- Effects:
  - Existing reviews/reports/favorites remain for historical and audit integrity.
  - New reviews/reports/favorites targeting archived entities are rejected.
  - Public browse endpoints exclude archived entities by default.
  - Admin endpoints can include archived entities for restore and moderation.

## State Transitions

- Trail/Campsite: `active -> archived -> active`.
- Review/ConditionReport visibility: `visible -> hidden/removed` (admin moderation), optional restore policy may allow `hidden -> visible`.
- User account: `active -> disabled` (admin action), disabled users cannot create new content.
