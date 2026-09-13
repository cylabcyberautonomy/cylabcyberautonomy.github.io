---
title: Open Weight Models Are Capable Autonomous Network Attackers
authors: [lakshmi-adiga, marko-morrison, vyas-sekar]
figures: true
description: We ran three of the latest open source models on our cyber ranges (Kimi K3, Qwen 3.8 Max, and GLM 5.2) and found that they are exceedingly capable at executing multi-stage network attacks.
---

We ran three of the latest open source models on our cyber ranges (Kimi K3, Qwen 3.8 Max, and GLM
5.2) and found a substantial increase in capability compared to the open weight models tested in the original Incalmo paper. The models can now chain exploits without specialized harnesses, yet with Incalmo we see dramatic performance improvements and reduced cost.

### Why open weight models?

Closed-weight frontier models have demonstrated increasingly strong cyber capabilities, as shown by the gamut of cyber benchmarks like CyBench, CyberGym, and Incalmo's MHBench. This has prompted a question we often hear from security practitioners and policy experts: can open-weight models do the same?

### How did we test them?

We tested Kimi K3, Qwen 3.8 Max, and GLM 5.2 as
autonomous offensive security agents, using 3 different agentic harnesses.

<div class="table-wrap" markdown="1">

| Harness | Agent structure | Interface to the LLM | Key mechanism |
| --- | --- | --- | --- |
| [Incalmo](https://arxiv.org/abs/2501.16466) | Single agent | High-level action library (`LateralMove`, `Reconnaissance`, etc.) | Actions are executed via a C2 server |
| [Artemis](https://arxiv.org/pdf/2512.09882) | Multi-agent | Supervisor that spawns dynamically-prompted sub-agents | Shell (via spawned Codex sub-agents), coordinated through a shared note/TODO system |
| Bash Shell | Single agent | One tool: a raw shell | Commands are executed directly, with no higher-level abstraction |

</div>

These agents are evaluated on the MHBench cyber ranges, a set of network environments each with at
least one multi-stage exploit. Further detail on the construction and scoring criteria of each of
these environments can be found [here](https://arxiv.org/abs/2501.16466).

## What did we find?

<div class="figure" data-vega="/assets/data/open-weights-cost-vs-goals.vl.json"></div>



### Results

We have found that open source models demonstrate a remarkable capability for executing end-to-end
offensive operations. The three open models exfiltrated between 93% and 100% of every environment's
critical data across twelve multi-host networks.

<div class="figure" data-vega="/assets/data/open-weights-goals.vl.json"></div>

We also provide the cost for these experiments, in the interest of transparency.

<div class="figure" data-vega="/assets/data/open-weights-cost.vl.json"></div>

To analyze even more dimensions of this data, check out the raw dataset
[here]({{ '/data/open-weights-attacker-dataset/' | relative_url }}).

### What's next?

Open source models have proven themselves capable of complex offensive security tasks in complex
network environments, and we are excited to see more innovation leveraging the specific advantages
of open source models for applications in this space, such as penetration testing.

Considering the success of open source models in our benchmark set, we have already started
exploring how we can make these challenges more discriminatory to assess the limits of open source
model's offensive capabilities, as well as their defensive capabilities.

For more information on the work we're doing and the open source systems we publish to enable it,
take a look at our [Github](https://github.com/cylabcyberautonomy)!

<p class="foot-note">Frontier closed-source models such as Anthropic's Claude Fable 5.1 and OpenAI's GPT-5.6 refuse to execute multi-stage network attacks.</p>
