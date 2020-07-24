# triib-export-tool
Procedure to export members and their data from Triib Management Software

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
GET https://[your_sub_domain].triib.com/accounts/login/

From the response tab, search in the HTML for the "csrfmiddlewaretoken" value

## Forth step
From postman, in the created collection from second step, create and execute a new request as follow:
POST https://[your_sub_domain].triib.com/accounts/login/
In the Body (form-data) parameters:
username [your_username]
password [your_password]
csrfmiddlewaretoken [the_token]

## Fifth step
From postman, in the created collection from second step, configure a new request as follow:
GET https://[your_sub_domain].triib.com/admin/members/{{id}}
Make sure to keep the last part wich is considered a "variable" for postman

## Sixth step
Open the "Runner" section of Postman, select the collection you created from the second step and check your request from fifth step.
Choose your member.csv file in the "Data" option
Click on the "Run" button

# Extracting the data
From this point, every profile html page as been dowloaded to your computer, it's now time to do some "page scrapping"
