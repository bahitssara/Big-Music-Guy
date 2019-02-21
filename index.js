
// make the start page function // 
$(document).ready(function(){
    $('.start-button').on('click', renderSearchPage)
 })
 
 // open the search page //
 function renderSearchPage(){
     $('.main-page').hide();
     $('.search-page').fadeIn();
     $('.search-page').removeClass('hidden');
 }

//watch for submits//
 function watchForm(){
     $('form').submit(event => {
        event.preventDefault();
        //give value to input to be re-used throughout//
        const searchInput = $('.search-bar').val();
        getYoutubeResults(searchInput);
        getNewsResults(searchInput);
        getTasteDiveResults(searchInput);
     })
 }

 //set query parameters 
 function setQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//fetch youtubes videos//
 function getYoutubeResults(query){ 
     const params= {
         part:'snippet',
         key:'AIzaSyAIGcyAJ-pZRhENhSnqy6L_l7EmdEdXw8U',
         q: query + 'interview',
         maxResults: 6,
         type: 'video',
         order: 'relevance',
     };
     const youtubeUrl='https://www.googleapis.com/youtube/v3/search';
     const queryString = setQueryParams(params)
     const url = youtubeUrl + '?' + queryString;

     fetch(url)
        .then (response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            renderYoutubeResults(responseJson);
        }) 
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
 }

 //display youtube results
 function renderYoutubeResults(responseJson) {
    console.log(responseJson)
    $('.youtube-results').empty();

    responseJson.items.forEach(video => {
        $('.youtube-results').append(`
        <ul>
            <li><h3>${video.snippet.title}</h3>
                <img src='${video.snippet.thumbnails.medium.url}'>
            </li>
        </ul>    
        `)
})

    $('.results').removeClass('hidden');
}

 // fetch news articles
 function getNewsResults(query){
    const params = {
        q: query,
        sortBy: 'relevancy',
        totalResults: 6,
        language: 'en'
    };
    const apiKey = '3311ba7deadd4135ac85e662cfb2f5fe';
    const newsUrl = 'https://newsapi.org/v2/everything';
    const queryString = setQueryParams(params);
    const url = newsUrl + '?' + queryString;

    const options = {
       headers: new Headers({
         "X-Api-Key": apiKey})
     };

     fetch(url, options)
       .then (response => {
           if (response.ok) {
               return response.json();
           }
           throw new Error(response.statusText);
       })
       .then(responseJson => {
           renderNewsResults(responseJson)
       }) 
       .catch(err => {
           $('#js-error-message').text(`Something went wrong: ${err.message}`);
   })
}

//display news results
function renderNewsResults(responseJson){
    console.log(responseJson);
    $('.news-results').empty();

    responseJson.articles.forEach(news => {
        $('.news-results').append(`
        <ul>
            <li><h3>${news.title}</h3></li>
            <img src="${news.urlToImage}" class="news-image" alt="news image">
            <li><a href="${news.url}">Read Full Article</a></li>
        </ul>    
        `)
    })

    $('.results').removeClass('hidden');
}

//fetch tastedive results
function getTasteDiveResults(query,callback) {
    const tasteDiveUrl='https://tastedive.com/api/similar?callback=?';
    const params = {
        k: '330958-BigMusic-3TPFTSYM',
        q: query,
        limit: 6,
        type: 'music',
        info: 1
    };
    const queryString = setQueryParams(params);
    const url = tasteDiveUrl + '&' + queryString;

    $.getJSON(url,callback, function(json){
        renderTasteDiveResults(json);
    }) 
}

//display tastedive results
function renderTasteDiveResults(json) {
    console.log(json);
    $('.tastedive-results').empty();
    json.Similar.Results.forEach(rec => {
        $('.tastedive-results').append(`
        <ul>
            <li><h3>${rec.Name}</h3></li>
            <li><a href="${rec.yUrl}">Video</a></li>
            <li><a href="${rec.wUrl}">Wiki</a></li>
        </ul>    
        `)
    })

    $('.results').removeClass('hidden');
}

 $(watchForm);


