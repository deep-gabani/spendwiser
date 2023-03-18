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


@app.route('/process-expense-image', methods=['POST'])
def process_image():
    """Processes a gallery image."""
    # Get the image data from the request.
    # request_data = {
    #   's3_image_path': 's3://process-expense-image-files/7207db42-1ee2-4100-a1d2-b60f10bee046.jpeg',
    # }
    request_data = json.loads(request.get_data(as_text=True))
    s3_image_path = request_data['s3_image_path']
    
    # Convert the image to response.
    response = compute_response(s3_image_path)

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
