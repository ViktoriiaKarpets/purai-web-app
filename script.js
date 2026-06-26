/* ============================================================
   purai — клиентская логика
   Данные: PHP (php/data.php) с резервом в localStorage.
   ИИ: PHP-прокси (php/ai.php) — ключ хранится на сервере.
   ============================================================ */

/* ---------- иконки (SVG, без эмодзи) ---------- */
const I = {
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
  refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.6" y2="16.6"/></svg>',
  bottle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4v3l1 2v13a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V7l1-2V2Z"/><line x1="9" y1="11" x2="15" y2="11"/></svg>',
  makeup:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8h8v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8Z"/><path d="M9 8l1.5-5h3L15 8"/></svg>',
  face:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
  skin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 13c1.5 1.5 6.5 1.5 8 0"/><circle cx="9" cy="9.5" r="1"/><circle cx="15" cy="9.5" r="1"/></svg>',
  lab:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><line x1="7.5" y1="15" x2="16.5" y2="15"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16h16"/><polyline points="7 14 11 10 14 13 19 7"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6Z"/></svg>',
  chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>'
};

/* ---------- словари RU / PL ---------- */
const T = {
  ru:{
    addProduct:'Добавить продукт', stCurrent:'Актуальные', stFuture:'Будущие', stPrevious:'Предыдущие',
    cat:'категория', catAll:'Всё', catSkin:'Уход', catMakeup:'Декор',
    brandLbl:'бренд', allBrands:'Все бренды', sortLbl:'сортировка',
    sortNew:'По добавлению', sortBrand:'Бренд А-Я', sortType:'Тип А-Я', sortPriceUp:'Цена ↑', sortPriceDown:'Цена ↓',
    sortExpUp:'Срок ↑', sortExpDown:'Срок ↓', sortRateUp:'Оценка ↑', sortRateDown:'Оценка ↓',
    emptyTitle:'Пока пусто', emptyCurrent:'Добавь первое средство – найди по названию или впиши состав вручную.',
    emptyFuture:'Здесь то, что хочешь попробовать.', emptyPrevious:'Здесь то, чем больше не пользуешься.',
    onboard:'Давай начнём анализировать твой уход! Нажми на иконку искорки слева сверху и заполни свой профиль кожи.',
    noRating:'без оценки', match:'совпад.',
    items1:'продукт', items2:'продукта', items5:'продуктов',
    /* product form */
    newProduct:'Новый продукт', editProduct:'Редактировать', findProduct:'Найти продукт',
    findHint:'Open Beauty Facts подставит состав и фото, если найдётся.', search:'Найти',
    fName:'Название*', fBrand:'Бренд', fCat:'Категория', fType:'Тип', typeHint:'Выбери из списка или впиши свой.',
    inUse:'Статус', stOptCurrent:'Актуальные', stOptFuture:'Будущие', stOptPrevious:'Предыдущие',
    ingredients:'Состав (INCI)*', ingHint:'Главное для анализа. Скопируй с упаковки или с сайта магазина.',
    photoLink:'Фото (ссылка)', orUpload:'или загрузить файл', paste:'Вставить', photoLoaded:'фото загружено',
    opened:'Дата открытия', expiry:'Срок годности', price:'Цена', currency:'Валюта',
    whereBuy:'Где купить', whereHint:'Заметка: магазин, цена, акция.', note:'Заметка', noteHint:'Личные пометки об ощущениях.',
    myRating:'Моя оценка', addToBag:'Добавить в косметичку', saveChanges:'Сохранить изменения', fillName:'Впиши хотя бы название',
    pasteHintToast:'Скопируй фото и нажми Ctrl+V', noClipImg:'В буфере нет изображения', photoAdded:'Фото добавлено', photoFail:'Не удалось загрузить фото',
    nothingFound:'Ничего не нашлось — впиши состав вручную', baseDown:'База недоступна — впиши состав вручную', searching:'Ищем в базе…', applied:'Данные подставлены',
    /* detail */
    card:'Карточка продукта', statusIs:'Статус', changeStatus:'Изменить статус',
    compatTitle:'Совместимость с моей кожей', compatDesc:'ИИ сравнивает состав с твоим профилем кожи и анализами. Изменил(а) профиль – нажми «Обновить анализ».',
    analyze:'Проанализировать состав', refresh:'Обновить анализ', aiThinking:'ИИ изучает состав…', fillIng:'Сначала впиши состав (INCI).',
    goodFor:'Хорошо для тебя', caution:'С осторожностью', avoid:'Лучше избегать',
    medDisc:'Это информация о косметических ингредиентах, а не медицинский совет. При проблемах с кожей обратись к дерматологу.',
    reviewTitle:'Отзывы – выжимка от ИИ', reviewDesc:'Вставь ссылки на продукт в маркетплейсах (по одной в строке). ИИ найдёт отзывы в сети и сделает выжимку с плюсами и оговорками.',
    reviewPh:'https://www.notino.pl/...\nhttps://www.rossmann.pl/...', makeReview:'Сделать выжимку', reviewThinking:'ИИ ищет и читает отзывы…',
    reviewLinksNeed:'Вставь ссылки или текст отзывов', fits:'Подходит твоей коже', praised:'Хвалят', complained:'Жалуются', reviewedPre:'выжимка по отзывам из сети, не исчерпывающая.',
    origTitle:'Проверка на оригинал', origCardDesc:'Подделку нельзя подтвердить по фото или составу. Полный чек-лист: Профиль – «Оригинальность».',
    whatBatch:'Батч-код – это код партии на упаковке/донышке. По нему можно узнать дату выпуска и срок годности.',
    checkBatch:'Проверить батч-код', whereTitle:'Где купить в Польше', whereDesc:'Скопируй название и вставь в поиск магазина.',
    copy:'Копировать', yourNote:'Твоя заметка', edit:'Редактировать', del:'Удалить', confirmDel:'Удалить этот продукт?',
    aiNoKey:'Вставь ключ Groq в php/config.php, чтобы ИИ заработал.', aiErr:'Не получилось', tryAgain:'Ещё раз',
    /* account */
    profile:'Профиль', firstName:'Имя', lastName:'Фамилия', email:'Почта', saveProfile:'Сохранить', photoLabel:'Фото профиля',
    secSkin:'Кожа', secAnalyses:'Анализы', secGallery:'Галерея', secDynamics:'Динамика', secReminders:'Напоминания', secOrig:'Оригинальность',
    skinTitle:'Профиль кожи', skinType:'Тип кожи', age:'Возраст', concerns:'Что беспокоит',
    sens:'Непереносимости и аллергены', sensHint:'ИИ особенно внимателен к этим компонентам в составе.', notes:'Заметки',
    chooseDash:'— выбрать —', custom:'＋ своё', addCustom:'Добавить своё:', savedProfile:'Профиль сохранён',
    skinNormal:'Нормальная', skinDry:'Сухая', skinOily:'Жирная', skinCombo:'Комбинированная', skinSens:'Чувствительная',
    galTitle:'Галерея кожи', galDesc:'Фото лица с датой. ИИ опишет видимые особенности кожи и поставит примерную оценку.',
    addPhoto:'Добавить фото', photoDate:'Дата фото', galEmpty:'Пока нет фото. Снимай при одинаковом свете – так лучше видна динамика.',
    expand:'Развернуть', collapse:'Свернуть', visible:'Видно', assumptions:'Предположения', tip:'Совет',
    faceDisc:'Фото хранятся в базе проекта. Это информация о коже, не медицинская диагностика.', analyzing:'Анализ…', faceFail:'Не удалось проанализировать',
    anTitle:'Анализы и заметки', anDesc:'Можно вписать результаты анализов и приложить фото бланка. Не для самодиагностики. ИИ учитывает это при анализе состава.',
    anNew:'Новая запись', anPh:'напр. железо ниже нормы; дерматолог назначил…', anAdd:'Добавить запись', anEmpty:'Пока нет записей.', anNeed:'Впиши текст или приложи фото', anAdded:'Запись добавлена',
    dynTitle:'Динамика кожи', dynDesc:'Отмечай состояние кожи по шкале 1–10. Максимум 10 точек.', chartEmpty:'Добавь хотя бы 2 отметки, чтобы увидеть линию.',
    date:'Дата', condition:'Состояние (1–10)', addPoint:'Отметить', points:'Точки на графике', max10:'Максимум 10 точек', exportPng:'Скачать PNG', exportPdf:'Скачать PDF',
    logNeed:'Укажи дату и оценку 1–10', logAdded:'Отметили', noChart:'Сначала добавь точки',
    remTitle:'Напоминания', remDesc:'Появляются плашкой наверху. Добавляй свои или убирай лишние.', addRem:'Добавить', remPh:'напр. Выпей коллаген',
    origFullTitle:'Проверка на оригинал', origFullDesc:'Подтвердить подлинность по фото нельзя, но эти шаги помогают не попасть на подделку.',
    o1:'<b>Батч-код.</b> Пробей код партии на checkcosmetic.net / checkfresh.com – покажет дату выпуска и срок.',
    o2:'<b>Где берёшь.</b> Авторизованные продавцы в Польше: Rossmann, Hebe, Notino, Sephora, Douglas, официальные сайты брендов.',
    o3:'<b>Цена.</b> Сильно дешевле рынка – почти всегда красный флаг.',
    o4:'<b>Упаковка.</b> Сверь шрифт, голограмму и качество печати с фото на официальном сайте.',
    copied:'Скопировано', deleted:'Удалено', saved:'Сохранено', added:'Добавлено', moved:'Статус изменён', copyFail:'Не удалось скопировать',
    footer:'PURAI – учебный проект. Анализ состава и кожи носит информационный характер и не заменяет дерматолога.'
  },
  pl:{
    addProduct:'Dodaj produkt', stCurrent:'Aktualne', stFuture:'Przyszłe', stPrevious:'Poprzednie',
    cat:'kategoria', catAll:'Wszystko', catSkin:'Pielęgnacja', catMakeup:'Makijaż',
    brandLbl:'Marka', allBrands:'Wszystkie', sortLbl:'Sortowanie',
    sortNew:'Po dodaniu', sortBrand:'Marka A-Z', sortType:'Typ A-Z', sortPriceUp:'Cena ↑', sortPriceDown:'Cena ↓',
    sortExpUp:'Termin ↑', sortExpDown:'Termin ↓', sortRateUp:'Ocena ↑', sortRateDown:'Ocena ↓',
    emptyTitle:'Na razie pusto', emptyCurrent:'Dodaj pierwszy produkt – wyszukaj po nazwie lub wpisz skład ręcznie.',
    emptyFuture:'Tu trafia to, co chcesz wypróbować.', emptyPrevious:'Tu trafia to, czego już nie używasz.',
    onboard:'Zacznijmy analizować Twoją pielęgnację! Kliknij ikonę iskierki w lewym górnym rogu i wypełnij profil skóry.',
    noRating:'bez oceny', match:'dopas.',
    items1:'produkt', items2:'produkty', items5:'produktów',
    newProduct:'Nowy produkt', editProduct:'Edytuj', findProduct:'Znajdź produkt',
    findHint:'Open Beauty Facts uzupełni skład i zdjęcie, jeśli się znajdzie.', search:'Szukaj',
    fName:'Nazwa*', fBrand:'Marka', fCat:'Kategoria', fType:'Typ', typeHint:'Wybierz z listy lub wpisz własny.',
    inUse:'Status', stOptCurrent:'Aktualne', stOptFuture:'Przyszłe', stOptPrevious:'Poprzednie',
    ingredients:'Skład (INCI)*', ingHint:'Najważniejsze do analizy. Skopiuj z opakowania lub ze strony sklepu.',
    photoLink:'Zdjęcie (link)', orUpload:'lub wybierz plik', paste:'Wklej', photoLoaded:'zdjęcie dodane',
    opened:'Data otwarcia', expiry:'Termin ważności', price:'Cena', currency:'Waluta',
    whereBuy:'Gdzie kupić', whereHint:'Notatka: sklep, cena, promocja.', note:'Notatka', noteHint:'Osobiste uwagi o wrażeniach.',
    myRating:'Moja ocena', addToBag:'Dodaj do kosmetyczki', saveChanges:'Zapisz zmiany', fillName:'Wpisz przynajmniej nazwę',
    pasteHintToast:'Skopiuj zdjęcie i naciśnij Ctrl+V', noClipImg:'W schowku nie ma obrazu', photoAdded:'Zdjęcie dodane', photoFail:'Nie udało się dodać zdjęcia',
    nothingFound:'Nic nie znaleziono – wpisz skład ręcznie', baseDown:'Baza niedostępna – wpisz skład ręcznie', searching:'Szukamy w bazie…', applied:'Dane uzupełnione',
    card:'Karta produktu', statusIs:'Status', changeStatus:'Zmień status',
    compatTitle:'Dopasowanie do mojej skóry', compatDesc:'AI porównuje skład z Twoim profilem skóry i wynikami badań. Zmieniłaś profil – kliknij „Odśwież analizę”.',
    analyze:'Przeanalizuj skład', refresh:'Odśwież analizę', aiThinking:'AI analizuje skład…', fillIng:'Najpierw wpisz skład (INCI).',
    goodFor:'Dobre dla Ciebie', caution:'Z ostrożnością', avoid:'Lepiej unikać',
    medDisc:'To informacja o składnikach kosmetycznych, a nie porada medyczna. Przy problemach ze skórą skonsultuj się z dermatologiem.',
    reviewTitle:'Opinie – podsumowanie AI', reviewDesc:'Wklej linki do produktu w sklepach (po jednym w wierszu). AI znajdzie opinie w sieci i zrobi podsumowanie z plusami i zastrzeżeniami.',
    reviewPh:'https://www.notino.pl/...\nhttps://www.rossmann.pl/...', makeReview:'Zrób podsumowanie', reviewThinking:'AI szuka i czyta opinie…',
    reviewLinksNeed:'Wklej linki lub tekst opinii', fits:'Pasuje do Twojej skóry', praised:'Chwalą', complained:'Narzekają', reviewedPre:'Podsumowanie opinii z sieci niepełne.',
    origTitle:'Sprawdzenie oryginalności', origCardDesc:'Podróbki nie da się potwierdzić po zdjęciu czy składzie. Pełna lista: Profil – „Oryginalność”.',
    whatBatch:'Co to batch-code: kod partii na opakowaniu/spodzie. Po nim sprawdzisz datę produkcji i termin ważności.',
    checkBatch:'Sprawdź batch-code', whereTitle:'Gdzie kupić w Polsce', whereDesc:'Skopiuj nazwę i wklej w wyszukiwarkę sklepu.',
    copy:'Kopiuj', yourNote:'Twoja notatka', edit:'Edytuj', del:'Usuń', confirmDel:'Usunąć ten produkt?',
    aiNoKey:'Wstaw klucz Groq w php/config.php, aby AI działało.', aiErr:'Nie udało się', tryAgain:'Jeszcze raz',
    profile:'Profil', firstName:'Imię', lastName:'Nazwisko', email:'E-mail', saveProfile:'Zapisz', photoLabel:'Zdjęcie profilu',
    secSkin:'Skóra', secAnalyses:'Badania', secGallery:'Galeria', secDynamics:'Dynamika', secReminders:'Przypomnienia', secOrig:'Oryginalność',
    skinTitle:'Profil skóry', skinType:'Typ skóry', age:'Wiek', concerns:'Co Cię niepokoi',
    sens:'Nietolerancje i alergeny', sensHint:'AI szczególnie zwraca uwagę na te składniki.', notes:'Notatki',
    chooseDash:'— wybierz —', custom:'＋ własne', addCustom:'Dodaj własne:', savedProfile:'Profil zapisany',
    skinNormal:'Normalna', skinDry:'Sucha', skinOily:'Tłusta', skinCombo:'Mieszana', skinSens:'Wrażliwa',
    galTitle:'Galeria skóry', galDesc:'Zdjęcia twarzy z datą. AI opisze widoczne cechy skóry i poda przybliżoną ocenę.',
    addPhoto:'Dodaj zdjęcie', photoDate:'Data zdjęcia', galEmpty:'Brak zdjęć. Rób je przy tym samym świetle – lepiej widać postęp.',
    expand:'Rozwiń', collapse:'Zwiń', visible:'Widać', assumptions:'Przypuszczenia', tip:'Wskazówka',
    faceDisc:'Zdjęcia są w bazie projektu. To informacja o skórze, nie diagnoza medyczna.', analyzing:'Analiza…', faceFail:'Nie udało się przeanalizować',
    anTitle:'Badania i notatki', anDesc:'Możesz wpisać wyniki badań i dołączyć zdjęcie. Nie do samodiagnozy. AI uwzględnia to przy analizie składu.',
    anNew:'Nowy wpis', anPh:'np. żelazo poniżej normy; dermatolog zalecił…', anAdd:'Dodaj wpis', anEmpty:'Brak wpisów.', anNeed:'Wpisz tekst lub dołącz zdjęcie', anAdded:'Wpis dodany',
    dynTitle:'Dynamika skóry', dynDesc:'Oznaczaj stan skóry w skali 1–10. Maksymalnie 10 punktów.', chartEmpty:'Dodaj co najmniej 2 oznaczenia, aby zobaczyć wykres.',
    date:'Data', condition:'Stan (1–10)', addPoint:'Oznacz', points:'Punkty na wykresie', max10:'Maksymalnie 10 punktów', exportPng:'Pobierz PNG', exportPdf:'Pobierz PDF',
    logNeed:'Podaj datę i ocenę 1–10', logAdded:'Oznaczono', noChart:'Najpierw dodaj punkty',
    remTitle:'Przypomnienia', remDesc:'Pojawiają się na pasku na górze. Dodawaj własne lub usuwaj.', addRem:'Dodaj', remPh:'np. Wypij kolagen',
    origFullTitle:'Sprawdzenie oryginalności', origFullDesc:'Autentyczności nie da się potwierdzić po zdjęciu, ale te kroki pomagają uniknąć podróbki.',
    o1:'<b>Batch-code.</b> Sprawdź kod partii na checkcosmetic.net / checkfresh.com – pokaże datę produkcji i termin.',
    o2:'<b>Gdzie kupujesz.</b> Autoryzowani sprzedawcy w Polsce: Rossmann, Hebe, Notino, Sephora, Douglas, oficjalne strony marek.',
    o3:'<b>Cena.</b> Dużo taniej niż na rynku – prawie zawsze czerwona flaga.',
    o4:'<b>Opakowanie.</b> Porównaj czcionkę, hologram i jakość druku ze zdjęciem na oficjalnej stronie.',
    copied:'Skopiowano', deleted:'Usunięto', saved:'Zapisano', added:'Dodano', moved:'Status zmieniony', copyFail:'Nie udało się skopiować',
    footer:'PURAI – projekt edukacyjny. Analiza składu i skóry ma charakter informacyjny i nie zastępuje dermatologa.'
  }
};

