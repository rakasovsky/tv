// сокращаем путь до картинок 
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';



const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const  modal = document.querySelector('.modal');

const tvShows = document.querySelector('.tv-shows'),
      tvCardImg = document.querySelector('.tv-card__img'),
      modalTitle = document.querySelector('.modal__title'),
      genresList = document.querySelector('.genres-list'),
      rating = document.querySelector('.rating'),
      description = document.querySelector('.description'),
      modalLink = document.querySelector('.modal__link'),
      dropdown = document.querySelectorAll('.dropdown'),
      tvShowsHead = document.querySelector('.tv-shows__head'),
      posterWrapper = document.querySelector('.poster__wrapper'),
      modalContent = document.querySelector('.modal__content'),
      pagination = document.querySelector('.pagination');


// Прелоудер
const preloader = document.querySelector('.preloader');
      
// search 
const searchForm = document.querySelector('.search__form'),
      searchFormInput = document.querySelector('.search__form-input') 


//Создание прелодера

const loading = document.createElement('div');
loading.className = 'loading';



// Открытие/закрытие меню


// Закрытие открытых владок меню
const closeDropdown = () => {
    dropdown.forEach(item => {
    //    item.classList.remove('active');
    })
};


hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});

document.body.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    }
} );


leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
    if (target.closest('#top-rated')){
        dbService.getTopRated().then((response) =>  renderCard(response, target));
    }
    if (target.closest('#popular')){
        dbService.getPopular().then((response) =>  renderCard(response, target));
    }
    if (target.closest('#today')){
        dbService.getToday().then((response) =>  renderCard(response, target));
    }
    if (target.closest('#week')){(
        dbService.getWeek().then((response) =>  renderCard(response, target)));
    }
    if (target.closest('#search')){
       tvShowList.textContent = '';
       tvShowsHead.textContent = '';

    }
   
});






// открытие модального окна

