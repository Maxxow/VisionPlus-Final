
import requests
import json

BASE_URL = "http://localhost:3000/auth"

def print_result(test_name, success, details=""):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"   Details: {details}")

def test_register_duplicate_email():
    # 1. Register a user
    email = "duplicate_test@example.com"
    password = "Pass1234!"
    
    payload = {"email": email, "password": password, "name": "Dup Tester"}
    
    # Initial registration (might fail if already exists from previous run, which is fine for this test)
    requests.post(f"{BASE_URL}/register", json=payload)
    
    # 2. Try to register again
    response = requests.post(f"{BASE_URL}/register", json=payload)
    
    # Expect 401 Unauthorized (based on auth.service.ts logic where it throws UnauthorizedException for existing user)
    # Note: Usually this should be 409 Conflict, but we follow key implementation
    success = response.status_code in [401, 409] 
    print_result("Register Duplicate Email", success, f"Status: {response.status_code}, Response: {response.text}")

def test_login_wrong_password():
    # 1. Register a user (ensure existence)
    email = "wrong_pass_test@example.com"
    password = "CorrectPass123"
    requests.post(f"{BASE_URL}/register", json={"email": email, "password": password})
    
    # 2. Login with wrong password
    response = requests.post(f"{BASE_URL}/login", json={"email": email, "password": "WrongPass123"})
    
    # Expect 401
    success = response.status_code == 401
    print_result("Login Wrong Password", success, f"Status: {response.status_code}")

def test_login_non_existent_user():
    email = "ghost_user@example.com"
    response = requests.post(f"{BASE_URL}/login", json={"email": email, "password": "AnyPassword"})
    
    # Expect 401
    success = response.status_code == 401
    print_result("Login Non-Existent User", success, f"Status: {response.status_code}")

def test_register_weak_password():
    # Attempt to register with short password
    payload = {"email": "weak_pass@example.com", "password": "123"}
    response = requests.post(f"{BASE_URL}/register", json=payload)
    
    # Expect 400 Bad Request (Class Validator)
    success = response.status_code == 400
    print_result("Register Weak Password", success, f"Status: {response.status_code}")

def main():
    print("Starting Backend Functional Tests (Negative Scenarios)...\n")
    
    try:
        test_register_duplicate_email()
        test_login_wrong_password()
        test_login_non_existent_user()
        test_register_weak_password()
    except Exception as e:
        print(f"\nExample script error: {e}")

if __name__ == "__main__":
    main()
