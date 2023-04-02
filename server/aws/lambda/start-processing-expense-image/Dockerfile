FROM public.ecr.aws/lambda/python:3.8

# Install any required system packages
RUN yum -y update

# Install any required Python packages
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the Lambda function code into the container
COPY main.py ${LAMBDA_TASK_ROOT}

# Set the handler and entrypoint for the Lambda function
ENV AWS_LAMBDA_FUNCTION_HANDLER=main.lambda_handler

CMD ["main.lambda_handler"]
