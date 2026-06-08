import requests, re, json
from urllib.parse import unquote

s = requests.Session()
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

r = s.get("https://cekbpom.pom.go.id/all-produk", headers={"User-Agent": UA}, timeout=12)
csrf_match = re.search(r'<meta name="csrf-token" content="([^"]+)"', r.text)
csrf_token = csrf_match.group(1) if csrf_match else ""
xsrf_cookie = unquote(s.cookies.get("XSRF-TOKEN", ""))

print("csrf_token:", csrf_token[:30])

# Format DataTables lengkap berdasarkan config di halaman BPOM
payload = {
    "draw": "1",
    "columns[0][data]": "PRODUCT_ID",
    "columns[0][name]": "",
    "columns[0][searchable]": "true",
    "columns[0][orderable]": "false",
    "columns[0][search][value]": "",
    "columns[0][search][regex]": "false",
    "columns[1][data]": "PRODUCT_REGISTER",
    "columns[1][name]": "",
    "columns[1][searchable]": "true",
    "columns[1][orderable]": "true",
    "columns[1][search][value]": "",
    "columns[1][search][regex]": "false",
    "columns[2][data]": "PRODUCT_NAME",
    "columns[2][name]": "",
    "columns[2][searchable]": "true",
    "columns[2][orderable]": "true",
    "columns[2][search][value]": "",
    "columns[2][search][regex]": "false",
    "columns[3][data]": "REGISTRAR_NAME",
    "columns[3][name]": "",
    "columns[3][searchable]": "true",
    "columns[3][orderable]": "true",
    "columns[3][search][value]": "",
    "columns[3][search][regex]": "false",
    "order[0][column]": "1",
    "order[0][dir]": "asc",
    "start": "0",
    "length": "10",
    "search[value]": "",
    "search[regex]": "false",
    "query": "NA18221701516",
    "product_register": "",
    "product_name": "",
    "product_brand": "",
    "product_package": "",
    "product_form": "",
    "ingredients": "",
    "submit_date_start": "",
    "submit_date_end": "",
    "product_date_start": "",
    "product_date_end": "",
    "expire_date_start": "",
    "expire_date_end": "",
    "manufacturer_name": "",
    "status": "",
    "release_date": "",
    "manufacturer": "",
    "registrar": "",
    "_token": csrf_token,
}

headers = {
    "User-Agent": UA,
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Referer": "https://cekbpom.pom.go.id/all-produk",
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://cekbpom.pom.go.id",
    "X-CSRF-TOKEN": csrf_token,
    "X-XSRF-TOKEN": xsrf_cookie,
}

resp = s.post("https://cekbpom.pom.go.id/produk-dt/all", data=payload, headers=headers, timeout=20)
print(f"Status: {resp.status_code}")
try:
    data = resp.json()
    print("recordsTotal:", data.get("recordsTotal"))
    print("data count:", len(data.get("data", [])))
    if data.get("data"):
        print("Keys:", list(data["data"][0].keys()))
        print("First:", json.dumps(data["data"][0], ensure_ascii=False)[:500])
except Exception as e:
    print("Not JSON:", resp.text[:500])
