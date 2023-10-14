import os
import sys
import mimetypes

from flask import Flask, Response, send_file, abort #, jasonify

app      = Flask(__name__)
DEBUG    = True
HOST     = '127.0.0.1'
PORT     = 5000
BASE_DIR = os.path.dirname(os.getcwd())

print('   BASE_DIR', BASE_DIR)

##################################################################

# @app.route('/validate/<validation_key:string>', methods=['GET'])
# def serve_file(validation_key):
# 	jasonify({
# 		error: `Some scary error occured on ${}`
# 	})

@app.route('/<path:filename>', methods=['GET'])
def serve_file(filename):
	file_path = os.path.join(BASE_DIR, filename)
	print(file_path)

	if os.path.exists(file_path):
		mime_type, _ = mimetypes.guess_type(file_path)
		return send_file(file_path, mimetype=mime_type)
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

