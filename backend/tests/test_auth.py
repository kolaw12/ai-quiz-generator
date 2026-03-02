import pytest
import time
import random
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_random_ip():
    return f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}_{time.time()}"

def test_fresh_signup():
    ip = get_random_ip()
    timestamp = str(int(time.time() * 1000))
    email = f"adaeze_{timestamp}@gmail.com"
    payload = {
        "name": "Adaeze Okafor",
        "email": email,
        "password": "MyJamb2025!"
    }
    
    response = client.post("/api/auth/signup", json=payload, headers={"x-forwarded-for": ip})
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert "user" in data

def test_duplicate_email_signup():
    ip = get_random_ip()
    timestamp = str(int(time.time() * 1000))
    email = f"adaeze_dup_{timestamp}@gmail.com"
    payload = {
        "name": "Adaeze Okafor",
        "email": email,
        "password": "MyJamb2025!"
    }
    
    client.post("/api/auth/signup", json=payload, headers={"x-forwarded-for": ip})
    response = client.post("/api/auth/signup", json=payload, headers={"x-forwarded-for": ip})
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_weak_password_signup():
    ip = get_random_ip()
    payload = {
        "name": "Test User",
        "email": f"test_{int(time.time())}@gmail.com",
        "password": "pass"
    }
    
    response = client.post("/api/auth/signup", json=payload, headers={"x-forwarded-for": ip})
    assert response.status_code == 400
    assert "Password" in response.json()["detail"]

def test_login_flow():
    ip = get_random_ip()
    timestamp = str(int(time.time() * 1000))
    email = f"login_test_{timestamp}@gmail.com"
    password = "SuperSecure123!"
    
    client.post("/api/auth/signup", json={"name": "Test User", "email": email, "password": password}, headers={"x-forwarded-for": ip})
    
    response = client.post("/api/auth/login", json={"email": email, "password": password}, headers={"x-forwarded-for": ip})
    assert response.status_code == 200
    assert "token" in response.json()
    assert response.json()["user"]["email"] == email

def test_wrong_password_and_brute_force():
    ip = get_random_ip()
    timestamp = str(int(time.time() * 1000))
    email = f"brute_test_{timestamp}@gmail.com"
    correct_password = "SuperSecure123!"
    wrong_password = "WrongPassword123!"
    
    client.post("/api/auth/signup", json={"name": "Test User", "email": email, "password": correct_password}, headers={"x-forwarded-for": ip})
    
    for i in range(6):
        response = client.post("/api/auth/login", json={"email": email, "password": wrong_password}, headers={"x-forwarded-for": ip})
        
        if i < 5:
            assert response.status_code == 401
            assert "Invalid" in response.json()["detail"]
        else:
            assert response.status_code == 429
            assert "locked" in response.json()["detail"]

def test_logout_blacklisting():
    ip = get_random_ip()
    timestamp = str(int(time.time() * 1000))
    email = f"logout_test_{timestamp}@gmail.com"
    password = "SuperSecure123!"
    
    client.post("/api/auth/signup", json={"name": "Test User", "email": email, "password": password}, headers={"x-forwarded-for": ip})
    login_resp = client.post("/api/auth/login", json={"email": email, "password": password}, headers={"x-forwarded-for": ip})
    token = login_resp.json()["token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    me_resp = client.get("/api/auth/me", headers=headers)
    assert me_resp.status_code == 200
    
    logout_resp = client.post("/api/auth/logout", headers=headers)
    assert logout_resp.status_code == 200
    
    me_resp_after = client.get("/api/auth/me", headers=headers)
    assert me_resp_after.status_code == 401
    assert "revoked" in me_resp_after.json()["detail"].lower()

def test_protected_routes():
    response = client.get("/api/auth/me")
    assert response.status_code == 401
