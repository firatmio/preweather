FROM rust:latest AS build
WORKDIR /build
ARG pkg=hackathon
COPY . .
RUN --mount=type=cache,target=/build/target \
    --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    set -eux; \
    cargo build --release; \
    objcopy --compress-debug-sections target/release/$pkg ./main

FROM docker.io/debian:trixie-slim

WORKDIR /app

COPY --from=build /build/main ./

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 6161

CMD ./main
