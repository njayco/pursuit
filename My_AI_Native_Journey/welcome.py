import getpass
import webbrowser
import os
import urllib.parse

def get_user_name():
    """Get the user's name from input."""
    return input("What's your name? ").strip()

def verify_pin():
    """Verify the PIN for Najee Jeremiah users."""
    pin = getpass.getpass("Please enter your PIN: ").strip()
    if pin == "1234":
        print("Correct Pin!")
    elif pin == "ABCD":
        print("Correct Pin!")
        return "regular"
    else:
        print("Incorrect pin.")
        return "denied"

def offer_certificate(role, name):
    """Offer to show the user their certificate."""
    response = input("\nWould you like to see your certificate? (Y/N): ").strip().upper()
    if response == "Y":
        if role == "admin":
            print("\n🎉 Opening your AI Director Certificate in browser...")
            certificate_path = os.path.abspath("My_AI_Native_Journey/ai_director_certificate.html")
            webbrowser.open(f"file://{certificate_path}")
        elif role == "regular":
            print(f"\n🎉 Opening your Cohort Member Certificate in browser...")
            print(f"Note: The certificate will ask for your name ({name}) to display it properly.")
            certificate_path = os.path.abspath("My_AI_Native_Journey/cohort_member_certificate.html")
            webbrowser.open(f"file://{certificate_path}")
        else:
            print(f"\n🎉 Opening your Cohort Member Certificate in browser...")
            print(f"Note: The certificate will ask for your name ({name}) to display it properly.")
            certificate_path = os.path.abspath("My_AI_Native_Journey/cohort_member_certificate.html")
            webbrowser.open(f"file://{certificate_path}")
    else:
        print("\nNo problem! Your certificate is ready whenever you want to view it.")

def print_welcome_message(name):
    """Print a personalized welcome message."""
    if name.lower() == "najee jeremiah":
        print(f"\nVerification required for {name}...")
        pin_result = verify_pin()
        if pin_result == "admin":
            print(f"Hey, it's the awesome AI Director, {name}!")
            offer_certificate("admin", name)
        elif pin_result == "regular":
            print(f"\nAyo! Congrats on starting your AI Native Journey!")
            print(f"Welcome {name}, Pursuit AI-Native June cohort Member.")
            offer_certificate("regular", name)
        else:
            print("Access denied. Please try again.")
    else:
        print(f"\nAyo! Congrats on starting your AI Native Journey!")
        print(f"Welcome {name}, Pursuit AI-Native June cohort Member.")
        offer_certificate("regular", name)

def main():
    """Main function to run the welcome script."""
    name = get_user_name()
    print_welcome_message(name)

if __name__ == "__main__":
    main() 