SECTION_SENTINELS = ['I', 'II', 'III', 'IV', 'V']
SUBSECTION_SENTINELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
SLIDE_SENTINELS = ['Title','Text','Image']
SLIDE_DETAIL_SENTINELS = ['-', '–']
SLIDE_SENTINEL_MAPPING = {'Title':'title', 'Text':'content', 'Image':'image_description'}
QUIZ_QUESTION_SENTINELS = [str(x) for x in range(1, 20)]
QUIZ_OPTION_SENTINELS = ['a', 'b', 'c', 'd', 'e']
MIN_LINE_LENGTH=5

REGEX_QUIZ = r'([\.\(\n]({s})[ \.\)])|^\W(({s})[\.\)])|([\.\(\n ]({s}) ?[\.\)])'
REGEX_BASE = r'([\. \(\n]({s})[ \.\)]|({s})[\.\)\n])'
REGEX_SLIDES_COMPONENTS = r'[\.\(\n ]*{s}[ \.\):]'
REGEX_SLIDES_DETAILS = r'[\.\(\n ]+({s}) ?|^({s})'

REPLACEMENT_REGEXES = [
    ('<|im_end|>', ''),
    (r'(\. ?){2,}', '.'),
    (r'^[\(\) \.:\n]*', ''),
    (r'(\. ?)\?', '?'),
    (r'(\. ?)\!', '!'),
    (r'(\. ?),', ','),
    (r'( , )', ', '),
    # Sometimes it does many tabs instead of a space
    (r'(\t\t\t+)', ' '),
    (r'(      +)', ' ')
]