/* ---------- пресеты ---------- */
const CONCERNS={ru:["Акне","Постакне","Чёрные точки","Расширенные поры","Пигментация","Покраснения","Купероз","Обезвоженность","Сухость","Жирность","Чувствительность","Морщины","Тусклость","Отёчность"],
  pl:["Trądzik","Przebarwienia potrądzikowe","Zaskórniki","Rozszerzone pory","Przebarwienia","Zaczerwienienia","Kuperoza","Odwodnienie","Suchość","Tłustość","Wrażliwość","Zmarszczki","Szarość","Opuchlizna"]};
const SENS={ru:["Отдушки","Спирт denat.","Эфирные масла","Ретиноиды","Кислоты AHA/BHA","Силиконы","SLS/SLES","Ланолин","Никель","Орехи"],
  pl:["Substancje zapachowe","Alkohol denat.","Olejki eteryczne","Retinoidy","Kwasy AHA/BHA","Silikony","SLS/SLES","Lanolina","Nikiel","Orzechy"]};
const TYPES={
  skincare:{
    ru:["Очищение","Тонер","Сыворотка","Крем","Маска","SPF","Эксфолиант","Масло","Мист","Патчи","Гель для умывания"],
    pl:["Oczyszczanie","Tonik","Serum","Krem","Maseczka","SPF","Eksfoliant","Olejek","Mgiełka","Płatki", "Żel do mycia twarzy"]
  },
  makeup:{
    ru:["Тон","Консилер","Пудра","Румяна","Хайлайтер","Помада","Блеск","Тушь","Тени","Подводка","Праймер","Бровь"],
    pl:["Podkład","Korektor","Puder","Róż","Rozświetlacz","Pomadka","Błyszczyk","Tusz","Cienie","Eyeliner","Primer","Brwi"]
  }
};
const DEF_REM={ru:["Выпей водички","Нанеси SPF перед выходом","Не трогай лицо руками!","Смой макияж перед сном","Поменяй наволочку","Сделай фото для галереи"],
  pl:["Napij się wody","Nałóż SPF przed wyjściem","Nie dotykaj twarzy rękami!","Zmyj makijaż przed snem","Zmień poszewkę","Zrób zdjęcie do galerii"]};
