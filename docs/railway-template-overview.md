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
* current Next.js, React and Python dependencies, including a critical CVE fix

No new variables and no new migrations.
