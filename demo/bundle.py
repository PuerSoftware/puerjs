import os
import re
import sys

from slimit import minify


class JsImports:
    @staticmethod
    def to_abs_path(rel_path, base_path):
        if rel_path.startswith('.'):
            return os.path.abspath(os.path.join(os.path.dirname(base_path), rel_path))
        else:
            return os.path.join(os.path.dirname(base_path), rel_path)

    @staticmethod
    def get_scripts(abs_html_path):
        with open(abs_html_path, 'r') as f:
            html_content = f.read()
        script_tags      = re.findall(r'<script([^>]+)></script>', html_content)
        abs_script_paths = []

        for tag in script_tags:
            attrs     = re.findall(r'(\w+)\s*=\s*"([^"]+)"', tag)
            attr_dict = {name: value for (name, value) in attrs}
            if 'type' in attr_dict and attr_dict['type'] == 'module':
                abs_js_path = JsImports.to_abs_path(attr_dict['src'], abs_html_path)
                abs_script_paths.append(abs_js_path)
        return abs_script_paths

    @staticmethod
    def get_imports(js_content):
        return re.findall(r'import\s+.*?\s+from\s+[\'"](.*?)[\'"]', js_content)

    @staticmethod
    def demodularize_js(js_content):
        js_content   = re.sub(r'import .*\n', '', js_content + '\n')
        def_keywords = r'(const|class|var|let|function|async)'
        js_content   = re.sub(f'export default {def_keywords}', r'\1', js_content)
        js_content   = re.sub(f'export {def_keywords}', r'\1', js_content)
        js_content   = re.sub(r'export .*\n', '', js_content)
        js_content   = re.sub(r'export default (\(.*\)\s*=>)', r'\1', js_content)
        js_content   = re.sub(r'export (\(.*\)\s*=>)', r'\1', js_content)
        return js_content.strip() + '\n;\n'

    @staticmethod
    def minify(js_content):
        return minify(js_content, mangle=True)


class Bundler:
    def __init__(self, rel_html_path):
        self.base_path = os.getcwd() + '/'
        self.imports   = []
        self.js_code   = []
        self.visited   = []
        abs_html_path  = JsImports.to_abs_path(rel_html_path, self.base_path)
        abs_js_path    = JsImports.get_scripts(abs_html_path)[0]
        self.get_imports(abs_js_path)

    def get_imports(self, abs_js_path):
        if abs_js_path in self.visited:
            return
        self.visited.append(abs_js_path)
        with open(abs_js_path, 'r') as f:
            js_content = f.read()
        
        import_paths = JsImports.get_imports(js_content)
        for rel_import_path in import_paths:
            abs_import_path = JsImports.to_abs_path(rel_import_path, abs_js_path)
            self.get_imports(abs_import_path)

        if abs_js_path not in self.imports:
            self.imports.append(abs_js_path)
            self.js_code.append(
                JsImports.demodularize_js(
                    js_content
                    # JsImports.minify(js_content)
                )
            )


    def save(self, rel_bundle_path):
        abs_bundle_path = JsImports.to_abs_path(rel_bundle_path, self.base_path)
        js_code = '\n\n'.join(self.js_code)
        with open(abs_bundle_path, 'w') as f:
            f.write(js_code)
        return self

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage example: python bundler.py ..rel/path/to/entry.html ../rel/path/to/bundled.js')
        sys.exit(1)

    rel_entry_point = sys.argv[1]
    rel_bundle_path = sys.argv[2]
    bundler         = Bundler(rel_entry_point).save(rel_bundle_path)

    for imp in bundler.imports:
        print(imp)
