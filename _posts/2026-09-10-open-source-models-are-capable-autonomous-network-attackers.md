---
title: Open Weight Models Are Capable Autonomous Network Attackers
authors: [lakshmi-adiga, marko-morrison, vyas-sekar]
figures: true
description: We ran three of the latest open weight models on our cyber ranges (Kimi K3, Qwen 3.8 Max, and GLM 5.2) and found a substantial increase in capability compared to the open weight models tested in the original Incalmo paper.
---

We ran three of the latest open weight models on our cyber ranges (Kimi K3, Qwen 3.8 Max, and GLM
5.2) and found a substantial increase in capability compared to the open weight models tested in the original Incalmo [paper](https://arxiv.org/abs/2501.16466). The models can now chain exploits without specialized harnesses, yet with Incalmo we see dramatic performance improvements and reduced cost.

### Why open weight models?

Closed-weight frontier models have demonstrated increasingly strong offensive cyber capabilities, as shown by the gamut of cyber benchmarks like CyBench, CyberGym, and Incalmo's MHBench. This has prompted a question we often hear from security practitioners and policy experts: can open-weight models do the same?

### How did we test them?

We tested Kimi K3, Qwen 3.8 Max, and GLM 5.2 as autonomous offensive security agents, using 3 different agentic harnesses.

<div class="table-wrap" markdown="1">

| Harness | Agent structure | Interface to the LLM | Execution mechanism |
| --- | --- | --- | --- |
| [Incalmo](https://arxiv.org/abs/2501.16466) | Single agent | High-level action library (`LateralMove`, `Reconnaissance`, etc.) | Actions are executed via a C2 server |
| [Artemis](https://arxiv.org/pdf/2512.09882) | Multi-agent | Supervisor that spawns dynamically-prompted sub-agents | Shell (via spawned sub-agents), coordinated through a shared note/TODO system |
| Bash Shell | Single agent | One tool: a bash shell | Commands are executed directly through shell, with no higher-level abstraction |

</div>

These agents are evaluated on the MHBench cyber ranges, a set of network environments each with at
least one multi-stage exploit. Further detail on the construction and scoring criteria of each of
these environments can be found [here](https://arxiv.org/abs/2501.16466).

### What did we find?

When we first ran experiments with open weight models for Incalmo a year ago, we observed that "\[Open weight\] models do not follow instructions and are unable to execute shell commands correctly." Open weight models have come a long way from when we first evaluated them for offensive cyber tasks.

The open weight models with the minimal harness (highlighted in green) showed that a bare shell
alone can reach up to 100% average goal completion on an environment. 

<div class="figure" data-vega="/assets/data/open-weights-cost-vs-goals.vl.json"></div>

<p class="figure-caption">Each point is the average goals achieved for one model/harness/environment experiment setup. Use the toggle below the chart to switch the labeled regions between grouping by harness or by model. Each highlighted region spans one standard deviation around its group's mean cost and mean goals achieved.</p>

However, there is a large variability in all 3 of the open weight models' performance across environments with just a bash shell, as well as a large variability in the cost of a run. 

With the Incalmo harness, we see the performance of these runs be significantly higher, and the cost of each run is on average lower than both the minimal harness and the multi-agent pentesting harness ARTEMIS. 

When comparing GLM 5.2, Kimi K3, and Qwen3.8 Max, regardless of the harness they each had similar success rates however Kimi K3 had much more variable cost; at one point going up to an average of $16 per run with ARTEMIS. 

### Deep Dive

To make these results easier to explore, the heatmap below breaks performance down by model, environment, and harness. 

Each cell below is one model/environment pair, colored by percent of goals accomplished for the harness selected in the dropdown. Switch the statistic dropdown to see the mean, median, best
trial, worst trial, or standard deviation across each cell's trials instead of the default mean.

<div class="figure" data-vega="/assets/data/open-weights-goals.vl.json"></div>

We also provide the cost for these experiments, in the interest of transparency.

<div class="figure" data-vega="/assets/data/open-weights-cost.vl.json"></div>

To analyze even more dimensions of this data, check out the raw dataset
[here]({{ '/data/open-weights-attacker-dataset/' | relative_url }})!

### What's next?

Open weight models have proven themselves capable of complex offensive security tasks in complex
network environments, and we are excited to see more innovation leveraging the specific advantages
of open weight models for applications in this space, such as penetration testing.

Considering the success of open weight models in our benchmark set, we have already started
exploring how we can make these challenges more discriminatory to assess the limits of open weight
models' offensive capabilities, as well as their defensive capabilities.

For more information on the work we're doing and the open source systems we publish to enable it,
take a look at our [Github](https://github.com/cylabcyberautonomy)!

### Appendix: cost versus goals, by model and harness

<div class="figure" data-vega="/assets/data/open-weights-cost-vs-goals-pairs.vl.json"></div>

<p class="figure-caption">The same points as the chart at the top of the post, split into one panel per harness so that every model/harness pair gets its own rectangle: nine in total, each spanning one standard deviation around that pair's mean cost and mean goals achieved. Colour is the model, and all three panels share the same axes, so the three models can be compared within a harness by colour and across harnesses by position.</p>

<p class="foot-note">Frontier closed-source models such as Anthropic's Claude Fable 5.1 and OpenAI's GPT-5.6 refuse to execute multi-stage network attacks.</p>
