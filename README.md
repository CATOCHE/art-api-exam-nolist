# ART API

## Getting Started

### Create a database

* Art API will work with a CouchDB database such as the one provided by roo or by IBM Cloudant.
  In order to create a roo database it is first necessary to obtain an account at the JRS School. A database is created by entering the command:

```
$ roo db add <database-name>
```

### Clone your repo

Find or create an folder to install the application. The application with be cloned to a sub-folder called "/art-api-exam-nolist" by running the following command:

$ git clone https://github.com/CATOCHE/art-api-exam-nolist.git

### Install dependencies

Use npm install command to install all dependencies required by the api:

$ npm install

This will install all dependencies defined in the project's package.json file.

### Establish environment variables such as key and secrets to create a database url

Open the project in atom and create a ".env" file. This file will be used to define the local environment parameters such as the port id and the database url, including the database key and password provided by the database management software. These parameters must be defined in the following format:

PORT=port-number // e.g. PORT=4000

COUCHDB_URL=https://'database-key':'database-secret'@'database-service'/'database-name'

Make sure to also create a file named .gitignore that should include a list of files that will not be uploaded to Github. It is very important to include the .env in this file in order to keep the database access information private.
It is also important to include 'node_modules' in this file, since these modules are accessible from NDM and are not required to be stored with the project in Github.

### Load your data.

Sample data is provided in a file called load-data.js that contains 8 documents that will be loaded to the database by calling the script:

$ npm run load

### Start the API

The API can be launched by running the command:

$ npm start

### Make your first `GET` call within the browser.

To verify the APU is running use any web browser and enter the in the URL line:

localhost:<port>

e.g.

localhost:4000

The API should respond with a message such as:

"Welcome to the Art API. Manage all the paintings for much win."

## Basics

### Base URL - All endpoints within the paintings are located at the following base URL:

    https://carlosa.roo.land/carlos-art

    Within this address, you'll find APIs (collections of related endpoints) covering the functional areas within the ART API. For example, we currently surface the following APIs:

    /paintings        A database of famous paintings
    /artists          A database of famous artists

### Scheme -

    This database supports a KEY and SECRET number combination that is to be included in the URL when addressing the database using the following format:

    https://(USER-KEY):(USER-SCRET)carlosa.roo.land/carlos-art

### HTTP Verbs -

    This application supports the following verbs:
    - POST:  Used to create a new document in either /paitings or /artists endpoints.
             The body of the POST command must include all the fields defined below in the schema.  
    - GET :  The GET /endpoint/id is used to retrieve a single document specified by the id.
             The id is defined as the document type followed by its slugified name. E.g.:

             id: astist_claude-monet
    - PUT    This command is used to modify the contents of a document. It requires that all document field are available as defiened in the schema below.
    - DELETE: Is used to delete a single document in the database based on its id.

### Schemas

      2 different schemas are used in this API, one for each type of documents:

      **Paintings Schema**
      {}
        "id":           "painting_name-of-work"
        "rev":          "revision number"
        "name"          "Painting's Name"
        "movement":     "Movement the painting belongs to"
        "artist":       "Artist's Name"
        "yearCreated":  YYYY
        "museum":       { "name": "Museum's Name", "location": "City"}
        "type":
      }

      **Artists Schema**
      {
        "id":         "type_artist-name",
        "rev":        "revision number",
        "name":       "artist's name",
        "type",       "artist",
        "dateBorn":   "YYYY-MM-DD",
        "placeBorn":  "City, Country",
        "dateDied":   "YYYY-MM-DD",
        "placeDied":  "City, Country",
        "movements":  "list of movements and styles"
      }

### Content Types

    Only 2 types of documents are handled by this API:
    /paintings and
    /artists.

### Response Status Codes -

Successful operations are commonly reported with status code 200 "OK" with exception of the POST command that returns code 201 "Created".

Status code 404 "Not Found" is reported when the command requires an id (such as a GET or DELETE command) and the id does not match any document id in the database.

Status code 409 "Conflict" is reported when creating or updating documents when the document body does not match the required schema.

Status code 400 "Bad Request" if request failed due to an error on your part, such as a syntax error or malformed content in the request body.
