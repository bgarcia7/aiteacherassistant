
from flask import Blueprint, request

import db
import ai

quiz_blueprint = Blueprint(
  "quiz_blueprint", __name__
)

@quiz_blueprint.route('/<quiz_id>')
def get_quiz(quiz_id):
  return db.get_quiz(quiz_id)


@quiz_blueprint.route('/', methods=['POST'])
def create_quiz():
  data = request.get_json()

  lesson_plan_id= data.get('lesson_plan_id')
  num_questions = data.get('num_questions', 5)
  question_types = data.get('question_types', 'multiple choice')

  lesson_plan = db.get_lesson_plan(lesson_plan_id)
  
  quiz = ai.generate_quiz(lesson_plan)
  print("Generated quiz:", quiz)
  quiz = db.insert_quiz(lesson_plan_id, quiz['pdf_url'], quiz['content'])

  return { 'quiz': quiz}
