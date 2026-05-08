import os, glob

target_dir = 'client/pages'
replace_str = '''              <ul className="space-y-2">
                <li>
                  <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-700 hover:text-primary transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/advertise"'''
search_str = '''              <ul className="space-y-2">
                <li>
                  <Link to="/advertise"'''

for file_path in glob.glob(os.path.join(target_dir, '*.tsx')):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if search_str in content:
        content = content.replace(search_str, replace_str)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_path}')
