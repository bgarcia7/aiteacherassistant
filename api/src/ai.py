import openai
import re
from generation_constants import *
from pdf import create_pdf, upload_pdf_to_s3

import db

# ===============[ INTERNAL FUNCTIONS ]=================

#### GENERAL STRING FORMATTING ####
def clean_text(string):
    string = string.strip()
    for rtr in REPLACEMENT_REGEXES:
        string = re.sub(rtr[0], rtr[1], string)
    return string


def parse_string_on_sent(string, s, regex_format=REGEX_BASE):
    regex = regex_format.format(s=s)
    parsed = [x for x in re.split(
        regex, string.strip(), maxsplit=0) if x and len(x.strip()) > 3]
    return parsed


#### QUIZ STRING FORMATTING ####
def parse_options(q):
    return parse_string_on_sent(q, '|'.join(QUIZ_OPTION_SENTINELS), regex_format=REGEX_QUIZ)

def structure_quiz_response(string):
    questions = parse_string_on_sent(string, '|'.join(QUIZ_QUESTION_SENTINELS))
    questions = [
        {'question': clean_text(parse_options(q)[0]),
         'options':[clean_text(o) for o in parse_options(q)[1:]]}
        for q in questions
    ]
    return questions


def prettify_quiz(quiz):
    return '\n\n'.join([
        QUIZ_QUESTION_SENTINELS[ix] + '. ' + q['question'] + '\n' + '\n'.join(['\t' + QUIZ_OPTION_SENTINELS[ix2] + ') ' + o for ix2, o in enumerate(q['options'])]) for ix, q in enumerate(quiz)
    ])

#### LESSON PLAN STRING FORMATTING ####
# Accepts a string with different subsections seperated by \n

def prettify_module(module_body):
    print("MODULE BODY:", module_body)
    print([(ix2, s) for ix2, s in enumerate(module_body.split("\n"))])
    return '\n'.join([SUBSECTION_SENTINELS[ix2] + '. ' + s for ix2, s in enumerate(module_body.split("\n"))])


def prettify_lesson_plan(lesson_plan):
    modules = lesson_plan['modules']
    string = 'Learning Objective: ' + lesson_plan['title'] + '\n'
    string += 'Lesson Plan:\n'
    for ix, m in enumerate(modules):
        # print(ix, m)
        string += SECTION_SENTINELS[ix] + '. ' + m['title'] + \
            ' (' + (m.get('duration') or 'N/A') + ') \n'
        string += m['body']
    return string


def structure_module(module):
    print("Module: ", module)
    s = {}
    subsections = parse_string_on_sent(module, '|'.join(SUBSECTION_SENTINELS))
    section_info = subsections[0]

    split_section_info = section_info.split('(')
    s['title'] = split_section_info[0].strip()
    # Handle case when there is no duration
    if len(split_section_info) > 1:
        s['duration'] = clean_text(split_section_info[1].replace(')', ''))
    # Format module
    cleaned_subsections = [clean_text(subsection)
                           for subsection in subsections[1:]]
    s['body'] = '\n'.join([SUBSECTION_SENTINELS[ix2] +
                          '. ' + s for ix2, s in enumerate(cleaned_subsections)])
    print("structure_module:-=================\n", s)
    return s


def structure_response(string):
    # Parse modules
    # print("structure_response:", string)
    modules = parse_string_on_sent(string, '|'.join(SECTION_SENTINELS))
    # print("Parsed_structured_response: ", string)
    return [structure_module(m) for m in modules]


def structure_slide_response(string):
    formatted_slides = []
    slides = [clean_text(x) for x in parse_string_on_sent(string, '|'.join(['Slide ?' + str(ix) for ix in range(1, 20)])) if x and ('slide' not in x and len(x) > 2*len('slide'))]
    for slide in slides:
        components = [clean_text(s) for s in parse_string_on_sent(slide, '|'.join(SLIDE_SENTINELS), REGEX_SLIDES_COMPONENTS)]
        formatted_slide = {}
        for ix, c in enumerate(components):
            details = [clean_text(d) for d in parse_string_on_sent(clean_text(c), '|'.join(SLIDE_DETAIL_SENTINELS), REGEX_SLIDES_DETAILS)]
            # if slide component couldn't be broken down into details, we store a single string instead of an array of length = 1. Length > 1 corresponds to "content"
            if SLIDE_SENTINELS[ix].lower() == 'text':
                formatted_slide[SLIDE_SENTINEL_MAPPING[SLIDE_SENTINELS[ix]]] = details
            else:
                formatted_slide[SLIDE_SENTINEL_MAPPING[SLIDE_SENTINELS[ix]]] = details[0]
        formatted_slides.append(formatted_slide)
    return formatted_slides
    
    
    


#### OPEN AI API CALLS ####
def get_response(prompt, temperature=0.6):
    print("PROMPT:", prompt)
    response = openai.Completion.create(
        # model="text-chat-davinci-002-20230126",
        model="text-davinci-003",
        prompt=prompt,
        temperature=temperature,
        max_tokens=3500 - len(prompt.split()),
        top_p=1,
        frequency_penalty=1,
        presence_penalty=1
    )
    db.insert_prompt(prompt, response.choices[0].text.strip())
    return response.choices[0].text.strip()


# ===============[ EXTERNAL FUNCTIONS ]=================

def generate_modules(title, learning_objective, num_minutes=60):
    print("GENERATING MODULES")
    prompt = PROMPT_TEMPLATE.format(
        learning_objective=learning_objective, num_minutes=num_minutes)
    response = get_response(prompt)
    print("RAW Response: ", response)

    modules = structure_response(response)
    return modules


def expand_module(lesson_plan, module):
    prompt = EXPAND_MODULE_PROMPT.format(
        title=module['title'], lesson_plan=prettify_lesson_plan(lesson_plan))
    response = get_response(prompt)
    print("RAW Response: ", response)
    new_module = structure_module(response)
    print("OLDDDDD\n", module, "\nNEWWWW\n", new_module)
    return new_module


def regenerate_module(lesson_plan, module):
    print("REGENERATING MODULES")
    prompt = REGENERATE_MODULE_PROMPT.format(
        title=module['title'], lesson_plan=prettify_lesson_plan(lesson_plan))
    response = get_response(prompt, temperature=0.75)
    print("RAW Response: ", response)
    new_module = structure_module(response)
    print("OLDDDDD\n", module, "\nNEWWWW\n", new_module)
    return new_module


def generate_quiz(lesson_plan):
    lecture_string = prettify_module(
        [x for x in lesson_plan['modules'] if 'lecture' in x['title'].lower()][0]['body'])
    prompt = GENERATE_QUIZ_PROMPT.format(
        learning_objective=lesson_plan['description'], lecture=lecture_string, num_question=5)
    response = get_response(prompt, temperature=0.5)
    print("RAW Response:\n", response)
    quiz = structure_quiz_response(response)
    pdf_name = create_pdf(lesson_plan['title'], prettify_quiz(quiz))
    pdf_url = upload_pdf_to_s3(pdf_name)
    return {'content': quiz, 'pdf_url': pdf_url}


def generate_slides(lesson_plan):
    lecture_string = prettify_module(
        [x for x in lesson_plan['modules'] if 'lecture' in x['title'].lower()][0]['body'])
    prompt = GENERATE_SLIDES_PROMPT.format(lecture=lecture_string)
    response = get_response(prompt, temperature=0.5)
    print("RAW Response:\n", response)
    slides = structure_slide_response(response)
    print("SLIDESSSSSS:\n", slides)
    return slides
