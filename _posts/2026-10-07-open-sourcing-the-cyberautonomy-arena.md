---
title: Open-Sourcing The CyberAutonomy Arena
subtitle: A universal framework for evaluating autonomous network security systems
authors: [lakshmi-adiga, vyas-sekar]
description: Network defenses need to drastically evolve to match AI-assisted attackers, but we have limited data and insight to drive this evolution. The CyberAutonomy Arena enables large scale experimentation to provide these insights into the interaction and evolution of autonomous attacker and defender systems.
---

<style>
/* Figures that swap on BOTH theme (site's data-theme toggle, default dark)
   and viewport (site breakpoint is 700px): horizontal art on desktop,
   vertical art on mobile. The `.content` prefix is required so the hide rule
   outranks the site's `.content .figure img { display:block }`. */
.content .tv-swap .tv{ display:none !important; max-width:100%; height:auto; margin:0 auto; }
@media (min-width:701px){
  html:not([data-theme="light"]) .content .tv-swap .tv-desktop.tv-dark{ display:block !important; }
  html[data-theme="light"]       .content .tv-swap .tv-desktop.tv-light{ display:block !important; }
}
@media (max-width:700px){
  html:not([data-theme="light"]) .content .tv-swap .tv-mobile.tv-dark{ display:block !important; }
  html[data-theme="light"]       .content .tv-swap .tv-mobile.tv-light{ display:block !important; }
}
/* Component sub-headings. reset.css gives headings `font: inherit`, so an
   unstyled h4 inherits 24px (bigger than the 18px h3); pin it smaller here. */
.content h4{ font-size: 15px !important; font-weight: 600; line-height: 1.35; color: var(--primary-color); }
/* Ordered list rendered with "1)" "2)" markers instead of disc/decimal. */
.content ol.paren{ list-style: none; padding: 0 1rem 0 2.2rem; counter-reset: paren; }
.content ol.paren li{ counter-increment: paren; position: relative; }
.content ol.paren li::before{ content: counter(paren) ") "; position: absolute; left: -1.4rem; }
</style>

<div class="callout tldr">
  <p class="tldr-label">TL;DR</p>
  <ul>
    <li>LLM cyber capabilities have enabled cyberattackers to execute exploits at machine speed, and machine scale.</li>
    <li>Network defenders are overwhelmed and current defense systems are ill-equipped to handle these constantly evolving threats. We need data to inform how we design a new paradigm of evolving, autonomous network defenses.</li>
    <li>The CyberAutonomy Arena enables large scale experimentation by allowing any autonomous attacker to be played against any autonomous defender on any network using a universal interface. We open source the arena <a href="https://github.com/cylabcyberautonomy/CyberAutonomyArena">here</a> <em></em>.</li>
  </ul>
</div>

### What if defenders could set the pace?

<div class="figure figure-image tv-swap">
  <img class="tv tv-desktop tv-dark"  src="{{ '/assets/img/posts/cyberautonomy-arena/today-vision-desktop-dark.webp' | relative_url }}"  alt="Side-by-side comparison. Today: human and AI attackers act at machine timescale while human defenders observe and react at human timescale against rigid defenses that can't adapt in real time. Our Vision: human and AI defenders scale exponentially, operate at machine timescale, observe attacker-defender interactions, and run adaptable, personalized defenses that evolve in real time." width="2000" height="857">
  <img class="tv tv-desktop tv-light" src="{{ '/assets/img/posts/cyberautonomy-arena/today-vision-desktop-light.webp' | relative_url }}" alt="Side-by-side comparison. Today: human and AI attackers act at machine timescale while human defenders observe and react at human timescale against rigid defenses that can't adapt in real time. Our Vision: human and AI defenders scale exponentially, operate at machine timescale, observe attacker-defender interactions, and run adaptable, personalized defenses that evolve in real time." width="2000" height="857">
  <img class="tv tv-mobile tv-dark"  src="{{ '/assets/img/posts/cyberautonomy-arena/today-vision-mobile-dark.png' | relative_url }}"  alt="Stacked comparison. Today: human and AI attackers act at machine timescale while human defenders observe and react at human timescale against rigid defenses that can't adapt in real time. Our Vision: human and AI defenders scale exponentially, operate at machine timescale, observe attacker-defender interactions, and run adaptable, personalized defenses that evolve in real time." width="1168" height="1896">
  <img class="tv tv-mobile tv-light" src="{{ '/assets/img/posts/cyberautonomy-arena/today-vision-mobile-light.png' | relative_url }}" alt="Stacked comparison. Today: human and AI attackers act at machine timescale while human defenders observe and react at human timescale against rigid defenses that can't adapt in real time. Our Vision: human and AI defenders scale exponentially, operate at machine timescale, observe attacker-defender interactions, and run adaptable, personalized defenses that evolve in real time." width="1168" height="1896">
</div>

<p class="figure-caption"><strong>Today vs. our vision.</strong> Defenders are outpaced by machine-speed attackers and run rigid defenses that can't adapt in real time. We envision defenders operating at machine scale, observing each network's interactions and evolving adaptable, personalized defenses in real time.</p>

Today, network defenders face two main challenges:

<ol class="paren">
  <li>Managing increasingly overwhelmed, overburdened security systems.</li>
  <li>Trying to adapt those systems as threats evolve.</li>
