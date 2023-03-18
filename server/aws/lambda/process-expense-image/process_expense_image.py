import json
import boto3
from src.compute_response import compute_response
from src.configure import Configure


config, log = Configure().configurations()
s3 = boto3.client('s3')


def lambda_handler(event, context):
    # Get the request body
    request_data = event

    s3_image_path = request_data['s3_image_path']

    log.info(f's3_image_path: {s3_image_path}')
    
    # Convert the image to response.
    response = compute_response(s3_image_path)

    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
