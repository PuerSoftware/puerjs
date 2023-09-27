import os

from flask        import Flask, Response, abort
from library.puer import Puer

app = Flask(__name__)

@app.route('/static/js/<path:filename>')
def serve_puer_js(filename):
    path = f'static/js/{filename}'
    if not os.path.exists(path):
        abort(404)

    with open(path, 'r') as f:
        jsx = f.read()

    js = Puer.steep(jsx)
    return Response(js, content_type='application/javascript')

if __name__ == '__main__':
    app.run(debug=True)
