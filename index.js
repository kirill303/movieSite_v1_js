//___________________________----МЕШУРА

const API__get__ID = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const API_key = `сюда ваш ключ`;
const API_base__url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=2018&month=OCTOBER&page=1`;
const API__get__actor = 'https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=';
const API_get_KeyWord = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?';
const API__get__rev = 'https://kinopoiskapiunofficial.tech/api/v1/reviews?filmId='
const API__get__actorURl = 'https://kinopoiskapiunofficial.tech/api/v1/staff/';
let thisPageUrl = `https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?`;
let thisDataUrl = 'year=2018&month=OCTOBER&page=';
//_____________________SLIDER
const blocks = 20;
let blocksHtml = '';
let position = 0;
let blockCount = blocks;



let thisPage = 1;
const mouthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//_______________________________________________HTML
//____________---HEADER
const form1 = document.querySelector(".form1");
const formMounth = document.querySelector(".form__mounth");
const input = document.querySelector(".search");
const inputMounth = document.querySelector(".search__mounth");
//_________--MAIN
const allmovies = document.querySelector(".movie__block-cont");
const btnPrevMovie = document.querySelector("#btn-prev__mov");
const btnNextMovie = document.querySelector("#btn-next__mov");
const des = document.querySelector('.des');
const mouths = document.querySelector('.mouths');
const this__mouth = document.querySelector(".this__mouth");
window.onload = function(){
   console.log('Страница загружена');
}
//___________________-----ЗАПРОСЫ
async function minGet(id) {
   console.log(id);
   const resp = await fetch(id, {
      headers: {
         "Content-type": "application/json",
         "X-API-KEY": API_key,
      }
   });
   if (resp.status == "404") { return 0 }
   const respData = await resp.json();
   return respData;
}
async function getMovie(url) {
   allmovies.innerHTML = '';
   const resp = await fetch(url, {
      headers: {
         "Content-type": "application/json",
         "X-API-KEY": API_key,
      }
   });
   const respData = await resp.json();
   snowMovie(respData);
}
async function getId(id) {
   const respData = await minGet(API__get__ID + id);
   const relpData = await minGet(API__get__ID + id + "/box_office");
   const renpData = await minGet(API__get__actor + id);
   const rekpData = await minGet(API__get__ID + id + '/facts');
   const rekbData = await minGet('https://kinopoiskapiunofficial.tech/api/v2.1/films/' + id + '/frames');
   const reepData = await minGet(API__get__rev + id + '&page=1');
   snowId(respData, relpData, renpData, rekpData, reepData, rekbData);
}

//________________-------ЧЕКЕТЫ
const checked = {
   rating: (r) => {
      r = +r;
      if (r > 6.9) {
         return "rev-green"
      } else if (r < 6.9 && r > 4) {
         return "rev-yellow"
      } else if (r < 4 && r > 0.1) {
         return "rev-red"
      } else {
         return "rev-Nan"
      }
   },
   kl1: (kl) => {
      let h = '';
      if (kl.length == 0) {
         return "Жабагадюшник"
      } else {
         kl.forEach((e) => {
            h += `${e.genre}  `
         });
         return h;
      }
   },
   mnts: (kl) => {
      kl = Math.floor(kl);
      if (kl < 60) {
         return `${kl} Минут`
      } else if (kl > 60) {
         let n = 0
         for (; kl > 60; n++) {
            kl -= 60;
         }
         return `${(n == 1) ? n + " Час" : n + " Часа"} и ${kl} Минут`
      } else {
         return `666 минут`
      }
   },
   kl2: (kl) => {
      let h = '';
      if (kl.length == 0 || kl == undefined) {
         return "Жабагадюшник"
      } else {
         for (let y = 0; y < kl.length; y++) {
            h += `${kl[y].country} ${(y != (kl.length - 1)) ? "," : " "} `
         }
         return h;
      }
   },
   le: (jk) => {
      let h = '';
      if (jk != null && jk.split("").length > 300) {
         let n = jk.split("");
         for (let index = 0; index < 240; index++) {
            h += n[index];
         }
         h += "..."
      } else {
         h = (jk) || "Нет описания";
      }
      return h;
   },
   dataRevChecked: (dataRev) => {
      let m = '';
      if (dataRev != 0 && dataRev.reviews && dataRev.reviews.length != 0) {
         for (let index = 0; index < 12; index++) {
            let h42 = dataRev.reviews[index];
            if (h42.length == index) break;
            m += `
         <span class ="rev__title">${h42.reviewTitle || ("рецензия " + (+ index + 1))}</span>
         <p>${h42.reviewDescription}</p>
         <span class ="rev__autor">${h42.reviewAutor || "Нет автора"}</span>
         `;
         }
      } else m = "По фильму нет отзывов"
      return m;
   },
   dataActorChecked: (dataActor) => {
      let k = '';
      if (dataActor != 0) {
         for (let n = 0; n < blocks; n++) {
            if (n == dataActor.length - 1) break;
            let g = dataActor[n].professionText.split('');
            g.pop();
            k += `<div class="actor__block">
         <div class="actor__image"><img src="${dataActor[n].posterUrl}" alt="" class="actor__imageImg"  id = "G${dataActor[n].staffId}"></div>
         <div class="actor__name">${dataActor[n].nameRu}</div>
         <div class="actor__job">${g.join("")}</div>
      </div>`
         }
      }
      return k;
   },
   dataIMGSChecked: (dataIMGS) => {
      let Lm = '';
      if (dataIMGS != 0 && dataIMGS.frames.length != 0) {
         for (let n = 0; n < blocks; n++) {
            if (n == dataIMGS.frames.length - 1) break;
            Lm += `<div class="des__movie-images">
      <img src="${dataIMGS.frames[n].image}" alt="">
   </div>`
         }
      } else Lm = "По фильму нет картинок"
      return Lm;
   },
   dataFactsChecked: (dataFacts) => {
      let q = '';
      if (dataFacts != 0 && dataFacts.total != 0) {
         for (let $L = 0; $L < 4; $L++) {
            if ($L == dataFacts.total) break;
            let random42 = Math.floor(Math.random() * dataFacts.total)
            q += `<li class = "des-facts__li">${(dataFacts.items[random42].spoiler == true) ? "<span class = 'spoiler'>Внимание спойлер</span>" : ""}${dataFacts.items[random42].text}</li><br>`
         }
      } else q = "По фильму нет фактов"
      return q;
   },
   dataMediaIfList: (clientMedia, kList, j) => {
      return (clientMedia < 760) ? ` <li id="event${kList}" class="des-page__block">Описание</li>` : '';
   },
   dataMediaIfTopBlock: (clientMedia, k) => {
      return (clientMedia < 760) ? `  <div class="des__description des-top__block">
      ${k}
   </div>` : '';
   }
}
//_________________________ПЕРЕЗАПИСЬ СТРАНИЦЫ
function snowMovie(data) {
   if (data.hasOwnProperty("releases")) data.films = data.releases;
   data.films.forEach(el => {
      let newMov = document.createElement('div');
      newMov.classList.add("movie__block");
      newMov.innerHTML =
         `<div class="movie__block-cont">
         <div class="block-movie__prev">
            <img class="block-movie__img" src="${el.posterUrl}" id ="${el.filmId}">
            <div class="block-movie__rev ${checked.rating(el.rating)}">
               <p>${(typeof (+el.rating) == "number" && el.rating) ? (+el.rating).toFixed(1) : "N"}</p>
            </div>
         </div>
         <div class="block-movie__info">
            <div class="block-movie__author">${el.nameRu || el.nameEn}</div>
            <div class="block-movie__genres">${(el.genres.length == 0) ? "Жабагадюшник" : el.genres[0].genre}
            </div>
         </div>
         <div class = "block-movie__psevdoAfter"></div>
      </div>`;
      allmovies.appendChild(newMov);
   });
   if (data.films.length == 0) allmovies.innerHTML = "Ничего не найдено:("
}
function snowId(data, dataProk, dataActor, dataFacts, dataRev, dataIMGS) {
   document.querySelector('body').style.overflow = "hidden";
   console.log(data);
   console.log(dataProk);
   console.log(dataActor);
   console.log(dataFacts);
   console.log(dataRev);
   console.log(dataIMGS);
   //_____________-РЕЦЕНЗИИ
   let kBlock = 0;
   let kList = 1;
   const m = [];
   m.push(checked.dataActorChecked(dataActor));
   m.push(checked.dataFactsChecked(dataFacts));
   m.push(checked.dataRevChecked(dataRev));
   m.push(checked.dataIMGSChecked(dataIMGS));
   des.innerHTML = ` 
   <div class="des__left">
   <img class="des__image" src="${data.posterUrl}">
