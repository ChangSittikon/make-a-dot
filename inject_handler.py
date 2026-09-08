import os

filepath = 'src/app/profile/settings/flow-builder/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

handler = """  const handleSaveOptionWeight = async (optionId: string, weightJson: string) => {
    try {
      const res = await fetch(`/api/options/${optionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vectorWeight: weightJson })
      });
      if (res.ok) {
        setNodes(prev => prev.map(n => ({
          ...n,
          options: n.options.map(o => o.id === optionId ? { ...o, vectorWeight: weightJson } : o)
        })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNode = (questionText: string"""

content = content.replace("  const handleSaveNode = (questionText: string", handler)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected handleSaveOptionWeight")
