---
title: Making development of autonomous red-teaming systems visual and understandable
authors: [shaden-almodhy, marko-morrison, Hanan Hibshi]
description: Existing agentic multi-host red-teaming systems are complicated and difficult to develop. To solve this, we created CyBlocks, a visual coding tool for developing AMR systems quickly and legibly.
---

<div class="figure"><img src="/assets/img/posts/cyblocks-1/01.png" alt="The CyBlocks IDE: a block palette on the left and an attacker system laid out as connected blocks on a dark canvas." width="2880" height="1458"></div>

- Existing **agentic multi-host red-teaming (AMR) systems** are complicated and difficult to develop.
- To solve this issue, we created **CyBlocks**: a visual coding tool for developing AMR systems quickly and legibly.
- The first version of CyBlocks can be found [here](https://github.com/cylabcyberautonomy/cyblocks).

### Current state

Agentic multi-host red-teaming (AMR) systems are becoming more powerful and popular. Popular examples include [ARTEMIS](https://claude.com/customers/artemis), [Incalmo](https://arxiv.org/abs/2501.16466), [CAI](https://github.com/aliasrobotics/CAI), and [PentestGPT](https://pentestgpt.com/paper.html). However, such systems usually consist of massive codebases. For example, PentestGPT's codebase consists of around 23k lines of code, and Incalmo's codebase reaches 38k lines of code.

### Problem

Currently, the complexity and size of AMR systems introduces a multitude of usability problems:

1. **Difficult to develop.** Creating AMR systems requires a high level of domain expertise in both security and software development. Maintaining such a system also requires deep knowledge of how it was built in the first place.
2. **Difficult to use.** Security professionals, non-security professionals such as policy analysts, executives and students may be unable to use an AMR system correctly or effectively without clearly legible internals.
3. **Difficult to understand.** Scientists, developers, and students have little clarity into why one system might work better than another due to the complexity of the codebase.

Programmers, pentesters, scientists, and non-domain experts all experience these same kinds of problems, which creates a high barrier for entry to autonomous cybersecurity experimentation.

### Approach & Challenges

In other domains, **visual coding** is a popular solution for lowering the barrier of entry to software development. Currently, many visual programming platforms exist that serve different domains, such as [Scratch](https://scratch.mit.edu/) lowering the barrier of entry for programming education, and [Google Visual Blocks](https://visualblocks.withgoogle.com/#/) for quickly building ML pipelines. There are also visual development platforms for agentic workflows such as n8n, LangGraph, and Agent Bricks, which help developers compose models, tools, and control logic through abstractions.

However, the unique characteristics of AMR systems make them incompatible with existing visual coding solutions.

- **Environmental challenges.** In contrast with more typical programming settings, AMR systems operate in uncertain, external environments. A visual coding solution must handle unpredictable status and a dynamic environment.
- **Diverse toolkits.** The tools available to an attacker range vastly in functionality, with new tools being introduced to the broader cybersecurity community every day. A visual coding system must be expressive and flexible enough to integrate new functionality with ease.
- **Control/data flow.** AMR systems are heavily interconnected and work with live and external services. Therefore, representing their control and data flow visually is difficult without creating a clutter that reduces readability.

To this end, our objective is to create a visual coding IDE that can make the development of autonomous red-teaming systems easier and more understandable.

<div class="figure"><img src="/assets/img/posts/cyblocks-1/02.png" alt="The block set grouped into four families - Control, Data, Agents and Actions - beside an example attacker system showing control flow and data flow between blocks." width="1296" height="927"></div>

### Solution

To accomplish this, our plan consisted of two phases. First, we created a more general abstraction of the building blocks used to compose AMR systems, along with the families that the blocks belong to. Second, we did an initial implementation of the block set, validating it by replicating functionality from actual AMR systems.

To derive the abstractions, we conducted a literature review of existing AMR systems ([Incalmo](https://arxiv.org/abs/2501.16466), [PentestGPT](https://pentestgpt.com/paper.html), [CAI](https://github.com/aliasrobotics/CAI)). Across different architectures, the same block-level abstraction kept recurring, along with a consistent pattern of control and data flow around the system. This allowed us to construct the initial block set abstraction derived from the diagrams and assigned them to different families of blocks (Agents, Control, Data, Actions) based on their functionality throughout the attack. Each block represents a code module that can be used as a step in the attack flow.

As proof of concept that our IDE and abstracted blocks are capable of building offensive cybersecurity systems, we replicated **PentestGPT** and a simplified version of **Incalmo**.

In addition to the attacker functionality, we also implemented an environment creation toolkit that deploys local Docker containers - no testbed needed to get testing!

### Project Status and Future Vision

Our ultimate goal is to lower the barrier to entry for the Cyber autonomy experimentation by expanding CyBlocks to support entire system handling from environments to offensive and defensive operations and analysis.

**Currently, CyBlocks V0.0.1 is released.**

- Set up **CyBlocks** on your local machine by following the instructions in our [README.md](https://github.com/cylabcyberautonomy/cyblocks/tree/main).
- Follow the instructions on our Github to construct your own attack systems or try the existing demo attacks.
- If you have any ideas or suggestions on how to improve **CyBlocks**, please reach out.

<!-- ### Functionality

- Agent Blocks:
  - Human: Utilizes a human in the loop as an executor, editor, or reviewer
  - LLM: Makes decisions depending on the parameters passed into it
  - Algorithm: Executes algorithms rules within the workflow
- Control Blocks:
  - Stop: terminate attack flow
  - Choice: Gives agents the ability to choose specific actions and branch to different control flows.
  - Start: Start of the attack flow.
  - Executor: Executes command-line in the terminal as determined by an agent and stores results in a DataFile.
- Data Blocks:
  - DataFile: Supports different file formats where all attack information, including command outputs and planning, is read from and written to.
  - Parameter: Provides preset instructions given as prompts to specify different kinds of agents.
  - Library: Contains external libraries utilized throughout the attack flow.
- Action Blocks:
  - Nmap: Executes network scanning commands.
  - Curl: Executes HTTP or network request commands.
  - Hydra: Executes login authentication testing commands.
  - SSH: Executes Secure Shell remote access commands -->
