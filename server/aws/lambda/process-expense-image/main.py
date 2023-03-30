from bson import ObjectId
import datetime
import pymongo
import pytz
from src.compute_expense import compute_expense
from src.configure import Configure


config, log = Configure().configurations()

ORG_NAME = 'spendwiser'
DB_NAME = 'spendwiser'
DB_CLUSTER = 'ywcbuvt'
DB_USERNAME = 'deep'
DB_PASSWORD = 'lCGV26tOJv6T6BpT'


def get_current_time():
    return datetime.datetime.utcnow().replace(tzinfo=pytz.UTC).strftime('%Y-%m-%dT%H:%M:%SZ')


def lambda_handler(event, context):
    """Processes the expense imagee and updated the DB with the extracted expense data.

    event parameters:
        - user_id: User document id (_id) in str from the database.
        - expense_id: 32-digit unique id. It will be used to update the DB with the extracted expense data.
                      (Before calling this function, start-processing-expense-image function will create an
                      empty expense with this expense id in the expenses collection.)
        - s3_image_uri: Expense image's S3 bucket URI.
        - uploaded_time: The time when the expense image was uploaded.
    
    Returns:
        None
    """
    # This is being called async..
    client = pymongo.MongoClient(f"mongodb+srv://{DB_USERNAME}:{DB_PASSWORD}@{ORG_NAME}.{DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority")
    db = client[DB_NAME]
    expenses_collection = db['expenses']

    user_id = ObjectId(event['user_id'])
    expense_id = event['expense_id']
    s3_image_uri = event['s3_image_uri']
    uploaded_time = event['uploaded_time']

    log.info(f's3_image_uri: {s3_image_uri}')
    
    
    # Convert the image to expense.
    expense = compute_expense(s3_image_uri)

    log.info(f'expense ({expense_id}): {expense}')

    
    # Update this expense with the extracted data in the db...
    expense = {
        'expense_id': expense_id,
        's3_image_uri': s3_image_uri,
        'uploaded_time': uploaded_time,
        **expense,
        'expense_extraction_time': get_current_time(),
        'is_extraction_finished': True
    }
    result = expenses_collection.update_one(
        {"user_id": user_id},
        {"$set": {"expenses.$[elem]": expense}},
        array_filters=[{"elem.expense_id": expense_id}]
    )

    log.info('Finished updating expense. Adios!')

