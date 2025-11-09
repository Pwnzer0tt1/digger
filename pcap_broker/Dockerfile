# Copyright (C) 2025 Pwnzer0tt1
# Licensed under GPL-3.0

FROM golang:alpine

RUN apk add --no-cache build-base libpcap-dev openssh-client tcpdump
RUN go install github.com/fox-it/pcap-broker@latest
ENTRYPOINT ["pcap-broker"]