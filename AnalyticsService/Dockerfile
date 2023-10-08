# Use an official Python runtime as a parent image
FROM python:3.9

# Set working directory
WORKDIR /app

# Install app dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Change Ownership
RUN chown -R 1001:1001 /app

# Change Permissions (be cautious with this in a production setting)
RUN chmod -R 755 /app

# Switch to non-root user
USER 1001

# Bundle app source
COPY . ./

# Run Gunicorn
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000", "--log-level", "info"]