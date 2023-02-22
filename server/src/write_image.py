import base64
import os

def write_image(base64_image: str, image_name: str) -> str:
    """Write a new image from the base64 with the given name.
    
    Args:
        base64_image: The base64 image string.
        image_name: The name of the image.
    
    Returns:
        image_path: path to the new image.
    """
    image_data = base64.b64decode(base64_image)

    # Write image to a file
    image_path = os.path.join('tmp', image_name)
    with open(image_path, 'wb') as f:
        f.write(image_data)

    return image_path
