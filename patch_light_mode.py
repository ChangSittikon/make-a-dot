import re

filepath = 'src/app/profile/settings/idea-board/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace classes
replacements = {
    'bg-[#0f1115]': 'bg-white',
    'bg-[#1a1d24]': 'bg-white',
    'bg-[#2a2d35]': 'bg-gray-100',
    'border-gray-900': 'border-black',
    'border-gray-800': 'border-gray-200',
    'border-gray-700/50': 'border-gray-300',
    'text-gray-200': 'text-gray-800',
    'text-gray-300': 'text-gray-700',
    'text-gray-400': 'text-gray-500',
    'text-gray-600': 'text-gray-400',
    'text-white': 'text-gray-900',
    'hover:bg-gray-800': 'hover:bg-gray-100',
    'hover:text-white': 'hover:text-gray-900',
    'bg-black/80': 'bg-black/40',
    'bg-gray-800': 'bg-gray-100',
    'bg-black': 'bg-gray-50',
    'text-black': 'text-white',
    'hover:bg-white': 'hover:bg-gray-900',
    'hover:bg-gray-200': 'hover:bg-brand-red',
    'bg-white text-black': 'bg-brand-black text-white'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Fix some specific issues introduced by blanket replaces
content = content.replace('bg-gray-50 font-prompt', 'bg-gray-50 font-prompt') # keep page bg as 50

# The submit button: 'w-full bg-brand-black text-white font-bold'
content = content.replace(
    'w-full bg-white text-white font-bold py-3 rounded-xl hover:bg-brand-red transition mt-2',
    'w-full bg-brand-black text-white font-bold py-3 rounded-xl hover:bg-brand-red transition mt-2'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Changed to Light Mode!")
