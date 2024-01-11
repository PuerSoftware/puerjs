import os
import sys
import mimetypes
import time

from flask import Flask, Response, request, send_file, abort, jsonify

app           = Flask(__name__)
DEBUG         = True
HOST          = '127.0.0.1'
PORT          = 8001
BASE_PUER_DIR = os.path.dirname(os.getcwd())
BASE_DIR      = os.path.join(BASE_PUER_DIR, 'demo')

print('BASE_PUER_DIR', BASE_PUER_DIR)
print('BASE_DIR',      BASE_DIR)

##################################################################

@app.route('/<path:filename>', methods=['GET'])
def serve_file(filename):
	file_path = os.path.join(BASE_DIR, filename)
	if not os.path.exists(file_path):
		file_path = os.path.join(BASE_PUER_DIR, filename)
	if not os.path.exists(file_path):
		abort(404, description="Resource not found")

	print(file_path)

	mime_type, _ = mimetypes.guess_type(file_path)
	with open(file_path, 'rb') as f:
		file_content = f.read()
	return Response(file_content, mimetype=mime_type)


@app.route('/')
def index():
	index_file = os.path.join(BASE_DIR, 'index.html')
	with open(index_file, 'rb') as f:
		content = f.read()

	return Response(content, mimetype='text/html')


if __name__ == '__main__':
	app.run(host=HOST, port=PORT, debug=DEBUG)

