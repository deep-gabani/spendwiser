from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
import json
from pyngrok import ngrok

from src.compute_response import compute_response
from src.configure import Configure


config, log = Configure().configurations()


app = Flask(__name__)
url = ngrok.connect(config['server_port']).public_url
log.critical(f'Tunnel URL: {url}')


@app.route('/screenshot', methods=['POST'])
def process_image():
    """Processes a gallery image."""
    # Get the image data from the request.
    # request_data = {
    #   'base64_image': 'b/9j/....',
    #   'image_name': 'dunzo_screenshot.jpeg'
    # }
    request_data = json.loads(request.get_data(as_text=True))
    base64_image = request_data['base64_image']
    image_name = request_data['image_name']
    
    # Convert the image to response.
    response = compute_response(base64_image, image_name)

    return jsonify(response)


if __name__ == '__main__':
    CORS(app)

    ### swagger specific ###
    SWAGGER_URL = config['swagger']['url']
    API_URL = config['swagger']['yaml_path']
    SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': config['swagger']['app_name']
        }
    )
    app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
    ### end swagger specific ###

    app.run(debug=True)
