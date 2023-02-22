import numpy as np
from PIL import Image


def preprocess_image(image_path: str) -> np.ndarray:
    """Preprocesses the image for OCR.
    
    Args:
        image_path: The path to the image file.
    
    Returns:
        img: The preprocessed np.ndarray image.
    """
    # Do preprocessing.
    img = Image.open(image_path)
    return img
