const skip_link = document.getElementById("skip-link");

window.addEventListener("keydown", (e) => {
    if (e.keyCode === 9) {
        skip_link.classList.remove("d-none");
    }
  })

  skip_link.addEventListener("click", (e) => {
    setTimeout(() => {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }, 1)
  })