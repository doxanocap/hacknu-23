from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# SSL = os.environ["SSL"]
DATABASE_URL = "mysql+mysqldb://56yf23sjq0qvzvzllg8m:pscale_pw_HcT1HR8b8IP6KB7K8mJUfbwdcO91iBHRFswxaBePfXU@aws.connect.psdb.cloud/hacknu?ssl=C:\Windows\System32\cacert.pem"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)
