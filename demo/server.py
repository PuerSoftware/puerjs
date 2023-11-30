import os
import sys
import mimetypes
import time

from flask import Flask, Response, request, send_file, abort, jsonify

app      = Flask(__name__)
DEBUG    = True
HOST     = '127.0.0.1'
PORT     = 8001
BASE_DIR = os.path.dirname(os.getcwd())

print('   BASE_DIR', BASE_DIR)

##################################################################

@app.route('/validate', methods=['POST'])
def validate():
	response = {
		'error'  : None,
		'fields' : {}
	}
	errorCount = 0
	for field, data in request.json.items():
		response['fields'][field] = {
			'error': f'Filed {field}/{data["validationType"]} may or may not contain an error'
		}
		errorCount += 1

	if errorCount > 0:
		s = 's' if errorCount > 1 else ''
		response['error'] = f'This form contains {errorCount} error{s}'

	return jsonify(response)

@app.route('/<path:filename>', methods=['GET'])
def serve_file(filename):
	file_path = os.path.join(BASE_DIR, filename)
	print(file_path)

	if os.path.exists(file_path):
		mime_type, _ = mimetypes.guess_type(file_path)
		with open(file_path, 'rb') as f:
			file_content = f.read()
		return Response(file_content, mimetype=mime_type)
	else:
		abort(404, description="Resource not found")

@app.route('/')
def index():
	demo_dir     = os.path.join(BASE_DIR, 'demo')
	files        = sorted(os.listdir(demo_dir))
	html_files   = [f for f in files if f.endswith('.html')]

	html_content = '<h1>Index:</h1><ul>'
	for html_file in html_files:
		html_content += f'<li><a href="demo/{html_file}">{html_file}</a></li>'
	html_content += '</ul>'

	return Response(html_content, mimetype='text/html')


if __name__ == '__main__':
	app.run(host=HOST, port=PORT, debug=DEBUG)

