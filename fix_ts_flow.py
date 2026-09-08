import re

filepath = 'src/components/flow/FlowApp.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("<BottomTabBar currentTab=\"home\" />", "<BottomTabBar />")

# Fix ResultCard index
old_result_1 = """                <ResultCard 
                  name="คุณเอ (Producer)" """
new_result_1 = """                <ResultCard 
                  index={0}
                  name="คุณเอ (Producer)" """

old_result_2 = """                <ResultCard 
                  name="ทีม ABC" """
new_result_2 = """                <ResultCard 
                  index={1}
                  name="ทีม ABC" """

content = content.replace(old_result_1, new_result_1)
content = content.replace(old_result_2, new_result_2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed FlowApp TS errors")
