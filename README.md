# 🎯 World-Class Leadership Assistant Personas

**138 World-Class Expert Personas for All Leaders' Problem Solving & Strategic Decision Making**

**모든 리더들의 문제 해결을 위한 138개 월드클래스 전문가 페르소나**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/seanshin0214/world-class-leadership-personas?style=social)](https://github.com/seanshin0214/world-class-leadership-personas)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Professional Personas](https://img.shields.io/badge/personas-138-blue)](https://github.com/seanshin0214/world-class-leadership-personas/tree/main/community)
[![World-Class](https://img.shields.io/badge/quality-World--Class-gold)](https://github.com/seanshin0214/world-class-leadership-personas)

An advanced persona management MCP server that provides **138 world-class expert personas** to solve every leader's challenges. From strategic planning to technical implementation, access the right expert at the right time with **80%+ token savings**.

---

## ✨ What is World-Class Leadership Assistant Personas?

A **Model Context Protocol (MCP) server** providing 138 world-class expert personas to solve every leader's challenges:
- 🎯 **Access 138 world-class expert advisors** on demand
- 🌟 **All personas World-Class certified** - Extensive experience and deep expertise
- 🚢 **Save 80%+ tokens** with "Submarine Mode" (0 tokens until triggered)
- 🧠 **Smart context detection** - AI suggests the right expert automatically
- 🔗 **Chain multiple experts** for comprehensive analysis
- 🌍 **Professional expertise** - from strategy to implementation

---

## 🚀 Key Features

### Core Capabilities
- **Submarine Mode**: Zero token consumption by default
- **Trigger-Based Activation**: Load personas only when needed via `@persona:name`
- **Individual File Management**: Each persona stored as a `.txt` file
- **Simple CRUD Operations**: Create, update, delete personas with MCP tools

### v2.0+ Innovations
- **🧠 Smart Context Detection**: AI analyzes conversation and suggests optimal expert
- **🔗 Expert Chaining**: Execute multiple experts sequentially for complex decisions
- **📊 Usage Analytics**: Track patterns and improve recommendations (local storage only)
- **🌟 World-Class Collection**: 138 expert advisors ready to use (all World-Class certified!)
- **📂 Category-Based Organization**: 9 categories with 100-unit numbering system
- **🔢 Smart Numbering**: 100s=Engineering, 200s=Design, 300s=Business, 400s=AI, 500s=Testing, 600s=Education, 700s=Science, 800s=Leadership, 900s=Legal
- **⚡ Automation Scripts**: Upgrade and numbering scripts included

---

## 💡 How Token Savings Work

### Traditional Approach (System Prompt)
```
Every conversation: 500 tokens consumed
100 conversations: 50,000 tokens wasted
Even when expertise isn't needed
```

### Leader's Decision Making Assistants Approach
```
Default: 0 tokens (Submarine Mode)
When needed: @persona:name → Active only for that conversation
Next conversation: Back to 0 tokens
```

**Result**: 80%+ token savings in real-world usage

---

## 📦 Installation

### Prerequisites
- Claude Desktop
- Node.js 18+
- npm or yarn

### Steps

1. **Clone and Install**
```bash
git clone https://github.com/seanshin0214/world-class-leadership-personas.git
cd world-class-leadership-personas
npm install
```

2. **Configure Claude Desktop**

Edit `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac):

```json
{
  "mcpServers": {
    "persona": {
      "command": "node",
      "args": ["C:\\path\\to\\world-class-leadership-personas\\dist\\index.js"]
    }
  }
}
```

3. **Restart Claude Desktop**

---

## 🎯 Quick Start

### 1. Browse Community Personas

```
You: "Browse community personas"
Claude: [Executes browse_community tool]

🌟 Community Persona Collection

Found 26 personas

## Innovation & Technology
- innovation-expert
- ai-engineer
- fullstack-dev
...
```

### 2. Install a Persona

```
You: "Install innovation-expert persona"
Claude: [Executes install_community_persona]
✅ Persona "innovation-expert" installed successfully!
```

### 3. Use the Persona

```
You: "@persona:innovation-expert Analyze our product's disruption potential"
Claude: [Activates innovation expert persona and analyzes]
```

### 4. Smart Suggestions

```
You: "Explain quantum computing to a 10-year-old"
Claude: [Executes suggest_persona]
💡 Persona Suggestion
Recommended: @persona:science-teacher
Confidence: 85%
Reason: Educational context detected
```

---

## 🌟 Community Persona Collection

**138 world-class expert personas organized by category!**

### 📂 Category-Based Organization (NEW!)

All personas are now organized with a **100-unit numbering system** for easy navigation:

```
100-199: 💻 Engineering & Development (30 personas)
200-299: 🎨 Design & Creative (22 personas)
300-399: 💼 Business & Strategy (34 personas)
400-499: 🤖 Data, AI & ML (8 personas)
500-599: 🧪 Testing & QA (2 personas)
600-699: 📚 Education & Training (24 personas)
700-799: 🔬 Science & Research (13 personas)
800-899: 👔 Leadership & Management (2 personas)
900-999: ⚖️  Legal & Advisory (3 personas)
```

**📖 Full Catalog**: See [PERSONA_CATEGORIES.md](PERSONA_CATEGORIES.md) for complete list

### 🏛️ The Council for Future Design (NEW!)

**8 Executive-Level Advisory Personas for Strategic Decision-Making**

The Council represents the pinnacle of business expertise - world-class advisors who have shaped Fortune 100 companies, led $15B+ deals, and transformed entire industries. Each brings 20+ years of experience and proven methodologies.

#### Strategic & Leadership (96-98)
- `96-strategic-oracle` - **전략의 현자**: MIT Systems Dynamics PhD, 15yr McKinsey Partner, WEF Advisor. 7-dimension macro analysis, 4th-gen scenario planning, Real Options valuation
- `97-ethical-technologist` - **윤리적 기술 설계자**: Google AI Ethics Board founder, DeepMind Safety, IEEE P7000 Chair. AI fairness (LIME/SHAP), Zero Trust security, Differential Privacy
- `98-governance-guardian` - **거버넌스 수호자**: Yale Law JD, 3x S&P 500 Board Chair, SEC Enforcement. Board optimization, CEO succession, crisis management (6-hour golden time)

#### People & Markets (99-100)
- `99-human-dynamics-architect` - **인간 역학 설계자**: Harvard Org Psych PhD, Google People Ops VP (Project Aristotle). ONA, psychological safety, generational integration, continuous performance (OKRs)
- `100-market-experience-creator` - **시장 경험 창조자**: Stanford GSB, P&G Brand Director, Apple CX VP, Tesla CMO. Brand architecture, 15-20 touchpoint orchestration, Marketing Mix Modeling, D2C transformation

#### Execution & Growth (101-102)
- `101-execution-capital-alchemist` - **실행 자본 연금술사**: Wharton MBA, McKinsey Ops Partner, Goldman M&A MD, KKR/Blackstone. DCF/LBO modeling, Lean Six Sigma DMAIC, PMI 100-day plans, turnaround ($500M saved)
- `102-agile-growth-architect` - **민첩한 성장 설계자**: Google X, Y Combinator Partner, 3x Unicorn founder, a16z. Product-Market Fit (Sean Ellis Test), AARRR funnel, viral growth (K-factor), 0→$10M ARR playbooks

#### Sustainability (108)
- `108-sustainability-policy-shaper` - **지속가능성 정책 설계자**: Harvard Kennedy MPA, UN SDG Officer, World Bank Green Bond, EU Climate Advisor. ESG materiality, Scope 1/2/3, Science-Based Targets, Net Zero roadmaps, PPP structures

**When to Use the Council:**
- Complex strategic decisions requiring multiple perspectives
- M&A integration, transformation, or turnaround scenarios
- Balancing innovation, ethics, profitability, and sustainability
- Building world-class teams, boards, and governance structures

**Example Council Session:**
```
You: "@persona:96-strategic-oracle Should we enter the AGI market given 2030 timeline?"
[Strategic Oracle analyzes with 4 scenarios, Real Options]

You: "@persona:97-ethical-technologist What are the AI ethics implications?"
[Ethical Technologist applies 3-filter framework, TCFD risks]

You: "@persona:101-execution-capital-alchemist What's the financial model?"
[Execution Alchemist builds LBO model, Unit Economics, IRR projections]
```

### Innovation & Technology (5)
- `innovation-expert` - Innovation strategy and disruption analysis
- `ai-engineer` - AI/ML engineering and architecture
- `fullstack-dev` - Full-stack web development
- `data-engineer` - Data pipelines and infrastructure
- `devops-engineer` - DevOps, CI/CD, cloud infrastructure

### Business & Strategy (6)
- `business-mgmt` - Business management and operations
- `strategy-consultant` - Strategic consulting and planning
- `product-manager` - Product management and roadmapping
- `vp-innovation` - VP of Innovation perspective
- `disruptive-entrepreneur` - Disruptive business models
- `global-startup` - Global startup strategy

### Education & Learning (7)
- `education-policy` - Education policy and reform
- `intl-education` - International education systems
- `student-mobility` - Student mobility and exchange programs
- `elite-tutor` - Elite tutoring and exam preparation
- `college-consultant` - College admissions consulting
- `university-president` - University leadership perspective
- `science-teacher` - Science education

### Analytics (2)
- `business-analytics` - Business data analysis
- `education-analytics` - Education data and metrics

### Professional Services (2)
- `harvard-law-dispute` - Harvard Law School dispute resolution
- `harvard-phd-negotiation` - Harvard PhD-level negotiation

### Example Personas (4)
- `python-master` - Python programming expert
- `creative-writer` - Creative writing and storytelling
- `product-strategist` - Product strategy
- `ux-design-expert` - UX design and user research

---

## 🛠️ Advanced Features

### Persona Chaining

Execute complex multi-step workflows:

```
You: "Chain these personas: coder → teacher → professional"

Step 1 - coder: Code analysis and bug detection
Step 2 - teacher: Explain findings to beginners
Step 3 - professional: Create formal report

✅ Chain completed: 3/3 steps
```

**Use Cases:**
- Code review → Documentation → Presentation
- Analysis → Summary → Executive brief
- Brainstorming → Structure → Final proposal

### Usage Analytics

```
You: "Show persona analytics"

📊 Persona Usage Analytics

Usage count:
  professional: 15 uses
  coder: 12 uses
  teacher: 8 uses

Top context patterns:
  professional: business, report, meeting
  coder: function, debug, implement
  teacher: explain, understand, learn

💡 Data stored locally only (never transmitted)
```

---

## 🔧 MCP Tools

### Basic Tools
1. **create_persona** - Create new persona
2. **update_persona** - Modify existing persona
3. **delete_persona** - Remove persona
4. **list_personas** - List all available personas

### Advanced Tools (v2.0)
5. **suggest_persona** - AI-powered persona recommendation
6. **chain_personas** - Sequential persona execution
7. **get_analytics** - View usage statistics
8. **browse_community** - Explore community collection
9. **install_community_persona** - One-click install from community

---

## 💡 Vision: Persona Marketplace

This is just the beginning! We're building the **world's first MCP Persona Marketplace**.

### Roadmap

**Phase 1 (Current):** GitHub Community
- ✅ 26 free personas
- ✅ Open source (MIT)
- ✅ Community contributions

**Phase 2 (In Development):** Persona Hub Website
- 🚧 Web-based marketplace
- 🚧 Search and discovery
- 🚧 One-click installation

**Phase 3 (Planned):** Creator Economy
- 💰 Premium personas
- 💰 70/30 revenue sharing (Creator/Platform)
- 💰 Monetize your expertise

See [VISION.md](VISION.md) for details.

---

## 🤝 Contributing

We welcome contributions! Share your expertise with the community.

### How to Contribute a Persona

1. Create persona following [community examples](community/)
2. Include metadata (Author, Category, Version)
3. Submit via [Persona Submission Issue](https://github.com/seanshin0214/leaders-decision-assistants/issues/new?template=persona_submission.md)
4. Or create a Pull Request

### Revenue Sharing Promise

**When Persona Hub launches:**
- 70% to Creator
- 30% to Platform
- Minimum payout: $50/month
- Monthly transparent reports

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

---

## ❓ FAQ

### Does this cost money to use?

**No API costs.** Leader's Decision Making Assistants is completely free to use. Unlike AI Council MCP (which calls multiple AI APIs), Leader's Decision Making Assistants only manages text files on your local computer. It doesn't make any external API calls.

**What you need:**
- ✅ Claude Desktop (free or paid subscription)
- ✅ Node.js (free)
- ❌ No additional API keys required
- ❌ No pay-per-use costs

**Cost structure:**
- Leader's Decision Making Assistants itself: **$0** (open source, MIT License)
- Running personas in Claude Desktop: Uses your existing Claude subscription
- The personas are just text prompts that enhance Claude's behavior

### Who pays for what?

**You:**
- Your Claude Desktop subscription (if using Claude Pro)
- No additional costs for Leader's Decision Making Assistants

**Creator (@seanshin0214):**
- Does NOT pay for your Claude usage
- Does NOT collect any fees
- Provides this as free open-source software

### Is this a cloud service or SaaS?

**No.** Leader's Decision Making Assistants runs entirely on your local computer.

**How it works:**
1. You download and install Leader's Decision Making Assistants on your computer
2. Personas are stored as `.txt` files in `~/.persona/` folder
3. When you type `@persona:name`, it loads that text file
4. No data sent to external servers
5. Everything stays on your machine

### Do you collect any data?

**No.** Everything is local:
- ✅ Persona files stored locally (`~/.persona/`)
- ✅ Usage analytics stored locally (never transmitted)
- ✅ No telemetry, tracking, or data collection
- ✅ No central server to send data to
- ✅ Your privacy is 100% protected

### How is this different from ChatGPT custom GPTs?

**ChatGPT Custom GPTs:**
- Cloud-based, stored on OpenAI servers
- Requires ChatGPT Plus ($20/month)
- Limited to OpenAI ecosystem
- Can be shared publicly (privacy concerns)

**Leader's Decision Making Assistants:**
- Runs locally on your computer
- Works with Claude Desktop (any tier)
- Open source and fully customizable
- 100% private (never leaves your machine)
- 80%+ token savings with Submarine Mode
- Community marketplace with revenue sharing

### Will the marketplace charge for personas?

**Current (Phase 1):**
- All 26 community personas are **FREE**
- MIT License (open source)

**Future (Phase 3 - Planned):**
- Premium personas may be offered by creators
- 70/30 revenue split (Creator gets 70%)
- Free personas will always remain available
- You choose what to download

**If you contribute a persona now:**
- It's free and open source (MIT)
- If marketplace launches, you're eligible for 70% revenue share on premium versions
- See [CONTRIBUTING.md](CONTRIBUTING.md) for details

---

## 📚 Documentation

- [VISION.md](VISION.md) - Long-term vision and roadmap
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines and revenue sharing
- [Community Personas](community/) - Browse all 26 personas

---

## 🐛 Troubleshooting

### MCP Server Not Showing

1. Completely quit and restart Claude Desktop
2. Check config file path: `%APPDATA%\Claude\claude_desktop_config.json`
3. Verify JSON syntax (commas, brackets)

### Persona Not Activating

- Use exact format: `@persona:name`
- Check persona name spelling
- Run `list_personas` to see available personas

### File Location Issues

**Windows:** `C:\Users\YourName\.persona\`
**Mac/Linux:** `~/.persona/`

Note: Folder may be hidden (enable "Show hidden files" in Explorer)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

Built with:
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk) by Anthropic
- [docx](https://www.npmjs.com/package/docx) for Word export

Special thanks to all community contributors!

---

## 🔗 Links

- **GitHub**: https://github.com/seanshin0214/leaders-decision-assistants
- **Issues**: https://github.com/seanshin0214/leaders-decision-assistants/issues
- **Discussions**: https://github.com/seanshin0214/leaders-decision-assistants/discussions

---

**Created by**: @seanshin0214
**Version**: 2.0.0
**Last Updated**: 2025-11-02

🎭 **Join the Persona Revolution!** ⭐ Star the repo to support the project!
