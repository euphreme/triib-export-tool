# triib-export-tool
Procedure to export members and their data from Triib Management Software

# Dowloading the profiles
## First step
From the members list, export all the content into a csv file and extract the id column into another csv file named "members.csv", make sure to keep the header as "id"

## Second step
Download and Install [Postman](https://www.postman.com/)
Configure the "[Save requests extension](https://blog.postman.com/write-to-your-local-file-system-using-a-postman-collection/)"
Make sure to configure the "Test" script as follow:
```javascript
var id = pm.variables.get("id");

// The data to be written to file
let dataToFile = {
    requestName: `${id}-${request.name}` || request.url,
    fileExtension: 'html',
    responseData: pm.response.text()
};

pm.sendRequest({
    url: 'http://localhost:3000/write',
    method: 'POST',
    header: 'Content-Type:application/json',
    body: {
        mode: 'raw',
        raw: JSON.stringify(dataToFile)
    }
}, function(err, res) {
    console.log(res);
});
```

## Third step
From postman, in the created collection from second step, create and execute a new request as follow:

```GET https://[your_sub_domain].triib.com/accounts/login/```

From the response tab, search in the HTML for the "csrfmiddlewaretoken" value

## Forth step
From postman, in the created collection from second step, create and execute a new request as follow:

```POST https://[your_sub_domain].triib.com/accounts/login/```

In the Body (form-data) parameters:
* username [your_username]
* password [your_password]
* csrfmiddlewaretoken [the_token]

## Fifth step
From postman, in the created collection from second step, configure a new request named 'Profile' as follow:

```GET https://[your_sub_domain].triib.com/admin/members/{{id}}```

Make sure to keep the last part wich is considered a "variable" for postman

## Sixth step
Open the "Runner" section of Postman, select the collection you created from the second step and check your 'Profile' request from fifth step.
Choose your member.csv file in the "Data" option
Click on the "Run" button

# Extracting the data
From this point, every profile html page as been dowloaded to your computer, it's now time to do some "page scrapping"

1. Place the downloaded profiles this project in a directory named 'profiles'
1. Install [nodejs](https://nodejs.org/en/) on your computer
1. Run npm install in the project root directory
1. Run node index.js in the project root directory

The script will extract the user's information and will create JSON files for each profile present in the member.csv file and save them in an "out" directory in the root of the project.

The user's data includes:
* name
* email
* gymnastic scores
* metcons scores
* weightlifing scores
* workout history

# Specific workouts data
The same procedure can be created to download all the workouts from Triib by resolving the data from the URL and using the security token. 
