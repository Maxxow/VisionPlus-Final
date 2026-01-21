
import requests
import concurrent.futures
import random
import string
import time
import sys

# Configuration
BASE_URL = "http://localhost:3000/auth"
NUM_USERS = 1000
MAX_WORKERS = 50  # Concurrency level

def generate_random_string(length=8):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def generate_user(index):
    # Ensure uniqueness and meet password requirements (UpperCase, LowerCase, Number)
    email = f"user{index}_{generate_random_string()}@example.com"
    password = f"Pass{generate_random_string(5)}1"
    name = f"User {index}"
    return {"email": email, "password": password, "name": name}

def register_and_login(user):
    result = {
        "email": user["email"],
        "register_status": None,
        "login_status": None,
        "success": False,
        "error": None
    }
    
    try:
        # Register
        reg_payload = {
            "email": user["email"],
            "password": user["password"],
            "name": user["name"]
        }
        reg_response = requests.post(f"{BASE_URL}/register", json=reg_payload)
        result["register_status"] = reg_response.status_code
        
        if reg_response.status_code not in [200, 201]:
            result["error"] = f"Register failed: {reg_response.text}"
            return result

        # Login
        login_payload = {
            "email": user["email"],
            "password": user["password"]
        }
        login_response = requests.post(f"{BASE_URL}/login", json=login_payload)
        result["login_status"] = login_response.status_code
        
        if login_response.status_code in [200, 201]:
            result["success"] = True
        else:
            result["error"] = f"Login failed: {login_response.text}"
            
    except Exception as e:
        result["error"] = str(e)
        
    return result

def main():
    print(f"Starting load test with {NUM_USERS} users...")
    print(f"Target: {BASE_URL}")
    
    users = [generate_user(i) for i in range(NUM_USERS)]
    
    successful_ops = 0
    failed_ops = 0
    
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_user = {executor.submit(register_and_login, user): user for user in users}
        
        completed = 0
        for future in concurrent.futures.as_completed(future_to_user):
            data = future.result()
            completed += 1
            
            if data["success"]:
                successful_ops += 1
                # print(f"[{completed}/{NUM_USERS}] Success: {data['email']}")
            else:
                failed_ops += 1
                print(f"[{completed}/{NUM_USERS}] Failed: {data['email']} - {data['error']}")
                
            if completed % 50 == 0:
                print(f"Progress: {completed}/{NUM_USERS} completed.")

    duration = time.time() - start_time
    print(f"\nTest Completed in {duration:.2f} seconds")
    print(f"Successful: {successful_ops}")
    print(f"Failed: {failed_ops}")
    print(f"Success Rate: {(successful_ops/NUM_USERS)*100:.2f}%")

if __name__ == "__main__":
    main()
