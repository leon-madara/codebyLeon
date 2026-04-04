from pathlib import Path
path = Path('src/components/HorizontalScroll/MultiCardScrollSection.tsx')
patterns = {
    'hs-root': 'className="hs"',
    'story-section': 'className="hs__story',
    'track': 'className="hs__track',
}
lines = path.read_text().splitlines()
for name, pattern in patterns.items():
    matches = [i + 1 for i, line in enumerate(lines) if pattern in line]
    print(f"{name}: {matches}")
