import os
import re
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Schema & Types Replacements (Code Level)
    content = content.replace("equityPercentage", "revSharePercentage")
    content = content.replace("equityOffered", "revShareOffered")
    content = content.replace("SWEAT_EQUITY", "SWEAT_SHARE")
    content = content.replace("EQUITY", "REV_SHARE")
    
    # UI Texts Replacements (Case sensitive/insensitive where appropriate)
    content = content.replace("Sweat Equity", "Sweat Share")
    content = content.replace("หุ้นส่วน", "ส่วนแบ่งรายได้")
    content = content.replace("หุ้น", "ส่วนแบ่ง")
    content = content.replace("Equity Points", "Trust Points")
    content = content.replace("equityPoints", "trustPoints")
    content = content.replace("Equity", "Rev-Share")
    content = content.replace("equity", "revShare")

    # Fix some specific casings that might have gone weird
    content = content.replace("revShareSplit", "revShareSplit")
    content = content.replace("Rev-ShareSplits", "RevShareSplits")

    if original_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def main():
    search_dir = r"C:\Users\CHANG-PCSONSAI\.gemini\antigravity\scratch\make-a-dot"
    
    # Files to ignore
    ignore_dirs = ['.git', 'node_modules', '.next']
    
    for root, dirs, files in os.walk(search_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            if file.endswith(('.tsx', '.ts', '.prisma', '.json')):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
