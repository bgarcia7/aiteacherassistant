from sqlalchemy import create_engine
from sqlalchemy import Column, String, Integer, Sequence
from sqlalchemy.ext.declarative import declarative_base  
from sqlalchemy.orm import sessionmaker
import os
import uuid

# ========[ PRODUCTION ]=========
# db_url = os.environ.get('DATABASE_URL')

# ========[ LOCAL ]=========
import json
db_url = json.load(open('zappa_settings.json'))['production']['environment_variables']['DATABASE_URL']

db = create_engine(db_url)
base = declarative_base()

class LessonPlan(base):  
    __tablename__ = 'lesson_plan'

    id = Column(String, primary_key=True, default=str(uuid.uuid1()))
    title = Column(String)
    description = Column(String)

Session = sessionmaker(db)  
session = Session()

base.metadata.create_all(db)

# Create 
test_lesson = LessonPlan(title="Intro to Algebra", description="students will learn ")  
session.add(test_lesson)  
session.commit()

# Read
lessons = session.query(LessonPlan)  
for l in lessons:  
    print(l.title)

# Update
test_lesson.title = "Intro to Geometry"  
session.commit()

# Delete
session.delete(test_lesson)  
session.commit()  
print(db)


# Drop table
LessonPlan.__table__.drop(db)
session.commit() 
