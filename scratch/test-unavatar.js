const domain = "nonexistentdomain123.com";
const url = `https://unavatar.io/${domain}?fallback=false`;

console.log("Fetching Unavatar for:", domain);
fetch(url)
  .then(res => {
    console.log("Status:", res.status);
  })
  .catch(err => console.error("Error:", err));
