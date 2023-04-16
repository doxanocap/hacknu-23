from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# SSL = os.environ["SSL"]
DATABASE_URL = "mysql+mysqldb://qywffzyayekkkv1n5ylo:pscale_pw_9EdGQhYgnB19K1XtTfYqWizI4ufZ4I1BJZQxEDhwtva@aws.connect.psdb.cloud/hacknu?ssl=C:\Windows\System32\cacert.pem"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)
