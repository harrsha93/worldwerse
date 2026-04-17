from datetime import datetime

users = {
    "1001": {"pin": "1234", "balance": 20000},
    "1002": {"pin": "4321", "balance": 15000}
}

def print_receipt(acc, transaction, amount, balance):
    print("\n------ Transaction Receipt ------")
    print("Date & Time     :", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print("Account Number  :", acc)
    print("Transaction     :", transaction)
    print("Amount          :", amount)
    print("Available Bal.  :", balance)
    print("Thank you for banking with us!")
    print("----------------------------------")

def display_menu(language):
    if language == "Kannada":
        print("ವಹಿವಾಟು ಆಯ್ಕೆಮಾಡಿ")
        print("1. ಹಣ ತೆಗೆಯಿರಿ")
        print("2. ಶೇಷ ತೋರಿಸಿ")
        print("3. ಠೇವಣಿ ಮಾಡಿ")
        print("4. ಪಿನ್ ಬದಲಾಯಿಸಿ")
        print("5. ನಿರ್ಗಮಿಸಿ")
    elif language == "Hindi":
        print("कृपया लेनदेन चुनें")
        print("1. पैसे निकालें")
        print("2. बैलेंस देखें")
        print("3. जमा करें")
        print("4. पिन बदलें")
        print("5. बाहर जाएँ")
    else:
        print("Select your transaction")
        print("1. Withdraw")
        print("2. Balance")
        print("3. Deposit")
        print("4. Change PIN")
        print("5. Exit")

def atm():
    print("======== WELCOME TO THE ATM ========")
    print("1. Domestic\n2. International")
    region = input("Enter your choice: ")
    if region != "1":
        print("International service not available.")
        return

    print("\nSelect language / ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ / भाषा चुनें")
    print("1. ಕನ್ನಡ (Kannada)\n2. English\n3. हिंदी (Hindi)")
    lang_choice = input("Enter choice: ")

    language = "English"
    if lang_choice == "1":
        language = "Kannada"
    elif lang_choice == "3":
        language = "Hindi"

    acc = input("\nEnter your Account Number: ")
    if acc not in users:
        print("Account not found!")
        return

    for attempt in range(3):
        entered_pin = input("Enter your 4-digit PIN: ")
        if entered_pin == users[acc]['pin']:
            break
        else:
            print("Wrong PIN. Try again.")
    else:
        print("Too many incorrect attempts. Card blocked.")
        return

    while True:
        print(f"\n=== Welcome Account: {acc} ===")
        display_menu(language)
        choice = input("Enter your choice: ")

        if choice == "1": 
            amount = int(input("Enter amount to withdraw: "))
            if amount > users[acc]['balance']:
                print("Insufficient balance!")
            else:
                users[acc]['balance'] -= amount
                print("Please collect your cash.")
                print("New balance:", users[acc]['balance'])
                if input("Do you want a receipt? (y/n): ").lower() == "y":
                    print_receipt(acc, "Withdrawal", amount, users[acc]['balance'])

        elif choice == "2":  
            print("Your current balance is:", users[acc]['balance'])
            if input("Do you want a receipt? (y/n): ").lower() == "y":
                print_receipt(acc, "Balance Inquiry", 0, users[acc]['balance'])

        elif choice == "3":  
            amount = int(input("Enter amount to deposit: "))
            users[acc]['balance'] += amount
            print("Deposit successful. Updated balance:", users[acc]['balance'])
            if input("Do you want a receipt? (y/n): ").lower() == "y":
                print_receipt(acc, "Deposit", amount, users[acc]['balance'])

        elif choice == "4":
            old_pin = input("Enter current PIN: ")
            if old_pin == users[acc]['pin']:
                new_pin = input("Enter new 4-digit PIN: ")
                if len(new_pin) == 4:
                    users[acc]['pin'] = new_pin
                    print("PIN changed successfully.")
                else:
                    print("PIN must be 4 digits!")
            else:
                print("Incorrect current PIN.")

        elif choice == "5":
            print("Thank you! Visit again.")
            break
        else:
            print("Invalid option selected.")

        input("\nPress Enter to continue...")

atm()
