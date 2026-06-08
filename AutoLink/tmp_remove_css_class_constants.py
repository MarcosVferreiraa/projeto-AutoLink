from pathlib import Path
import re

root = Path('src')
const_pattern = re.compile(r'^(const\s+([A-Za-z0-9_]+Class[0-9]*)\s*=\s*(["\\'])(.*?)\3;)$')
jsx_usage_pattern = r'\bclassName\s*=\s*\{{\s*{name}\s*\}}'
createel_usage_pattern = r'\bclassName\s*:\s*{name}\b'

modified_files = []
for path in sorted(root.rglob('*.jsx')):
    text = path.read_text(encoding='utf-8')
    lines = text.splitlines()
    consts = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        m = const_pattern.match(stripped)
        if m:
            consts.append((i, m.group(2), m.group(4)))
    if not consts:
        continue

    new_text = text
    to_remove = set()
    replaced_any = False
    for idx, name, value in consts:
        total_occurrences = len(re.findall(r'\b' + re.escape(name) + r'\b', new_text))
        if total_occurrences == 0:
            to_remove.add(idx)
            continue
        jsx_pattern = re.compile(jsx_usage_pattern.format(name=re.escape(name)))
        createel_pattern = re.compile(createel_usage_pattern.format(name=re.escape(name)))
        jsx_count = len(jsx_pattern.findall(new_text))
        createel_count = len(createel_pattern.findall(new_text))
        if jsx_count + createel_count != total_occurrences:
            continue
        new_text = jsx_pattern.sub(f'className="{value}"', new_text)
        new_text = createel_pattern.sub(f'className: "{value}"', new_text)
        to_remove.add(idx)
        replaced_any = True

    if not replaced_any:
        continue

    new_lines = new_text.splitlines()
    for idx, _, _ in sorted(consts, reverse=True):
        if idx < len(new_lines) and const_pattern.match(new_lines[idx].strip()):
            del new_lines[idx]
    cleaned_lines = []
    blank = False
    for line in new_lines:
        if line.strip() == '':
            if not blank:
                cleaned_lines.append(line)
            blank = True
        else:
            cleaned_lines.append(line)
            blank = False
    final_text = '\n'.join(cleaned_lines).rstrip() + '\n'
    if final_text != text:
        path.write_text(final_text, encoding='utf-8')
        modified_files.append(path)
        print(f'Updated {path}')

print(f'Total modified files: {len(modified_files)}')
