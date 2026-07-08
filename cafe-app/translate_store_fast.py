import re
from deep_translator import GoogleTranslator
import concurrent.futures
import time

def safe_translate(text, dest):
    translator = GoogleTranslator(source='en', target=dest)
    try:
        return translator.translate(text)
    except Exception as e:
        print(f"Error on {text} -> {dest}: {e}")
        return text

with open('src/lib/store.ts', 'r', encoding='utf-8') as f:
    content = f.read()

name_matches = list(re.finditer(r"name: '([^']+)', name_te: '[^']+', name_hi: '[^']+', name_kn: '[^']+'", content))
desc_matches = list(re.finditer(r"description: '([^']+)', description_te: '[^']+', description_hi: '[^']+', description_kn: '[^']+'", content))

names = [m.group(1) for m in name_matches]
descs = [m.group(1) for m in desc_matches]

print("Translating...")

def translate_batch(texts, dest):
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        return list(executor.map(lambda text: safe_translate(text, dest), texts))

names_te = translate_batch(names, 'te')
names_hi = translate_batch(names, 'hi')
names_kn = translate_batch(names, 'kn')

descs_te = translate_batch(descs, 'te')
descs_hi = translate_batch(descs, 'hi')
descs_kn = translate_batch(descs, 'kn')

print("Applying translations...")
new_content = ""
offset = 0
for i, match in enumerate(name_matches):
    new_content += content[offset:match.start()]
    n = names[i]
    te = names_te[i].replace("'", "\\'") if names_te[i] else n
    hi = names_hi[i].replace("'", "\\'") if names_hi[i] else n
    kn = names_kn[i].replace("'", "\\'") if names_kn[i] else n
    new_content += f"name: '{n}', name_te: '{te}', name_hi: '{hi}', name_kn: '{kn}'"
    offset = match.end()

new_content += content[offset:]
content = new_content

desc_matches = list(re.finditer(r"description: '([^']+)', description_te: '[^']+', description_hi: '[^']+', description_kn: '[^']+'", content))
new_content = ""
offset = 0
for i, match in enumerate(desc_matches):
    new_content += content[offset:match.start()]
    d = descs[i]
    te = descs_te[i].replace("'", "\\'") if descs_te[i] else d
    hi = descs_hi[i].replace("'", "\\'") if descs_hi[i] else d
    kn = descs_kn[i].replace("'", "\\'") if descs_kn[i] else d
    new_content += f"description: '{d}', description_te: '{te}', description_hi: '{hi}', description_kn: '{kn}'"
    offset = match.end()

new_content += content[offset:]

with open('src/lib/store.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Translations complete!")
