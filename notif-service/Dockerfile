FROM rust:1.87.0-slim AS builder

WORKDIR /app
COPY . .

RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    libclang-dev \
    cmake \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN cargo build --release

FROM rust:1.87.0-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/notif-service /usr/local/bin/notif-service

CMD ["notif-service"]
