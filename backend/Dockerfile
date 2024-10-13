FROM oven/bun:slim AS base
WORKDIR /usr/src/app

COPY ./package.json ./bun.lockb ./
RUN bun install --production
COPY ./src ./src

FROM base AS release
RUN apt update && apt install git unzip -y
COPY --from=base /usr/src/app/ .

ENV NODE_ENV production