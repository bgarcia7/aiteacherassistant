from flask import Blueprint, request
import openai

import db

lesson_plan_blueprint = Blueprint(
  "lessonplan_blueprint", __name__
)

module_types = ['core objective', 'materials', 'warm up', 'instructions', 'guided practice', 'independent practice', 'conclusion']

LESSON_PLAN_PROMPT = """create a {num_minutes} minute lesson plan for {grade} grade students with the following learning objective: {learning_objective}. Make sure to use language that is appropriate for the grade level and subject area.

The response should be formatted as JSON modules each with a title and body, like so: """

LESSON_PLAN_EXAMPLE = """\n[{'title': 'sample module title 1', 'body': 'sample module content 1'}, {'title': 'sample module title 2', 'body': 'sample module body content 2'}}]"""
    

@lesson_plan_blueprint.route('/<plan_id>')
def get_lesson_plan(plan_id):
  return db.get_lesson_plan(plan_id)


@lesson_plan_blueprint.route('/', methods=['POST'])
def create_lesson_plan():
  print("HI")
  data = request.get_json()

  # Step 1: Create lesson plan object
  lesson_plan = db.insert_lesson_plan(data.get('title', 'Lesson Plan Sample title'), data.get('learning_objective', 'Lesson Plan Sample Description'))

  # Step 2: Generate lesson plan modules
  prompt = LESSON_PLAN_PROMPT.format(num_minutes=data.get('num_minutes', 60), grade=data.get('grade', '4th'), learning_objective=data.get('learning_objective','Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.')) + LESSON_PLAN_EXAMPLE
  print(f"prompt: {prompt}\ndata: {data}")

  response = openai.Completion.create(
      model="text-davinci-003",
      prompt=prompt,
      temperature=0.5,
      max_tokens=3900,
      top_p=1,
      frequency_penalty=1,
      presence_penalty=1
  )

  print(f"response:\n{response}")

  # TODO - requires prompt engineering to ensure modules are consistently well-formatted
  # modules = ast.literal_eval(response.choices[0].text.strip())

  # TODO - insert modules into db (also requires setting up lesson_plan_id mapping in Module table)
  # _ = [x['lesson_plan_id'] = lesson_plan['id'] for x in modules]
  # modules = insert_modules()

  return { 'lesson_plan': lesson_plan}
