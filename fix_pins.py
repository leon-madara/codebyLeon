import os

def remove_line(file_path, pattern):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    with open(file_path, 'w', encoding='utf-8') as f:
        for line in lines:
            if pattern not in line:
                f.write(line)

# Remove nuclear cleanup from hook
remove_line(r'c:\Users\Leon\DevMode\codebyLeon\src\hooks\useScrollAnimation.ts', 'ScrollTrigger.getAll().forEach(trigger => trigger.kill())')

# Remove nuclear cleanup from TorchEffect
remove_line(r'c:\Users\Leon\DevMode\codebyLeon\src\components\TorchEffect.tsx', 'ScrollTrigger.getAll().forEach(t => t.kill())')
