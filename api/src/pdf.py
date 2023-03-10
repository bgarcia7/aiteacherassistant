import boto3
from fpdf import FPDF
import json
LOCAL_DIR = '/tmp/'

AWS_ACCESS_KEY_ID = json.load(open('zappa_settings.json'))[
    'production']['environment_variables']['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = json.load(open('zappa_settings.json'))[
    'production']['environment_variables']['AWS_SECRET_ACCESS_KEY']


def encode_text(text):
    return text.encode('latin-1', 'replace').decode('latin-1')


def upload_pdf_to_s3(pdf_file_name):
    # local directoy prepends string to pdf_file_name depending on env

    s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
    BUCKET = "aiteacherassistant"
    s3.Bucket(BUCKET).upload_file(LOCAL_DIR + pdf_file_name, pdf_file_name)
    pdf_url = 'https://aiteacherassistant.s3.us-west-2.amazonaws.com/' + pdf_file_name
    return pdf_url


def create_pdf(lesson_plan_title, quiz):
    lesson_plan_title = encode_text(lesson_plan_title)
    quiz = encode_text(quiz)

    pdf = FPDF()
    pdf.add_page()

    # Add Title
    pdf.set_font("Arial", size=24)
    pdf.cell(200, 20, txt="Quiz: " + lesson_plan_title,
             ln=1, align='C')

    # Add Quiz
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 7, txt=quiz, align='l')

    # save the pdf with name .pdf
    pdf_file_name = lesson_plan_title.replace(' ', '_') + '.pdf'
    pdf.output(LOCAL_DIR + pdf_file_name)
    return pdf_file_name
