function renderPhotos(photosInfo){
    return photosInfo.map((photoInfo)=>
        `<div class="photo-card">
            <a class="gallery__link" href="${photoInfo.largeImageURL}">
                <img class="gallery__img" src="${photoInfo.webformatURL}" data-source="${photoInfo.largeImageURL}" alt="${photoInfo.tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>${photoInfo.likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>${photoInfo.views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>${photoInfo.comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>${photoInfo.downloads}
                    </p>
                </div>
            </a>
        </div>`
    ).join("");
}

export {renderPhotos}