import os
import sys
import mimetypes

from flask import Flask, send_file, abort

app = Flask(__name__)
current_folder = os.path.dirname(os.getcwd())
print('pwd', current_folder)
entry_file = 'test.html'

@app.route('/<path:filename>', methods=['GET'])
def serve_file(filename):
    file_path = os.path.join(current_folder, filename)
    print(file_path)

    if os.path.exists(file_path):
        mime_type, _ = mimetypes.guess_type(file_path)
        return send_file(file_path, mimetype=mime_type)
    else:
        abort(404, description="Resource not found")

@app.route('/')
def serve_index():
    index_path = os.path.join(current_folder, entry_file)
    return send_file(index_path, mimetype='text/html')

if __name__ == '__main__':
    entry_file = sys.argv[1]
    app.run(debug=True)