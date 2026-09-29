---
title: "Are AI-Evolved systems ready for primetime — Not yet!"
subtitle: Exposing the Achilles’ heel of AI-evolved systems
authors: [lesley-zhou, vyas-sekar]
description: AI-evolved programs that score better on their benchmark can crash, slow down, or return worse results on new workloads. We built AIChilles to expose these weaknesses automatically, and found them even in a spec-driven multi-agent workflow.
---

<div class="figure figure-image"><img src="{{ '/assets/img/posts/ai-evolved-systems/aichilles-overview.svg' | relative_url }}?v={{ site.time | date: '%s' }}" alt="Diagram. An initial program P and a workload W feed AI evolution, which produces an evolved program P′. Both P and P′ go into AIChilles, which searches new inputs W′ and reports weakness types: system crashes, slowdowns, memory blowups, or P′ performing worse than the original P."></div>

<p class="figure-caption"><strong>Fig. 1.</strong> AI evolution optimizes a program for a higher KPI on a fixed workload <em>W</em>. AIChilles <a href="#ref-1">[1]</a> takes the initial program <em>P</em> and the evolved program <em>P′</em>, searches new inputs <em>W′</em>, and exposes where <em>P′</em> crashes, slows down, blows up memory, or performs worse than <em>P</em>.</p>

AI-driven system evolution promises to revolutionize how we innovate computer systems. Traditionally, optimizing system heuristics takes specialized expertise and huge engineering effort. AI evolution provides a new possibility: why not give AI agents a system program, an evaluator, and enough iterations, and let them automatically discover better implementations?

