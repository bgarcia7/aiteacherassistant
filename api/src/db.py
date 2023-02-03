from sqlalchemy import create_engine, MetaData, desc
from sqlalchemy import Column, String, Integer, Sequence, ForeignKey, JSON, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import desc
from datetime import datetime, timezone

import time
import os
import uuid

# ========[ PRODUCTION ]=========
# db_url = os.environ.get('DATABASE_URL')

# ========[ LOCAL ]=========
import json
db_url = json.load(open('zappa_settings.json'))[
    'production']['environment_variables']['DATABASE_URL']
engine = create_engine(db_url)
base = declarative_base()
Session = sessionmaker(engine)

# ===============[ MODELS ]=================


def now():
    return datetime.now(timezone.utc)


class LessonPlan(base):
    __tablename__ = 'lesson_plans'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String)
    description = Column(String)
    modules = relationship("Module", back_populates="lesson_plan")
    quizzes = relationship("Quiz", back_populates="lesson_plan")
    slide_decks = relationship("SlideDeck", back_populates="lesson_plan")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Module(base):
    __tablename__ = 'modules'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_type = Column(String, nullable=True)
    title = Column(String)
    body = Column(String)
    duration = Column(Integer)
    lesson_plan_id = Column(UUID, ForeignKey("lesson_plans.id"))
    lesson_plan = relationship("LessonPlan", back_populates="modules")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Quiz(base):
    __tablename__ = 'quizzes'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pdf_url = Column(String)
    content = Column(JSON)
    lesson_plan_id = Column(UUID, ForeignKey("lesson_plans.id"))
    lesson_plan = relationship("LessonPlan", back_populates="quizzes")
    inserted_at = Column(Time, default=now)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class SlideDeck(base):
    __tablename__ = 'slide_decks'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    drive_url = Column(String)
    audio_task_id=Column(String)
    audio_script=Column(JSON)
    lesson_plan_id = Column(UUID, ForeignKey("lesson_plans.id"))
    lesson_plan = relationship("LessonPlan", back_populates="slide_decks")
    slides = relationship("Slide", back_populates="slide_deck")
    inserted_at = Column(Time, default=now)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Slide(base):
    __tablename__ = 'slides'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String)
    content = Column(JSON)
    image_description = Column(String)
    slide_deck_id = Column(UUID, ForeignKey("slide_decks.id"))
    slide_deck = relationship("SlideDeck", back_populates="slides")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Prompt(base):
    __tablename__ = 'prompts'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prompt = Column(String)
    response = Column(String)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

base.metadata.create_all(engine)

# ===============[ LESSON PLAN FUNCTIONS ]=================


def insert_lesson_plan(title, description, modules=[]):
    # Create
    with Session() as session:
        print("INSERT LESSON PLAN")
        lesson_plan = LessonPlan(title=title, description=description)
        session.add(lesson_plan)
        session.commit()
        session.refresh(lesson_plan)
        print("Base lesson", lesson_plan.as_dict())

        for module in modules:
            new_module = Module(module_type=module.get('module_type'), title=module.get(
                'title'), body=module.get('body'), duration=module.get('duration'), lesson_plan_id=lesson_plan.id)
            print("New module", new_module.as_dict())
            session.add(new_module)
            session.commit()

        session.refresh(lesson_plan)
        return lesson_plan.as_dict()


def get_lesson_plan(lesson_plan_id):
    with Session() as session:
        lesson_plan = session.query(LessonPlan).filter_by(
            id=lesson_plan_id).first()

        expanded_lesson_plan = lesson_plan.as_dict()
        # Add modules
        modules = session.query(Module).filter_by(
            lesson_plan_id=lesson_plan_id).all()
        # print("Modules", lesson_plan.modules)
        expanded_lesson_plan['modules'] = [module.as_dict()
                                           for module in modules]

        # Add quizzes
        quiz = session.query(Quiz).filter_by(
            lesson_plan_id=lesson_plan_id).order_by(desc(Quiz.inserted_at)).first()

        if quiz:
            expanded_lesson_plan["quiz"] = quiz.as_dict()

        # Add slide_deck
        slide_deck = get_slide_deck_by_lesson_plan(lesson_plan_id)
        if slide_deck:
            expanded_lesson_plan["slide_deck"] = slide_deck

        # print("Exapnded", expanded_lesson_plan)
        return expanded_lesson_plan


