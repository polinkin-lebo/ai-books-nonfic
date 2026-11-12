from pathlib import Path
import base64,json,mimetypes,re,hashlib
root=Path(__file__).resolve().parent
styles=['style.css','ui-v2.css','carousels.css','refinements.css','nonfic.css']
scripts=['data.js','app.js','controls.js','carousels.js','nonfic.js']
def uri(path):
 return 'data:'+(mimetypes.guess_type(str(path))[0] or 'application/octet-stream')+';base64,'+base64.b64encode(path.read_bytes()).decode()
assets={str(p.relative_to(root)):uri(p) for p in (root/'assets').rglob('*') if p.is_file()}
html=(root/'index.html').read_text()
for name in styles+scripts:
 version=hashlib.sha256((root/name).read_bytes()).hexdigest()[:10]
 html=re.sub(r'(?<=")'+re.escape(name)+r'(?:\?v=[^"]*)?(?=")',lambda m:name+'?v='+version,html)
(root/'index.html').write_text(html)
for name in styles:
 css=(root/name).read_text()
 css=re.sub(r"url\('([^']+)'\)",lambda m:"url('"+uri(root/m[1])+"')",css)
 html=re.sub(r'<link rel="stylesheet" href="'+re.escape(name)+r'(?:\?[^"]*)?">',lambda m:'<style>'+css+'</style>',html)
for name in scripts:
 js=(root/name).read_text()
 if name=='data.js':js+='\nconst ASSETS='+json.dumps(assets)+';'
 else:
  for path,value in sorted(assets.items(),key=lambda x:len(x[0]),reverse=True):js=js.replace('src="'+path+'"','src="'+value+'"').replace("'"+path+"'","'"+value+"'")
  js=js.replace('src="assets/design/${file}"','src="${ASSETS[\'assets/design/\'+file]}"')
 html=re.sub(r'<script src="'+re.escape(name)+r'(?:\?[^"]*)?"></script>',lambda m:'<script>'+js+'</script>',html)
(root/'standalone.html').write_text(html)
print(f'{len(html.encode()):,} bytes, {len(assets)} assets')
