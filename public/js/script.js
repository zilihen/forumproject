async function generateJoke() {

  // send a request to the url https://.../home/generate
  try {
    let res = await fetch("/home/generate", {
      method: "POST"
    });

    if (!res.ok) {
      throw new Error("Something went wrong.")
    }

    let data = await res.json();
    let text = `${data.setup}\n${data.punchline}`;

    document.querySelector("#textZone").innerHTML = text;
  } catch (err) {
    alert(err);
  }
}


// TODO: should be somewhat similar to above. Not finished yet
async function saveJoke() {
  try {
    let res = await fetch("/home/save", {
      method: "POST"
    });

    if (!res.ok) {
      throw new Error("Something went wrong.");
    }
  } catch (err) {
    alert(err);
  }
}

async function logout() {
  try {
    let res = await fetch("/home/logout", {
      method: "POST"
    });

    if (!res.ok) {
      throw new Error("Something went wrong.");
    }

    location.href = "/loginPage";

    return true;
  } catch (err) {
    alert(err);
  }
}

async function viewJokes() {
  try {
    let res = await fetch("/home/view", {
      method: "POST"
    });
  }
  
}



