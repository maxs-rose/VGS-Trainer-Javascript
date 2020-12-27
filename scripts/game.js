var vgsJson = {}
var selectableVGS = []
var challenge = {}
var input = ""
var found = true
var searchResults = []
var score = 0
var gotHint = false

$(document).ready(function()
{
    $.getJSON(`${document.URL}/data/vgs.json`, function(data) {
        vgsJson = data

        selectableVGS = []
        vgsJson.forEach(function(element) {
            if(element.final)
                selectableVGS.push(element)
        });

        getChallenge()
    });
});

$(document).keypress(function(e)
{
    $("#challenge").find("span").html(challenge.value)

    if(e.which == 13)
    {
        score = 0
        getChallenge()
        shake()
    }
    else if(e.which == 32)
    {
        score = 0
        clear()
        shake()
    }
    else if(e.which == 47)
    {
        $("#challenge").find("span").html(`${challenge.combo.toUpperCase()} - ${challenge.value}`)
        gotHint = true
    }
    else
    {
        input += e.key.toUpperCase()
        updateInput()
        getOptions(input)

        if(found)
            win()
        else
            updateDisplay()
    }
})

function getOptions(comb)
{
    searchResults = []

    vgsJson.forEach(function(vgs)
    {
        if(vgs.combo === comb.toLowerCase() && vgs.final === true)
            searchResults.push(vgs)
    })

    if(searchResults.length == 1)
    {
        if(searchResults[0].combo === challenge.combo)
        {
            found = true
            return
        }
        else
            return
    }
    
    searchResults = []

    vgsJson.forEach(function(vgs)
    {
        if(vgs.combo.length === comb.length + 1 && vgs.combo.startsWith(comb.toLowerCase()))
            searchResults.push(vgs)
    })
}

function clear()
{
    input = ""
    $("#user-input").html("Update Input")
    $("#options-list").html("")
    $("#score").find("span").html(score)
}

function updateInput()
{
    $("#user-input").html(input)
}

function getChallenge()
{
    found = false
    clear()
    challenge = selectableVGS[Math.floor(Math.random() * selectableVGS.length)]

    $("#challenge").find("span").html(challenge.value)
}

function win()
{
    if(!gotHint)
        score++

    gotHint = false

    $("#user-input").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)

    getChallenge()
}

function shake()
{
    $("#user-input").effect("shake")
}

function updateDisplay()
{
    $("#options-list").html("")

    searchResults.forEach(res =>
        {
            $("#options-list").append(`<li>${res.combo.toUpperCase()} - ${res.value}</li>`)
        })
}