tvShowList.addEventListener('click', event => {


    debugger;

    //сохраняем позицию после возвращения с модального окна 
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    
    if(card) {


        //вызов прелоудера
        preloader.style.display = 'block';

        // создание нового объекта запроса
        // new DBService().getTvShow(card.id)
        //     .then(data => {
        //     console.log(data);
        //     tvCardImg.src = IMG_URL + data.poster_path;
        //     modalTitle.textContent  = data.name;
        //     // с reduce 
        //     // genresList.innerHTML = data.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '' )

        //     // с for
        //     // genresList.textContent = ''
        //     // for(const item of data.genres){
        //     //     genresList.innerHTML += `<li>${item.name}</li>`
        //     // }

        //     // с forEach
        //     genresList.textContent = ''
        //     data.genres.forEach(item => {
        //         genresList.innerHTML += `<li>${item.name}</li>`;
        //     })
        //     rating.textContent = data.vote_average;
        //     description.textContent = data.overview;
        //     modalLink.href = data.homepage;
        //     if( tvCardImg.src) {
        //         tvCardImg.src = IMG_URL +  data.poster_path;
        //         posterWrapper.style.display = 'none';
        //     } else {
        //         posterWrapper.style.display = 'none';
        //     };
        // })

        dbService.getTvShow(card.id)

        .then(({
            poster_path: posterPath,
            name: title,
            genres,
            vote_average: voteAverage,
            overview,
            homepage }) => {

                // Удаляем блок с картинкой - если картинки нет
                if(posterPath) {
                    tvCardImg.src = IMG_URL + posterPath;
                    tvCardImg.alt = title;
                    posterWrapper.style.display = '';
                } else {
                    posterWrapper.style.display = 'none';
                    modalContent.style.paddingLeft = '50px';
                }

                tvCardImg.src = IMG_URL + posterPath;
                tvCardImg.alt = title;
                modalTitle.textContent = title;
                genresList.textContent = '';
                genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}</li>`
                });
                rating.textContent = voteAverage;
                description.textContent = overview;
                modalLink.href = homepage;
            } 

        )

        .then(() => {
              //запрещаем прокрутку экрана во время открытого модального
                    document.body.style.overflow = 'hidden';
                    modal.classList.remove('hide');
            })


          //скрытие прелоудера
          .finally(() => {
            preloader.style.display = '';
            })

         };
        
})



//закрытие модалки 

modal.addEventListener('click', event => {
    if(event.target.closest('.cross') ||
       event.target.classList.contains('modal')){
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
} ) 


// замена атрибутов картинки

// const changeImage = event => {
//     const card = event.target.closest('.tv-shows__item');

//     if (card) {
//         const img = card.querySelector('.tv-card__img');
//         const changeImg = img.dataset.backdrop; 
//         if(changeImg) {
//             img.dataset.backdrop = img.src;
//             img.src = changeImg;
//         }
//     }
// };


// tvPoster = [...document.querySelectorAll('.tv-card__img')].forEach(img => {
//     img.addEventListener('mouseenter', function(event) {
//         if(img.dataset.backdrop){
//               [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop];
//         }
//     });
//     img.addEventListener('mouseleave', function(event) {
//         if(img.dataset.backdrop){
//             [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
//         }
//       });
// });


// замена атрибутов картинки c деструктуризацией 

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');
        if(img.dataset.backdrop) {
            // деструктуризация 
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }
    }
};

tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);



class DBService {

    constructor(){
        this.API_KEY = '35631bbcf4480e586759cd9b1b11f381';
        this.SERVER = 'https://api.themoviedb.org/3';
    }

    getData = async (url) => {
    
        const res = await fetch(url);
        if(res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    // Создание нового метода 
    getTestCard = () => {
        return this.getData('card.json');
    }


    // результаты поиска
    getSearchResult = data => {
        this.temp = this.SERVER + '/search/tv?api_key=' + this.API_KEY +
        '&language=ru-RU&query=' + data;
        return this.getData(this.temp)
    }


    getNextPage = page => {
        return this.getData(this.temp + '&page=' + page);
    }

    // getSearchResult = (data) => {
    //     return this.getData(`https://api.themoviedb.org/3/search/tv?api_key=35631bbcf4480e586759cd9b1b11f381&language=en-US&page=1&query=${data}`)
    // }


    getTvShow = id => {
        return this.getData(this.SERVER + '/tv/' + id + '?api_key=' + this.API_KEY + '&language=ru-RU')
    }

    getTopRated = () => this.getData(this.SERVER + '/tv/top_rated?api_key=' + this.API_KEY + '&language=ru-RU')
    getPopular = () => this.getData(this.SERVER + '/tv/popular?api_key=' + this.API_KEY + '&language=ru-RU')
    getToday = () => this.getData(this.SERVER + '/tv/airing_today?api_key=' + this.API_KEY + '&language=ru-RU')
    getWeek = () => this.getData(this.SERVER + '/tv/on_the_air?api_key=' + this.API_KEY + '&language=ru-RU')
}

const dbService = new DBService();

console.log(dbService.getSearchResult('глухарь'));


const renderCard = (response, target) => {
    // Очищаем результаты прошлых поисковых запросов
    tvShowList.textContent = '';


    if (!response.total_results) {
        loading.remove();
        tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено';
        tvShowsHead.style.cssText = 'color: red; '
        return;
    } 

    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';
    tvShowsHead.style.cssText = ''

    response.results.forEach(item => {

        // извлекаем свойства объкта item и переименование свойст / деструктуризация

        const {
              backdrop_path: backdrop,
              name: title,
              poster_path: poster,
              vote_average: vote,
              id: id
             } = item;

        // проверка наличия содержания информации       
        const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg' ;
        const backdropImg =  backdrop ? IMG_URL + backdrop : '' ;
        const voteElem = vote ? '<span class="tv-card__vote">' + vote + '</span>' : '';
       


        // создание нового элемента 
        const card = document.createElement('li');

        // добавление id для карт
        card.idTV = id;
        // добавление класса 
        // через свойство className card.className = 'tv-shows__item';
        card.classList.add('tv-shows__item');
        // вставка шаблона в ``
        card.innerHTML = `
         <a href="#"  id="${id}" class="tv-card">
         ${voteElem}
            <img class="tv-card__img"
                src="${posterImg}"
                data-backdrop="${backdropImg}"
                alt="${title}">
            <h4 class="tv-card__head">${title}</h4>
        </a>
        `;

        // выпиливаем прелоудер после загрузки данных           
        loading.remove();
        //добавление элемента на страницу (с помошью append карты появляются в конце блока)
        // tvShowList.insertAdjacentElement('afterbegin', card); insertAdjacentElement позволяет добавлять элементы более гибко
        tvShowList.append(card);
    });

    // Создание пагинации, проверка кол-ва страниц

    pagination.textContent = '';

    if(!target && response.total_pages > 1 ){
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`
        }
    } 
};


pagination.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('pages')) {
        tvShows.append(loading);
        dbService.getNextPage(target.textContent).then(renderCard);
    }
});


// Поиск
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    // использовать trim() для очистки от пробелов в начале и конце строки
    const value = searchFormInput.value.trim();
    if(value) {
        // tvShows.append(loading);
        dbService.getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
    
   
});

// {
//     // вызов прелоудера перед выполнением запроса к API
//     tvShows.append(loading);
//     new DBService().getTestData().then(renderCard);
// }