const axios = require('axios').default;
const options={
    API_URL:        "https://pixabay.com/api/",
    API_KEY:        "32355865-c929d0081293f1f48a699b3aa",
    q:              "",
    image_type:     "photo",
    orientation:    "horizontal",
    safesearch:     true,
    page:           1,
    per_page:       40,
    getRequest(searchPhoto){
        this.q=searchPhoto.trim();
        return `${this.API_URL}?key=${this.API_KEY}&q=${this.q}&image_type=${this.image_type}&orientation=${this.orientation}&safesearch${this.safesearch}&page=${this.page}&per_page=${this.per_page}`;
    },
};

async function getPhotos(searchStr,page){
    var result;
    if(page>0){
        options.page=page;
    }

    await axios.get(options.getRequest(searchStr))
    .then(function (response) {
        // обробка успішного запиту
        result={
            allHitsQuantyty:    response.data.total,
            pageHitsQuantyty:   response.data.totalHits,
            data:               response.data.hits,
            status:             true,
        };

        //console.log(`total =${response.data.total},   length = ${response.data.hits.length}, per_page=${options.per_page}`);
        if(response.data.total===0){
            result.status=false;// нічого не знайдено
        }
        if((response.data.total>0 && response.data.length==0)||(response.data.total>0 && response.data.hits.length<options.per_page)){
            result.status="end";// кінець даних
        }

    })
    .catch(function (error) {
        // обробка помилки
        //console.log(`axios getError`);
        //console.log(error);
        result={
            allHitsQuantyty:    0,
            pageHitsQuantyty:   0,
            data:               null,
            status:             'error',//помилка виконанння
            error:              error,
        };
    })
    .then(function () {
        // виконується завжди
        
    }); 
    console.log(result);
    return result;
}

export {getPhotos}