</div>
<div class="des__right">
   <div class="des__titles">
      <div class="des__title">
         ${(data.nameRu) || (data.nameEn) || "Клалафуда Клалафу"}
      </div>
      <div class="des__genres">
         ${checked.kl1(data.genres)}
      </div>
      <div class="des__text">
         ${checked.le(data.description)}
      </div>
      <ul class="des__pages">
         <li id="event${kList++}" class="des-page__block">Характеристики</li>
         <li id="event${kList++}" class="des-page__block">Актеры</li>
         <li id="event${kList++}" class="des-page__block">Факты</li>
         <li id="event${kList++}" class="des-page__block">Отзывы</li>
         <li id="event${kList++}" class="des-page__block">Картинки</li>
         ${checked.dataMediaIfList(window.screen.width, kList++)}
      </ul>
      <div class="des__top">
         <ul class="des__ul des-top__block">
            <li>Год выхода: ${data.year}</li>
            <li>Страны: ${checked.kl2(data.countries)}</li>
            <li>Рейтинг: (${(data.ratingKinopoisk || 'N') + ' KINOPOISK), (' + (data.ratingImdb || 'N') + 'IMDB'})
            </li>
            <li> Слоган: "${(data.slogan) || 'Нет слогана'}"</li>
            <li>Прокат по миру: "${(typeof (dataProk.items[0]) == "object") ? String(dataProk.items[0].amount).split('').join(" ") + "$" : 'Нет данных'}"</li>
            <li>Длина фильма: ${checked.mnts(data.filmLength)}</li>
         </ul>
         <div class="des__actors des-top__block">
            ${m[kBlock++]}
         </div>
         <div class="des__facts des-top__block">
            <ul class="des-facts__ul">
               ${m[kBlock++]}
            </ul>
         </div>
         <div class="des__rev des-top__block">
            ${m[kBlock++]}
         </div>
         <div class="des__imgs des-top__block">
            ${m[kBlock++]}
         </div>
         ${checked.dataMediaIfTopBlock(window.screen.width, checked.le(data.description))}
      </div>
   </div>
   <div class = "search__kinopoisk"><a href="${(data.webUrl) || " https://www.kinopoisk.ru/"}">Искать на<br> кинопоиске</a></div>