const AVATARS=[{id:'a1',img:'assets/avatar1.png'},{id:'a2',img:'assets/avatar2.png'},{id:'a3',img:'assets/avatar3.png'},{id:'a4',img:'assets/avatar4.png'}];

/* ---------- состояние ---------- */
let lang='ru';
let profile={firstName:'',lastName:'',email:'',avatar:'a1',skinType:'',age:'',concerns:[],sensitivities:[],notes:'',reminders:[],gallery:[],analyses:[],log:[],lang:'ru'};
let products=[];
let fStatus='current', fCat='all', fBrand='all', fSort='new';
let tmpProd=null, skinDraft={concerns:[],sensitivities:[]}, pasteTarget=null, galPasted='', anPasted='';

/* ---------- утилиты ---------- */
const $=s=>document.querySelector(s);
const t=k=>(T[lang]&&T[lang][k]!=null)?T[lang][k]:(T.ru[k]!=null?T.ru[k]:k);
const esc=s=>(s==null?'':String(s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function toast(m){const x=$('#toast');x.textContent=m;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200);}
function plural(n){n=Math.abs(n)%100;const x=n%10;if(n>10&&n<20)return t('items5');if(x>1&&x<5)return t('items2');if(x===1)return t('items1');return t('items5');}
function fmtDate(d){try{return new Date(d).toLocaleDateString(lang==='pl'?'pl':'ru',{day:'numeric',month:'short',year:'numeric'});}catch(e){return d;}}
function expiryInfo(date){if(!date)return null;const d=new Date(date+'-01'),now=new Date();const m=(d.getFullYear()-now.getFullYear())*12+(d.getMonth()-now.getMonth());const x=d.toLocaleDateString(lang==='pl'?'pl':'ru',{month:'short',year:'2-digit'});if(m<0)return{cls:'bad',txt:lang==='pl'?'po terminie':'просрочено'};if(m<=2)return{cls:'soon',txt:(lang==='pl'?'do ':'до ')+x};return{cls:'',txt:(lang==='pl'?'do ':'до ')+x};}
function ringColor(p){if(p==null)return 'var(--pink-2)';if(p>=70)return 'var(--good)';if(p>=45)return 'var(--caution)';return 'var(--avoid)';}
function matchBg(p){if(p==null)return 'var(--pink-soft)';if(p>=70)return 'var(--good-bg)';if(p>=45)return 'var(--caution-bg)';return 'var(--avoid-bg)';}
function matchTx(p){if(p==null)return 'var(--pink-deep)';if(p>=70)return 'var(--good)';if(p>=45)return 'var(--caution)';return 'var(--avoid)';}
function copyText(s){const ok=()=>toast(t('copied'));const bad=()=>fallbackCopy(s);if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(s).then(ok).catch(bad);}else bad();}
function fallbackCopy(s){try{const ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();document.execCommand('copy');document.body.removeChild(ta);toast(t('copied'));}catch(e){toast(t('copyFail'));}}
function dataURLparts(d){const m=(d||'').match(/^data:([^;]+);base64,(.*)$/);return m?{media:m[1],data:m[2]}:null;}
function fileToSmall(file,max,q){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const sc=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);c.getContext('2d').drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q||0.8));};img.onerror=rej;img.src=r.result;};r.onerror=rej;r.readAsDataURL(file);});}
function photoBox(src,iconKey,cls){return `<div class="${cls}"><span class="ph">${I[iconKey]}</span>${src?`<img src="${esc(src)}" referrerpolicy="no-referrer" onerror="this.remove()">`:''}</div>`;}

/* ---------- слой данных (PHP + резерв localStorage) ---------- */
const API='php/data.php';
async function api(action,payload){const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({action},payload||{}))});if(!r.ok)throw new Error('http '+r.status);return r.json();}
function saveLocal(){try{localStorage.setItem('purai_state',JSON.stringify({profile,products}));}catch(e){}}
async function save(action,payload){try{await api(action,payload);}catch(e){saveLocal();}}
async function bootstrap(){
  try{const d=await api('bootstrap');profile=Object.assign(profile,d.profile||{});products=d.products||[];}
  catch(e){try{const s=JSON.parse(localStorage.getItem('purai_state')||'null');if(s){profile=Object.assign(profile,s.profile||{});products=s.products||[];}}catch(_){}}
  if(!profile.reminders||!profile.reminders.length)profile.reminders=[...DEF_REM[profile.lang==='pl'?'pl':'ru']];
  lang=profile.lang==='pl'?'pl':'ru';
}

