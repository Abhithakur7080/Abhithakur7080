# 🔧 Git Author Fix + Clean Repo Recreate Guide

## 🎯 Goal

* Fix all commits to a single author (name + email)
* Remove duplicate contributors
* Push clean history to a new GitHub repo

---

# 🧠 Step 1: Check Current Authors

```bash
git log --all --pretty="%an <%ae>"
```

👉 If you see multiple variations like:

```
Abhijeet kumar <email>
Abhijeet Kumar <email>
```

Then Git treats them as different contributors ❌

---

# 🚀 Step 2: Fix All Commits (Local Only)

```bash
git filter-branch --force --env-filter '
export GIT_AUTHOR_NAME="Abhijeet Kumar"
export GIT_AUTHOR_EMAIL="abhijeetthakur7080@gmail.com"
export GIT_COMMITTER_NAME="Abhijeet Kumar"
export GIT_COMMITTER_EMAIL="abhijeetthakur7080@gmail.com"
' --tag-name-filter cat -- --all
```

---

# 🧹 Step 3: Clean Old Git History

```bash
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

---

# 🔍 Step 4: Verify Fix

```bash
git log --all --pretty="%an <%ae>"
```

✅ Expected:

```
Abhijeet Kumar <abhijeetthakur7080@gmail.com>
```

---

# 🌐 Step 5: Delete Old GitHub Repo

1. Go to GitHub repo
2. Open **Settings**
3. Scroll down → **Delete this repository**
4. Confirm deletion

---

# 🆕 Step 6: Create New Repo on GitHub

* Click **New Repository**
* Use same or new name
* DO NOT initialize with README

---

# 🔗 Step 7: Connect Local Repo to New Repo

```bash
git remote remove origin
git remote add origin https://github.com/your-username/repo-name.git
```

---

# 🚀 Step 8: Push Clean History

```bash
git push -u origin main
```

---

# ✅ Final Result

* Only one contributor visible 🎯
* Clean commit history ✅
* No duplicate authors ✅

---

# 💡 Best Practice (Avoid Future Issues)

Set correct local Git config:

```bash
git config user.name "Abhijeet Kumar"
git config user.email "abhijeetthakur7080@gmail.com"
```

---

# 🔥 Summary

| Step | Action           |
| ---- | ---------------- |
| 1    | Check authors    |
| 2    | Rewrite commits  |
| 3    | Clean history    |
| 4    | Verify           |
| 5    | Delete repo      |
| 6    | Create new repo  |
| 7    | Reconnect remote |
| 8    | Push clean code  |

---

# ⚠️ Notes

* This process rewrites Git history
* Safe for personal projects
* Avoid on shared repos unless coordinated

---

✅ Done! Your repo is now clean and professional 🚀
