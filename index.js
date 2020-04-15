/**
 * This class edits the text on the button and change it's redirection
 */
class LinkRewriter {
  constructor(url){
    this.url = url
  }
  element(e){
    e.setAttribute('href', this.url)
    e.setInnerContent("My Reroll variant")
  }
}

/**
 * This class adds on to the title of the title of webpage  and the main title of the page. 
 */
class TitleRewriter {
  element(e) {
    e.append(" by: Dustin Huynh")
  }
}

/**
 * This class gives a brief description of the webpage
 */
class BodyRewriter {
  element(e){
    e.setInnerContent("Click \"Reroll variant\" to have a chance at rolling another variant!")
  }
}

/**
 * Entry point
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * This function fetches from the api and return a json object of the variants
 */
async function getUrls(url) {
  let resp = await fetch(url)
  let respJson = await resp.json()
  return respJson.variants
}

/**
 * Randomly select one of the two urls
 */
function random(urls) {
  var rand = Math.random()*100
  if(rand <= 50)
    return urls[0]
  if(rand > 50)
    return urls[1]
}

/**
 * Rewrites the html of the variant url
 */
async function getVariantUrl(selected_url) {
  let variant = await fetch(selected_url)
  let rewrite = new HTMLRewriter()
    .on("h1#title", new TitleRewriter())
    .on("title", new TitleRewriter())
    .on("a#url", new LinkRewriter())
    .on("p#description", new BodyRewriter())
  let response = new Response(rewrite.transform(variant).body, variant)
  return response
}

/**
 * Event handler returns a response
 */
async function handleRequest(request) {
  let urls = await getUrls("https://cfw-takehome.developers.workers.dev/api/variants")
  let selected_url = random(urls)
  let response = await getVariantUrl(selected_url)
  return response

}