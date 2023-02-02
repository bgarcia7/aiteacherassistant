SECTION_SENTINELS = ['I', 'II', 'III', 'IV', 'V']
SUBSECTION_SENTINELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
REGEX_QUIZ = r'([\.\(\n]({s})[ \.\)])|^\W(({s})[\.\)])|([\.\(\n ]({s}) ?[\.\)])'
REGEX_BASE = r'([\. \(\n]({s})[ \.\)]|({s})[\.\)\n])'
QUIZ_QUESTION_SENTINELS = [str(x) for x in range(1, 20)]
QUIZ_OPTION_SENTINELS = ['a', 'b', 'c', 'd', 'e']

REPLACEMENT_REGEXES = [
    ('<|im_end|>', ''),
    (r'(\. ?){2,}', '.'),
    (r'^[\(\) \.]*', ''),
    (r'(\. ?)\?', '?'),
    (r'(\. ?)\!', '!'),
    (r'(\. ?),', ','),
    (r'( , )', ', '),
    # Sometimes it does many tabs instead of a space
    (r'(\t\t\t+)', '\n'),
    (r'(      +)', '\n')
]

PROMPT_TEMPLATE = """Create a lesson plan for a {num_minutes} minute class consisting of an introduction, lecture, a guided practice, and an individual practice for the learning objective below:
###
Learning Objective: Identify different types of consumers in a food chain, including animals that eat plants, animals that eat other animals, and animals that eat plants and animals for 7th graders
Lesson Plan:
I. Introduction (5 minutes) 
    A. Introduction to the topic: Explain what a food chain is and why it’s important to understand different types of consumers in a food chain. 
    B. Introduce learning objective: Today, we will be learning about different types of consumers in a food chain, including animals that eat plants, animals that eat other animals, and animals that eat plants and animals for 7th graders. 
II. Lecture Section (20 minutes) 
    A. Discuss primary consumers – Animals that only consume plants, such as rabbits or deer: Begin by introducing the concept of a food chain and explaining how energy flows through it from one organism to another. Explain what primary consumers are and provide examples of organisms that fit into this category, such as rabbits, deer, cows, sheep, goats, horses etc. Describe what type of diet these animals have (herbivorous).  
    B. Discuss secondary consumers – Animals that consume both plant-eating animals and other meat-eating predators like snakes or hawks: Provide examples of organisms in this category such as foxes, wolves ,snakes ,hawks etc., and explain their dietary habits (carnivorous). Explain why these animals must depend on the lower level organisms for their survival by discussing the flow of energy within an ecosystem. 
    C. Discuss tertiary consumer – Top predators at the top of the food chain such as lions or sharks : Introduce students to tertiary consumers which are large carnivores at the top of a food chain who feed upon herbivores and other carnivores alike. Provide examples such as lions, sharks, orca whales etc., and discuss their role in maintaining balance within an ecosystem by keeping numbers of secondary consumers and primary consumers in check, which helps keep plant populations at healthy levels.
    D. Discuss omnivores - Animals which feed on both plants and other animal species like bears or humans: Introduce students to omnivore species which can be found throughout different ecosystems around the world including bears, humans, pigs etc.. Explain how they can adapt to various environments due to their ability to eat both vegetation and meat products thus allowing them access to more resources than strictly herbivorous/carnivorous species do not have access too. 
    E. Review key points from lecture section: Summarize all concepts discussed throughout lecture section by highlighting main ideas related to each type consumer discussed while also pointing out ways in which they interact with one another within an ecosystem
III Guided Practice Section (15 minutes)
    A. Group activity 1: Break students into groups of 4-5 and have them identify different examples of primary, secondary, tertiary, and omnivore consumers within their group by discussing with one another. Ask them to think about primary, secondary, tertiary, and omnivore consumers that live in your local area.
    B. Group Activity 2 : Have each group draw out an example of a simple food web showing how energy flows from one organism to another within the environment
IV Individual Practice Section (20 minutes)
    A. Independent practice activity 1 : Have students complete worksheets individually which ask them to identify various organisms as either primary, secondary, tertiary, or omnivore consumers
    B. Independent practice activity 2 : Have students create their own mini poster board illustrating an example of how energy flows between organisms within an ecosystem
###
Learning Objective: Explain the role of an API in the development of applications and the distinction between a programming language's syntax and the API for 11th graders
Lesson Plan:
I. Introduction (5 minutes)
    A. Introduce the lesson topic: Explain the role of an API in the development of applications and the distinction between a programming language's syntax and the API 
    B. Discuss why it is important to understand APIs, their features, and how they are used in application development 
    C. Ask students what they already know about APIs and discuss any ideas or questions that arise 
II. Lecture (30 minutes)
    A. Define what an API is, its purpose, and how it can be used in application development. An API stands for Application Programming Interface and it provides a way to access the functionality of another application or service. It allows developers to use pre-existing code when building their applications which makes the development process much faster and easier. 
    B. Describe different types of APIs including web services, libraries/frameworks, database accessors etc. Web Service APIs: These are typically used to allow two applications to communicate with each other over the internet using a protocol such as HTTP or HTTPS. Examples include Google Maps API or Facebook Graph API. Library/Framework APIs: This type of API is provided by programming language frameworks such as ReactJS or AngularJS that provide additional functionality for developers when building their applications. Database Accessor APIs: These types of APIs provide access to data stored in databases such as SQL Server or Oracle Database allowing developers to query and retrieve information from them without writing custom code every time they need something new from the database. 
    C. Provide examples of popular APIs such as Google Maps or Facebook Graph API. Examples of popular web service based APIs include Google Maps API, which allows you to embed maps into your website with just a few lines of code; Facebook GraphAPI which gives you access to all sorts of user data on Facebook; Twitter's RESTful Services that let you programmatically interact with tweets posted on twitter; Amazon AWS SDKs that give you direct access to cloud computing services like S3 storage buckets; Stripe Connect Platform for accepting payments online; etc... 
    D Explain the difference between a programming language’s syntax and an API’s syntax. A programming language's syntax refers specifically to how instructions are written within the framework provided by that particular language while an APi's syntax describes how requests should be structured when interacting with external systems via an interface like HTTP(S). For example if we were making a request using Ruby we would structure our request differently than if we were making one using Java since both languages have different syntactical structures even though they may be ableto make requests similarly at some level underneathe surface..     E Demonstrate how
    E. Demonstrate how to use an example code snippet with both languages' syntaxes side by side for comparison purposes 
III Guided Practice Section (15 minutes)
    A. Have students work together in pairs to write sample code for interacting with a publically available API of your choosiing 
    B. Guide them through each step while providing assistance if needed
    C. Allow time for discussion among peers
    D. Encourage constructive feedback from other group members
IV Individual Practice (10 minutes)
    A. Give students individual practice problems related to concepts discussed during lecture
    B. Assign tasks that require synthesis of multiple skills
    C. Monitor student progress while offering hints when needed
###
Learning Objective: {learning_objective}
Lesson Plan:
"""

