# 🔐 CyberGuard

CyberGuard is a lightweight cybersecurity analysis project designed to detect potential security risks in user input or code by identifying common attack patterns such as **SQL Injection**, **Cross-Site Scripting (XSS)**, and suspicious symbols.  
It provides a simple risk score and visual feedback to help users understand input safety.

---

## 🚀 Features

- 🔍 Detects SQL Injection patterns  
- 🛡️ Identifies possible XSS attacks  
- ⚠️ Checks for suspicious characters and symbols  
- 📊 Generates a risk score based on input analysis  
- 🎨 Interactive and animated UI for result display  
- 💡 Beginner-friendly and easy to extend

---

## 🧠 How It Works

1. User enters text or code into the input field  
2. CyberGuard analyzes the input using pattern matching  
3. The system checks for:
   - SQL keywords
   - Script tags / malicious JS
   - Special symbols
4. A risk score and security report are generated instantly

Example output:
```json
{
  "length": 41,
  "containsSQL": false,
  "containsXSS": false,
  "containsSuspiciousSymbols": false,
  "riskScore": 41
}
