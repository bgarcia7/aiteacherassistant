import os
import boto3
import soundfile
from espnet2.bin.tts_inference import Text2Speech

class Boto3Client:
    def __init__(self):
        self.boto3_client = boto3.session.Session(
            aws_access_key_id=os.environ["AWS_ACCESS_KEY"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
            region_name="us-east-1",
        )

    def download_from_s3(self, bucket_name, download_path):
        s3_client = self.boto3_client.resource("s3").Bucket(bucket_name)

        for s3_object in s3_client.objects.all():
            filename = os.path.split(s3_object.key)
            s3_client.download_file(s3_object.key, f"{download_path}/{filename}")

    def upload_to_s3(self, bucket_name, file_body, key):
        s3_client = self.boto3_client.resource("s3").Bucket(bucket_name)
        s3_client.put_object(Body=file_body, Key=key)

def text_to_speech(**inputs):

    local_path = '/workspace/'
    client = Boto3Client()
  
    text2speech = Text2Speech.from_pretrained("espnet/kan-bayashi_ljspeech_vits")
    speech = text2speech(inputs['text'])["wav"]

    write_path = local_path + inputs['file_name']
    print('writing to: ', write_path)
    soundfile.write(write_path, speech.numpy(), text2speech.fs, "PCM_16")
    

    print('wrote soundfile')

    return {"file_url": inputs['file_name']}
