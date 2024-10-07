FROM oven/bun:slim AS base
WORKDIR /usr/src/app

COPY ./package.json ./bun.lockb ./
COPY ./src ./src
RUN bun install --production

FROM base AS release
RUN apt update && apt install git -y
COPY --from=base /usr/src/app/ .

ENV NODE_ENV production