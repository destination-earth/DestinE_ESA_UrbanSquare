ARG BASE_IMAGE=murmurationsas/python-base-image:3.11-slim-bookworm

# First stage: we build and install dependencies in the venv
FROM ${BASE_IMAGE} as builder

# we need git installed in order to retrieve datacuber module from git directly
USER root
RUN apt update -y && \
     apt install -y git

USER alice

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Second stage: we pick up the complete venv from the first stage, and we add the app modules and data
FROM ${BASE_IMAGE}

ARG WEKEO_S3_ACCESS_KEY
ARG WEKEO_S3_SECRET_KEY
ARG OVH_DE_S3_ACCESS_KEY
ARG OVH_DE_S3_SECRET_KEY
ARG ENV

ENV APP_ASSETS=${APP_SRC}/assets

COPY --from=builder --chown=alice:app ${APP_VENV} ${APP_VENV}
COPY --chown=alice:app data/ ${APP_DATA}
COPY --chown=alice:app assets/ ${APP_ASSETS}
COPY --chown=alice:app *.py ${APP_SRC}/

ENV WEKEO_S3_ACCESS_KEY=$WEKEO_S3_ACCESS_KEY
ENV WEKEO_S3_SECRET_KEY=$WEKEO_S3_SECRET_KEY
ENV OVH_DE_S3_ACCESS_KEY=$OVH_DE_S3_ACCESS_KEY
ENV OVH_DE_S3_SECRET_KEY=$OVH_DE_S3_SECRET_KEY
ENV ENV=$ENV

CMD gunicorn -b 0.0.0.0:8080 app:server --timeout 600
