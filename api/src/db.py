from sqlalchemy import create_engine, MetaData
from sqlalchemy import Column, String, Integer, Sequence, ForeignKey
from sqlalchemy.ext.declarative import declarative_base  
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID

import time
import os
import uuid

# ========[ PRODUCTION ]=========
# db_url = os.environ.get('DATABASE_URL')

# ========[ LOCAL ]=========
import json
db_url = json.load(open('zappa_settings.json'))['production']['environment_variables']['DATABASE_URL']
engine = create_engine(db_url)
base = declarative_base()
Session = sessionmaker(engine)  

## MODELS
class LessonPlan(base):  
    __tablename__ = 'lesson_plans'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String)
    description = Column(String)
    modules = relationship("Module", back_populates="lesson_plan")
    # modules = relationship("Module", back_populates="lesson_plan")

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Module(base):  
    __tablename__ = 'modules'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_type = Column(String)
    title = Column(String)
    body = Column(String)
    lesson_plan_id = Column(UUID, ForeignKey("lesson_plans.id"))
    lesson_plan = relationship("LessonPlan", back_populates="modules")

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

## DB FUNCTIONS
def insert_lesson_plan(title, description, modules = []):
    # Create 
    with Session() as session:
        print("INSERT LESSON PLAN")
        lesson_plan = LessonPlan(title=title, description=description)  
        session.add(lesson_plan)
        session.commit()
        session.refresh(lesson_plan)
        print("Base lesson", lesson_plan.as_dict())

        for module in modules:
            new_module = Module(module_type=module['module_type'], title=module['title'], body=module['body'], lesson_plan_id=lesson_plan.id)
            print("New module", new_module.as_dict())
            session.add(new_module)
            session.commit()

        session.refresh(lesson_plan)
        return lesson_plan.as_dict()

def get_lesson_plan(lesson_plan_id):
    with Session() as session:
        lesson_plan = session.query(LessonPlan).filter_by(id=lesson_plan_id).first()
        return lesson_plan.as_dict()

def insert_modules(modules):
    with Session() as session:
        modules=[Module(module_type=module['module_type'], title=module['title'], body=module['body']) for module in modules]
        session.add(modules)
        session.commit()

def update_module(module_id, new_module):
    with Session() as session:
        module = session.query(Module).filter_by(id=module_id).first()
        module.module_type = new_module['module_type']
        module.title = new_module['title']
        module.body = new_module['body']
        session.commit()
        return module.as_dict()

def delete_module(module_id):
    with Session() as session:
        module = session.query(Module).filter_by(id=module_id).first()
        session.delete(module)
        session.commit()
        return module.as_dict()

if __name__ == "__main__":
    print("Adding tables")
    base.metadata.create_all(engine)