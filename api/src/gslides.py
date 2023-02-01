from __future__ import print_function

import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import uuid

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/drive',
          "https://www.googleapis.com/auth/presentations"]

TAAI_FOLDER_ID = "1iIPkhrTMgc6spXSTdIba0xBOGmyN41yU"
PRESENTATION_TEMPLATE_ID = "1sWOCz6ETH__y1h9yirCzPUG9QG3s9RM-7HvRZNxJ_3U"


def main():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        drive = build('drive', 'v3', credentials=creds)
        slides = build('slides', 'v1', credentials=creds)

        # listDrive(drive)

        # presentation = createPresentation(slides)
        # moveFile(drive, presentation.get('presentationId'), TAAI_FOLDER_ID)

        presentation_copy_id = copyPresentation(
            drive, PRESENTATION_TEMPLATE_ID, "DUM")
        moveFile(drive, presentation_copy_id, TAAI_FOLDER_ID)
        makeFilePublic(drive, presentation_copy_id)
        createSlide(slides, presentation_copy_id,
                    "QUOTES", "EVERYDAY", "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png")

    except HttpError as error:
        # TODO(developer) - Handle errors from drive API.
        print(f'An error occurred: {error}')


def createPresentation(slides):
    body = {
        'title': "YOU ALREADY KNOW"
    }
    presentation = slides.presentations().create(body=body).execute()
    print(f"Created presentation with ID:"
          f"{(presentation.get('presentationId'))}")
    return presentation


def listDrive(drive):
    # Call the Drive v3 API
    results = drive.files().list(
        pageSize=10, fields="nextPageToken, files(id, name)").execute()
    items = results.get('files', [])

    if not items:
        print('No files found.')
        return
    print('Files:')
    for item in items:
        print(u'{0} ({1})'.format(item['name'], item['id']))


def moveFile(drive, file_id, folder_id):
    """Move specified file to the specified folder.
    Args:
        file_id: Id of the file to move.
        folder_id: Id of the folder
    Print: An object containing the new parent folder and other meta data
    Returns : Parent Ids for the file

    Load pre-authorized user credentials from the environment.
    TODO(developer) - See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.
    """
    try:
        # pylint: disable=maybe-no-member
        # Retrieve the existing parents to remove
        file = drive.files().get(fileId=file_id, fields='parents').execute()
        previous_parents = ",".join(file.get('parents'))
        # Move the file to the new folder
        file = drive.files().update(fileId=file_id, addParents=folder_id,
                                    removeParents=previous_parents,
                                    fields='id, parents').execute()
        return file.get('parents')

    except HttpError as error:
        print(F'An error occurred: {error}')
        return None


def copyPresentation(drive, presentation_id, copy_title):
    """
           Creates the copy Presentation the user has access to.
           Load pre-authorized user credentials from the environment.
           TODO(developer) - See https://developers.google.com/identity
           for guides on implementing OAuth2 for the application.
           """

    try:
        body = {
            'name': copy_title
        }
        drive_response = drive.files().copy(
            fileId=presentation_id, body=body).execute()
        presentation_copy_id = drive_response.get('id')
        print(
            f"Successfully copied presentation with new id: {presentation_copy_id}")

    except HttpError as error:
        print(f"An error occurred: {error}")
        print("Presentations  not copied")
        return error

    return presentation_copy_id


def createSlide(slides, presentation_id, title, text, image_url):
    """
    Creates the Presentation the user has access to.
    Load pre-authorized user credentials from the environment.
    TODO(developer) - See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.\n
    """
    try:
        pageId = uuid.uuid4().hex
        titleId = uuid.uuid4().hex
        bodyId1 = uuid.uuid4().hex
        bodyId2 = uuid.uuid4().hex
        imageId = uuid.uuid4().hex

        emu4M = {
            'magnitude': 4000000,
            'unit': 'EMU'
        }

        body1Insert = {
            "insertText": {
                "objectId": bodyId1,
                "text": text,
            },
        }

        body2Insert = {
            'createImage': {
                'objectId': imageId,
                'url': image_url,
                'elementProperties': {
                    'pageObjectId': pageId,
                    'size': {
                        'height': emu4M,
                        'width': emu4M
                    },
                    'transform': {
                        'scaleX': 1,
                        'scaleY': 1,
                        'translateX': 100000,
                        'translateY': 100000,
                        'unit': 'EMU'
                    }
                }
            }
        }

        requests = [
            {
                "createSlide": {
                    "objectId": pageId,
                    "slideLayoutReference": {
                        "predefinedLayout": "TITLE_AND_TWO_COLUMNS"
                    },
                    "placeholderIdMappings": [
                        {
                            "layoutPlaceholder": {
                                "type": "TITLE",
                                "index": 0
                            },
                            "objectId": titleId,
                        },
                        {
                            "layoutPlaceholder": {
                                "type": "BODY",
                                "index": 0
                            },
                            "objectId": bodyId1,
                        },
                        {
                            "layoutPlaceholder": {
                                "type": "BODY",
                                "index": 1
                            },
                            "objectId": bodyId2,
                        },
                    ],
                },
            },
            {
                "insertText": {
                    "objectId": titleId,
                    "text": title,
                },
            },
            body1Insert,
            body2Insert

        ]

        # If you wish to populate the slide with elements,
        # add element create requests here, using the page_id.

        # Execute the request.
        body = {
            'requests': requests
        }
        response = slides.presentations().batchUpdate(
            presentationId=presentation_id, body=body).execute()
        create_slide_response = response.get('replies')[0].get('createSlide')
        print(f"Created slide with ID:"
              f"{(create_slide_response.get('objectId'))}")
        return response

    except HttpError as error:
        print(f"An error occurred: {error}")
        print("Slides not created")
        return error


def makeFilePublic(drive, file_id):
    """Batch permission modification.
    Args:
        real_file_id: file Id
        real_user: User ID
        real_domain: Domain of the user ID
    Prints modified permissions

    Load pre-authorized user credentials from the environment.
    TODO(developer) - See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.
    """

    try:
        ids = []

        def callback(request_id, response, exception):
            if exception:
                # Handle error
                print(exception)
            else:
                # print(f'Request_Id: {request_id}')
                # print(F'Permission Id: {response.get("id")}')
                ids.append(response.get('id'))

        # pylint: disable=maybe-no-member
        batch = drive.new_batch_http_request(callback=callback)
        public_permission = {
            'type': 'anyone',
            'role': 'writer'
        }
        batch.add(drive.permissions().create(fileId=file_id,
                                             body=public_permission,
                                             fields='id',))
        # This batch is probably unneccessary, but it was in sample code
        batch.execute()
        print(f"File {file_id} is now public")

    except HttpError as error:
        print(F'An error occurred: {error}')
        ids = None

    return ids


if __name__ == '__main__':
    main()
