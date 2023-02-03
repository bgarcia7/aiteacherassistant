import os
import beam

app = beam.App(
    name="text-to-speech",
    cpu=8,
    memory="32Gi",
    gpu=1,
    python_version="python3.8",
    python_packages=["soundfile", "espnet_model_zoo", "torch", "boto3"],
)

app.Trigger.Webhook(
    inputs={"text": beam.Types.String(), "file_name": beam.Types.String()},
    outputs={"file_url": beam.Types.String()},
    handler="run.py:text_to_speech",
)

app.Output.File(path="audio.wav", name="audio")
