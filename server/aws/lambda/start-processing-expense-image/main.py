import boto3
from bson import ObjectId
import datetime
import json
import logging
import pymongo
import pytz
import uuid


ORG_NAME = 'spendwiser'
DB_NAME = 'spendwiser'
DB_CLUSTER = 'ywcbuvt'
DB_USERNAME = 'deep'
DB_PASSWORD = 'lCGV26tOJv6T6BpT'

log = logging.getLogger(__name__)


def parse_mongo_dict(_dict):
    for k, v in _dict.items():
        if type(v) == ObjectId:
            _dict[k] = str(v)
    return _dict


def get_current_time():
    return datetime.datetime.utcnow().replace(tzinfo=pytz.UTC).strftime('%Y-%m-%dT%H:%M:%SZ')


def lambda_handler(event, context):
    """Triggers the extraction of expense data from the image.

    event parameters:
        - phone_number: User's phone number (which is unique across users btw).
        - s3_image_uri: Expense image's S3 bucket URI.
    
    Returns:
        - statusCode: HTTPS status code.
        - body:
            - expense_id: 32-digit unique id.
            - uploaded_time: The time when the expense image was uploaded.
            - message: Message to be displayed in the application.
    """
    lambda_client = boto3.client('lambda')

    client = pymongo.MongoClient(f"mongodb+srv://{DB_USERNAME}:{DB_PASSWORD}@{ORG_NAME}.{DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority")
    db = client[DB_NAME]
    users_collection = db['users']
    expenses_collection = db['expenses']

    phone_number = event['phone_number']
    s3_image_uri = event['s3_image_uri']


    log.info(f's3_image_uri: {s3_image_uri}')

    # Creating an id for this expense...
    expense_id = str(uuid.uuid4())[:32]
    uploaded_time = get_current_time()

    # Update this expense in the db...
    user = users_collection.find_one({ "phone_number": phone_number })
    expense = {
        'expense_id': expense_id,
        's3_image_uri': s3_image_uri,
        'uploaded_time': uploaded_time,
        'is_extraction_finished': False
    }
    result = expenses_collection.update_one(
        { "user_id": user['_id'] },
        { "$push": { "expenses": expense } }
    )


    # Start async lambda for expense extraction...
    response = lambda_client.invoke(
        FunctionName='process-expense-image',
        InvocationType='Event',
        Payload=json.dumps(parse_mongo_dict({ **expense, 'user_id': user['_id'] }))
    )


    return {
        'statusCode': 200,
        'body': {
            'expense_id': expense_id,
            'uploaded_time': uploaded_time,
            'message': f'Expense extraction is started.\nYour expense id is {expense_id}.'
        }
    }
