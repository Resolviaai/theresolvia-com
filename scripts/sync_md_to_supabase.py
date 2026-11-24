import os
import glob
import yaml
import json
import urllib.request
import urllib.error

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT_DIR, 'content', 'blog')
SP_URL = os.environ.get('SUPABASE_URL', 'https://irrewfsdmixunaashckv.supabase.co')
SP_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if not SP_KEY:
    env_path = os.path.join(ROOT_DIR, '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
                    SP_KEY = line.split('=', 1)[1].strip()
                elif line.startswith('SUPABASE_ANON_KEY=') and not SP_KEY:
                    SP_KEY = line.split('=', 1)[1].strip()

if not SP_KEY:
    SP_KEY = 'sb_publishable_xvpxIf1s8f_D3nQ3dvTZwQ_i1xcD_uO'

files = glob.glob(os.path.join(CONTENT_DIR, '*.md'))
print(f"Found {len(files)} markdown files in {CONTENT_DIR}")

posts_to_upsert = []
for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()

    parts = text.split('---', 2)
    if len(parts) >= 3:
        front = yaml.safe_load(parts[1])
        body = parts[2].strip()
    else:
        continue

    slug = front.get('slug') or os.path.splitext(os.path.basename(fpath))[0]
    title = front.get('title', '')
    desc = front.get('description', '')
    cat = front.get('category', 'Retention Science')
    badge = front.get('badge', cat)
    read_time = front.get('readTime', '7 min read')
    author = front.get('author', 'Resolvia Editorial Team')
    cover = front.get('coverImage', '')

    post = {
        'slug': slug,
        'title': title,
        'description': desc,
        'category': cat,
        'badge': badge,
        'read_time': read_time,
        'author': author,
        'cover_image': cover if cover else None,
        'content_markdown': body,
        'status': 'published',
        'featured': (slug == 'agency-vs-freelance-video-editor')
    }
    posts_to_upsert.append(post)

print(f"Prepared {len(posts_to_upsert)} posts for Supabase upsert.")

# Upsert via Supabase REST API
url = f"{SP_URL}/rest/v1/posts?on_conflict=slug"
req = urllib.request.Request(
    url,
    data=json.dumps(posts_to_upsert).encode('utf-8'),
    headers={
        'apikey': SP_KEY,
        'Authorization': f'Bearer {SP_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req) as resp:
        res_data = json.loads(resp.read().decode('utf-8'))
        print(f"✓ Successfully upserted {len(res_data)} posts to Supabase!")
        for p in res_data:
            print(f"  - [{p['status']}] {p['slug']} -> {p['title']}")
except urllib.error.HTTPError as e:
    print('HTTP Error:', e.code, e.read().decode())
except Exception as e:
    print('Error:', e)
