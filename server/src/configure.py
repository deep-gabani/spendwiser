import json
import logging

class Singleton(type):
    """Meta class."""
    _instances = {}
    def __call__(cls):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__()
        return cls._instances[cls]


class Configure(metaclass=Singleton):
    """Configurations class."""

    def __init__(self):
        super().__init__()

        self.config = {}
        self.log = logging.getLogger(__name__)

        try:
            with open('src/config.json', 'r') as config_file:
                self.config = json.load(config_file)
                logging.basicConfig(level=self.config.get('log_level'), format='(%(levelname)s) [%(asctime)s] %(filename)s:%(lineno)d -> %(message)s')
                self.log.debug(f'Config: {self.config}')
        except Exception as e:
            self.log.error(f'Unable to read config: {e}')

    def configurations(self):
        """Returns config and log."""
        return self.config, self.log
