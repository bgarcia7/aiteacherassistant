
from flask import Blueprint, request, jsonify

import db
import ai
import gslides

slide_deck_blueprint = Blueprint(
    "slide_deck_blueprint", __name__
)


@slide_deck_blueprint.route('/<slide_deck_id>')
def get_slide_deck(slide_deck_id):
    return db.get_slide_deck(slide_deck_id)


@slide_deck_blueprint.route('/', methods=['POST'])
def create_slides():
    data = request.get_json()
    print("Got data", data)

    lesson_plan_id = data.get('lesson_plan_id')
    if not lesson_plan_id:
        return jsonify({"error": "Missing lesson_plan_id"}), 400

    lesson_plan = db.get_lesson_plan(lesson_plan_id)
    slides = ai.generate_slides(lesson_plan)
    drive_url = gslides.createGoogleSlides(
        lesson_plan.get("title"), slides)
    slide_deck = db.insert_slide_deck(lesson_plan_id, slides, drive_url)
    expanded_slide_deck = db.get_slide_deck(slide_deck['id'])
    return jsonify({"slides": expanded_slide_deck})