</ol>

Trying to keep pace with autonomous attackers in this current paradigm is near-impossible.

We envision a future of autonomous network security where defenders are able to operate at machine scale and machine speed, operating adaptive defense systems that observe each network's unique interactions and continuously evolve in response.

The CyberAutonomy Arena helps us move toward this autonomous future by enabling rapid experimentation, generating data on how autonomous attackers and defenders interact. With this data we can start guiding data-driven, evolving defense systems.

### Why the CyberAutonomy Arena?

<div class="figure figure-image tv-swap">
  <img class="tv tv-desktop tv-dark"  src="{{ '/assets/img/posts/cyberautonomy-arena/why-desktop-dark.webp' | relative_url }}"  alt="Progression across three stages. Isolated component evaluations: an intrusion detection system is evaluated on labeled network traffic datasets and an exploit generator on a set of vulnerable programs. End-to-end system evaluations: a complete defender system and a complete attacker system are deployed against each other on a real network. Collection of systems evaluations: multiple defender systems and multiple attacker systems compete on the network." width="2000" height="546">
  <img class="tv tv-desktop tv-light" src="{{ '/assets/img/posts/cyberautonomy-arena/why-desktop-light.webp' | relative_url }}" alt="Progression across three stages. Isolated component evaluations: an intrusion detection system is evaluated on labeled network traffic datasets and an exploit generator on a set of vulnerable programs. End-to-end system evaluations: a complete defender system and a complete attacker system are deployed against each other on a real network. Collection of systems evaluations: multiple defender systems and multiple attacker systems compete on the network." width="2000" height="546">
  <img class="tv tv-mobile tv-dark"  src="{{ '/assets/img/posts/cyberautonomy-arena/why-mobile-dark.webp' | relative_url }}"  alt="Progression across three stages, stacked vertically. Isolated component evaluations: an intrusion detection system is evaluated on labeled network traffic datasets and an exploit generator on a set of vulnerable programs. End-to-end system evaluations: a complete defender system and a complete attacker system are deployed against each other on a real network. Collection of systems evaluations: multiple defender systems and multiple attacker systems compete on the network." width="777" height="2000">
  <img class="tv tv-mobile tv-light" src="{{ '/assets/img/posts/cyberautonomy-arena/why-mobile-light.webp' | relative_url }}" alt="Progression across three stages, stacked vertically. Isolated component evaluations: an intrusion detection system is evaluated on labeled network traffic datasets and an exploit generator on a set of vulnerable programs. End-to-end system evaluations: a complete defender system and a complete attacker system are deployed against each other on a real network. Collection of systems evaluations: multiple defender systems and multiple attacker systems compete on the network." width="777" height="2000">
</div>

<p class="figure-caption">From isolated components to end-to-end systems to collections of competing systems: prior work evaluates single components in isolation, while the arena evaluates complete attacker and defender systems against one another.</p>

Current work in evaluating security measures and exploits tends to be component based, evaluating components on their efficacy in isolation, on benchmarks of static files. These evaluations are static, quickly saturate, and don't necessarily reflect how these components behave when implemented in end-to-end systems in the real world.

For example, an intrusion detection system may score highly on a network telemetry benchmark yet overwhelm downstream alert triage, reducing the effectiveness of the overall defense system.

We want to see how end-to-end attack and defense systems behave in a closer-to-real-world setting, a real network. These arena evaluations provide that, and are more realistic, harder to saturate, and adapt as new attacker and defender systems are evaluated.

### How does the CyberAutonomy Arena work?

The arena brings three new systems to the table.

#### 1. An abstraction for expressing attackers and defenders

Allows researchers to describe attack and defense strategies at a high level and combine components into complete systems methodically. This lets researchers to quickly iterate on attack/defense design.

#### 2. Standardized interfaces for connecting systems and networks

We allow attacker systems, defender systems, and network deployment systems to be treated like black boxes, as long as they expose a set of 10 functions the arena uses to drive an experiment lifecycle. Researchers can swap components and explore new combinations without rebuilding the experiment around each implementation.

#### 3. A network specification and deployment framework

We provide a way of configuring a network through just one YAML file. Using our vulnerability catalogue &mdash; a public set of software setup scripts associated with each vulnerability &mdash; we can instantiate a huge set of varied networks and attack chains. Our network deployment orchestrator is able to optimize this deployment, reducing network deployment times from 6&ndash;8 hours to an average of 30 minutes on our networks.

### How can I use the arena?

The arena is designed to support your choice of attacker, defender, and network deployment system through its standardized interfaces. Simply write a plugin that exposes the functions required for the arena interface to deploy your own attacker and defender systems on any existing network deployment infrastructure you support.

If you would like to replicate our setup, we use three projects: Incalmo for attack systems, Perry for defense systems, and MHBench for network deployment. To get started with the same components, clone the repositories and follow the setup instructions in their READMEs:

* [Incalmo](https://github.com/cylabcyberautonomy/Incalmo): our autonomous attack system
* [MHBench](https://github.com/cylabcyberautonomy/MHBench): our multi-host network deployment system
* [Perry](https://github.com/cylabcyberautonomy/Perry): our repository for autonomous defenses
