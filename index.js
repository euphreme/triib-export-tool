const csv = require('csv-parser');
const fs = require('fs');
const cheerio = require('cheerio');

const extractEmail = (member) => {
    const pageContent = fs.readFileSync(`./profiles/${member}-Profile.html`);
    const html = pageContent.toString('UTF-8');
    const $ = cheerio.load(html);

    const profileTables = $("#tabProfile table");
    const profileTableColumn = $(profileTables[0]).find("td:nth-child(1)");
    const data = $(profileTableColumn).find('p:nth-child(2)');
    return data.text().replace('Send Email', '').replace('Email:', '').trim().toLowerCase();
}

const extractData = ($, datatable) => {
    const rows = $(datatable).find('tbody > tr');
    const workouts = [];
    rows.each((inx, el) => {
        const data = $(el).find('td');
        const score = $(data[1]).text();

        const w = {
            name: $(data[0]).text()
        }

        if (score === 'No Score') {
            w.result = 'No Score';
        } else {
            w.result = score.split('recorded')[0].trim().replace('#', '').replace(',', '');
            w.date = score.split('recorded')[1].trim();
        }

        workouts.push(w);
    });
    return workouts;
}

const extractWorkoutHistory = ($, datatable) => {
    const rows = $(datatable).find('tbody > tr');
    const workouts = [];
    rows.each((inx, el) => {
        const data = $(el).find('td');
        const workoutLink = $(data[0]).find('a');
        workouts.push({
            id: workoutLink.attr("href").split('workout=')[1],
            name: workoutLink.text(),
            notes: $(data[1]).text(),
            date: $(data[2]).text(),
            result: $(data[4]).text(),
            level: $(data[5]).text(),
        });
    });
    return workouts;
}

const parseMemberFile = (member) => {
    console.log(`Parsing ${member}-Workout History.html`)
    const pageContent = fs.readFileSync(`./workouts/${member}-Workout History.html`);
    const html = pageContent.toString('UTF-8');
    const $ = cheerio.load(html);

    const datatables = $('.datatables');

    const memberNameContainer = $('.alert-heading').text();
    const memberName = memberNameContainer.substr(0, memberNameContainer.indexOf('\'')).trim();
    console.log(memberName);

    const email = extractEmail(member);
    const weightlifting = extractData($, datatables[0]);
    const metcon = extractData($, datatables[1]);
    const gymnastic = extractData($, datatables[2]);
    const history = extractWorkoutHistory($, $('.datatables-workout-history'));

    const data = JSON.stringify({
        member,
        memberName,
        email,
        weightlifting,
        metcon,
        gymnastic,
        history
    }, null, 4);

    fs.writeFileSync(`./out/${memberName}-workouts.json`, data);
}

const parseMembers = () => {
    return new Promise((resolve, reject) => {
        const members = [];
        fs.createReadStream('members.csv')
            .pipe(csv())
            .on('data', row => parseMemberFile(row.user))
            .on('end', () => {
                console.log('Done reading members list.');
                resolve(members);
            });
    });
}

const main = async () => {
    const members = await parseMembers();
    console.log(members);
};

main().then(() => console.log('DONE.'));
// loginTriib().then(() => console.log('DONE.'));

/*

let products = () => {
    $("#id_shopping_cart tbody").find("tr").each(function () {
        const name = $(this).find("td:nth-child(2)").text().replace('Edit', '').trim();
        const price = $(this).find("td:nth-child(3)").text().replace('$','').trim();
        console.log(`"${name}","${price}"`);
    });
}
*/