/* ---------- ИИ через PHP ---------- */
async function callAI(type,payload){
  const r=await fetch('php/ai.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({type,lang},payload))});
  const d=await r.json();
  if(d.error){throw new Error(d.error==='nokey'?t('aiNoKey'):(d.message||d.error));}
  return parseJSON(d.text);
}
function parseJSON(x){x=(x||'').replace(/```json/gi,'').replace(/```/g,'').trim();const s=x.indexOf('{'),e=x.lastIndexOf('}');if(s>=0&&e>=0)x=x.slice(s,e+1);return JSON.parse(x);}
function profileText(){return `Тип кожи: ${profile.skinType||'—'}. Возраст: ${profile.age||'—'}. Беспокоит: ${(profile.concerns||[]).join(', ')||'—'}. Непереносимости: ${(profile.sensitivities||[]).join(', ')||'—'}. Заметки: ${profile.notes||'—'}.`;}
function analysesText(){return (profile.analyses||[]).map(a=>`${a.date}: ${a.text}`).join('\n');}

/* ---------- язык ---------- */
function setLang(l){lang=l;profile.lang=l;saveProfile();applyLang();}
async function saveProfile(){await save('saveProfile',{profile});}
function applyLang(){
  [...$('#langToggle').children].forEach(b=>b.classList.toggle('on',b.dataset.l===lang));
  $('#addLabel').textContent=t('addProduct');
  $('#footer').innerHTML=`${esc(t('footer'))} <span style="color:var(--pink)">♥</span>`;
  document.documentElement.lang=lang;
  renderReminder(); renderFilters(); renderGrid();
}

function translateType(subtype,cat){
  if(!subtype)return '';
  const c=TYPES[cat]||TYPES.skincare;
  const idxRu=c.ru.indexOf(subtype);
  const idxPl=c.pl.indexOf(subtype);
  if(idxRu>=0)return lang==='pl'?c.pl[idxRu]:c.ru[idxRu];
  if(idxPl>=0)return lang==='ru'?c.ru[idxPl]:c.pl[idxPl];
  return subtype;
}

/* ---------- напоминания ---------- */
function renderReminder(){
  const el=$('#reminder');
  if(!profile.skinType){
    el.style.display='flex';
    el.innerHTML=`<span style="color:var(--pink)">♥</span><span class="r-txt">${esc(t('onboard'))}</span>`;
    return;
  }
  const hidden=new Set(profile.hiddenRem||[]);
  const defaults=(DEF_REM[lang]||DEF_REM.ru).filter((_,i)=>!hidden.has(i));
  const custom=(profile.reminders||[]).filter(r=>!DEF_REM.ru.includes(r)&&!DEF_REM.pl.includes(r));
  const rs=[...defaults,...custom];
  if(!rs.length){el.style.display='none';return;}
  el.style.display='flex';
  const r=rs[Math.floor(Math.random()*rs.length)];
  el.innerHTML=`<span style="color:var(--pink)">♥</span><span class="r-txt">${esc(r)}</span>
    <button onclick="renderReminder()" title="${esc(t('addRem'))}">${I.refresh}</button>
    <button onclick="document.getElementById('reminder').style.display='none'">${I.close}</button>`;
}

/* ---------- фильтры ---------- */
function renderFilters(){
  const brands=[...new Set(products.map(p=>p.brand).filter(Boolean))].sort();
  $('#filtersBar').innerHTML=`
    <div class="seg" id="segStatus">
      <button data-v="current" class="${fStatus==='current'?'on':''}" onclick="setStatus('current')">${esc(t('stCurrent'))}</button>
      <button data-v="future" class="${fStatus==='future'?'on':''}" onclick="setStatus('future')">${esc(t('stFuture'))}</button>
      <button data-v="previous" class="${fStatus==='previous'?'on':''}" onclick="setStatus('previous')">${esc(t('stPrevious'))}</button>
    </div>
    <span class="fl-label">${esc(t('cat'))}</span>
    <div class="seg" id="segCat">
      <button data-v="all" class="${fCat==='all'?'on':''}" onclick="setCat('all')">${esc(t('catAll'))}</button>
      <button data-v="skincare" class="${fCat==='skincare'?'on':''}" onclick="setCat('skincare')">${esc(t('catSkin'))}</button>
      <button data-v="makeup" class="${fCat==='makeup'?'on':''}" onclick="setCat('makeup')">${esc(t('catMakeup'))}</button>
    </div>
    <select class="sel" id="selBrand" onchange="fBrand=this.value;renderGrid()">
      <option value="all">${esc(t('allBrands'))}</option>
      ${brands.map(b=>`<option value="${esc(b)}" ${fBrand===b?'selected':''}>${esc(b)}</option>`).join('')}
    </select>
    <select class="sel" id="selSort" onchange="fSort=this.value;renderGrid()">
      ${[['new','sortNew'],['brand','sortBrand'],['type','sortType'],['priceUp','sortPriceUp'],['priceDown','sortPriceDown'],['expUp','sortExpUp'],['expDown','sortExpDown'],['rateUp','sortRateUp'],['rateDown','sortRateDown']]
        .map(([v,k])=>`<option value="${v}" ${fSort===v?'selected':''}>${esc(t(k))}</option>`).join('')}
    </select>`;
}
function setStatus(v){fStatus=v;renderGrid();renderFilters();}
function setCat(v){fCat=v;renderGrid();renderFilters();}

/* ---------- сетка ---------- */
function sortList(list){
  const a=[...list];
  const num=(x,d)=>x==null||x===''?d:parseFloat(x);
  switch(fSort){
    case 'brand':a.sort((x,y)=>(x.brand||'').localeCompare(y.brand||''));break;
    case 'type':a.sort((x,y)=>(x.subtype||'').localeCompare(y.subtype||''));break;
    case 'priceUp':a.sort((x,y)=>num(x.price,1e12)-num(y.price,1e12));break;
    case 'priceDown':a.sort((x,y)=>num(y.price,-1)-num(x.price,-1));break;
    case 'expUp':a.sort((x,y)=>(x.expiry||'9999').localeCompare(y.expiry||'9999'));break;
    case 'expDown':a.sort((x,y)=>(y.expiry||'').localeCompare(x.expiry||''));break;
    case 'rateUp':a.sort((x,y)=>num(x.rating,99)-num(y.rating,99));break;
    case 'rateDown':a.sort((x,y)=>num(y.rating,-1)-num(x.rating,-1));break;
    default:a.sort((x,y)=>(y.createdAt||0)-(x.createdAt||0));
  }
  return a;
}
function renderGrid(){
  let list=products.filter(p=>(p.status||'current')===fStatus&&(fCat==='all'||p.category===fCat)&&(fBrand==='all'||p.brand===fBrand));
  list=sortList(list);
  $('#secTitle').textContent=fStatus==='current'?t('stCurrent'):fStatus==='future'?t('stFuture'):t('stPrevious');
  $('#prodCount').textContent=list.length?`${list.length} ${plural(list.length)}`:'';
  const g=$('#grid');
  if(!list.length){
    const msg=fStatus==='previous'?t('emptyPrevious'):fStatus==='future'?t('emptyFuture'):t('emptyCurrent');
    g.innerHTML=`<div class="empty"><div class="e-ic">${fCat==='makeup'?I.makeup:I.bottle}</div><h3>${esc(t('emptyTitle'))}</h3><p>${esc(msg)}</p><button class="btn btn-primary" onclick="openAdd()">${I.plus}<span>${esc(t('addProduct'))}</span></button></div>`;
    return;
  }
  g.innerHTML=list.map(p=>{
    const exp=expiryInfo(p.expiry);
    const m=p.analysis&&p.analysis.compatibility!=null?p.analysis.compatibility:null;
    const typeLabel=translateType(p.subtype,p.category)||(p.category==='makeup'?t('catMakeup'):t('catSkin'));
    const price=(p.price!=null&&p.price!=='')?`<div class="b-price">${(+p.price).toFixed(2)} ${esc(p.currency||'zł')}</div>`:'';
    return `<div class="card ${(p.status||'current')==='previous'?'prev':''}" onclick="openDetail('${p.id}')">
      ${photoBox(p.photo,p.category==='makeup'?'makeup':'bottle','thumb')}
      <span class="cat-chip">${p.category==='makeup'?t('catMakeup'):t('catSkin')}</span>
      ${exp?`<span class="exp-chip ${exp.cls}">${esc(exp.txt)}</span>`:''}
      <div class="body">
        <div class="b-type">${esc(typeLabel)}</div>
        <div class="b-name">${esc(p.name)}</div>
        ${price}
        <div class="b-foot">
          <span class="rate">${p.rating?('★ '+p.rating+'/10'):`<span class="none">${esc(t('noRating'))}</span>`}</span>
          ${m!=null?`<span class="match-dot" style="background:${matchBg(m)};color:${matchTx(m)}">${m}% ${esc(t('match'))}</span>`:''}
        </div>
      </div></div>`;
  }).join('');
}

/* ---------- модалки ---------- */
function showModal(html){$('#modal').innerHTML=html;$('#overlay').classList.add('open');document.body.style.overflow='hidden';}
function closeModal(){$('#overlay').classList.remove('open');document.body.style.overflow='';pasteTarget=null;}
$('#overlay').addEventListener('click',e=>{if(e.target===$('#overlay'))closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

/* ============================================================
   ДОБАВЛЕНИЕ / РЕДАКТИРОВАНИЕ ПРОДУКТА
   ============================================================ */
function openAdd(editId){
  const edit=editId?products.find(p=>p.id===editId):null;
  tmpProd=edit?JSON.parse(JSON.stringify(edit)):{id:uid(),name:'',brand:'',category:'skincare',subtype:'',status:'current',ingredients:'',photo:'',rating:null,price:null,currency:'zł',expiry:'',opened:'',where:'',note:'',reviewLinks:'',analysis:null,reviewSummary:null,createdAt:Date.now()};
  showModal(`
    <div class="m-head"><h2>${esc(edit?t('editProduct'):t('newProduct'))}</h2><button class="m-close" onclick="closeModal()">${I.close}</button></div>
    <div class="m-body">
      ${edit?'':`<div class="field"><label>${esc(t('findProduct'))}</label><span class="hint">${esc(t('findHint'))}</span>
        <div class="search-wrap"><input id="fSearch" placeholder="CeraVe foaming cleanser" onkeydown="if(event.key==='Enter')doSearch()"><button class="btn btn-soft" onclick="doSearch()">${I.search}<span>${esc(t('search'))}</span></button></div>
        <div class="results" id="fResults"></div></div>`}
      <div class="row2">
        <div class="field"><label>${esc(t('fName'))}</label><input id="pName" value="${esc(tmpProd.name)}"></div>
        <div class="field"><label>${esc(t('fBrand'))}</label><input id="pBrand" value="${esc(tmpProd.brand)}"></div>
      </div>
      <div class="row2">
        <div class="field"><label>${esc(t('fCat'))}</label><select class="sel" id="pCat" onchange="fillTypeList()"><option value="skincare" ${tmpProd.category==='skincare'?'selected':''}>${esc(t('catSkin'))}</option><option value="makeup" ${tmpProd.category==='makeup'?'selected':''}>${esc(t('catMakeup'))}</option></select></div>
        <div class="field"><label>${esc(t('fType'))}</label><input id="pSub" list="typeList" value="${esc(tmpProd.subtype)}"><span class="hint">${esc(t('typeHint'))}</span><datalist id="typeList"></datalist></div>
      </div>
      <div class="field"><label>${esc(t('inUse'))}</label><select class="sel" id="pStatus">
        <option value="current" ${tmpProd.status==='current'?'selected':''}>${esc(t('stOptCurrent'))}</option>
        <option value="future" ${tmpProd.status==='future'?'selected':''}>${esc(t('stOptFuture'))}</option>
        <option value="previous" ${tmpProd.status==='previous'?'selected':''}>${esc(t('stOptPrevious'))}</option></select></div>
      <div class="field"><label>${esc(t('ingredients'))}</label><span class="hint">${esc(t('ingHint'))}</span><textarea id="pIng" placeholder="Aqua, Glycerin, Niacinamide...">${esc(tmpProd.ingredients)}</textarea></div>
      <div class="field"><label>${esc(t('photoLink'))}</label><input id="pPhoto" value="${esc(tmpProd.photo&&!tmpProd.photo.startsWith('data:')?tmpProd.photo:'')}" placeholder="https://..." oninput="tmpProd.photo=this.value.trim()"></div>
      <div class="field"><label>${esc(t('orUpload'))}</label>
        <div class="file-row"><input type="file" accept="image/*" onchange="pickProdFile(event)"><button class="btn btn-soft" type="button" onclick="pasteImage('product')">${I.copy}<span>${esc(t('paste'))}</span></button></div></div>
      <div class="row2">
        <div class="field"><label>${esc(t('opened'))}</label><input id="pOpened" type="date" value="${esc(tmpProd.opened)}"></div>
        <div class="field"><label>${esc(t('expiry'))}</label><input id="pExp" type="month" placeholder="2026-08" value="${esc(tmpProd.expiry)}"></div>
      </div>
      <div class="field"><label>${esc(t('price'))}</label><div class="price-row"><input id="pPrice" type="number" min="0" step="0.01" value="${tmpProd.price!=null?esc(tmpProd.price):''}" placeholder="0.00"><input id="pCur" value="${esc(tmpProd.currency||'zł')}"></div></div>
      <div class="field"><label>${esc(t('whereBuy'))}</label><span class="hint">${esc(t('whereHint'))}</span><textarea id="pWhere" placeholder="Rossmann −20%">${esc(tmpProd.where||'')}</textarea></div>
      <div class="field"><label>${esc(t('note'))}</label><span class="hint">${esc(t('noteHint'))}</span><textarea id="pNote" placeholder="">${esc(tmpProd.note||'')}</textarea></div>
      <div class="field"><label>${esc(t('myRating'))}</label><div class="rate-pick" id="pRate">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<button type="button" class="${tmpProd.rating==n?'on':''}" onclick="pickRate(${n})">${n}</button>`).join('')}</div></div>
      <button class="btn btn-primary btn-block" onclick="commitProd('${editId||''}')">${esc(edit?t('saveChanges'):t('addToBag'))}</button>
    </div>`);
  fillTypeList();
}
function fillTypeList(){const c=$('#pCat').value;$('#typeList').innerHTML=(TYPES[c][lang]||TYPES[c].ru).map(x=>`<option value="${esc(x)}">`).join('');}
function pickRate(n){tmpProd.rating=n;[...$('#pRate').children].forEach((b,i)=>b.classList.toggle('on',i+1===n));}
async function pickProdFile(e){const f=e.target.files[0];if(!f)return;try{tmpProd.photo=await fileToSmall(f,460,0.82);$('#pPhoto').value='';$('#pPhoto').placeholder=t('photoLoaded');toast(t('photoAdded'));}catch(_){toast(t('photoFail'));}}
async function doSearch(){
  const q=$('#fSearch').value.trim();if(!q)return;const box=$('#fResults');box.innerHTML=`<div class="loading-row"><div class="spinner"></div>${esc(t('searching'))}</div>`;
  try{
    const url=`https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=8&fields=product_name,brands,image_front_small_url,ingredients_text`;
    const data=await(await fetch(url)).json();const items=(data.products||[]).filter(p=>p.product_name);
    if(!items.length){box.innerHTML=`<div class="loading-row">${esc(t('nothingFound'))}</div>`;return;}
    window._si=items;
    box.innerHTML=items.map((p,i)=>`<div class="result" onclick="applyResult(${i})">${p.image_front_small_url?`<img src="${esc(p.image_front_small_url)}" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">`:`<div style="width:42px;height:42px;border-radius:9px;background:var(--pink-soft-2)"></div>`}<div><div class="r-name">${esc(p.product_name)}</div><div class="r-brand">${esc(p.brands||'—')}</div></div></div>`).join('');
  }catch(e){box.innerHTML=`<div class="loading-row">${esc(t('baseDown'))}</div>`;}
}
function applyResult(i){const p=window._si[i];$('#pName').value=p.product_name||'';$('#pBrand').value=(p.brands||'').split(',')[0]||'';if(p.ingredients_text)$('#pIng').value=p.ingredients_text;if(p.image_front_small_url){tmpProd.photo=p.image_front_small_url;$('#pPhoto').value=p.image_front_small_url;}toast(t('applied'));}
async function commitProd(editId){
  tmpProd.name=$('#pName').value.trim();tmpProd.brand=$('#pBrand').value.trim();tmpProd.category=$('#pCat').value;tmpProd.subtype=$('#pSub').value.trim();
  tmpProd.status=$('#pStatus').value;tmpProd.ingredients=$('#pIng').value.trim();tmpProd.expiry=$('#pExp').value;tmpProd.opened=$('#pOpened').value;
  tmpProd.where=$('#pWhere').value.trim();tmpProd.note=$('#pNote').value.trim();
  const pr=$('#pPrice').value;tmpProd.price=pr===''?null:parseFloat(pr);tmpProd.currency=$('#pCur').value.trim()||'zł';
  const up=$('#pPhoto').value.trim();if(up)tmpProd.photo=up;
  if(!tmpProd.name){toast(t('fillName'));return;}
  const old=editId?products.find(p=>p.id===editId):null;
  if(old&&old.ingredients!==tmpProd.ingredients)tmpProd.analysis=null;
  if(editId){const i=products.findIndex(p=>p.id===editId);products[i]=tmpProd;}else products.unshift(tmpProd);
  await save('saveProduct',{product:tmpProd});renderFilters();renderGrid();closeModal();toast(editId?t('saved'):t('added'));
}

/* ============================================================
   КАРТОЧКА ПРОДУКТА
   ============================================================ */
function plStores(q){const e=encodeURIComponent(q);return[['Rossmann',`https://www.rossmann.pl/szukaj?Search=${e}`],['Hebe',`https://www.hebe.pl/search?query=${e}`],['Notino',`https://www.notino.pl/search/?q=${e}`],['Sephora',`https://www.sephora.pl/search?q=${e}`],['Douglas',`https://www.douglas.pl/pl/search?q=${e}`]];}
function openDetail(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  const exp=expiryInfo(p.expiry);const typeLabel=translateType(p.subtype,p.category)||(p.category==='makeup'?t('catMakeup'):t('catSkin'));
  const q=((p.brand?p.brand+' ':'')+p.name).trim();
  showModal(`
    <div class="m-head"><h2 style="font-size:18px">${esc(t('card'))}</h2><button class="m-close" onclick="closeModal()">${I.close}</button></div>
    <div class="m-body">
      <div class="pd-hero">
        ${photoBox(p.photo,p.category==='makeup'?'makeup':'bottle','pd-img')}
        <div style="flex:1;min-width:0">
          <div class="pd-type">${esc(typeLabel)}</div><h2>${esc(p.name)}</h2>
          ${p.brand?`<div class="pd-brand">${esc(p.brand)}</div>`:''}
          <div class="pd-meta">
            <span class="tag">${p.category==='makeup'?t('catMakeup'):t('catSkin')}</span>
            ${p.price!=null&&p.price!==''?`<span class="tag">${(+p.price).toFixed(2)} ${esc(p.currency||'zł')}</span>`:''}
            ${p.rating?`<span class="tag gold">★ ${p.rating}/10</span>`:''}
            ${p.opened?`<span class="tag">${lang==='pl'?'otw.':'откр.'}: ${esc(fmtDate(p.opened))}</span>`:''}
            ${exp?`<span class="tag ${exp.cls?'warn':''}">${lang==='pl'?'termin':'срок'}: ${esc(exp.txt)}</span>`:''}
          </div>
        </div>
      </div>

      <div class="status-row">
        <span class="st-l">${esc(t('statusIs'))}</span>
        <select class="sel" onchange="changeStatus('${id}',this.value)">
          <option value="current" ${(p.status||'current')==='current'?'selected':''}>${esc(t('stOptCurrent'))}</option>
          <option value="future" ${p.status==='future'?'selected':''}>${esc(t('stOptFuture'))}</option>
          <option value="previous" ${p.status==='previous'?'selected':''}>${esc(t('stOptPrevious'))}</option>
        </select>
      </div>

      <div class="panel">
        <div class="p-title">${I.skin}${esc(t('compatTitle'))}</div>
        <div class="p-desc">${esc(t('compatDesc'))}</div>
        <div id="matchBox">${p.analysis?renderMatch(p.analysis,id):`<button class="btn btn-primary btn-block" onclick="runMatch('${id}')">${esc(t('analyze'))}</button>`}</div>
      </div>

     <!-- 
     <div class="panel">
        <div class="p-title"><span style="color:var(--pink)">♥</span> ${esc(t('reviewTitle'))}</div>
        <div class="p-desc">${esc(t('reviewDesc'))}</div>
        <div class="field"><textarea id="revLinks" placeholder="${esc(t('reviewPh'))}">${esc(p.reviewLinks||'')}</textarea></div>
        <button class="btn btn-soft btn-block" style="margin-top:8px" onclick="runReview('${id}')">${esc(t('makeReview'))}</button>
        <div id="revBox" style="margin-top:12px">${p.reviewSummary?renderReview(p.reviewSummary):''}</div>
      </div>
      -->

      <div class="panel">
        <div class="p-title">${I.shield}${esc(t('origTitle'))}</div>
        <div class="p-desc">${esc(t('origCardDesc'))}</div>
        <div class="batch-info">${esc(t('whatBatch'))}</div>
        <a href="https://checkcosmetic.net/" target="_blank" rel="noopener" style="text-decoration:none"><span style="display:inline-block;background:var(--pink-soft);border:1.5px solid var(--line);border-radius:11px;padding:9px 13px;font-weight:700;font-size:13px;color:var(--pink-deep)">${esc(t('checkBatch'))} →</span></a>
      </div>

      <div class="panel">
        <div class="p-title">${I.search}${esc(t('whereTitle'))}</div>
        <div class="p-desc">${esc(t('whereDesc'))}</div>
        <div class="copy-row"><span class="cr-txt">${esc(q)}</span><button class="btn btn-soft" onclick="copyText('${esc(q).replace(/'/g,"\\'")}')">${I.copy}<span>${esc(t('copy'))}</span></button></div>
        <div class="store-links">${plStores(q).map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener">${n} <img src="assets/arrow-dark.svg" class="arrow-ic"><img src="assets/arrow-pink.svg" class="arrow-ic arrow-hover"> </a>`).join('')}</div>
        ${p.where?`<div style="font-size:13px;font-weight:600;color:var(--muted);margin-top:11px">${esc(t('yourNote'))}: ${esc(p.where)}</div>`:''}
      </div>

      <div class="detail-actions">
        <button class="btn btn-ghost" onclick="openAdd('${id}')">${I.edit}<span>${esc(t('edit'))}</span></button>
        <button class="danger-link" onclick="delProd('${id}')">${I.trash}<span>${esc(t('del'))}</span></button>
      </div>
    </div>`);
}
async function changeStatus(id,v){const p=products.find(x=>x.id===id);p.status=v;await save('saveProduct',{product:p});renderFilters();renderGrid();toast(t('moved'));}
function renderMatch(a,id){
  if(a.compatibility==null&&(!a.good||!a.good.length))return `<div class="disclaimer">${esc(t('analyze'))}: ${esc(t('tryAgain'))}</div><button class="btn btn-primary btn-block" style="margin-top:10px" onclick="runMatch('${id}')">${esc(t('analyze'))}</button>`;
  const pct=a.compatibility==null?0:Math.max(0,Math.min(100,a.compatibility));
  const groups=[['good',t('goodFor'),a.good],['caution',t('caution'),a.caution],['avoid',t('avoid'),a.avoid]];
  return `<div class="match-top">
      <div class="ring" style="--pct:${pct};--rc-color:${ringColor(a.compatibility)}"><div class="ring-in"><div class="ring-num" style="color:${matchTx(a.compatibility)}">${a.compatibility==null?'—':pct}</div><div class="ring-lbl">${esc(t('match'))}</div></div></div>
      <div style="flex:1"><div class="match-verdict">${esc(a.verdict||'')}</div><div class="match-summary">${esc(a.summary||'')}</div></div>
    </div>
    ${groups.map(([c,title,arr])=>(arr&&arr.length)?`<div class="ing-group ${c}"><div class="g-h">${esc(title)}</div><div class="ing-list">${arr.map(x=>`<div class="ing-item"><b>${esc(x.name)}</b> — <span>${esc(x.why)}</span></div>`).join('')}</div></div>`:'').join('')}
    <div class="disclaimer">${esc(t('medDisc'))}</div>
    <button class="btn btn-soft btn-block" style="margin-top:12px" onclick="runMatch('${id}')">${I.refresh}<span>${esc(t('refresh'))}</span></button>`;
}
function renderReview(r){
  const cmap={yes:'var(--good)',rather_yes:'var(--good)',unclear:'var(--caution)',rather_no:'var(--avoid)',no:'var(--avoid)'};
  const c=cmap[r.fitLevel]||'var(--pink-deep)';
  return `<span class="fit-badge" style="background:${c}1f;color:${c}">${esc(t('fits'))}: ${esc(r.fitsYourSkin||'—')}</span>
    <div style="font-size:13.5px;font-weight:500;color:var(--ink)">${esc(r.summary||'')}</div>
    <div class="prc-row">
      ${r.pros&&r.pros.length?`<div class="prc pos"><div class="prc-h">${esc(t('praised'))}</div><ul>${r.pros.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
      ${r.cons&&r.cons.length?`<div class="prc neg"><div class="prc-h">${esc(t('complained'))}</div><ul>${r.cons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
    </div>
    ${r.reviewed?`<div class="disclaimer" style="margin-top:10px">${esc(r.reviewed)} · ${esc(t('reviewedPre'))}</div>`:''}`;
}
async function runMatch(id){
  const p=products.find(x=>x.id===id);
  if(!p.ingredients){$('#matchBox').innerHTML=`<div class="disclaimer">${esc(t('fillIng'))}</div>`;return;}
  $('#matchBox').innerHTML=`<div class="loading-row"><div class="spinner"></div>${esc(t('aiThinking'))}</div>`;
  try{const a=await callAI('ingredients',{profileText:profileText(),analysesText:analysesText(),ingredients:p.ingredients});p.analysis=a;await save('saveProduct',{product:p});$('#matchBox').innerHTML=renderMatch(a,id);renderGrid();}
  catch(e){$('#matchBox').innerHTML=`<div class="disclaimer">${esc(e.message)}</div><button class="btn btn-soft btn-block" style="margin-top:10px" onclick="runMatch('${id}')">${esc(t('tryAgain'))}</button>`;}
}
async function runReview(id){
  const p=products.find(x=>x.id===id);const input=$('#revLinks').value.trim();if(!input){toast(t('reviewLinksNeed'));return;}
  p.reviewLinks=input;$('#revBox').innerHTML=`<div class="loading-row"><div class="spinner"></div>${esc(t('reviewThinking'))}</div>`;
  try{const r=await callAI('review',{productName:(p.brand?p.brand+' ':'')+p.name,links:input,profileText:profileText()});p.reviewSummary=r;await save('saveProduct',{product:p});$('#revBox').innerHTML=renderReview(r);}
  catch(e){$('#revBox').innerHTML=`<div class="disclaimer">${esc(e.message)}</div>`;}
}
async function delProd(id){if(!confirm(t('confirmDel')))return;products=products.filter(p=>p.id!==id);await save('deleteProduct',{id});renderFilters();renderGrid();closeModal();toast(t('deleted'));}

/* ============================================================
   ПРОФИЛЬ (аккаунт) — вертикальное меню + разделы
   ============================================================ */
function avatarHTML(id,size){const a=AVATARS.find(x=>x.id===id)||AVATARS[0];const s=size||64;return `<div class="avatar" style="width:${s}px;height:${s}px"><img src="${a.img}" style="width:100%;height:100%;border-radius:50%;object-fit:cover"></div>`;}
function openAccount(){
  showModal(`
    <div class="m-head"><h2>${esc(t('profile'))}</h2><button class="m-close" onclick="closeModal()">${I.close}</button></div>
    <div class="m-body">
      <div class="acc-head">${avatarHTML(profile.avatar)}<div><div class="acc-name">${esc(((profile.firstName||'')+' '+(profile.lastName||'')).trim()||t('profile'))}</div><div class="acc-mail">${esc(profile.email||'')}</div></div></div>
      <div class="field"><label>${esc(t('photoLabel'))}</label><div class="avatar-pick">${AVATARS.map(a=>`<div class="avatar-opt ${profile.avatar===a.id?'on':''}" onclick="pickAvatar('${a.id}')"><img src="${a.img}" style="width:100%;height:100%;border-radius:50%;object-fit:cover"></div>`).join('')}</div></div>
      <div class="row2">
        <div class="field"><label>${esc(t('firstName'))}</label><input id="acFn" value="${esc(profile.firstName||'')}"></div>
        <div class="field"><label>${esc(t('lastName'))}</label><input id="acLn" value="${esc(profile.lastName||'')}"></div>
      </div>
      <div class="field"><label>${esc(t('email'))}</label><input id="acEm" type="email" value="${esc(profile.email||'')}"></div>
      <button class="btn btn-soft btn-block" onclick="saveAccount()">${esc(t('saveProfile'))}</button>
      <div class="acc-list">
        ${accItem('skin',I.skin,t('secSkin'))}
        ${accItem('analyses',I.lab,t('secAnalyses'))}
        ${accItem('gallery',I.face,t('secGallery'))}
        ${accItem('dynamics',I.chart,t('secDynamics'))}
        ${accItem('reminders',I.bell,t('secReminders'))}
        ${accItem('originality',I.shield,t('secOrig'))}
      </div>
    </div>`);
}
function accItem(key,icon,label){return `<div class="acc-item" onclick="openSection('${key}')"><div class="ai-ic">${icon}</div><div class="ai-t">${esc(label)}</div><div class="ai-arrow">${I.chev}</div></div>`;}
function pickAvatar(id){profile.avatar=id;saveProfile();openAccount();}
async function saveAccount(){profile.firstName=$('#acFn').value.trim();profile.lastName=$('#acLn').value.trim();profile.email=$('#acEm').value.trim();await saveProfile();toast(t('saved'));openAccount();}

function sectionHead(title){return `<div class="m-head"><button class="back" onclick="openAccount()">${I.back}</button><h2>${esc(title)}</h2><button class="m-close" onclick="closeModal()">${I.close}</button></div>`;}
function openSection(key){
  if(key==='skin')openSkin();else if(key==='analyses')openAnalyses();else if(key==='gallery')openGallery();
  else if(key==='dynamics')openDynamics();else if(key==='reminders')openReminders();else openOriginality();
}

/* --- кожа --- */
function openSkin(){
  skinDraft={concerns:[...(profile.concerns||[])],sensitivities:[...(profile.sensitivities||[])]};
  showModal(`${sectionHead(t('secSkin'))}<div class="m-body">
    <div class="set-title">${esc(t('skinTitle'))}</div>
    <div class="row2">
      <div class="field"><label>${esc(t('skinType'))}</label><select class="sel" id="fSkin"><option value="">${esc(t('chooseDash'))}</option>${[['skinNormal'],['skinDry'],['skinOily'],['skinCombo'],['skinSens']].map(([k])=>`<option ${profile.skinType===t(k)?'selected':''}>${esc(t(k))}</option>`).join('')}</select></div>
      <div class="field"><label>${esc(t('age'))}</label><input id="fAge" type="number" min="10" max="100" value="${esc(profile.age||'')}"></div>
    </div>
    <div class="field"><label>${esc(t('concerns'))}</label><div class="chips" id="cConcerns"></div></div>
    <div class="field"><label>${esc(t('sens'))}</label><span class="hint">${esc(t('sensHint'))}</span><div class="chips" id="cSens"></div></div>
    <div class="field"><label>${esc(t('notes'))}</label><textarea id="fNotes">${esc(profile.notes||'')}</textarea></div>
    <button class="btn btn-primary btn-block" onclick="commitSkin()">${esc(t('saveProfile'))}</button>
  </div>`);
  drawChips('cConcerns','concerns',false);drawChips('cSens','sensitivities',true);
}
function drawChips(id,key,custom){const el=$('#'+id),set=new Set(skinDraft[key]),presets=key==='concerns'?CONCERNS[lang]:SENS[lang],all=[...new Set([...presets,...skinDraft[key]])];el.innerHTML=all.map(c=>`<button type="button" class="chip ${set.has(c)?'on':''}" onclick="this.classList.toggle('on');syncChips('${id}','${key}')">${esc(c)}</button>`).join('')+(custom?`<button type="button" class="chip add" onclick="addChip('${id}','${key}')">${esc(t('custom'))}</button>`:'');}
function syncChips(id,key){skinDraft[key]=[...$('#'+id).querySelectorAll('.chip.on')].map(b=>b.textContent);}
function addChip(id,key){const v=prompt(t('addCustom'));if(!v)return;if(!skinDraft[key].includes(v))skinDraft[key].push(v);drawChips(id,key,key==='sensitivities');}
async function commitSkin(){profile.skinType=$('#fSkin').value;profile.age=$('#fAge').value;profile.notes=$('#fNotes').value;profile.concerns=skinDraft.concerns;profile.sensitivities=skinDraft.sensitivities;await saveProfile();toast(t('savedProfile'));renderReminder();}

/* --- галерея --- */
function openGallery(){
  const g=profile.gallery||[];galPasted='';
  showModal(`${sectionHead(t('secGallery'))}<div class="m-body">
    <div class="set-title">${esc(t('galTitle'))}</div><div class="set-sub">${esc(t('galDesc'))}</div>
    <div class="row2">
      <div class="field"><label>${esc(t('photoDate'))}</label><input id="galDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="field"><label>${esc(t('addPhoto'))}</label><div class="file-row"><input id="galFile" type="file" accept="image/*"><button class="btn btn-soft" type="button" onclick="pasteImage('gallery')">${I.copy}<span>${esc(t('paste'))}</span></button></div></div>
    </div>
    <button class="btn btn-primary btn-block" onclick="addGalleryPhoto()">${esc(t('addPhoto'))}</button>
    <div id="galGrid">${g.length?`<div class="gal-grid">${g.map(renderGalCard).join('')}</div>`:`<div class="mini-empty">${esc(t('galEmpty'))}</div>`}</div>
    <div class="disclaimer">${esc(t('faceDisc'))}</div>
  </div>`);
}
function renderGalCard(e){
  return `<div class="gal-card"><div class="gal-photo"><span class="ph">${I.face}</span>${e.photo?`<img src="${esc(e.photo)}" referrerpolicy="no-referrer" onerror="this.remove()">`:''}${e.score!=null?`<span class="gal-score">≈ ${e.score}/10</span>`:''}<button class="gal-del" onclick="delGallery('${e.id}')">${I.close}</button></div>
    <div class="gal-body"><div class="gal-date">${esc(fmtDate(e.date))}</div>
    <div class="gal-note collapsed" id="galnote-${e.id}">${e.note?renderFaceNote(e.note):`<span style="color:var(--muted)">${esc(t('analyzing'))}</span>`}</div>
    ${e.note?`<button class="gal-toggle" onclick="toggleGal('${e.id}',this)">${esc(t('expand'))}</button>`:''}</div></div>`;
}
function renderFaceNote(n){if(typeof n==='string')return esc(n);return `${n.observations&&n.observations.length?`<b>${esc(t('visible'))}:</b><ul>${n.observations.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${n.assumptions&&n.assumptions.length?`<b>${esc(t('assumptions'))}:</b><ul>${n.assumptions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${n.gentleTip?`<div style="margin-top:5px">${esc(t('tip'))}: ${esc(n.gentleTip)}</div>`:''}`;}
function toggleGal(id,btn){const el=$('#galnote-'+id);const col=el.classList.toggle('collapsed');btn.textContent=col?t('expand'):t('collapse');}
async function addGalleryPhoto(){
  const date=$('#galDate').value||new Date().toISOString().slice(0,10);
  let photo=galPasted;const f=$('#galFile').files[0];
  if(f){try{photo=await fileToSmall(f,440,0.8);}catch(_){toast(t('photoFail'));return;}}
  if(!photo){toast(t('pasteHintToast'));return;}
  const entry={id:uid(),date,photo,score:null,note:null,createdAt:Date.now()};
  profile.gallery=profile.gallery||[];profile.gallery.unshift(entry);await save('addGallery',{entry});galPasted='';openGallery();
  try{
    const note=await callAI('face',{profileText:profileText(),image:photo});
    const ent=profile.gallery.find(x=>x.id===entry.id);if(ent){ent.note=note;ent.score=note.score!=null?note.score:null;await save('updateGallery',{entry:ent});}
    const box=$('#galnote-'+entry.id);if(box){box.innerHTML=renderFaceNote(note);const card=box.closest('.gal-card');if(card&&note.score!=null){let sc=card.querySelector('.gal-score');if(!sc){sc=document.createElement('span');sc.className='gal-score';card.querySelector('.gal-photo').appendChild(sc);}sc.textContent='≈ '+note.score+'/10';}if(!box.parentElement.querySelector('.gal-toggle')){const b=document.createElement('button');b.className='gal-toggle';b.textContent=t('expand');b.onclick=()=>toggleGal(entry.id,b);box.after(b);}}
  }catch(err){const box=$('#galnote-'+entry.id);if(box)box.innerHTML=`<span style="color:var(--avoid)">${esc(t('faceFail'))}: ${esc(err.message)}</span>`;}
}
async function delGallery(id){profile.gallery=(profile.gallery||[]).filter(x=>x.id!==id);await save('deleteGallery',{id});openGallery();}

/* --- анализы --- */
function openAnalyses(){
  const a=profile.analyses||[];anPasted='';
  showModal(`${sectionHead(t('secAnalyses'))}<div class="m-body">
    <div class="set-title">${esc(t('anTitle'))}</div><div class="set-sub">${esc(t('anDesc'))}</div>
    <div class="field"><label>${esc(t('anNew'))}</label><textarea id="anText" placeholder="${esc(t('anPh'))}"></textarea>
      <div class="file-row" style="margin-top:8px"><input id="anFile" type="file" accept="image/*"><button class="btn btn-soft" type="button" onclick="pasteImage('analysis')">${I.copy}<span>${esc(t('paste'))}</span></button></div></div>
    <button class="btn btn-soft btn-block" onclick="addAnalysis()">${esc(t('anAdd'))}</button>
    <div id="anList" style="display:flex;flex-direction:column;gap:10px">${a.length?a.map(renderAn).join(''):`<div class="mini-empty">${esc(t('anEmpty'))}</div>`}</div>
  </div>`);
}
function renderAn(e){return `<div class="an-item">${e.photo?`<img src="${esc(e.photo)}">`:''}<div style="flex:1"><div class="an-date">${esc(fmtDate(e.date))}</div><div class="an-text">${esc(e.text)}</div></div><button class="an-del" onclick="delAnalysis('${e.id}')">${I.close}</button></div>`;}
async function addAnalysis(){
  const text=$('#anText').value.trim();const f=$('#anFile').files[0];let photo=anPasted;
  if(f){try{photo=await fileToSmall(f,500,0.78);}catch(_){}}
  if(!text&&!photo){toast(t('anNeed'));return;}
  const entry={id:uid(),date:new Date().toISOString().slice(0,10),text,photo:photo||'',createdAt:Date.now()};
  profile.analyses=profile.analyses||[];profile.analyses.unshift(entry);await save('addAnalysis',{entry});anPasted='';openAnalyses();toast(t('anAdded'));
}
async function delAnalysis(id){profile.analyses=(profile.analyses||[]).filter(x=>x.id!==id);await save('deleteAnalysis',{id});openAnalyses();}

/* --- динамика --- */
function openDynamics(){
  const log=[...(profile.log||[])].sort((a,b)=>a.date.localeCompare(b.date));
  showModal(`${sectionHead(t('secDynamics'))}<div class="m-body">
    <div class="set-title">${esc(t('dynTitle'))}</div><div class="set-sub">${esc(t('dynDesc'))}</div>
    <div id="chartArea">${chartSVG(log)}</div>
    <div class="export-row"><button class="btn btn-soft" onclick="exportChart('png')">${I.download}<span>${esc(t('exportPng'))}</span></button><button class="btn btn-soft" onclick="exportChart('pdf')">${I.download}<span>${esc(t('exportPdf'))}</span></button></div>
    <div class="log-add">
      <div class="field"><label>${esc(t('date'))}</label><input id="logDate" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="field"><label>${esc(t('condition'))}</label><input id="logScore" type="number" min="1" max="10"></div>
      <button class="btn btn-primary" onclick="addLog()" style="height:46px" ${log.length>=10?'disabled':''}>${esc(t('addPoint'))}</button>
    </div>
    ${log.length>=10?`<div class="set-sub">${esc(t('max10'))}</div>`:''}
    <div class="field"><label>${esc(t('points'))}</label><div class="pt-list">${log.map(renderPt).join('')||`<div class="mini-empty">${esc(t('noChart'))}</div>`}</div></div>
  </div>`);
}
function renderPt(p){return `<div class="pt-row"><input type="date" value="${esc(p.date)}" onchange="editLog('${p.id}','date',this.value)"><input type="number" min="1" max="10" value="${esc(p.score)}" onchange="editLog('${p.id}','score',this.value)"><button class="iconbtn danger" onclick="delLog('${p.id}')">${I.trash}</button></div>`;}
function chartSVG(log){
  if(log.length<2)return `<div class="chart-wrap"><div class="mini-empty">${esc(t('chartEmpty'))}</div></div>`;
  const W=320,H=170,pl=30,pr=14,pt=14,pb=26,iw=W-pl-pr,ih=H-pt-pb,n=log.length;
  const xs=i=>pl+(n===1?iw/2:iw*i/(n-1)),ys=s=>pt+ih*(1-(s/10));
  const grid=[0,5,10].map(s=>`<line x1="${pl}" y1="${ys(s)}" x2="${W-pr}" y2="${ys(s)}" stroke="#F3D7E4" stroke-width="1"/><text x="${pl-6}" y="${ys(s)+3}" font-size="9" fill="#b58aa0" text-anchor="end" font-family="Arial">${s}</text>`).join('');
  const pts=log.map((e,i)=>[xs(i),ys(Math.max(1,Math.min(10,e.score)))]);
  const line=`<polyline fill="none" stroke="#FF94C3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;
  const dots=pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#fff" stroke="#FF94C3" stroke-width="2.5"/>`).join('');
  const labs=`<text x="${pl}" y="${H-8}" font-size="9" fill="#b58aa0" font-family="Arial">${esc(fmtDate(log[0].date))}</text><text x="${W-pr}" y="${H-8}" font-size="9" fill="#b58aa0" text-anchor="end" font-family="Arial">${esc(fmtDate(log[n-1].date))}</text>`;
  return `<div class="chart-wrap"><svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${grid}${line}${dots}${labs}</svg></div>`;
}
async function addLog(){
  const date=$('#logDate').value,score=parseInt($('#logScore').value,10);
  if(!date||!score||score<1||score>10){toast(t('logNeed'));return;}
  profile.log=profile.log||[];if(profile.log.length>=10){toast(t('max10'));return;}
  const ex=profile.log.find(l=>l.date===date);let entry;
  if(ex){ex.score=score;entry=ex;}else{entry={id:uid(),date,score,createdAt:Date.now()};profile.log.push(entry);}
  await save('saveLog',{entry});openDynamics();toast(t('logAdded'));
}
async function editLog(id,field,val){const l=(profile.log||[]).find(x=>x.id===id);if(!l)return;if(field==='score'){const s=parseInt(val,10);if(s<1||s>10||!s)return;l.score=s;}else l.date=val;await save('saveLog',{entry:l});const log=[...profile.log].sort((a,b)=>a.date.localeCompare(b.date));$('#chartArea').innerHTML=chartSVG(log);}
async function delLog(id){profile.log=(profile.log||[]).filter(x=>x.id!==id);await save('deleteLog',{id});openDynamics();}
function exportChart(fmt){
  const svg=$('#chartArea svg');if(!svg){toast(t('noChart'));return;}
  const clone=svg.cloneNode(true);clone.setAttribute('width','640');clone.setAttribute('height','340');
  const xml=new XMLSerializer().serializeToString(clone);const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml);
  const img=new Image();
  img.onload=()=>{const c=document.createElement('canvas');c.width=640;c.height=340;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,640,340);ctx.drawImage(img,0,0,640,340);
    if(fmt==='png'){c.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='PURAI-dynamika.png';a.click();URL.revokeObjectURL(a.href);});}
    else{try{const{jsPDF}=window.jspdf;const pdf=new jsPDF({orientation:'landscape',unit:'px',format:[680,380]});pdf.addImage(c.toDataURL('image/png'),'PNG',20,20,640,340);pdf.save('PURAI-dynamika.pdf');}catch(e){toast('PDF: '+e.message);}}
  };
  img.src=url;
}

