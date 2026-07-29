<script lang="ts">
	import { ctfConfig } from "$lib/state.svelte";


    let { flowId, ipport, data } = $props();

    let serviceName = $derived.by(() => {
        for (const [sn, s] of Object.entries(ctfConfig.config.services)) {
            if (s.ipports.map((v) => `${v.ip}:${v.port}`).includes(ipport)) {
                return sn;
            }
        }

        return "unknown";
    });
    console.log(data);
    const editor_cnt = `#!/usr/bin/env python3
# Filename: replay-http-${serviceName}-${flowId}.py
import json
import logging
import random
import requests
import sys
      
"""
This file was generated from network capture towards ${data[0].hostname}
Corresponding flow id: ${flowId}
Service: ${serviceName}
"""
      
# Setup logger to log requests
logging.basicConfig(format='[%(levelname)s] %(message)s')
logging.getLogger("urllib3.connectionpool").setLevel(logging.DEBUG)
      
s = requests.Session()

${data.map((req) => {
    return `
r = s.${(req.http_method || "").toLowerCase()}(
    f"http://${req.hostname}${":" + req.http_port || ""}${req.url}",
    ${req.http_method === "POST" ? `data=${req.rq_content},` : ""}
    headers={
        ${req.request_headers.map((h) => `"${h.name}": "${h.value}"`).join("\n        ")}
    },
    timeout=2, # prevent stall
)
      
if r.status_code != ${req.status}:
    logging.error(f"Request returned wrong status code {r.status_code}, expected ${req.status}")
print(r.text, flush=True)
`;
}).join("\n")}
`;
    
    $effect(() => {
        const editor = ace.edit("http-replay-editor");
        editor.setOptions({
            readOnly: true,
            minLines: 10,
            maxLines: 30,
            fontSize: 14,
            customScrollbar: true
        });
        editor.setTheme("ace/theme/dracula");
        editor.session.setMode("ace/mode/python");
    });
</script>

<div id="http-replay-editor" class="rounded-bottom">{editor_cnt}</div>