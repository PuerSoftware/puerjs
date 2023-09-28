from flask import Flask, send_file, abort
import os
import mimetypes

app = Flask(__name__)
current_folder = os.getcwd()

@app.route('/<path:filename>', methods=['GET'])
def serve_file(filename):
    file_path = os.path.join(current_folder, filename)

    if os.path.exists(file_path):
        mime_type, _ = mimetypes.guess_type(file_path)
        return send_file(file_path, mimetype=mime_type)
    else:
        abort(404, description="Resource not found")

@app.route('/')
def serve_index():
    index_path = os.path.join(current_folder, 'test.html')
    return send_file(index_path, mimetype='text/html')

if __name__ == '__main__':
    app.run(debug=True)