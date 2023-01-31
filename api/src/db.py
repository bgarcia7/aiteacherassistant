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
Session = sessionmaker(db)  
session = Session()

class LessonPlan(base):  
    __tablename__ = 'lesson_plan'

    id = Column(String, primary_key=True, default=str(uuid.uuid1()))
    title = Column(String)
    description = Column(String)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Module(base):  
    __tablename__ = 'module'

    id = Column(String, primary_key=True, default=str(uuid.uuid1()))
    module_type = Column(String)
    title = Column(String)
    body = Column(String)
    # lesson_plan_id = Column()

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

def insert_lesson_plan(title, description):
    # Create 
    lesson_plan = LessonPlan(title=title, description=description)  
    session.add(lesson_plan)  
    session.commit()
    return lesson_plan.as_dict()

def get_lesson_plan(lesson_plan_id):
    lesson_plan = session.query(LessonPlan).filter_by(id=lesson_plan_id).first()
    return lesson_plan.as_dict()

def insert_modules(modules):
    modules=[Module(module_type=module['module_type'], title=module['title'], body=module['body']) for module in modules]
    session.add(modules)
    session.commit()

def update_module(module_id, new_module):
    module = session.query(Module).filter_by(id=module_id).first()
    module.module_type = new_module['module_type']
    module.title = new_module['title']
    module.body = new_module['body']
    session.commit()
    return module.as_dict()

def delete_module(module_id):
    module = session.query(Module).filter_by(id=module_id).first()
    session.delete(module)
    session.commit()
    return module.as_dict()




base.metadata.create_all(db)