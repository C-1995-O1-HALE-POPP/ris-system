from flask.cli import FlaskGroup
from app import create_app
from app.extensions import db

app = create_app()
cli = FlaskGroup(create_app=create_app)

if __name__ == "__main__":
    cli()
