import fitz
import json
import re

md_path = "../temp data/Updated Policies Dimension.md"
pdf_path = "../temp data/New Modified Policies.pdf"

# 1. Read MD file to get policy list
with open(md_path, 'r', encoding='utf-8') as f:
    md_lines = f.readlines()

policy_names = []
current_dim = ""
current_subcat = ""

structure = {}

for line in md_lines:
    line = line.strip()
    if line.startswith("มิติ"):
        current_dim = line
        structure[current_dim] = {}
    elif line.startswith("-"):
        current_subcat = line.replace("-", "").replace("(subcat)", "").strip()
        if current_dim:
            structure[current_dim][current_subcat] = []
    elif re.match(r'^\d+\.', line):
        # Policy name
        name = re.sub(r'^\d+\.', '', line).strip()
        # remove **
        name = name.replace("**", "").strip()
        if name:
            if current_dim and current_subcat:
                structure[current_dim][current_subcat].append(name)
            elif current_dim: # For future dimension which might have no subcat
                if "none" not in structure[current_dim]:
                    structure[current_dim]["none"] = []
                structure[current_dim]["none"].append(name)
            policy_names.append(name)

# 2. Extract text from PDF
doc = fitz.open(pdf_path)
text = ""
for page in doc:
    text += page.get_text()

text = text.replace('ำ', 'ำ')

# 3. We will try to find each policy's start index
# But OCR might have slight differences in names.
# Let's split by "ทำไมต้องนโยบายนี้"
parts = text.split("ทำไมต้องนโยบายนี้")

policies_data = []

for i in range(1, len(parts)):
    prev_part = parts[i-1]
    curr_part = parts[i]
    
    # Extract Title from prev_part
    prev_lines = [l.strip() for l in prev_part.split('\n') if l.strip()]
    if i == 1:
        title_lines = prev_lines
    else:
        # Find where feasibility of previous policy ended.
        # Usually feasibility ends and then the new title starts.
        # Let's just assume the last 1-4 lines of prev_part are the title.
        # Specifically, we can look for the longest line from the end, or just take everything after the last period? Thai doesn't use periods.
        # Let's look for "ความเป็นไปได้" in prev_lines.
        try:
            idx = len(prev_lines) - 1 - prev_lines[::-1].index("ความเป็นไปได้")
            # The feasibility section is from idx to some point. Where does the next title start?
            # It's really hard to know without semantic understanding.
            # Let's just say the last 2 lines are the title/desc if they are short.
            # Actually, let's just take the lines after the last "ความเป็นไปได้" block.
            # We'll just collect everything from idx+1 to end as feasibility + new title, which is wrong.
            pass
        except ValueError:
            pass

        # Since we have the exact policy names, let's find them!
        title_lines = []
        for j in range(len(prev_lines)):
            line = prev_lines[j]
            # check if line is similar to any policy name
            for pname in policy_names:
                # simple substring or close match
                if len(pname) > 5 and (pname.lower() in line.lower() or line.lower() in pname.lower()):
                    # Found the start of the title!
                    title_lines = prev_lines[j:]
                    break
            if title_lines:
                break
        
        if not title_lines:
            # Fallback: take last 2 lines
            title_lines = prev_lines[-2:]
            
    # Extract sections from curr_part
    why_lines = []
    how_lines = []
    outcome_lines = []
    feasibility_lines = []
    
    curr_lines = [l.strip() for l in curr_part.split('\n') if l.strip()]
    
    section = 'why'
    for line in curr_lines:
        if line == "ดำเนินการอย่างไร":
            section = 'how'
            continue
        elif line == "ทำแล้วได้อะไร" or line == "ทำแล้วได้อะไร และ ความเป็นไปได้":
            section = 'outcome'
            continue
        elif line == "ความเป็นไปได้":
            section = 'feasibility'
            continue
            
        if section == 'why': why_lines.append(line)
        elif section == 'how': how_lines.append(line)
        elif section == 'outcome': outcome_lines.append(line)
        elif section == 'feasibility': feasibility_lines.append(line)
        
    policies_data.append({
        "title": title_lines,
        "why": why_lines,
        "how": how_lines,
        "outcome": outcome_lines,
        "feasibility": feasibility_lines
    })

# Format to JSON
formatted = {}
for idx, p in enumerate(policies_data):
    formatted[f"policy_{idx}"] = p
    
with open('parsed_robust.json', 'w', encoding='utf-8') as f:
    json.dump({"structure": structure, "policies": formatted}, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(policies_data)} policies.")
