import numpy as np
from PIL import Image
import boto3
import io
from src.configure import Configure


s3 = boto3.resource('s3')
config, log = Configure().configurations()


def preprocess_image(s3_image_path: str) -> np.ndarray:
    """Preprocesses the image for OCR.
    
    Args:
        s3_image_path: The image location in s3 (URI).
    
    Returns:
        img: The preprocessed np.ndarray image.
    """
    # Do preprocessing.
    bucket_name, key = s3_image_path[5:].split('/', 1)

    bucket = s3.Bucket(bucket_name)
    img_data = bucket.Object(key).get().get('Body').read()
    img = Image.open(io.BytesIO(img_data))

    log.info(f'img: {img}')

    return img