</div>

<div class="des__cross"><i class="fa fa-times" id="h4" aria-hidden="true"></i></div>
   `
   des.style.display = 'flex';
   console.log(window.performance.timing);
}
function snowMouths() {
   mouths.innerHTML = '<div class="mouth__circle"></div>';
   let k = -1;
   for (let h = 0; h <= 360; h += 30) {
      const j = document.createElement('div');
      j.className = "mouth";
      j.style.transform = `rotate(${h}deg)`;
      if (h >= 180) { k += 1 }
      j.innerHTML = `<div class="mouth1" id = "M${(k != -1) ? k : ''}" ></div >
      <div class="mouth2" id="M${(k != -1 && k != 1) ? k + 5 : 0}"></div>`
      mouths.appendChild(j);

   }
}
//_______________________--ОБРАБОТЧИКИ
document.addEventListener('submit', e => {
   if (e.target == form1) {
      let zap = input.value;
      getMovie(`${API_get_KeyWord}keyword=${zap}&page=1`);
      return false;
   } else if (e.target == formMounth) {
      let zap1 = 0;
      if (inputMounth.value > 2013 && inputMounth.value < 2021) {
         zap1 = inputMounth.value;
      } else {
         zap1 = 2021;
      }
      let zap2 = this__mouth.innerHTML.toUpperCase();
      thisDataUrl = `year=${zap1}&month=${zap2}&page=`;
      getMovie(`${thisPageUrl}year=${zap1}&month=${zap2}&page=1`);
      mouths.style.width = `20px`;
      mouths.style.height = `20px`;
      this__mouth.style.height = `10px`;
      this__mouth.style.width = `10px`;
      formMounth.style.height = `10px`;
      formMounth.style.width = `10px`;
      mouths.innerHTML = '';
      return false;
   }
})
document.addEventListener('click', async e => {
   console.log(e.target);
   if (e.target.className == 'block-movie__img') {
      getId(e.target.id);
      //ПОДРОБНОСТИ ФИЛЬМА
   } else if (e.target == btnNextMovie || e.target == btnNextMovie.lastChild) {
      ++thisPage;
      getMovie(thisPageUrl + thisDataUrl + thisPage);
      //СЛЕДУЩАЯ СТРАНИЦА
   } else if (e.target == btnPrevMovie || e.target == btnPrevMovie.lastChild) {
      if (thisPage != 1) --thisPage;
      getMovie(thisPageUrl + thisDataUrl + thisPage);
      //предудащая страница
   } else if (e.target.id == "h4") {
      des.style.display = "none";
      document.querySelector('body').style.overflow = "scroll";
   } else if (e.target == mouths) {
      mouths.style.width = `200px`;
      mouths.style.height = `200px`;
      this__mouth.style.height = `200px`;
      this__mouth.style.width = `40px`;
      formMounth.style.height = `40px`;
      formMounth.style.width = `200px`;

      snowMouths();
   } else if (e.target.className == "mouth1" || e.target.className == "mouth2") {
      let l = e.target.id.replace('M', '');
      this__mouth.innerHTML = mouthsArr[l];
   } else if (e.target.className == "logo") {
      thisDataUrl = 'year=2018&month=OCTOBER&page=';
      getMovie(thisPageUrl + thisDataUrl + thisPage);
   } else if (e.target.className == "des-page__block") {
      const allPage = document.querySelectorAll(".des-top__block");
      const allPageLi = document.querySelectorAll(".des-page__block");
      let l = e.target.id.replace('event', '');
      for (let index = 0; index < allPage.length; index++) {
         let elem = allPage[index];

         if (index != (l - 1)) {
            allPageLi[index].style.textDecoration = "none";
            elem.style.width = "0%";
            setTimeout(() => {
               elem.style.display = 'none';
            }, 500);
         } else {
            allPageLi[index].style.textDecoration = "underline";
            elem.style.width = "100%";
            elem.style.display = "flex";
         }

      }
   } else if (e.target.className == 'actor__imageImg') {
      let r = await minGet(API__get__actorURl + e.target.id.replace('G', ''));
      if (r != 0) window.open(r.webUrl);
   }
});
//________________________ЗАПУСК
getMovie(API_base__url);
