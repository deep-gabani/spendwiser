import json
import typing as t
from src.configure import Configure


config, log = Configure().configurations()


def convert_image_details_to_expense(text: str) -> t.Dict:
    """Converts image text and details to expense."""
    if config['fake']:
        with open('src/settings/fake_expense.json') as fake_expense:
            expense = json.load(fake_expense)
        return expense
    
    # Convert the text to expense...
    return {
        'text': text
    }
