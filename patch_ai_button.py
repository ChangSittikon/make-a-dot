import re

with open('src/app/profile/settings/flow-builder/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the bottom button's onClick handler.
# The button is: <button onClick={async () => { ... setSaving(true); ... fetch('/api/ai/seed-flow') ... 'ให้น้องดอทช่วยสร้าง (AI)'
# Let's use a regex to capture it.

pattern = re.compile(
    r'(<button[^>]*onClick=\{async \(\) => \{\s*setSaving\(true\);\s*try \{\s*const res = await fetch\(\'/api/ai/seed-flow\'\);.*?)(disabled=\{saving\}.*?ให้น้องดอทช่วยสร้าง \(AI\).*?</button>)', 
    re.DOTALL
)

def replacer(match):
    original = match.group(0)
    
    # We construct the new onClick block
    new_onClick = """<button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const res = await fetch('/api/ai/generate-flow', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ industryName: activeIndustry?.name || "ทั่วไป" })
                        });
                        
                        const data = await res.json();
                        
                        if (!res.ok) {
                          if (data.error === 'Missing GOOGLE_GENERATIVE_AI_API_KEY in .env') {
                            alert('ยังไม่ได้ตั้งค่า GOOGLE_GENERATIVE_AI_API_KEY ในไฟล์ .env ครับ');
                          } else {
                            alert('เกิดข้อผิดพลาดในการสร้างด้วย AI: ' + (data.error || 'Unknown'));
                          }
                          return;
                        }
                        
                        if (data.nodes) {
                          const newNodes = data.nodes.map((n: any, i: number) => ({
                            ...n,
                            order: nodes.length + i
                          }));
                          setNodes([...nodes, ...newNodes]);
                        }
                      } catch (e) {
                        console.error(e);
                        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ AI");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    """
    
    # Append the rest of the button (from 'disabled={saving}' to '</button>')
    return new_onClick + match.group(2)

content = pattern.sub(replacer, content)

# Also let's fix the text "กำลังประมวลผล..." to "กำลังให้น้องดอทช่วยคิด..." as it was originally
content = content.replace("กำลังประมวลผล...'", "กำลังให้น้องดอทช่วยคิด...'")

open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(content)
print("Patched bottom AI button")
