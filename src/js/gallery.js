import {getPhotos} from"./getPhotos";// отримання даних з сервера
import {renderPhotos} from"./renderPhotos";//рендер галереї
import throttle from "lodash.throttle";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";// Додатковий імпорт стилів
//import photoCardTpl from "../templates/photo-card.hbs";
const refs={
    gallery:        document.querySelector(".gallery"),
    form:           document.querySelector("#search-form"),
    SCROLL_DELEY:   500,
    page:           1,
    allPhotos:      0,
};
//=============================================================================
var instance=new SimpleLightbox('.gallery a',{captionsData: "alt", captionDelay:250});
//==============================Events=========================================
refs.form.addEventListener("submit",(event)=>{
    event.preventDefault();
    refs.page=1;
    getPhotos(refs.form.searchQuery.value).then((result)=>{
        refs.gallery.innerHTML="";
        console.log(`status: ${result.status}`);
        if(!result.status)
        {
            Notify.failure("Sorry, there are no images matching your search query. Please try again");
        }
        else if(result.status=="error"){
            Notify.failure("Sorry, there is script error, we are working on it. Please try again later");
        }
        else
        {
            Notify.success(`Hooray! We found ${result.allHitsQuantyty} images.`);
            refs.gallery.innerHTML=renderPhotos(result.data);
            console.log(result.data);
            refs.allPhotos=result.allHitsQuantyty;
            instance.refresh();
        }
        //console.log(result.allHitsQuantyty);
        //console.log(result.pageHitsQuantyty);
    });
});
//------------------------------------------------------------------------
document.addEventListener("scroll",throttle(()=>{
    checkPosition();
},refs.SCROLL_DELEY));
//=======================================================================

//=======================================================================
function checkPosition() {
    // Нам потребуется знать высоту документа и высоту экрана:
    const height = document.body.offsetHeight
    const screenHeight = window.innerHeight

    // Они могут отличаться: если на странице много контента,
    // высота документа будет больше высоты экрана (отсюда и скролл).

    // Записываем, сколько пикселей пользователь уже проскроллил:
    const scrolled = window.scrollY

    // Обозначим порог, по приближении к которому
    // будем вызывать какое-то действие.
    // В нашем случае — четверть экрана до конца страницы:
    const threshold = height - screenHeight / 4

    // Отслеживаем, где находится низ экрана относительно страницы:
    const position = scrolled + screenHeight

    if (position >= threshold) {
      // Если мы пересекли полосу-порог, вызываем нужное действие.
        //console.log(`position:  ${position}`);
        //console.log(`limit:  ${threshold}`);

        if(refs.allPhotos>0)
        {
            getPhotos(refs.form.searchQuery.value,refs.page).then((result)=>{
                refs.page++;
                refs.allPhotos-=result.data.length
                refs.gallery.innerHTML+=renderPhotos(result.data);

                instance.refresh();

                if(result.status=="end"){
                    Notify.info(`We're sorry, but you've reached the end of search results.`);
                }
            });
        } 
    }
}
