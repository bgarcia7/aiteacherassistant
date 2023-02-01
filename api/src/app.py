# app.py

from flask import Flask, request
import yaml
from flask_cors import CORS, cross_origin
from ast import literal_eval
import os
import ast
import openai
import random
import json

from lesson_plan import lesson_plan_blueprint
from module import module_blueprint
app = Flask(__name__)
app = CORS(app)

# ========[ PRODUCTION ]=========
# openai.organization = os.environ.get('OPENAI_ORG')
# openai.api_key = os.environ.get('OPENAI_KEY')

# ========[ LOCAL ]=========
openai.organization = json.load(open('zappa_settings.json'))['production']['environment_variables']['OPENAI_ORG']
openai.api_key = json.load(open('zappa_settings.json'))['production']['environment_variables']['OPENAI_KEY']


@app.route('/')
def hello_world():
 return '<h1>SHE LIVES</h1>'

app.register_blueprint(lesson_plan_blueprint, url_prefix='/lesson_plan')
app.register_blueprint(module_blueprint, url_prefix='/module')

# We only need this for local development.
if __name__ == '__main__':
 app.run(debug=True)
