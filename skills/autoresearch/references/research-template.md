# Research Loop — Output Template & Firecrawl Patterns

## Firecrawl Command Patterns

### Round 1: Broad Discovery

```bash
# Wide search
firecrawl search "<topic>" --limit 10 -o .firecrawl/research/round1-broad.json --json

# Targeted angles (parallel)
firecrawl search "<topic> statistics data numbers" --limit 5 -o .firecrawl/research/round1-stats.json --json &
firecrawl search "<topic> controversy criticism debate" --limit 5 -o .firecrawl/research/round1-angles.json --json &
firecrawl search "<topic> timeline history" --limit 5 -o .firecrawl/research/round1-timeline.json --json &
wait

# Scrape top results (parallel)
firecrawl scrape "<url1>" --only-main-content -o .firecrawl/research/source1.md &
firecrawl scrape "<url2>" --only-main-content -o .firecrawl/research/source2.md &
firecrawl scrape "<url3>" --only-main-content -o .firecrawl/research/source3.md &
wait
```

### Round 2+: Gap-Filling

```bash
# Target weakest dimensions from scoring
firecrawl search "<topic> <specific gap query>" --limit 5 -o .firecrawl/research/round2-gap1.json --json
firecrawl search "<topic> <another gap>" --limit 5 -o .firecrawl/research/round2-gap2.json --json
```

### Reading Results

Never read entire files. Use targeted extraction:

```bash
# Check file size
wc -l .firecrawl/research/source1.md

# Find specific content
grep -n "keyword" .firecrawl/research/source1.md
grep -A 10 "## Section" .firecrawl/research/source1.md

# Extract URLs from search results
jq -r '.data.web[] | "\(.title): \(.url)"' .firecrawl/research/round1-broad.json
```

## Scoring Template

After each round, evaluate each dimension 0-100:

```
Research Score — Round X:
  core_facts:   XX/100 — [brief justification]
  data_stats:   XX/100 — [brief justification]
  key_players:  XX/100 — [brief justification]
  timeline:     XX/100 — [brief justification]
  impact:       XX/100 — [brief justification]
  controversy:  XX/100 — [brief justification]
  future:       XX/100 — [brief justification]
  visuals:      XX/100 — [brief justification]
  ---
  OVERALL:      XX/100
  GAPS:         [what to search for next]
```

## Output Document Template

```markdown
# Research: <Topic>

## Key Facts
- [sourced fact 1] (source: url)
- [sourced fact 2] (source: url)

## Statistics & Data
- [stat with specific number] (source: url)
- [stat with specific number] (source: url)

## Key Players
- [person/org]: [role and relevance]

## Timeline
- [date]: [event]

## Impact & Significance
- [why this matters]

## Debates & Criticism
- [opposing view 1]
- [opposing view 2]

## Future Trends
- [prediction/trend]

## Visual Opportunities
- [vivid scene/moment for imagery]

## Sources
1. [url] — [what it contributed]
2. [url] — [what it contributed]

## Research Score: XX/100
Dimensions: core_facts=XX, data_stats=XX, key_players=XX, timeline=XX,
            impact=XX, controversy=XX, future=XX, visuals=XX
Rounds completed: X
```
