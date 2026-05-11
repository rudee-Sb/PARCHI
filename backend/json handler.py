import json
import os

def read_json(file_path):
    """Reads data from a JSON file."""
    if not os.path.exists(file_path):
        return []
    with open(file_path, 'r') as file:
        return json.load(file)

def write_json(file_path, data):
    """Writes data to a JSON file with nice formatting."""
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)