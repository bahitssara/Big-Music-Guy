
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
        <h3 class="youtube-title">${video.snippet.title}</a></h3>
                <div class="iFrame">
                    <iframe class="iFrame-box" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe><br>
           </div>    
        `)
})

    $('.results').removeClass('hidden');
}

 // fetch news articles
 function getNewsResults(query){
    const params = {
        q: query,
        sortBy: 'relevancy',
        pageSize: 6,
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
            <h3 class="news-title"><a href="${news.url}" target="_blank">${news.title}</a></h3>
            <img src="${news.urlToImage}" class="news-image" alt="news image">
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
    .error(function() { 
        alert("Something went wrong, try again!"); 
    })
}

//display tastedive results
function renderTasteDiveResults(json) {
    console.log(json);
    $('.tastedive-results').empty();

    json.Similar.Results.forEach(rec => {
        $('.tastedive-results').append(`
        <div class="tastedive-list">
            <h3><a href="${rec.wUrl}" target="_blank">${rec.Name}</a></h3>
            <div class="iFrame">
                <iframe class="iFrame-box" src="${rec.yUrl}" frameborder="0" allowfullscreen></iframe><br>
           </div>   
           <p class="wiki-results">${rec.wTeaser}</p> 
        </div>
        `)
    })

    $('.results').removeClass('hidden');
}

//Search again button-Scrolls to top of page
function searchAgainButton() {
    $('.search-again').click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
});
}

//search button aligns you with results with each search
function searchButtonOffset(){
$('#search-button').click(function() {
$('html, body').animate({
    scrollTop: ($('.results-page').offset().top)
},500);
});
}


 $(watchForm);
 $(searchAgainButton);
 $(searchButtonOffset);