/* --- напоминания --- */
function openReminders(){
  const hidden=new Set(profile.hiddenRem||[]);
  const defaults=(DEF_REM[lang]||DEF_REM.ru).filter((_,i)=>!hidden.has(i));
  const custom=(profile.reminders||[]).filter(r=>!DEF_REM.ru.includes(r)&&!DEF_REM.pl.includes(r));
  const all=[...defaults,...custom];
  showModal(`${sectionHead(t('secReminders'))}<div class="m-body">
    <div class="set-title">${esc(t('remTitle'))}</div><div class="set-sub">${esc(t('remDesc'))}</div>
    <div class="rem-list">${all.map((x,i)=>`<div class="rem-row"><span>${esc(x)}</span><button class="rm-del" onclick="delRem(${i})">${I.close}</button></div>`).join('')}</div>
    <div class="search-wrap" style="margin-top:6px"><input id="remNew" placeholder="${esc(t('remPh'))}" onkeydown="if(event.key==='Enter')addReminder()"><button class="btn btn-soft" onclick="addReminder()">${esc(t('addRem'))}</button></div>
  </div>`);
}
async function addReminder(){const v=$('#remNew').value.trim();if(!v)return;profile.reminders=profile.reminders||[];profile.reminders.push(v);await saveProfile();openReminders();renderReminder();}
async function delRem(i){
  const hidden=new Set(profile.hiddenRem||[]);
  const defaults=(DEF_REM[lang]||DEF_REM.ru).filter((_,idx)=>!hidden.has(idx));
  const custom=(profile.reminders||[]).filter(r=>!DEF_REM.ru.includes(r)&&!DEF_REM.pl.includes(r));
  if(i<defaults.length){
    const text=defaults[i];
    const origIdx=(DEF_REM[lang]||DEF_REM.ru).indexOf(text);
    profile.hiddenRem=profile.hiddenRem||[];
    profile.hiddenRem.push(origIdx);
  }else{
    const ci=i-defaults.length;
    custom.splice(ci,1);
    profile.reminders=[...DEF_REM.ru,...custom];
  }
  await saveProfile();openReminders();renderReminder();
}

