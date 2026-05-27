import fitz
import json

pdf_path = "../temp data/New Modified Policies.pdf"

try:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
except Exception as e:
    print("Error opening PDF:", e)
    exit(1)

# Clean up text
text = text.replace('ำ', 'ำ')

lines = [line.strip() for line in text.split('\n') if line.strip()]

policies = []
current_policy = {'title_block': [], 'why': [], 'how': [], 'outcome': [], 'feasibility': []}
current_section = 'title_block'

for line in lines:
    if line == "ทำไมต้องนโยบายนี้":
        current_section = 'why'
        continue
    elif line == "ดำเนินการอย่างไร":
        current_section = 'how'
        continue
    elif line == "ทำแล้วได้อะไร" or line == "ทำแล้วได้อะไร และ ความเป็นไปได้":
        current_section = 'outcome'
        continue
    elif line == "ความเป็นไปได้":
        current_section = 'feasibility'
        continue
        
    # If we encounter a line that belongs to a title block of the NEXT policy,
    # it means we were in 'feasibility' (or 'outcome') and now we see something that is NOT one of the headers
    # BUT how do we know it's a new policy title?
    # Usually, a title block comes after 'ความเป็นไปได้' of the previous policy.
    # So if current_section == 'feasibility' and we've already collected some feasibility lines,
    # and maybe we hit something that looks like a title...
    # Actually, it's safer to split by "ทำไมต้องนโยบายนี้" and then look backwards.

    if current_section == 'why':
        current_policy['why'].append(line)
    elif current_section == 'how':
        current_policy['how'].append(line)
    elif current_section == 'outcome':
        current_policy['outcome'].append(line)
    elif current_section == 'feasibility':
        # Wait, if we are in feasibility and we see the title of the next policy, 
        # how do we distinguish it from just another line of feasibility?
        # A new policy starts before "ทำไมต้องนโยบายนี้".
        current_policy['feasibility'].append(line)
    else:
        current_policy['title_block'].append(line)

# The above line-by-line is flawed because 'feasibility' of policy N and 'title' of policy N+1 are lumped together.

# Let's split by "ทำไมต้องนโยบายนี้"
parts = text.split("ทำไมต้องนโยบายนี้")

parsed_policies = []

for i in range(1, len(parts)):
    # parts[i-1] contains the end of the previous policy and the title of the current policy
    # parts[i] contains why, how, outcome, feasibility of the current policy (and the title of the NEXT policy)
    
    if i == 1:
        title_text = parts[0]
    else:
        # The title of the current policy is at the end of parts[i-1].
        # Specifically, it's after the "ความเป็นไปได้" section of the previous policy.
        # But wait, parts[i-1] HAS "ความเป็นไปได้" in it.
        prev_part = parts[i-1]
        
        # We need to find the last "ความเป็นไปได้" in prev_part
        last_feasibility_idx = prev_part.rfind("ความเป็นไปได้")
        if last_feasibility_idx != -1:
            # But the feasibility section has text. Where does it end?
            # It ends where the next title begins. This is hard to detect programmatically.
            # Let's look at the lines. Usually there's a clear break.
            pass

# Let's try another approach.
# Let's use the known English/Thai titles from the dimension file to locate them in the text!
# Or we can just use an LLM to parse it. Wait, I CAN just use my LLM!
# Since I need to create `unifiedPoliciesData.js` and I have the MD file,
# I will just write a python script that outputs a template and I will manually fill the exact text since I can read the OCR!
# Wait, manually filling 30 policies will take too long.

# Let's use the fact that titles usually don't have bullets, are short, and are before "ทำไมต้องนโยบายนี้".
import re
sections = re.split(r'(ทำไมต้องนโยบายนี้|ดำเนินการอย่างไร|ทำแล้วได้อะไร|ทำแล้วได้อะไร และ ความเป็นไปได้|ความเป็นไปได้)', text)

# sections will be a list: [title_of_1, "ทำไมต้องนโยบายนี้", why_of_1, "ดำเนินการอย่างไร", how_of_1, ...]
# However, after "ความเป็นไปได้", the next block will contain BOTH the feasibility of N and title of N+1.
# i.e.,  "ความเป็นไปได้", "feasibility_text_of_N \n Title_of_N+1", "ทำไมต้องนโยบายนี้"
# So the block BEFORE "ทำไมต้องนโยบายนี้" always ends with the title of the new policy.
# How many lines is the title? Usually 1-3 lines.
# Can we say the title is the last 2 lines before "ทำไมต้องนโยบายนี้"?