EXPAND_MODULE_PROMPT = """Given the lesson plan below, provide more detail and specific content regarding section {title}
###
{lesson_plan}
###
 """

REGENERATE_MODULE_PROMPT = """Given the lesson plan below, please create a completely different and more detailed version of section {title}
###
{lesson_plan}
"""

GENERATE_QUIZ_PROMPT = """Create a {num_question} question multiple choice quiz that can be used for a lesson plan with the following objective and lecture. Seperate each question and option with a new line:
learning_objective: {learning_objective}
lecture: {lecture}

Example of desired output format with dummy data:
1. Multiple choice question 1
a) multiple choice question 1 option a 
b) multiple choice question 1 option b
c) multiple choice question 1 option c
d) multiple choice question 1 option d
2. Multiple choice question 2
a) multiple choice question 2 option a 
b) multiple choice question 2 option b
c) multiple choice question 2 option c
d) multiple choice question 2 option d
3. Multiple choice question 3
a) multiple choice question 3 option a 
b) multiple choice question 3 option b
c) multiple choice question 3 option c
d) multiple choice question 3 option d
4. Multiple choice question 4
a) multiple choice question 4 option a 
b) multiple choice question 4 option b
c) multiple choice question 4 option c
d) multiple choice question 4 option d
5. Multiple choice question 5
a) multiple choice question 5 option a 
b) multiple choice question 5 option b
c) multiple choice question 5 option c
d) multiple choice question 5 option d
"""

GENERATE_SLIDES_PROMPT = """You're a K-12 teacher with the following general lecture notes for an upcoming class:

Lecture notes: ###
{lecture}
###

Based on these lecture notes, create 5-10 powerpoint slides to present to your students that fully explain and define the topics avoiding directions or vague descriptions.

Desired format:

Slide 1
Title: Sample Title
Text:
- Detailed Long Sample Point A
- Detailed Long Sample Point B
- More Points
Image: Sample Image Description

Slide 2
Title: Sample Title 2
Text:
- Detailed Long Sample Point C
- Detailed Long Sample Point D
- More Points
Image: Sample Image Description 2
...
"""
