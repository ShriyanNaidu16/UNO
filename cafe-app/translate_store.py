import re
from googletrans import Translator
import time

translator = Translator()

with open('src/lib/store.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all names and descriptions
name_matches = list(re.finditer(r"name: '([^']+)', name_te: '[^']+', name_hi: '[^']+', name_kn: '[^']+'", content))
desc_matches = list(re.finditer(r"description: '([^']+)', description_te: '[^']+', description_hi: '[^']+', description_kn: '[^']+'", content))

names = [m.group(1) for m in name_matches]
descs = [m.group(1) for m in desc_matches]

def batch_translate(texts, dest):
    # Google translate can handle up to a certain size per request. Let's do batches of 50.
    results = []
    for i in range(0, len(texts), 50):
        batch = texts[i:i+50]
        try:
            translations = translator.translate(batch, src='en', dest=dest)
            if isinstance(translations, list):
                results.extend([t.text for t in translations])
            else:
                results.append(translations.text)
        except Exception as e:
            print(f"Error on {dest} batch: {e}")
            # fallback: return original English
            results.extend(batch)
        time.sleep(1)
    return results

print("Translating names...")
names_te = batch_translate(names, 'te')
names_hi = batch_translate(names, 'hi')
names_kn = batch_translate(names, 'kn')

print("Translating descriptions...")
descs_te = batch_translate(descs, 'te')
descs_hi = batch_translate(descs, 'hi')
descs_kn = batch_translate(descs, 'kn')

print("Replacing content...")
# Replace names
offset = 0
new_content = ""
for i, match in enumerate(name_matches):
    new_content += content[offset:match.start()]
    n = names[i]
    te = names_te[i].replace("'", "\\'") if i < len(names_te) else n
    hi = names_hi[i].replace("'", "\\'") if i < len(names_hi) else n
    kn = names_kn[i].replace("'", "\\'") if i < len(names_kn) else n
    new_content += f"name: '{n}', name_te: '{te}', name_hi: '{hi}', name_kn: '{kn}'"
    offset = match.end()

new_content += content[offset:]
content = new_content

# We have to re-find descriptions because positions changed
desc_matches = list(re.finditer(r"description: '([^']+)', description_te: '[^']+', description_hi: '[^']+', description_kn: '[^']+'", content))
offset = 0
new_content = ""
for i, match in enumerate(desc_matches):
    new_content += content[offset:match.start()]
    d = descs[i]
    te = descs_te[i].replace("'", "\\'") if i < len(descs_te) else d
    hi = descs_hi[i].replace("'", "\\'") if i < len(descs_hi) else d
    kn = descs_kn[i].replace("'", "\\'") if i < len(descs_kn) else d
    new_content += f"description: '{d}', description_te: '{te}', description_hi: '{hi}', description_kn: '{kn}'"
    offset = match.end()

new_content += content[offset:]

with open('src/lib/store.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Translations complete!")
