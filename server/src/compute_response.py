import typing as t
from src.write_image import write_image
from src.preprocess_image import preprocess_image
from src.extract_image_details import extract_image_details
from src.convert_image_details_to_expense import convert_image_details_to_expense


def compute_response(base64_image: str, image_name: str) -> t.Dict:
    """Computes the response.
    
    Below is the process of computing the response:
        1. Write down the image from the base64 image string.
        2. Preprocess the image for OCR.
        3. Extract the text & details from the image.
        4. Convert the text & details from the image into a response schema.
    
    Args:
        base64_image: The base64 image string.
        image_name: The name of the image.
    
    Returns:
        response: The response in expense schema format.
    """

    # Write down the image from the base64 image string.
    image_path = write_image(base64_image, image_name)

    # Preprocess the image for OCR.
    img = preprocess_image(image_path)

    # Extract the text & details from the image.
    text = extract_image_details(img)

    # Convert the text & details from the image into a response schema.
    response = convert_image_details_to_expense(text)

    return response
