import csv
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import argparse
import time
import os
from datetime import datetime


# Function to fetch data for a website
def fetch_website_data(website_url):
    try:
        # Make a GET request to the website URL with a timeout
        website_response = requests.get(website_url, timeout=10)
        website_response.raise_for_status()

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(website_response.content, "html.parser")

        # Find the version tag
        version_tag = soup.find("p", class_="mx-v")

        if version_tag:
            version_text = version_tag.get_text(strip=True)
            if "Version:" in version_text:
                version_number = version_text.replace("Version:", "").strip()

                # Get the host from the URL
                host = urlparse(website_url).netloc

                return f"Server: {host}, Version: {version_number}"
        else:
            return None
    except requests.exceptions.RequestException as e:
        return f"Error fetching data for {website_url}: {e}"


# Parse command-line arguments
parser = argparse.ArgumentParser(description="Fetch and extract version numbers from websites.")
parser.add_argument("--csv-url", required=True, help="URL of the CSV file")
parser.add_argument("--output-file", default="output.txt", help="Output file to save results")
parser.add_argument("--force", action="store_true", help="Force fetching data even for recently processed URLs")
args = parser.parse_args()

# Load the log of processed URLs
processed_urls = set()
if not args.force and os.path.exists(args.output_file):
    with open(args.output_file, "r") as log_file:
        processed_urls = set(line.strip() for line in log_file.readlines())

# Current timestamp
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Make a GET request to fetch the CSV file
response = requests.get(args.csv_url)

if response.status_code == 200:
    # Create a CSV reader object
    csv_data = response.text.splitlines()
    csv_reader = csv.reader(csv_data)

    # Skip the header row if present
    next(csv_reader, None)

    with open(args.output_file, "a") as output_file:
        for row in csv_reader:
            website_url = "https://" + row[0]  # Assuming the website URLs are in the first column
            if website_url not in processed_urls:
                print(f"Processing: {website_url}")
                result = fetch_website_data(website_url)
                if result:
                    print(result)
                    output = f"{timestamp} - {result}\n"
                    output_file.write(output)
                else:
                    error_msg = f"{timestamp} - Error processing {website_url}\n"
                    output_file.write(error_msg)
                processed_urls.add(website_url)
                time.sleep(1)  # To avoid overloading the server
else:
    print("Failed to retrieve data from the CSV.")
