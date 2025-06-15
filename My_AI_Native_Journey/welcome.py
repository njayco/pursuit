def get_user_name():
    """Get the user's name from input."""
    return input("What's your name? ").strip()

def print_welcome_message(name):
    """Print a personalized welcome message."""
    print(f"\nWelcome to AI_Native_Journey, {name}! 👋")
    print("We're excited to have you here as we explore the world of AI-native development together.")
    print("Feel free to explore the repository and contribute to our journey!")

def main():
    """Main function to run the welcome script."""
    name = get_user_name()
    print_welcome_message(name)

if __name__ == "__main__":
    main() 