const searchUser = document.getElementById("searchUser");
const searchBtt = document.querySelector(".searchBtt");
const userDetail = document.getElementById("userDetail");
const themeSwitch = document.querySelector(".themeMode");
const noResult = document.querySelector(".error");
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Dec', 'Nov'];

let userName = "";

function createHtml(tagName, elAttr, tagContent) {
    if(tagName == "p" && tagContent == undefined && elAttr.title == undefined) {
        return "";
    }

    let documentEl = document.createElement(tagName);
    
    for(let property in elAttr) {
        documentEl.setAttribute(property, elAttr[property]);
    };

    if(tagContent != undefined) {
        tagContent instanceof Element? documentEl.append(tagContent) : documentEl.innerHTML = tagContent;
    } 
    
    if(elAttr.title && tagContent == null) {
        documentEl.innerHTML = elAttr.title;
        documentEl.classList.add("opacity50");
    }

    return documentEl;
}

function createTable(arrContent) {
    let table = document.createElement("table");

    for(let i = 0; i < arrContent.length; i++ ) {
        let tr = document.createElement("tr")
        

       for(let j = 0; j < arrContent[i].length; j++) {
        let td = document.createElement("td");
        td.innerHTML = arrContent[i][j];
        tr.append(td);
       }

       table.append(tr);
    }

    return table;
}

function generateUserDetail(user) {
    if(user.name == undefined ) {
        noResult.classList.remove("hide");
        return false;
    } else {
        noResult.classList.add("hide");
    }

    let joinDate = new Date(user.created_at);
    let avatarImg = createHtml("img", {src : user.avatar_url, alt : user.name});
    let avatar = createHtml("div", {class : "avatar"}, avatarImg);
    let userFullName = createHtml("h1", {}, user.name);
    let createdAt = createHtml("p", {}, "Joined " + joinDate.getDay() + " " + months[joinDate.getMonth()] + " " + joinDate.getFullYear());
    let bio = createHtml("p", {class : "bio"}, user.bio );
    let login = createHtml("a", {href : user.html_url, class : "login" }, "@" + user.login);
    let statTable = createTable([["Respos", "Followers", "Following"], 
                                [user.public_repos, user.followers, user.following]]);
    let address = createHtml("p", {class : "address"}, user.location);
    let userUrl = createHtml("a", {class : "blogUrl", href : user.blog}, user.blog);
    let twitter = createHtml("p", {class : "twitter", title : "Not Available"}, user.twitter_username);
    let userCompany = createHtml("p", {class : "company"}, user.company);

    let userData = createHtml("div", {class : "userData"});
    userData.append(userFullName, login, createdAt, bio, 
        statTable, address, userUrl, twitter, userCompany);

    userDetail.innerHTML = " ";

    userDetail.append(avatar, userData);
}

searchUser.addEventListener("click", (ev) => {
    if(ev.target.value === ev.target.defaultValue) {
        ev.target.value = "";
    }
});

searchBtt.addEventListener("click", (ev) => {
    ev.preventDefault();
    userName = searchUser.value ||= "octocat";

    fetch("https://api.github.com/users/" + userName)
    .then(res => res.json())
    .then(data => generateUserDetail(data))
    .catch(err => console.log(err));

    searchUser.value = "Search GitHub username...";
})

themeSwitch.addEventListener("click", (ev) => {
    document.querySelector("body").classList.toggle("darkTheme");
    ev.target.innerHTML == "dark"? ev.target.innerHTML = "light" : ev.target.innerHTML = "dark"; 
});

//load default data --- to remove
(function () {
    fetch("https://api.github.com/users/octocat")
    .then(res => res.json())
    .then(data => generateUserDetail(data))
    .catch(err => console.log(err));

    document.querySelector("body").classList.toggle("darkTheme");
    themeSwitch.innerHTML = "light";
})();