
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
            console.log(responseJson)
        }) 
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
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
           console.log(responseJson)
       }) 
       .catch(err => {
           $('#js-error-message').text(`Something went wrong: ${err.message}`);
   })
}

//fetch tastdive results
function getTasteDiveResults(query,callback) {
    const tasteDiveUrl='https://tastedive.com/api/similar?callback=?';
    const params = {
        k: '330958-BigMusic-3TPFTSYM',
        q: query,
        limit: 6,
        type: 'music'
    };
    const queryString = setQueryParams(params);
    const url = tasteDiveUrl + '&' + queryString;

    $.getJSON(url,callback, function(json){
        console.log(json);
    })
    
}
 $(watchForm);


