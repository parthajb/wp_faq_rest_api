const app = document.getElementById('root')
const title = document.getElementById('title')
const tags = document.getElementById('tags')

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const city = urlParams.get('city')


const container = document.createElement('div')
container.setAttribute('class', 'container')


app.appendChild(container)


var requestGroup = new XMLHttpRequest()
requestGroup.open('GET', 'http://kharkhua.com/wp-json/wp/v2/ufaq-category/' + city, true)
requestGroup.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (requestGroup.status >= 200 && requestGroup.status < 400) {
        const h3 = document.createElement('h3')
        h3.textContent = data.name
        title.appendChild(h3)

    } else {
        const errorMessage = document.createElement('marquee')
        errorMessage.textContent = `No city found`
        app.appendChild(errorMessage)
    }
}
requestGroup.send()


var requestTags = new XMLHttpRequest()
requestTags.open('GET', 'http://kharkhua.com/wp-json/wp/v2/ufaq-tag/', true)
requestTags.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)

    if (requestTags.status >= 200 && requestTags.status < 400) {
        data.forEach(tag => {


            const link = document.createElement('button')
            link.setAttribute('class', 'tag')
            link.setAttribute('data-id', tag.id)
            link.textContent = tag.name


            tags.appendChild(link)
        })

    } else {
        const errorMessage = document.createElement('marquee')
        errorMessage.textContent = `No city found`
        app.appendChild(errorMessage)
    }
}
requestTags.send()


// document.getElementById("tag").addEventListener("click", getFAQ);


$(document).on("click", ".tag", function(){
  cityNew = city.substring(0, city.length - 1);
  tagid = $(this).attr("data-id");
  $('.tag').removeClass('active');
  $(this).addClass('active');
  container.innerHTML = '';
    console.log(tagid);
    var request = new XMLHttpRequest()
    request.open('GET', 'http://kharkhua.com/wp-json/wp/v2/ufaq?ufaq-category=' + cityNew+'&ufaq-tag='+tagid, true)
    request.onload = function() {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response)
        if (request.status >= 200 && request.status < 400) {
            data.forEach(faq => {
                const card = document.createElement('div')
                card.setAttribute('class', 'card')

                const btn = document.createElement('button')
                btn.setAttribute('class', 'btn btn-link btn-block text-left')
                btn.setAttribute('data-toggle', 'collapse')
                btn.setAttribute('data-target', '#' + faq.slug)
                btn.textContent = faq.title.rendered

                const div = document.createElement('div')
                div.setAttribute('id', faq.slug)
                div.setAttribute('class', 'collapse')
                div.setAttribute('aria-labelledby', faq.id)
                div.setAttribute('data-parent', '#accordion')
                div.innerHTML = faq.content.rendered

                container.appendChild(card)
                card.appendChild(btn)
                card.appendChild(div)
            })
        } else {
            const p = document.createElement('p')
            p.innerHTML = 'No FAQ found'
            app.appendChild(p)
        }
    }

    request.send()
});