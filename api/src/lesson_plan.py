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


@lesson_plan_blueprint.route('/<plan_id>/slides', methods=['POST'])
def create_slides(plan_id):
    lesson_plan = db.get_lesson_plan(plan_id)
    slides = ai.generate_slides(lesson_plan)
    drive_url = gslides.createGoogleSlides(lesson_plan.get("title"), slides)
    slide_deck = db.insert_slide_deck(plan_id, slides, drive_url)
    expanded_slide_deck = db.get_slide_deck(slide_deck['id'])
    return jsonify({"slides": expanded_slide_deck})