/* --- оригинальность --- */
function openOriginality(){
  showModal(`${sectionHead(t('secOrig'))}<div class="m-body">
    <div class="set-title">${esc(t('origFullTitle'))}</div><div class="set-sub">${esc(t('origFullDesc'))}</div>
    <ul class="check-list">
      <li><span class="ic">①</span><span>${t('o1')}</span></li>
      <li><span class="ic">②</span><span>${t('o2')}</span></li>
      <li><span class="ic">③</span><span>${t('o3')}</span></li>
      <li><span class="ic">④</span><span>${t('o4')}</span></li>
    </ul>
    <a href="https://checkcosmetic.net/" target="_blank" rel="noopener" style="text-decoration:none;margin-top:6px"><span style="display:inline-block;background:var(--pink-soft);border:1.5px solid var(--line);border-radius:11px;padding:9px 13px;font-weight:700;font-size:13px;color:var(--pink-deep)">${esc(t('checkBatch'))} →</span></a>
  </div>`);
}

/* ---------- вставка из буфера (Ctrl+V) ---------- */
async function pasteImage(target){
  pasteTarget=target;
  if(navigator.clipboard&&navigator.clipboard.read){
    try{const items=await navigator.clipboard.read();for(const it of items){const type=it.types.find(x=>x.startsWith('image/'));if(type){const blob=await it.getType(type);const data=await fileToSmall(blob,460,0.82);applyPaste(target,data);return;}}toast(t('noClipImg'));}
    catch(_){toast(t('pasteHintToast'));}
  }else toast(t('pasteHintToast'));
}
document.addEventListener('paste',async e=>{
  if(!pasteTarget)return;const items=(e.clipboardData||{}).items||[];
  for(const it of items){if(it.type.indexOf('image')===0){const f=it.getAsFile();try{const data=await fileToSmall(f,460,0.82);applyPaste(pasteTarget,data);e.preventDefault();}catch(_){}return;}}
});
function applyPaste(target,data){
  if(target==='product'){tmpProd.photo=data;const f=$('#pPhoto');if(f){f.value='';f.placeholder=t('photoLoaded');}toast(t('photoAdded'));}
  else if(target==='gallery'){galPasted=data;toast(t('photoAdded'));}
  else if(target==='analysis'){anPasted=data;toast(t('photoAdded'));}
}

/* ---------- запуск ---------- */
$('#sparkBtn').addEventListener('click',openAccount);
$('#addBtn').addEventListener('click',()=>openAdd());
$('#langToggle').addEventListener('click',e=>{const b=e.target.closest('button');if(b)setLang(b.dataset.l);});
(async function(){await bootstrap();applyLang();})();