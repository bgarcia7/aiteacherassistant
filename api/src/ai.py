module_types = ['core objective', 'materials', 'warm up', 'instructions', 'guided practice', 'independent practice', 'conclusion']

LESSON_PLAN_PROMPT = """create a {num_minutes} minute lesson plan for {grade} grade students with the following learning objective: {learning_objective}. Make sure to use language that is appropriate for the grade level and subject area.

The response should be formatted as JSON modules each with a title and body, like so: """

LESSON_PLAN_EXAMPLE = """\n[{'title': 'sample module title 1', 'body': 'sample module content 1'}, {'title': 'sample module title 2', 'body': 'sample module body content 2'}}]"""

SAMPLE_MODULES = [{'module_type': 'warm up', 'title': 'sample module title 1', 'body': 'sample module content 1'}, {'module_type': 'guided practice', 'title': 'sample module title 2', 'body': 'sample module body content 2'}]

def generate_modules(num_minutes, grade, learning_objective):
  prompt = LESSON_PLAN_PROMPT.format(num_minutes=num_minutes, grade=grade, learning_objective=learning_objective) + LESSON_PLAN_EXAMPLE
  print(f"prompt: {prompt}\n")


  print("TODO: Generate modules")
  # TODO: Parse and get modules
  # response = openai.Completion.create(
  #     model="text-davinci-003",
  #     prompt=prompt,
  #     temperature=0.5,
  #     max_tokens=3900,
  #     top_p=1,
  #     frequency_penalty=1,
  #     presence_penalty=1
  # )

  #TODO: Properly generate and return response


  # print(f"response:\n{response}")
  # TODO - requires prompt engineering to ensure modules are consistently well-formatted
  # modules = ast.literal_eval(response.choices[0].text.strip())

  # TODO - insert modules into db (also requires setting up lesson_plan_id mapping in Module table)
  # _ = [x['lesson_plan_id'] = lesson_plan['id'] for x in modules]
  # modules = insert_modules()

  return SAMPLE_MODULES


def regenerate_module(module):
    print("TODO: Regenerate module")
    return module