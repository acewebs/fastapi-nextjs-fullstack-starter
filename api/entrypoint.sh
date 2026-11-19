#!/bin/sh
set -e

# Railway starts every service at once, so Postgres may not be accepting
# connections yet on a cold deploy. Retrying here keeps the container alive
# through that window instead of crash-looping against the restart policy.
attempt=1
max_attempts=15
until alembic upgrade head; do
    if [ "$attempt" -ge "$max_attempts" ]; then
        echo "entrypoint: migrations failed after $attempt attempts, giving up" >&2
        exit 1
    fi
    echo "entrypoint: database not ready, retrying in 3s ($attempt/$max_attempts)" >&2
    attempt=$((attempt + 1))
    sleep 3
done

# A start command configured on the service arrives here as arguments, because
# this image sets ENTRYPOINT and no CMD. Honour it rather than discarding it.
if [ "$#" -gt 0 ]; then
    exec "$@"
fi

exec uvicorn app.main:app --host "${HOST:-0.0.0.0}" --port "${PORT:-8000}"
