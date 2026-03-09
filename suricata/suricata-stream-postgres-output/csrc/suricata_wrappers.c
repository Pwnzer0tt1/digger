// Copyright (C) 2025 Pwnzer0tt1
// Licensed under GPL-3.0

#include "flow.h"
#include <stdint.h>


uint64_t wrap_FlowGetId(const Flow *f) {
    return FlowGetId(f);
}