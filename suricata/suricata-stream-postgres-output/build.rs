// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

fn main() {
    cc::Build::new()
        .file("./csrc/suricata_wrappers.c")
        .include("/suricata-8.0.3/src/")
        .compile("suricata_wrappers");
}