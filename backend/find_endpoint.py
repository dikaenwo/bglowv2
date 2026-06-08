import requests, re

s = requests.Session()
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
}
r = s.get('https://cekbpom.pom.go.id/all-produk', headers=headers, timeout=10)
print('Status:', r.status_code)

# Simpan HTML untuk dianalisis
with open('bpom_page.html', 'w', encoding='utf-8') as f:
    f.write(r.text)

# Cari pola URL DataTables
matches = re.findall(r'"url"\s*:\s*"([^"]+)"', r.text)
print('DataTables url:', matches)

matches2 = re.findall(r"ajax\s*:\s*[\"']([^\"']+)[\"']", r.text)
print('ajax:', matches2)

matches3 = re.findall(r"'([^']*(?:dt|datatable|ajax|produk|data)[^']*)'", r.text[:5000], re.IGNORECASE)
print('other patterns:', matches3[:20])

# Cek title dan form actions
titles = re.findall(r'<title>(.*?)</title>', r.text)
actions = re.findall(r'action=["\']([^"\']+)["\']', r.text)
print('title:', titles)
print('form actions:', actions)
