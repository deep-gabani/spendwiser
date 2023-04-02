FROM public.ecr.aws/lambda/python:3.8

# Install any required system packages
RUN rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
RUN yum -y update
RUN yum -y install tesseract
RUN yum install -y \
        libjpeg-turbo-devel \
        zlib-devel \
        libpng-devel && \
    yum clean all

# Install any required Python packages
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the Lambda function code into the container
COPY src/ ${LAMBDA_TASK_ROOT}/src/
COPY main.py ${LAMBDA_TASK_ROOT}

# Set the handler and entrypoint for the Lambda function
ENV AWS_LAMBDA_FUNCTION_HANDLER=main.lambda_handler

CMD ["main.lambda_handler"]
