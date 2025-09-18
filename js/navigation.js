const hamburger = document.getElementById("hamburger");
const siteNav = document.getElementsByClassName("site-nav")[0];

hamburger.addEventListener("click", () => {
    siteNav.classList.toggle("active");
});