Recent work (e.g., [AdaEvolve](https://arxiv.org/pdf/2602.20133) [[2]](#ref-2), [Engram](https://dl.acm.org/doi/10.1145/3786335.3813138) [[3]](#ref-3), [OpenEvolve](https://github.com/algorithmicsuperintelligence/openevolve) [[4]](#ref-4), [CoCoEvolve](https://www.snowflake.com/en/blog/engineering/optimize-snowflake-ai-systems-cocoevolve/) (Snowflake) [[5]](#ref-5), [AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) (Google DeepMind) [[6]](#ref-6), [SFR-AutoR&D](https://sfr-autornd.github.io/) (Salesforce) [[7]](#ref-7), [ArchAgent](https://research.google/pubs/archagent-v2-a-case-study-with-the-data-prefetching-championship/) (Google) [[8]](#ref-8)) claims impressive improvements across a wide range of systems tasks. We got excited and wanted to see: are these improvements robust and generalizable to the broader system? However, we soon found that the promise was not as good as it seemed.

### AIChilles can automatically expose weaknesses in AI-evolved systems

When we started testing these systems, we noticed some weaknesses. The evolved programs often found a solution that worked well on the benchmark, but failed badly on new input workloads. We also observed that the program could crash at runtime, become much slower as the workload scaled, consume substantially more memory, or return a worse solution.

Motivated by this observation, we designed **AIChilles** ([paper](https://arxiv.org/abs/2606.15834), [code](https://github.com/lesleychou/aichilles)) [[1]](#ref-1), an agentic system for finding the “[Achilles’ heel](https://en.wikipedia.org/wiki/Achilles%27_heel)” of AI-evolved system programs. AIChilles takes as input an original program and its AI-evolved version. It infers the valid workload space, then searches for concrete workloads where the evolved program behaves much worse than the original program.

<div class="figure figure-centered" data-vega="/assets/data/ai-evolved-prism-scalability.vl.json"></div>

<p class="figure-caption"><strong>Fig. 2.</strong> AIChilles searches beyond the workloads used by the original evaluator. It finds valid inputs where the AI-evolved program behaves much worse relative to the baseline. Here, evolved programs have scalability issues on larger input workloads.</p>

We reported our findings to teams working on AI-evolution frameworks (AdaEvolve [[2]](#ref-2) and Engram [[3]](#ref-3)), and they acknowledged the issues found by AIChilles. They agree that when an evaluator rewards only benchmark score, AI evolution may exploit that objective aggressively and reveal gaps in the evaluator (see [blog](https://ucbskyadrs.github.io/blog/aichilles/)).

### Do specifications and multiagent workflows fix this?

More recently, systems such as [SkySynth](https://skydiscover-ai.github.io/blog-skysynth.html) [[9]](#ref-9) try to address this concern with explicit specifications and structured multi-agent workflows. Instead of asking one agent to optimize the program, SkySynth first asks an AI agent to propose the specification. Different agents then generate implementations, tests, and checks against these requirements before accepting a solution. The authors claim that this structured workflow could avoid the reward-hacking problem in evolved programs.

This made us wonder: perhaps explicit specifications and multiple testing agents could eliminate the failures we had seen before? So we tested SkySynth with AIChilles on its LLM-router application (AIChilles currently supports Python-based programs). Unfortunately, we still found evidence that the evolved program violated its own specification!

We ran AIChilles on the SkySynth-generated program, and found that it violated its own generated specification under new workloads. The specification explicitly required every request to end in one of two states: answered or refused. But under a severe capacity shortage, the evolved router repeatedly retried some requests without ever answering or refusing them.

We also found the full multi-agent evolution loop was expensive. A single run on one input configuration could take more than eight hours (and often exceed the Claude Pro token session limit). This makes it hard to run such a multi-agent workflow as "just-in-time."

### The new "bitter" lesson for AI-evolved systems

When an AI tells us it has improved a system, we should not only ask, "How much better is the score?" We should also ask, **"Is this score actually a faithful metric, and does it represent what we want to improve in the system?"**

Before we blame AI agents for reward hacking, we should first check **whether we gave them an incomplete signal to optimize** in the first place.

<div class="callout">
  <p>If you want to run AIChilles on your own AI-evolved system, please let us know! <button type="button" class="copy-email" data-u="leszhou" data-d="umd.edu" aria-label="Copy email address" title="Copy email address"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><span class="copy-email-tip" role="status"></span></button></p>
  <p>Or feel free to open an issue on the <a href="https://github.com/lesleychou/aichilles">code repo</a> and we will test them!</p>
</div>

### References

<ol class="references">
  <li id="ref-1"><em>AIChilles: Automatically Uncovering Hidden Weaknesses in AI-Evolved Systems.</em> arXiv:2606.15834, 2026. Yajie Zhou, Ao Li, Ashwin Silla, Zaoxing Liu, Vyas Sekar. <a href="https://arxiv.org/abs/2606.15834">[arXiv]</a> <a href="https://github.com/lesleychou/aichilles">[code]</a></li>
  <li id="ref-2"><em>AdaEvolve: Adaptive LLM Driven Zeroth-Order Optimization.</em> arXiv:2602.20133, 2026. Mert Cemri, Shubham Agrawal, Akshat Gupta, et al. <a href="https://arxiv.org/abs/2602.20133">[arXiv]</a></li>
  <li id="ref-3"><em>Improving Coherence and Persistence in Agentic AI for System Optimization</em> (Engram). Proceedings of the ACM Conference on AI and Agentic Systems, 2026. Pantea Karimi, Kimia Noorbakhsh, Mohammad Alizadeh, Hari Balakrishnan. <a href="https://dl.acm.org/doi/10.1145/3786335.3813138">[doi]</a></li>
  <li id="ref-4"><em>OpenEvolve.</em> Open-source project, GitHub. <a href="https://github.com/algorithmicsuperintelligence/openevolve">[code]</a></li>
  <li id="ref-5"><em>CoCoEvolve: Evolutionary Optimization for AI Systems.</em> Snowflake Engineering Blog. <a href="https://www.snowflake.com/en/blog/engineering/optimize-snowflake-ai-systems-cocoevolve/">[blog]</a></li>
  <li id="ref-6"><em>AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms.</em> Google DeepMind blog. <a href="https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/">[blog]</a></li>
  <li id="ref-7"><em>SFR-AutoR&amp;D.</em> Salesforce AI Research. <a href="https://sfr-autornd.github.io/">[project]</a></li>
  <li id="ref-8"><em>ArchAgent v2: A Case Study with the Data Prefetching Championship.</em> Google Research. <a href="https://research.google/pubs/archagent-v2-a-case-study-with-the-data-prefetching-championship/">[paper]</a></li>
  <li id="ref-9"><em>Building Specialized Systems We Can Trust with Agents</em> (SkySynth). SkyDiscover blog. <a href="https://skydiscover-ai.github.io/blog-skysynth.html">[blog]</a></li>
</ol>
