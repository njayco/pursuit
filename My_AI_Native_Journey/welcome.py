def get_user_name():
    """Get the user's name from input."""
    return input("What's your name? ").strip()

def print_welcome_message(name):
    """Print a personalized welcome message."""
    print(f"\nAyo! {name} Congrats on starting your AI Native Journey!")
    print(f"Welcome {name}, Pursuit AI-Native June cohort Member.")

def main():
    """Main function to run the welcome script."""
    name = get_user_name()
    print_welcome_message(name)

if __name__ == "__main__":
    main() 