# Authentication Testing Guide

## 🔬 Backend Test Automation (Pytest)
We have written a comprehensive suite testing every edge case (Brute Force, Sign Ups, Logging Out, Route Locking).

You can run this anytime within the `/backend` folder:
```bash
.\venv\Scripts\pytest.exe tests/test_auth.py -v
```

### ✅ Expected Console Output (100% Passing)
```text
======================= test session starts =======================
collected 7 items

tests/test_auth.py::test_fresh_signup PASSED                             [ 14%]
tests/test_auth.py::test_duplicate_email_signup PASSED                   [ 28%]
tests/test_auth.py::test_weak_password_signup PASSED                     [ 42%]
tests/test_auth.py::test_login_flow PASSED                               [ 57%]
tests/test_auth.py::test_wrong_password_and_brute_force PASSED           [ 71%]
tests/test_auth.py::test_logout_blacklisting PASSED                      [ 85%]
tests/test_auth.py::test_protected_routes PASSED                         [100%]

======================== 7 passed in 19.66s =======================
```

---

## 💻 Frontend Manual Test Checklist (UI Simulation)

Follow these steps exactly in your browser to verify the frontend UI correctly handles our robust new constraints:

### 1️⃣ Fresh Signup (Happy Path)
- [ ] Go to `http://localhost:3000/signup`.
- [ ] Enter a valid name (`Tunde Ola`).
- [ ] Enter a new email address (`tunde@example.com`).
- [ ] Enter a strong password (`JambBoss2025!`). *Observe the new dynamic password strength meter turn green.*
- [ ] Accept terms and click "Create Account".
- [ ] **Expected result:** Immediately redirects to `/dashboard`. Navbar says "Welcome, Tunde!".

### 2️⃣ Duplicate Email Prevention
- [ ] Log out.
- [ ] Go back to `/signup`.
- [ ] Try to sign up again with `tunde@example.com`.
- [ ] **Expected result:** Form prevents signup and shows a red error: *"This email is already registered. Try logging in instead."* with a clickable link to the login page.

### 3️⃣ Password Strength Enforcement
- [ ] Try signing up with the password `password123`.
- [ ] **Expected result:** Frontend validation blocks submission before it hits the backend. Red error reads: *"Password does not meet minimum strength requirements"*.

### 4️⃣ Login Success
- [ ] Go to `/login`.
- [ ] Enter `tunde@example.com` and `JambBoss2025!`.
- [ ] **Expected result:** Successful login, instant redirect to `/dashboard` without requiring a page refresh.

### 5️⃣ Brute Force Lockout
- [ ] Log out.
- [ ] Go to `/login`.
- [ ] Try logging in with the correct email `tunde@example.com` but a **wrong password**.
- [ ] Hit "Log In" **5 times in a row**.
- [ ] **Expected result:** On the 5th attempt, the backend will lock the account. The frontend will display: *"Account temporarily locked due to too many failed attempts. Try again in 15 minutes."* Subsequent correct attempts will also be denied until the lockout expires.

### 6️⃣ Logout & JWT Blacklisting
- [ ] Wait 15 minutes (or use a fresh test account) to log in.
- [ ] Click the "Logout" button in the Top Right User Menu.
- [ ] **Expected result:** Instant redirect to home page. You cannot use the browser "Back" button to return to the dashboard. The backend formally blacklisted the token, rendering it completely dead.

### 7️⃣ Protected Routes Redirect
- [ ] While logged out, try typing `http://localhost:3000/dashboard` directly into your browser URL bar.
- [ ] **Expected result:** Next.js middleware instantly deflects you back to `/login?returnUrl=/dashboard`.