def update_lesson_plan(lesson_plan_id, new_lesson_plan):
    with Session() as session:
        lesson_plan = session.query(LessonPlan).filter_by(
            id=lesson_plan_id).first()

        update_fields = ['title', 'description']
        for field in update_fields:
            if new_lesson_plan.get(field):
                setattr(lesson_plan, field, new_lesson_plan[field])

        session.commit()
        return lesson_plan.as_dict()

# ===============[ MODULE FUNCTIONS ]=================


def get_module(module_id):
    with Session() as session:
        module = session.query(Module).filter_by(id=module_id).first()
        return module.as_dict()


def insert_modules(modules):
    with Session() as session:
        modules = [Module(module_type=module.get('module_type'), title=module.get(
            'title'), body=module.get('body')) for module in modules]
        session.add(modules)
        session.commit()


def update_module(module_id, new_module):
    with Session() as session:
        module = session.query(Module).filter_by(id=module_id).first()

        update_fields = ['module_type', 'title', 'body', 'duration']
        for field in update_fields:
            if new_module.get(field):
                setattr(module, field, new_module[field])

        session.commit()
        return module.as_dict()


def delete_module(module_id):
    with Session() as session:
        module = session.query(Module).filter_by(id=module_id).first()
        session.delete(module)
        session.commit()
        return

# ===============[ QUIZ FUNCTIONS ]=================


def get_quiz(quiz_id):
    with Session() as session:
        quiz = session.query(Quiz).filter_by(id=quiz_id).first()
        return quiz.as_dict()


def insert_quiz(lesson_plan_id, pdf_url, content):
    with Session() as session:
        quiz = Quiz(pdf_url=pdf_url, content=content,
                    lesson_plan_id=lesson_plan_id)
        session.add(quiz)
        session.commit()
        return quiz.as_dict()

# ===============[ SLIDE FUNCTIONS ]=================


def get_slide_deck(slide_deck_id):
    with Session() as session:
        slide_deck = session.query(SlideDeck).filter_by(
            id=slide_deck_id).first()
        return expand_slide_deck(slide_deck)


def get_slide_deck_by_lesson_plan(lesson_plan_id):
    with Session() as session:
        slide_deck = session.query(SlideDeck).filter_by(
            lesson_plan_id=lesson_plan_id).order_by(desc(SlideDeck.inserted_at)).first()
        if slide_deck:
            return expand_slide_deck(slide_deck)
        else:
            return None


def expand_slide_deck(slide_deck):
    with Session() as session:
        slides = session.query(Slide).filter_by(
            slide_deck_id=slide_deck.id).all()
        expanded_slide_deck = slide_deck.as_dict()
        expanded_slide_deck['slides'] = [slide.as_dict()
                                         for slide in slides]
        return expanded_slide_deck


def insert_slide_deck(lesson_plan_id, slides, drive_url=None):
    with Session() as session:
        slide_deck = SlideDeck(
            lesson_plan_id=lesson_plan_id, drive_url=drive_url)
        session.add(slide_deck)
        session.commit()
        session.refresh(slide_deck)
        print("New Slide Deck:", slide_deck.as_dict())

        for slide in slides:
            new_slide = Slide(title=slide.get('title'), content=slide.get(
                'content'), image_description=slide.get('image_description'), slide_deck_id=slide_deck.id)
            print("New slide", new_slide.as_dict())
            session.add(new_slide)
            session.commit()

        session.refresh(slide_deck)
        return slide_deck.as_dict()

def insert_audio_data(slide_deck_id, audio_task_id, audio_script):
    with Session() as session:
        slide_deck = session.query(SlideDeck).filter_by(
            id=slide_deck_id).first()
        setattr(slide_deck, 'audio_task_id', audio_task_id)
        setattr(slide_deck, 'audio_script', audio_script)
        session.commit()

def insert_prompt(prompt, response):
    with Session() as session:
        prompt = Prompt(prompt=prompt, response=response)
        session.add(prompt)
        session.commit()
        return prompt.as_dict()


if __name__ == "__main__":
    print("Adding tables")
    base.metadata.create_all(engine)
