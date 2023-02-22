import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
import json
import os
from pyngrok import ngrok
import pytesseract
from PIL import Image
import typing as t


app = Flask(__name__)
url = ngrok.connect(5000).public_url
print(' * Tunnel URL:', url)


def write_image(base64_image: str, image_name: str) -> str:
    """Write a new image from the base64 with the given name.
    
    Returns:
        image_path: path to the new image.
    """
    image_data = base64.b64decode(base64_image)

    # Write image to a file
    image_path = os.path.join('images', image_name)
    with open(image_path, 'wb') as f:
        f.write(image_data)

    return image_path


def extract_text(image_path: str) -> str:
    """Extracts text from the given image.
    
    Returns:
        text: Extracted text.
    """
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    return text


@app.route('/screenshot', methods=['POST'])
def process_image():
    """Processes a gallery image."""
    # Get the image data from the request.
    # request_data = {
    #   'base64_image': 'b/9j/....',
    #   'image_format': 'jpeg',
    #   'image_name': 'dunzo_screenshot.jpeg'
    # }
    request_data = json.loads(request.get_data(as_text=True))
    base64_image = request_data['base64_image']
    image_name = request_data['image_name']

    image_path = write_image(base64_image, image_name)
    text = extract_text(image_path)

    # Return a dummy JSON response
    response = {
        'text': text
    }

    return jsonify(response)


if __name__ == '__main__':
    CORS(app)

    ### swagger specific ###
    SWAGGER_URL = '/api'
    API_URL = '/static/swagger.yaml'
    SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "Spendwiser APIs"
        }
    )
    app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
    ### end swagger specific ###

    app.run(debug=True)
