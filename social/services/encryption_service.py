from cryptography.fernet import Fernet

class EncryptionService:
    def __init__(self, key):
        self.key = key
        self.fernet = Fernet(self.key)

    def encrypt_text(self, plain_text):
        """Encrypts a string."""
        return self.fernet.encrypt(plain_text.encode()).decode()

    def decrypt_text(self, encrypted_text):
        """Decrypts a string."""
        return self.fernet.decrypt(encrypted_text.encode()).decode()

    def encrypt_file(self, file_path):
        """Encrypts a file."""
        with open(file_path, 'rb') as file:
            encrypted_data = self.fernet.encrypt(file.read())
        with open(file_path, 'wb') as file:
            file.write(encrypted_data)

    def decrypt_file(self, file_path):
        """Decrypts a file."""
        with open(file_path, 'rb') as file:
            decrypted_data = self.fernet.decrypt(file.read())
        with open(file_path, 'wb') as file:
            file.write(decrypted_data)