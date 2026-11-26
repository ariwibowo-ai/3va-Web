#!/usr/bin/env bash
F="${1:-index.html}"
[ -f "$F" ] || { echo "File $F tidak ditemukan"; exit 2; }
python3 - "$F" <<'PY'
import sys,re,json,os,subprocess,tempfile,shutil
from html.parser import HTMLParser
f=sys.argv[1]; d=os.path.dirname(os.path.abspath(f)); h=open(f,encoding='utf-8').read()
fails=0
def out(level,msg,detail=''):
    global fails
    if level=='FAIL': fails+=1
    print(f"{level:5} {msg}"+(f"\n        -> {detail}" if detail else ''))
VOID={'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr'}
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.st=[]; s.err=[]; s.ids=[]; s.refs=[]; s.scripts=[]; s.cur=None; s.buf=''
    def handle_starttag(s,t,a):
        a=dict(a)
        if a.get('id'): s.ids.append(a['id'])
        for k in ('src','href'):
            if a.get(k): s.refs.append((t,a[k]))
        if t=='script': s.cur=(a.get('src'),a.get('type')); s.buf=''
        if t not in VOID: s.st.append((t,s.getpos()[0]))
    def handle_endtag(s,t):
        if t in VOID: return
        if t=='script' and s.cur is not None: s.scripts.append((s.cur,s.buf)); s.cur=None
        if s.st and s.st[-1][0]==t: s.st.pop(); return
        s.err.append(f"</{t}> baris {s.getpos()[0]} tidak cocok")
        for i in range(len(s.st)-1,-1,-1):
            if s.st[i][0]==t: del s.st[i:]; break
    def handle_data(s,x):
        if s.cur is not None: s.buf+=x
p=P(); p.feed(h); p.close()
bad=p.err[:3]+[f"<{t}> baris {n} tidak ditutup" for t,n in p.st[:3]]
out('FAIL','Tag HTML tidak seimbang','; '.join(bad)) if bad else out('PASS','Tag HTML seimbang')
dup=sorted({i for i in p.ids if p.ids.count(i)>1})
out('FAIL','ID ganda',', '.join(dup[:8])) if dup else out('PASS','Tidak ada ID ganda')
miss=[]
for t,r in p.refs:
    if re.match(r'(https?:|//|#|mailto:|tel:|data:|javascript:|/cdn-cgi)',r): continue
    path=r.split('#')[0].split('?')[0]
    if path and not os.path.exists(os.path.join(d,path)): miss.append(r)
out('FAIL','File yang dirujuk tidak ada',', '.join(sorted(set(miss))[:8])) if miss else out('PASS','Semua file lokal yang dirujuk ada')
big=[r for t,r in p.refs if re.search(r'\.(png|jpe?g|webp)$',r) and os.path.exists(os.path.join(d,r)) and os.path.getsize(os.path.join(d,r))>150000]
if big: out('WARN','Gambar > 150 KB (perkecil)',', '.join(sorted(set(big))))
for (src,typ),code in p.scripts:
    if typ=='application/ld+json':
        try: json.loads(code); out('PASS','JSON-LD valid')
        except Exception as e: out('FAIL','JSON-LD rusak',str(e))
js=[(f'inline#{i}',c) for i,((s,t),c) in enumerate(p.scripts) if not s and t!='application/ld+json']
for (s,t),c in p.scripts:
    if s and not re.match(r'https?:|//|/cdn-cgi',s) and os.path.exists(os.path.join(d,s)): js.append((s,open(os.path.join(d,s),encoding='utf-8').read()))
if any('3va-' in (s or '') for (s,t),c in p.scripts): out('FAIL','Skrip prototype 3va-*.js masih dimuat')
else: out('PASS','Tidak ada skrip 3va-*.js')
if shutil.which('node'):
    for name,code in js:
        tmp=tempfile.NamedTemporaryFile('w',suffix='.js',delete=False,encoding='utf-8'); tmp.write(code); tmp.close()
        r=subprocess.run(['node','--check',tmp.name],capture_output=True,text=True); os.unlink(tmp.name)
        out('PASS',f'Sintaks JS ok ({name})') if r.returncode==0 else out('FAIL',f'Sintaks JS rusak ({name})',r.stderr.strip().splitlines() if r.stderr else '')
else: out('SKIP','Cek sintaks JS dilewati','pasang dulu: sudo apt install -y nodejs')
trunc=re.findall(r'https?://wa\.me(?!/6281237079929)',h)
out('FAIL','Link WhatsApp tanpa nomor/terpotong',f'{len(trunc)} tempat') if trunc else out('PASS','Semua link wa.me memakai nomor')
bare=sorted({m for m in re.findall(r'https?://([A-Za-z0-9.-]+)(?=["\'<\s)`]|\?)',h)}-{'eastventura.biz.id','schema.org','www.w3.org'})
if bare: out('WARN','URL tanpa path (mungkin terpotong), periksa manual',', '.join(bare[:8]))
alltxt=h+''.join(c for _,c in js)
for pat,ket in [(r'3VA2026','PIN admin'),(r'(?i)escrow','kata Escrow'),(r'(Recorded|Captured|Confirmed|Published)!','pesan sukses palsu'),(r'Compliant','klaim kepatuhan'),(r'accountNumber|accountHolder','data rekening'),(r'(?i)api[_-]?key|password|secret','kata kunci rahasia')]:
    n=len(re.findall(pat,alltxt))
    out('FAIL',f'Ditemukan: {ket}',f'{n}x') if n else out('PASS',f'Bersih dari: {ket}')
n=len(re.findall(r'Verified',alltxt))
if n: out('WARN','Kata "Verified" muncul',f'{n}x - pastikan benar-benar terbukti')
for pat,ket in [(r'eval\(','eval'),(r'document\.write','document.write'),(r'localStorage|sessionStorage','penyimpanan browser'),(r'setInterval','setInterval (boros baterai)'),(r'innerHTML','innerHTML (aman hanya jika bukan input pengguna)')]:
    n=len(re.findall(pat,''.join(c for _,c in js)))
    if n: out('WARN',f'JS memakai {ket}',f'{n}x')
called={m for a in re.findall(r'on(?:click|change|input|submit)="([^"]*)"',h) for m in re.findall(r'([A-Za-z_]\w*)\(',a)}
defined=set(re.findall(r'function\s+(\w+)',alltxt))|set(re.findall(r'(?:window\.)?(\w+)\s*=\s*(?:async\s*)?(?:function|\()',alltxt))
ign={'if','this','event','return','getElementById','querySelector','closest','click','stopPropagation','preventDefault','scrollIntoView','remove','add','toggle','open','encodeURIComponent'}
miss=sorted(c for c in called-defined-ign)
out('WARN','Fungsi di onclick/onchange tanpa definisi',', '.join(miss[:8])) if miss else out('PASS','Semua fungsi onclick/onchange terdefinisi')
print(f"\nRINGKASAN: {fails} FAIL. "+("JANGAN unggah dulu." if fails else "Aman lanjut ke tes Firefox."))
sys.exit(1 if fails else 0)
PY
rc=$?
shopt -s nullglob
for x in *.xml; do xmllint --noout "$x" && echo "PASS $x valid" || { echo "FAIL $x rusak"; rc=1; }; done
exit $rc
