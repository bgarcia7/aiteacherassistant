from flask import Blueprint, request, jsonify
import db
import ai
import gslides

lesson_plan_blueprint = Blueprint(
    "lessonplan_blueprint", __name__
)


@lesson_plan_blueprint.route('/<plan_id>')
def get_lesson_plan(plan_id):
    return db.get_lesson_plan(plan_id)


@lesson_plan_blueprint.route('/', methods=['POST'])
def create_lesson_plan():
    data = request.get_json()

    title = data.get('title', 'Default Title')
    learning_objective = data.get(
        'learning_objective', 'Understand the concept of a ratio and use ratio language to describe a ratio relationship between two quantities.')
    num_minutes = data.get('num_minutes', 60)
    # grade = data.get('grade', '4th')

    modules = ai.generate_modules(title, learning_objective, num_minutes)
    print("Generated modules:", modules)
    lesson_plan = db.insert_lesson_plan(title, learning_objective, modules)

    expanded_lesson_plan = db.get_lesson_plan(lesson_plan['id'])

    return {'lesson_plan': expanded_lesson_plan}


@lesson_plan_blueprint.route('/', methods=['PUT'])
def update_lesson_plan():
    data = request.get_json()
    modules = data.get('modules')

    updated_modules = [db.update_module(m.get('id'), m) for m in modules]
    updated_lesson_plan = db.update_lesson_plan(data.get('id'), data)
    expanded_lesson_plan = db.get_lesson_plan(updated_lesson_plan['id'])

    return {'lesson_plan': expanded_lesson_plan}
