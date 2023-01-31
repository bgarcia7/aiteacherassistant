from flask import Blueprint, request
import openai

import db

module_blueprint = Blueprint(
  "module_blueprint", __name__
)

module_types = ['core objective', 'materials', 'warm up', 'instructions', 'guided practice', 'independent practice', 'conclusion']

LESSON_PLAN_PROMPT = """create a {num_minutes} minute lesson plan for {grade} grade students with the following learning objective: {learning_objective}. Make sure to use language that is appropriate for the grade level and subject area.

The response should be formatted as JSON modules each with a title and body, like so: """

LESSON_PLAN_EXAMPLE = """\n[{'title': 'sample module title 1', 'body': 'sample module content 1'}, {'title': 'sample module title 2', 'body': 'sample module body content 2'}}]"""
    

@module_blueprint.route('/<module_id>')
def get_module(module_id):
  return db.get_module(module_id)


@module_blueprint.route('/<module_id>', methods=['POST'])
def regenerate_module(module_id):
  #TODO: Regenerate module
  return db.get_module(module_id)
