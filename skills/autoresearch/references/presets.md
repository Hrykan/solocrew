# Autoresearch Presets

Ready-to-use configurations for common optimization targets. Copy the relevant section into a `program.md` file in the project root.

## E2E Test Coverage

```markdown
# Autoresearch: E2E Test Pass Rate

## Goal
Maximize test pass rate. Current: XX/YY. Direction: higher is better.

## In-scope files
- src/**/*.tsx
- src/**/*.ts

## Out-of-scope
- tests/**/* (do not modify test files — that's cheating)
- package.json, configs

## Metric command
npx playwright test --reporter=line 2>&1 | tail -3 | grep -oP '\d+(?= passed)'

## Baseline
XX passed
```

## Bundle Size

```markdown
# Autoresearch: Bundle Size Reduction

## Goal
Minimize production bundle size. Current: XXX KB. Direction: lower is better.

## In-scope files
- src/**/*.tsx
- src/**/*.ts

## Out-of-scope
- vite.config.ts
- package.json

## Metric command
npm run build 2>&1 && du -sk dist/ | cut -f1

## Baseline
XXX KB
```

## Lighthouse Performance

```markdown
# Autoresearch: Lighthouse Performance Score

## Goal
Maximize Lighthouse performance score. Current: XX. Direction: higher is better.

## In-scope files
- src/**/*.tsx
- src/**/*.css

## Out-of-scope
- vite.config.ts
- public/*

## Metric command
npx lighthouse http://localhost:5173 --output=json --chrome-flags="--headless" 2>/dev/null | jq '.categories.performance.score * 100'

## Baseline
XX
```

## TypeScript Type Safety

```markdown
# Autoresearch: Type Error Elimination

## Goal
Minimize TypeScript errors. Current: XX errors. Direction: lower is better (0 = perfect).

## In-scope files
- src/**/*.ts
- src/**/*.tsx

## Out-of-scope
- tsconfig.json
- node_modules

## Metric command
npx tsc --noEmit 2>&1 | grep -c 'error TS' || echo 0

## Baseline
XX errors
```

## Lint Warnings

```markdown
# Autoresearch: Lint Warning Cleanup

## Goal
Eliminate lint warnings. Current: XX warnings. Direction: lower is better.

## In-scope files
- src/**/*.ts
- src/**/*.tsx

## Out-of-scope
- eslint.config.js
- .eslintrc*

## Metric command
npx eslint src/ 2>&1 | grep -c 'warning' || echo 0

## Baseline
XX warnings
```

## API Response Time

```markdown
# Autoresearch: API Response Time

## Goal
Minimize average API response time. Current: XXXms. Direction: lower is better.

## In-scope files
- src/api/**/*.ts
- src/server/**/*.ts

## Out-of-scope
- database migrations
- test files

## Metric command
./scripts/benchmark-api.sh | grep 'avg' | grep -oP '\d+(?=ms)'

## Baseline
XXXms
```

## Custom Metric

Template for any metric:

```markdown
# Autoresearch: [Your Goal]

## Goal
[What to optimize]. Current: [value]. Direction: [lower/higher] is better.

## In-scope files
- [file patterns the agent CAN modify]

## Out-of-scope
- [file patterns the agent CANNOT modify — especially the scoring harness]

## Metric command
[exact shell command that outputs a single number]

## Baseline
[current value]
```
