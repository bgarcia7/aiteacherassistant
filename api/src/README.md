# Setup

```
cd api/src
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m flask run
```

open http://127.0.0.1:5000

# Deployment

Get zappa_settings.json from Brandon

```
cd api/src
source venv/bin/activate
zappa update production
```
