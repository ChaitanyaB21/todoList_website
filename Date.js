module.exports = date

function date() {
    var today = new Date();


    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var day = today.toLocaleDateString("en-GB", options);

    return day
}