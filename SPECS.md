# VBall Practice — Future Feature Specs

Specs for features beyond the current localStorage-only app. The current
frontend already isolates all data access in `frontend/src/data/storage.js`,
so these features mostly mean replacing that layer with API calls and
building out the existing Express/MongoDB backend stub (`backend/server.js`).

## Guiding idea

The app grows from a single-coach planning tool into a coach/manager hub for
running one or more teams: rosters, schedules, plans, and communication in
one place. Players get a lighter, mostly read-only experience.

---

## 1. User Accounts & Login

**Goal:** Coaches sign in so drills and plans sync across devices and can be
shared within a team.

- Email + password auth (bcrypt) with optional Google OAuth later.
- JWT access token + refresh token; middleware guards all API routes.
- Roles: `coach` (full control), `assistant` (edit plans/drills, no team
  admin), `player` (read schedules/plans, receive messages), `manager`
  (admin without practice tools).
- Password reset via emailed link.
- Migration path: on first login, offer to import the browser's
  localStorage drills/plans into the account.

**Data:** `User { id, name, email, passwordHash, role, teams[], createdAt }`

**API sketch:**
```
POST /api/auth/register | login | refresh | forgot-password
GET  /api/me
```

## 2. Teams

**Goal:** A coach manages one or more teams; drills/plans can be personal or
team-scoped.

- Create team: name, season, level (club/school/etc.), logo/color.
- Invite members by email or shareable join code; approve/remove members.
- Roster: player profile with name, number, height, contact, guardian
  contact (youth), and notes visible only to staff.
- Positions per player (OH, MB, OPP, S, L/DS) with primary/secondary;
  roster view filterable by position.
- Team-scoped drill library and saved plans in addition to personal ones.

**Data:**
```
Team { id, name, season, level, ownerId, joinCode }
Membership { userId, teamId, role, jerseyNumber, positions[] }
```

## 3. Messaging & Notifications

**Goal:** Coach/manager pushes information to the team without a group-text
mess.

- Announcements: coach posts to the team (practice changes, tournament
  info); players see a feed and get notified.
- Delivery channels: in-app inbox first; email digests next; push
  notifications (web push/PWA) after that. SMS via Twilio optional.
- Targeting: whole team, by position group, or selected players.
- Read receipts / RSVP ("who saw this / who's coming") on announcements
  tied to events.
- Automated notifications: practice reminder N hours before, plan published,
  schedule change.
- Not in scope initially: player-to-player chat (moderation burden).

**Data:** `Message { id, teamId, senderId, audience, title, body, requiresRsvp, sentAt }`
plus `MessageReceipt { messageId, userId, readAt, rsvp }`

## 4. Schedules & Events

**Goal:** One calendar for practices, matches, and tournaments.

- Event types: practice, match, tournament, other; with location, start/end,
  opponent, notes.
- Recurring practices (e.g., every Tue/Thu 6–8pm).
- Attach a practice plan to a practice event — "Start Practice" from the
  event opens the existing live practice page.
- Availability: players mark in/out; coach sees headcount before practice.
- Month/week list views; iCal feed export for phone calendars.

**Data:** `Event { id, teamId, type, title, start, end, location, recurrence, planId?, opponent? }`
plus `Availability { eventId, userId, status }`

## 5. Backend & Sync

- Build out `backend/` (Express + MongoDB, already stubbed) with the routes
  above; deploy on Render/Railway/Fly; MongoDB Atlas free tier.
- Frontend swaps `data/storage.js` internals for `axios` calls (axios is
  already a dependency); keep localStorage as an offline cache so the live
  practice page works in gyms with bad wifi (queue writes, sync on
  reconnect).
- Frontend moves off GitHub Pages only if server-side rendering is ever
  needed; otherwise it can stay, pointed at the hosted API.

## 6. Later / nice-to-have

- Attendance tracking and per-player notes over the season.
- Stats during game drills (serve %, kills) from the scoreboard.
- Share a plan as a public read-only link or printable PDF.
- Multi-coach live view: assistant sees the running plan on their phone.

## Suggested order

1. Auth + backend foundation (unlocks everything else)
2. Teams + roster/positions
3. Schedules + attach plans to events
4. Messaging/notifications (in-app → email → push)
