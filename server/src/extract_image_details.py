import pytesseract
import numpy as np


def extract_image_details(img: np.ndarray) -> str:
    """Extracts the image text and details."""
    text = pytesseract.image_to_string(img)
    return text
