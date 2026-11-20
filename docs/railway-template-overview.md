# Deploy and Host Next.js + FastAPI Full-Stack Starter on Railway

Deploy a production-style full-stack monorepo starter with **Next.js**, **FastAPI**, **PostgreSQL**, **Redis**, and a **background worker**. Includes a real end-to-end async flow out of the box: create a record in the UI and watch it move from `pending` → `processing` → `completed` automatically.

## Already running this template?

Projects deployed before 19 November 2026 are on an older commit and do not
update by themselves. Railway does not redeploy a template-created service when
the source repo changes, and **Redeploy** re-runs the same commit.

Open the `api`, `web` and `worker` services and choose **Deploy Latest Commit**
to pick up:

* a Status page that no longer reports the API as unreachable when it is fine
* `DATABASE_URL` accepting Railway's own `${{Postgres.DATABASE_URL}}` form
* an api that waits for Postgres instead of exiting when it starts first
* database connections that survive a Postgres restart
* current Next.js, React and Python dependencies, closing two critical CVEs

No new variables and no new migrations.

## About Hosting Next.js + FastAPI Full-Stack Starter

This template is a production-inspired starter scaffold designed to help you launch real applications faster.

It includes:

* **web** → Next.js frontend
* **api** → FastAPI backend
* **worker** → background processing service
* **postgres** → persistent relational database
* **redis** → cache and async queue

The application deploys empty by default, but the full flow works immediately.

Create a record from the UI and the worker will process it automatically in the background.

This demonstrates a real-world architecture from day one without requiring you to rebuild the foundation later.

## Common Use Cases

* SaaS product starters
* internal tools and admin dashboards
* AI agent dashboards and orchestration apps
* async processing workflows
* CRUD applications with background jobs

## Dependencies for Next.js + FastAPI Full-Stack Starter Hosting

This template includes all required dependencies:

* Next.js
* FastAPI
* PostgreSQL
* Redis
* Python background worker

### Deployment Dependencies

* Next.js Documentation: https://nextjs.org/docs
* FastAPI Documentation: https://fastapi.tiangolo.com
* Railway Documentation: https://docs.railway.com
* Redis Documentation: https://redis.io/docs

### Implementation Details

Architecture components:

* **web** → UI and user interactions
* **api** → REST API + database access
* **worker** → async background processing
* **postgres** → primary data storage
* **redis** → queue + cache layer

Included working flow:

1. Create a record in the UI
2. API stores it as `pending`
3. Worker picks it up automatically
4. Status updates to `processing`
5. Completes as `completed`

This makes it easy to understand the full stack immediately after deployment.

## Why Deploy Next.js + FastAPI Full-Stack Starter on Railway?

Railway is a singular platform to deploy your infrastructure stack. Railway will host your infrastructure so you don't have to deal with configuration, while allowing you to vertically and horizontally scale it.

By deploying Next.js + FastAPI Full-Stack Starter on Railway, you are one step closer to launching a production-ready full-stack application with minimal setup. Host your frontend, backend, database, queue, and worker infrastructure on Railway.
