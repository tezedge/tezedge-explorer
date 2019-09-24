# Build stage 1
FROM simplestakingcom/tezos-opam-builder
# Checkout and compile tezos-rs source code
RUN curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain nightly -y
ENV PATH=/home/appuser/.cargo/bin:$PATH
ENV RUST_BACKTRACE=1
ENV SODIUM_USE_PKG_CONFIG=1
ENV OCAML_BUILD_CHAIN=local
RUN cd /home/appuser && \
	git clone https://github.com/simplestaking/tezos-rs.git && \
    cd tezos-rs && \
    cargo build

# Build stage 2
FROM debian:buster
COPY --from=0 /home/appuser/tezos-rs/target/debug/light-node /bin/light-node
COPY --from=0 /home/appuser/tezos-rs/tezos_interop/lib_tezos/artifacts/libtezos.o /lib/libtezos.o
COPY --from=0 /home/appuser/tezos-rs/light_node/config /config
RUN apt-get update && \
    apt-get install -y libgmp-dev libev-dev libsodium23

EXPOSE 4927 4927

ENTRYPOINT ["light-node", "--tezos-data-dir", "/tmp"]