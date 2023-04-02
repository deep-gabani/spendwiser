import boto3
from bson import ObjectId
import datetime
import pymongo
import pytz
import random


ORG_NAME = 'spendwiser'
DB_NAME = 'spendwiser'
DB_CLUSTER = 'ywcbuvt'
DB_USERNAME = 'deep'
DB_PASSWORD = 'lCGV26tOJv6T6BpT'


def parse_mongo_dict(_dict):
    for k, v in _dict.items():
        if type(v) == ObjectId:
            _dict[k] = str(v)
    return _dict


def get_current_time():
    return datetime.datetime.utcnow().replace(tzinfo=pytz.UTC).strftime('%Y-%m-%dT%H:%M:%SZ')


def lambda_handler(event, context):
    # Send OTP to the user...
    if event['resource'] == '/send-otp':
        # Get the phone number from the request
        phone_number = event['body']['phone_number']
        
        # Generate a random 6-digit OTP
        otp = str(random.randint(100000, 999999))
        
        # Create an SNS client
        sns_client = boto3.client('sns')
        
        # Send the OTP to the phone number using SNS
        response = sns_client.publish(
            # TargetArn='arn:aws:sns:ap-south-1:426469431555:send-otp',
            PhoneNumber=phone_number,
            Message=f'Spendwiser verification OTP is {otp}.'
        )
        
        # Get the message ID from the SNS response
        message_id = response['MessageId']
        
        # Return the OTP that was sent in the SMS message
        return {
            'statusCode': 200,
            'body': {
                'message': f'OTP sent successfully to {phone_number}.',
                'message_id': message_id,
                'otp': otp
            }
        }
        

    # Signup user...
    if event['resource'] == '/signup':
        client = pymongo.MongoClient(f"mongodb+srv://{DB_USERNAME}:{DB_PASSWORD}@{ORG_NAME}.{DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority")
        db = client[DB_NAME]
        users_collection = db['users']
        expenses_collection = db['expenses']
        
        user = event['body']
        phone_number = user['phone_number']
        email = user['email']

        # Checking if any user with the phone number already exists...
        _user = list(users_collection.find({ 'phone_number': phone_number }))
        if len(_user) != 0:
            return {
                'statusCode': 500,
                'body': {
                    'message': f'Oops! User with phone no. {phone_number} already exists!'
                }
            }

        # Checking if any user with the email already exists...
        if email != '':
            _user = list(users_collection.find({ 'email': email}))
            if len(_user) != 0:
                return {
                    'statusCode': 500,
                    'body': {
                        'message': f'Oops! User with email {email} already exists!'
                    }
                }

        # Inserting the user into the database...
        user = {
            **user,
            'signup_time': get_current_time()
        }
        result = users_collection.insert_one(user)
        user = users_collection.find_one({"_id": result.inserted_id})

        # Registering the user in the expenses collection...
        user_expenses = {
            'user_id': user['_id'],
            'expenses': [],
        }
        result = expenses_collection.insert_one(user_expenses)
        
        return {
            'statusCode': 200,
            'body': {
                'message': "Yay! You're in!",
                'user': parse_mongo_dict(user)
            }
        }
        

    # Login user...
    if event['resource'] == '/login':
        client = pymongo.MongoClient(f"mongodb+srv://{DB_USERNAME}:{DB_PASSWORD}@{ORG_NAME}.{DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority")
        db = client[DB_NAME]
        users_collection = db['users']
        
        user = event['body']
        phone_number = user['phone_number']

        # Checking if any user with the phone number already exists...
        user = users_collection.find_one({ 'phone_number': phone_number })
        if not user:
            return {
                'statusCode': 500,
                'body': {
                    'message': f'Oops! No user with phone no. {phone_number} found! Sign up.'
                }
            }
        
        return {
            'statusCode': 200,
            'body': {
                'message': "Yay! You're in!",
                'user': parse_mongo_dict(user)
            }
        }
