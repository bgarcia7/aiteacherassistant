# app.py

from flask import Flask, request
import yaml
from flask_cors import CORS
from ast import literal_eval
import os
import ast
import random
app = Flask(__name__)
CORS(app)

import openai
openai.organization = os.environ.get('OPENAI_ORG')
openai.api_key = os.environ.get('OPENAI_KEY')

@app.route('/')
def hello_world():
 return '<h1>SHE LIVES</h1>'

module_types = ['core objective', 'materials', 'warm up', 'instructions', 'guided practice', 'independent practice', 'conclusion']

# function to generate random module type from module types
def generate_module_type():
    return module_types[random.randint(0, len(module_types) - 1)]


LESSON_PLAN_PROMPT = """create a {num_minutes} minute lesson plan for {grade} grade students with the following learning objective: {learning_objective}. Make sure to use language that is appropriate for the grade level and subject area.

The response should be formatted as YAML modules each with a title and body, like so: """

LESSON_PLAN_EXAMPLE = """\n[{'title': 'sample module title 1', 'body': 'sample module content 1'}, {'title': 'sample module title 2', 'body': 'sample module body content 2'}}]"""
    
@app.route('/lessonplan/<plan_id>', methods=['GET'])
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

@app.route('/createlessonplan', methods=['GET', 'POST'])
def create_lesson_plan():
    if request.method == 'GET':
        data = {}
    if request.method == 'POST':
        data = request.get_json()

    prompt = LESSON_PLAN_PROMPT.format(num_minutes=data.get('num_minutes', 60), grade=data.get('grade', '4th'), learning_objective=data.get('learning_objective','Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.')) + LESSON_PLAN_EXAMPLE
    
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.5,
        max_tokens=3900,
        top_p=1,
        frequency_penalty=1,
        presence_penalty=1
    )

    lessonplan = {'modules': ast.literal_eval(response.choices[0].text.strip())}
    print(lessonplan)
    lessonplan['title'] = data.get('title', 'Lesson Plan Sample Title')
    lessonplan['description'] = data.get('description', 'Lesson Plan Sample Description')
    return { 'lessonplan': lessonplan }

# We only need this for local development.
if __name__ == '__main__':
 app.run(debug=True)
