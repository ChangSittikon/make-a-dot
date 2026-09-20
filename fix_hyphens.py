import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    content = content.replace("Rev-ShareSplit", "RevShareSplit")
    content = content.replace("rev-ShareSplit", "revShareSplit")
    content = content.replace("Rev-ShareAndSplit", "RevShareAndSplit")
    content = content.replace("rev-ShareAndSplit", "revShareAndSplit")
    content = content.replace("rev-Share", "revShare") # for anything else in code
    
    # but don't break "Rev-Share" strings in UI if possible, so we won't do a blanket Rev-Share -> RevShare unless we have to.
    # Actually Prisma schema complains about fields or models. Let's fix models.
    # Prisma doesn't like hyphens anywhere except enums maybe.
    
    if original_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed hyphens: {filepath}")

def main():
    search_dir = r"C:\Users\CHANG-PCSONSAI\.gemini\antigravity\scratch\make-a-dot"
    ignore_dirs = ['.git', 'node_modules', '.next']
    
    for root, dirs, files in os.walk(search_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            if file.endswith(('.tsx', '.ts', '.prisma', '.json')):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
