# app.py

from flask import Flask, request
from flask import Flask
from flask_cors import CORS
from ast import literal_eval
import os
import random
app = Flask(__name__)
CORS(app)

import openai
print('OPENAI_ORG', os.environ.get('OPENAI_ORG'))
# openai.organization = os.environ.get('OPENAI_ORG')
openai.organization = 'org-JoyTBJ8CFCC0eUSQnlLSHDxK'
# openai.api_key = os.environ.get('OPENAI_KEY')
openai.api_key = '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'

@app.route('/')
def hello_world():
 return '<h1>SHE LIVES</h1>'

module_types = ['core objective', 'materials', 'warm up', 'instructions', 'guided practice', 'independent practice', 'conclusion']

# function to generate random module type from module types
def generate_module_type():
    return module_types[random.randint(0, len(module_types) - 1)]

@app.route('/lessonplan/<plan_id>', methods=['GET','POST'])
def lesson_plan(plan_id):

    return {
        'title': '1.NBT.4 Basic Addition',
        'description': 'Add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used. Understand that in adding two-digit numbers, one adds tens and tens, ones and ones, and sometimes it is necessary to compose a ten.',
        'modules': [
            {'module_type': generate_module_type(),
            'body': 'Students will be able to add two-digit numbers using a variety of strategies.'},
            {'module_type': generate_module_type(),
            'body': 'Students will be able to add two-digit numbers using a variety of strategies.'},
            {'module_type': generate_module_type(),
            'body': 'Students will be able to add two-digit numbers using a variety of strategies.'}
        ]
    }


    # print(openai.api_key)
    # print(openai.organization)
    # response = openai.Completion.create(
    #     model="text-davinci-003",
    #     prompt="test",
    #     temperature=0.5,
    #     max_tokens=400,
    #     top_p=1,
    #     frequency_penalty=1,
    #     presence_penalty=1
    # )
    # print(response)
    # return {'response': response}

# We only need this for local development.
if __name__ == '__main__':
 app.run(debug=True)
