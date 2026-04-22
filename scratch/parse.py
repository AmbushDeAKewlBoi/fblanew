import os
import json
import PyPDF2
import glob
import re

def clean_event_name(filename):
    basename = os.path.basename(filename)
    name = basename.replace('.pdf', '')
    # Remove (1) or (2) from things like Cybersecurity (1).pdf
    name = re.sub(r'\s*\(\d+\)', '', name)
    # Replace dashes with spaces if it looks like camel case or just replace dashes. E.g. Introduction-to-Business-Concepts
    name = name.replace('-', ' ')
    return name.strip()

def extract_text_from_pdf(filepath):
    text = ""
    try:
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return text.strip()

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    pdf_files = glob.glob(os.path.join(root_dir, '*.pdf'))
    
    events_data = {}
    event_list = []
    
    for pdf in pdf_files:
        name = clean_event_name(pdf)
        print(f"Processing: {name}")
        text = extract_text_from_pdf(pdf)
        
        # Simple slug generation
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        
        events_data[slug] = {
            "name": name,
            "slug": slug,
            "infoText": text
        }
        
    out_path = os.path.join(root_dir, 'src', 'data', 'eventInfoRaw.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(events_data, f, ensure_ascii=False, indent=2)
        
    print(f"Saved {len(events_data)} events to {out_path}")

if __name__ == '__main__':
    main()
