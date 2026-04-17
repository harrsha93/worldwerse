import time
import random

# Function to print RCB Forever in different styles
def print_rcb_forever():
    styles = [
        lambda: print("RCB Forever " * 10),  # Print 10 times in one line
        lambda: print("\n".join(["RCB Forever"] * 5)),  # Print in multiple lines
        lambda: print("🔥 RCB Forever 🔥"),  # Add some fire!
        lambda: print("💪 RCB Forever 💪"),  # Strength mode
        lambda: print("RCB Forever " + "-" * random.randint(5, 20)),  # With random dashes
    ]
    
    while True:
        random.choice(styles)()  # Choose a random style
        time.sleep(1)  # Pause for 1 second

# Function to create a banner
def banner():
    print("=" * 50)
    print("🔥🔥🔥 RCB FOREVER 🔥🔥🔥".center(50))
    print("=" * 50)
    time.sleep(2)

# Main function
def main():
    banner()
    print("Starting the RCB Forever spam... 🚀")
    time.sleep(1)

    for _ in range(5):
        print("RCB Forever!!!".center(50))
        time.sleep(0.5)

    print("\nNow, enjoy infinite RCB Forever spam! 🎉")
    time.sleep(1)
    
    print_rcb_forever()  # Start infinite printing

# Run the script
if __name__ == "__main__":
    main()