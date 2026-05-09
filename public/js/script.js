async function generateJoke() {

  // send a request to the url https://.../home/generate
  try {
    let res = await fetch("/home/generate", {
      method: "Post"
    });

    let data = await res.json();
    let text = `${data.setup}\n${data.punchline}`;

    console.log(text);
    document.querySelector("#textZone").innerHTML = text;
  } catch (err) {
    document.querySelector("#textZone").innerHTML = "Something went wrong.";
  }
}


// TODO: should be somewhat similar to above. Use response.ok to check for successful response
async function saveJoke() {
  try { 
    let res = await fetch("/home/save")
  } catch(err) { 

  }
}



