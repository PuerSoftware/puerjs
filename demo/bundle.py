import os
import re
import sys

BASE_URL = os.getcwd()

class Bundler:
    def __init__(entry_point):
        self.entry_point = entry_point


    @staticmethod
    def get_js(file_name):
        with open(file_path, 'r') as f:
            content = f.read()
        if file_path.endswith('.html'):
            content = '\n'.join(re.findall(r'<script[^>]*>([\s\S]*?)<\/script>', content))
        return content

    @staticmethod
    def to_absolute_path(relative_path, current_path):
        if relative_path.startswith('.'):
            return os.path.abspath(os.path.join(os.path.dirname(current_path), relative_path))
        else:
            return os.path.join(BASE_URL, relative_path)

    @staticmethod
    def get_imports(js_content):
        imports = re.findall(r'import\s+.*?\s+from\s+[\'"](.*?)[\'"]', content)



def get_imports(file_path):
    import_statements = []
    with open(file_path, 'r') as f:
        content = f.read()

    if file_path.endswith('.js'):
        import_statements = re.findall(r'import\s+.*?\s+from\s+[\'"](.*?)[\'"]', content)
    elif file_path.endswith('.html'):
        script_blocks = re.findall(r'<script type="module">([\s\S]*?)<\/script>', content)
        for block in script_blocks:
            import_statements += re.findall(r'import\s+.*?\s+from\s+[\'"](.*?)[\'"]', block)

    return import_statements



def traverse_imports(entry_point, visited=None):
    if visited is None:
        visited = []
    full_path = os.path.abspath(os.path.join(BASE_URL, entry_point))
    if full_path not in visited:
        visited.append(full_path)
        imports = get_imports(full_path)
        for imp in imports:
            absolute_path = resolve_path(imp, full_path)
            if absolute_path.endswith('.js'):
                traverse_imports(absolute_path, visited)
            else:
                traverse_imports(absolute_path + '.js', visited)
    return visited

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Please provide the relative path to the entry point as an argument.')
        sys.exit(1)

    entry_point_relative = sys.argv[1]
    unique_imports       = traverse_imports(entry_point_relative)
    for imp in unique_imports:
        print(imp)
