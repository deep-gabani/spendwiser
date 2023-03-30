import typing as t
from src.preprocess_image import preprocess_image
from src.extract_image_details import extract_image_details
from src.convert_image_details_to_expense import convert_image_details_to_expense


def compute_expense(s3_image_uri: str) -> t.Dict:
    """Computes the expense.
    
    Below is the process of computing the expense:
        1. Preprocess the image for OCR.
        2. Extract the text & details from the image.
        3. Convert the text & details from the image into the expense schema.
    
    Args:
        s3_image_uri: The image location in s3 (URI).
    
    Returns:
        expense: The expense in expense schema format.
    """

    # Preprocess the image for OCR.
    img = preprocess_image(s3_image_uri)

    # Extract the text & details from the image.
    text = extract_image_details(img)

    # Convert the text & details from the image into the expense schema.
    expense = convert_image_details_to_expense(text)

    return expense
