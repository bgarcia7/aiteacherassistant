
from flask import Blueprint, request, jsonify

import db
import ai
import gslides
import requests

slide_deck_blueprint = Blueprint(
    "slide_deck_blueprint", __name__
)


@slide_deck_blueprint.route('/<slide_deck_id>')
def get_slide_deck(slide_deck_id):
    return db.get_slide_deck(slide_deck_id)


# @slide_deck_blueprint.route('/<slide_deck_id>/google')
# def create_google_slides(slide_deck_id):
#     slide_deck = db.get_slide_deck(slide_deck_id)
#     lesson_plan = db.get_lesson_plan(slide_deck.lesson_plan_id)

#     drive_url = gslides.createGoogleSlides(
#         lesson_plan.get("title"), slide_deck.get("slides", []))

#     slide_deck = db.update_slide_deck(slide_deck.id, {"drive_url": drive_url})
#     expanded_slide_deck = db.get_slide_deck(slide_deck['id'])
#     return jsonify({"slides": expanded_slide_deck})


@slide_deck_blueprint.route('/', methods=['POST'])
def create_slides():
    data = request.get_json()
    print("Got data", data)

    lesson_plan_id = data.get('lesson_plan_id')
    if not lesson_plan_id:
        return jsonify({"error": "Missing lesson_plan_id"}), 400

    lesson_plan = db.get_lesson_plan(lesson_plan_id)
    slides = ai.generate_slides(lesson_plan)

    for slide in slides:
        gImage = getGoogleImage(slide["image_description"])
        print(
            f"For description {slide['image_description']}, got image {gImage}")
        slide["image_url"] = gImage
    drive_url = gslides.createGoogleSlides(lesson_plan.get("title"), slides)
    slide_deck = db.insert_slide_deck(lesson_plan_id, slides, drive_url)
    expanded_slide_deck = db.get_slide_deck(slide_deck['id'])
    return jsonify({"slides": expanded_slide_deck})


@slide_deck_blueprint.route('/audio', methods=['POST'])
def create_slides_audio():
    data = request.get_json()
    print("Got data", data)
    lesson_plan_id = data.get('lesson_plan_id')
    if not lesson_plan_id:
        return jsonify({"error": "Missing lesson_plan_id"}), 400

    lesson_plan = db.get_lesson_plan(lesson_plan_id)
    slide_deck = lesson_plan['slide_deck']
    if not slide_deck:
        return jsonify({"error": "Missing slides for lesson_plan_id: {pid}".format(pid=lesson_plan_id)}), 400

    script, audio_task_id = ai.generate_audio(
        lesson_plan['description'], slide_deck)
    print("INSERTING AUDIO DATA", slide_deck['id'], audio_task_id, script)
    db.insert_audio_data(slide_deck['id'], audio_task_id, script)

    return jsonify({'audio_task_id': audio_task_id, 'script': script}), 200


def getGoogleImage(image_description):
    payload = {"query": image_description}
    r = requests.post(
        'http://ec2-35-86-252-232.us-west-2.compute.amazonaws.com/get_image', json=payload)
    myResp = r.json()
    return myResp['image_url']
