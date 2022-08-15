from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/",
          StaticFiles(
              directory="evolution/",
              html=True),
          name="evolution")