PROMPT_TEMPLATE = """Create a lesson plan for a {num_minutes} minute class consisting of an introduction, lecture, a guided practice, and an individual practice for the learning objective below:
###
Learning Objective: Identify different types of consumers in a food chain, including animals that eat plants, animals that eat other animals, and animals that eat plants and animals for 7th graders
Lesson Plan:
I. Introduction (5 minutes) 
    A. Introduction to the topic: Explain what a food chain is and why it’s important to understand different types of consumers in a food chain. 
    B. Introduce learning objective: Today, we will be learning about different types of consumers in a food chain, including animals that eat plants, animals that eat other animals, and animals that eat plants and animals for 7th graders. 
II. Lecture Section (25 minutes) 
    A. Discuss primary consumers: Animals that only consume plants, such as rabbits or deer: Begin by introducing the concept of a food chain and explaining how energy flows through it from one organism to another. Explain what primary consumers are and provide examples of organisms that fit into this category, such as rabbits, deer, cows, sheep, goats, horses etc. Describe what type of diet these animals have (herbivorous).
    B. Discuss secondary consumers: Animals that consume both plant-eating animals and other meat-eating predators like snakes or hawks: Provide examples of organisms in this category such as foxes, wolves ,snakes ,hawks etc., and explain their dietary habits (carnivorous). Explain why these animals must depend on the lower level organisms for their survival by discussing the flow of energy within an ecosystem.
    C. Discuss tertiary consumer: Top predators at the top of the food chain such as lions or sharks : Introduce students to tertiary consumers which are large carnivores at the top of a food chain who feed upon herbivores and other carnivores alike. Provide examples such as lions, sharks, orca whales etc., and discuss their role in maintaining balance within an ecosystem by keeping numbers of secondary consumers and primary consumers in check, which helps keep plant populations at healthy levels.
    D. Discuss omnivores: Animals which feed on both plants and other animal species like bears or humans: Introduce students to omnivore species which can be found throughout different ecosystems around the world including bears, humans, pigs etc.. Explain how they can adapt to various environments due to their ability to eat both vegetation and meat products thus allowing them access to more resources than strictly herbivorous/carnivorous species do not have access too.
    E. Review key points from lecture section: Summarize all concepts discussed throughout lecture section by highlighting main ideas related to each type consumer discussed while also pointing out ways in which they interact with one another within an ecosystem.
III. Guided Practice Section (20 minutes)
    A. Break students into groups and have them identify different examples of primary, secondary, tertiary, and omnivore consumers that live in their local area.
    B. Have each group draw out an example of a simple food web showing how energy flows between the primary, secondary, tertiary, and omnivore consumers they identified previously.
IV. Individual Practice Section (10 minutes)
    A. Write the names of 5 animals on the board and have students label each as primary, secondary, tertiary, or omniove consumers. Example animals: caterpillar, shark, pig, crow, and a house cat. Ask them to write examples of the food that each animal eats to justify their classification of the consumer.
###
Learning Objective: Explain the role of an API in the development of applications and the distinction between a programming language's syntax and the API for 11th graders
Lesson Plan:
I. Introduction (5 minutes)
    A. Introduce the lesson topic: Explain the role of an API in the development of applications and the distinction between a programming language's syntax and the API.
    B. Discuss why it is important to understand APIs, their features, and how they are used in application development.
    C. Ask students what they already know about APIs and discuss any ideas or questions that arise.
II. Lecture (30 minutes)
    A. Define what an API is, its purpose, and how it can be used in application development. An API stands for Application Programming Interface and it provides a way to access the functionality of another application or service. It allows developers to use pre-existing code when building their applications which makes the development process much faster and easier.
    B. Describe different types of APIs including web services, libraries/frameworks, database accessors etc. Web Service APIs: These are typically used to allow two applications to communicate with each other over the internet using a protocol such as HTTP or HTTPS. Examples include Google Maps API or Facebook Graph API. Library/Framework APIs: This type of API is provided by programming language frameworks such as ReactJS or AngularJS that provide additional functionality for developers when building their applications. Database Accessor APIs: These types of APIs provide access to data stored in databases such as SQL Server or Oracle Database allowing developers to query and retrieve information from them without writing custom code every time they need something new from the database.
    C. Provide examples of popular APIs such as Google Maps or Facebook Graph API. Examples of popular web service based APIs include Google Maps API, which allows you to embed maps into your website with just a few lines of code; Facebook GraphAPI which gives you access to all sorts of user data on Facebook; Twitter's RESTful Services that let you programmatically interact with tweets posted on twitter; Amazon AWS SDKs that give you direct access to cloud computing services like S3 storage buckets; Stripe Connect Platform for accepting payments online.
    D Explain the difference between a programming language’s syntax and an API’s syntax. A programming language's syntax refers specifically to how instructions are written within the framework provided by that particular language while an APi's syntax describes how requests should be structured when interacting with external systems via an interface like HTTP(S). For example if we were making a request using Ruby we would structure our request differently than if we were making one using Java since both languages have different syntactical structures even though they may be ableto make requests similarly at some level underneathe surface.
    E. Demonstrate how to use an example code snippet with both languages' syntaxes side by side for comparison purposes. 
III. Guided Practice Section (15 minutes)
    A. Have students work together in pairs to write sample code for interacting with a publically available weather API to be able to forecast the week's temperature.
    B. Guide them through each step while providing assistance if needed.
    C. Allow time for discussion among peers.
IV. Individual Practice (10 minutes)
    A. Provide students with the documentation for two search APIs for google: a standard search and image search API. Include parameters that each API expects and parameters that are optional. Then, ask students to write the code in a programming language of their choice that would allow them to first search a question on google and then take the answer to that question and search for an image on google. The end result should be a program that takes a quesiton, and returns an answer with a corresponding image.
###
Learning Objective: Give students an introduction to key principles of macro economics, including things like the law of demand and law of supply, market forces, market competition, etc
Lesson Plan: 
I. Introduction (5 minutes)
    A. Introduce the lesson topic: Explain the key principles of macro economics and the importance of understanding the basic concepts of macro economics.
    B. Ask students what they already know about macro economics and discuss any ideas or questions that arise.
II. Lecture (30 minutes)
    A. Define what macro economics is and its purpose. Macro economics is the study of the economy as a whole, focusing on overall economic trends and the behavior of large groups of people, businesses, and organizations.
    B. Explain the law of demand and law of supply: The law of demand states that the higher the price of a good or service, the less people are willing to purchase it. The law of supply states that the higher the price of a good or service, the more people are willing to produce it. For example, fidget spinners at some point were in such high demand, and there was such low supply, that people paid over $20 for them. Now, there's huge supply and low demand, so they're hardly worth anything.
    C. Discuss market forces and market competition: Market forces refer to the various factors that influence the behavior of buyers and sellers in the market, such as supply and demand, competition, and technology. Market competition is the process by which businesses compete with each other for customers and resources in order to maximize profits.
    D. Explain the role of government in macro economics: Governments intervene in the economy in order to promote economic growth and stability. This is done through fiscal policy, which is the use of government spending and taxation to influence economic activity, and monetary policy, which is the use of interest rates and money supply to influence economic activity.
    E. Review key points from lecture section: Summarize all concepts discussed throughout lecture section by highlighting main ideas related to each macro economic concept while also pointing out ways in which they interact with one another within an economy.
III. Guided Practice Section (15 minutes)
    A. Break students into groups and have them use an example scenario to explain how the law of demand and law of supply interact with one another.
    B. Have each group draw a graph that illustrates the scenario they chose and explain the market forces and market competition that are influencing the outcome.
IV. Individual Practice Section (10 minutes)
    A. Give students a pop quiz!
###
Learning Objective: {learning_objective}
Lesson Plan:
"""

EXPAND_MODULE_PROMPT = """Given the lesson plan below, provide more detail and specific content regarding section {title}
###
{lesson_plan}
###
 """

REGENERATE_MODULE_PROMPT = """Given the lesson plan below, please create a substantially more detailed version of section {title}, including examples and additional content where possible.
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

GENERATE_SLIDES_PROMPT = """You're teacher with the following general lecture notes for an upcoming class:

Lecture notes:
###
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

SLIDES_TO_SCRIPT_PROMPT = """You're a teacher teaching a class with this learning objective: {learning_objective}. You will use the slides below for your lesson. Create a full script that you'll use along with the slides. The script should include more detail than the slides. Talk in a natural voice, as if you're having a conversation with your students and your slides are just visual aides.

{slides}

Desired Format:
Slide 1: "This is what I'll say when reviewing slide 1"
Slide 2: "This is what I'll say when reviewing slide 2"
Slide 3: "This is what I"ll say when reviewing slide 3", etc, etc"""