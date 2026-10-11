    const supportedGameLanguages = ["auto", "ru", "en"];
    const englishText = {
      "Назад": "Back", "Настройки": "Settings", "Нация": "Nation", "Улучшения": "Upgrades", "Магазин": "Store", "Профиль": "Profile", "События": "Events",
      "Язык": "Language", "Авто (язык платформы)": "Auto (platform language)", "Русский": "Russian", "Английский": "English",
      "Яркость": "Brightness", "Контраст": "Contrast", "Насыщенность": "Saturation", "Масштаб UI в бою": "Battle UI scale", "Высота 3D-камеры": "3D camera height",
      "Полоски прочности": "Health bars", "Маркеры команд": "Team markers", "Индикатор КД": "Reload indicator", "Подробные итоги": "Detailed results", "Полный экран": "Fullscreen",
      "Вперед": "Forward", "Поворот влево": "Turn left", "Поворот вправо": "Turn right", "Башня влево": "Turret left", "Башня вправо": "Turret right", "Арт-режим": "Artillery view",
      "Экспорт": "Export", "Импорт": "Import", "Сбросить": "Reset", "Ротный бой": "Company battle", "Взводный бой": "Platoon battle", "Дуэль": "Duel", "Охота на командира": "Commander hunt", "Война": "War", "Выживание": "Survival", "Тренировка": "Training",
      "Победа": "Victory", "Поражение": "Defeat", "Ничья": "Draw", "Готово": "Ready", "Купить": "Buy", "Продать": "Sell", "Получить": "Claim", "Закрыть": "Close", "Выбрать": "Select", "Установить": "Install", "Снять": "Remove", "Недоступно": "Unavailable", "Заблокировано": "Locked", "Загрузка...": "Loading...", "Поиск": "Search", "Сброс": "Reset", "Все": "All", "Нет": "No", "Да": "Yes",
      "Урон": "Damage", "Пробитие": "Penetration", "Прочность": "Hit points", "Скорость": "Speed", "Обзор": "View range", "Перезарядка": "Reload", "Точность": "Accuracy", "Боёв": "Battles", "Побед": "Wins", "Поражений": "Defeats", "Фрагов": "Kills", "Серебро": "Silver", "Золото": "Gold", "Чертежи": "Blueprints", "Командир": "Commander", "Наводчик": "Gunner", "Заряжающий": "Loader", "Механик-водитель": "Driver", "Радист": "Radio operator", "Карта": "Map", "Игрок": "Player", "Союзники": "Allies", "Противники": "Enemies",
      "Выбери карту для тренировки": "Choose a training map", "Выбрать карту": "Choose map", "В бой": "Battle!", "В ангар": "To hangar", "Фильтры": "Filters", "Нет танков по выбранным фильтрам": "No tanks match the selected filters", "Продажа недоступна": "Sale unavailable", "Сохранить боекомплект": "Save ammunition loadout", "Прокачано": "Trained", "Идёт прокачка": "Training in progress", "Знак классности за бой": "Battle mastery badge", "Не получен": "Not earned", "Премиум танки": "Premium tanks", "Премиум танки не найдены.": "No premium tanks found.", "Контейнеры": "Containers", "Золото за рекламу": "Gold for ads", "Загрузка рекламы...": "Loading ad...", "Не хватает золота": "Not enough gold", "Продолжить": "Continue", "Получено": "Claimed", "Забрать": "Claim", "Ежедневная награда": "Daily reward", "Ежедневные задания": "Daily missions", "Контракты": "Contracts", "Боевой пропуск месяца": "Monthly battle pass", "Реплеи: последние 5 боёв": "Replays: last 5 battles", "Боевая статистика": "Battle statistics", "Сессия": "Session", "Техника": "Vehicles", "Медали": "Medals", "Статистика по технике": "Vehicle statistics",
      "Меняет яркость боевой карты.": "Changes battle-map brightness.", "Делает бой мягче или резче.": "Makes the battle view softer or sharper.", "Регулирует цветность боевой сцены.": "Adjusts battle-scene colour.", "Увеличивает или уменьшает боевые индикаторы.": "Increases or decreases battle indicators.", "Меняет базовую высоту камеры над танком в 3D-бою.": "Changes the default camera height above the tank in 3D battle.", "Показывать HP над танками.": "Show HP above tanks.", "Красные и зеленые маркеры над танками.": "Show red and green markers above tanks.", "Показывать время перезарядки у курсора.": "Show reload time at the cursor.", "Показывать урон, фраги, точность и захват в окне итогов.": "Show damage, kills, accuracy and capture in the results window.", "Разворачивает игру на весь экран, в том числе на MacBook.": "Expands the game to fullscreen, including on MacBook.", "Нажмите клавишу или введите ее имя.": "Press a key or enter its name.", "В режиме «Авто» используется язык, который определила платформа YaGamesSDK или браузер.": "Auto uses the language detected by YaGamesSDK or the browser.", "Флаг Веймарской республики с железным крестом используется для отображения эпохи.": "The Weimar Republic flag with the Iron Cross is used to show the era.",
      "Большое сражение 7 на 7: много целей, долгий обмен огнем и решающая роль команды.": "Large 7v7 battle: many targets, prolonged firefights and a decisive team role.", "Средний формат 5 на 5: быстрее ротного, но с местом для маневра.": "Medium 5v5 format: faster than company battles, with room to manoeuvre.", "Чистая схватка 1 на 1: только ты, враг и ошибки, за которые сразу платят.": "Pure 1v1: only you, the enemy and mistakes that cost you immediately.", "Особый бой 7 на 7: найдите и уничтожьте вражеского командира. Твой танк тоже командир, его потеря означает поражение.": "Special 7v7 battle: find and destroy the enemy commander. Your tank is also a commander; losing it means defeat.", "Масштабный бой 15 на 15: захватите 4 точки, затем базу врага. Танки возрождаются до победы.": "Large 15v15 battle: capture 4 points, then the enemy base. Tanks respawn until victory.", "Бой каждый сам за себя: 15 участников, побеждает последний. Каждую минуту характеристики всех танков растут на 5%.": "Free-for-all: 15 participants, last tank standing wins. Every minute, all tank stats increase by 5%.", "Одиночный выезд без врагов: сам выбери любую карту и выйди кнопкой «Назад».": "Solo sortie without enemies: choose any map and leave with the Back button."
      ,"Уровень": "Tier", "Класс": "Class", "Особенности": "Features", "Броня": "Armour", "Маскировка": "Camouflage", "Нация": "Nation", "Цена": "Price", "Опыт": "Experience", "Экипаж": "Crew", "Боекомплект": "Ammunition loadout", "Корпус": "Hull", "Башня": "Turret", "Снаряды": "Shells", "Барабан": "Autoloader", "Залп": "Salvo", "СССР": "USSR", "Германия": "Germany", "Великобритания": "United Kingdom", "Швеция": "Sweden", "Франция": "France", "Япония": "Japan", "Польша": "Poland", "Китай": "China", "Италия": "Italy", "Чехословакия": "Czechoslovakia", "США": "USA", "Швейцария": "Switzerland", "Австрия": "Austria", "Мировая нация": "International"
    };
    let activeGameLanguage = "ru";
    const englishTankNames = new Map();
    const originalUiText = new WeakMap();
    const originalUiAttributes = new WeakMap();
    let translationPattern = null;

    Object.assign(englishText, {
      "Сравнить": "Compare", "Тест-драйв": "Test drive", "Роль": "Role",
      "Сменить режим": "Change mode",
      "Разведка": "Scout", "Поддержка": "Support", "Штурм": "Assault",
      "ЛТ": "LT", "СТ": "MT", "ТТ": "HT", "ПТ": "TD", "САУ": "SPG",
      "КТ": "HT", "БТР": "APC", "ед/с": "units/s", "уровень": "tier",
      "Код": "Code", "Плавающий": "Amphibious", "Ракетные ускорители": "Rocket boosters",
      "Повышенная проходимость": "Improved terrain mobility", "Осадный режим": "Siege mode",
      "Ускорители": "Boosters", "Ракеты": "Boost", "Осада": "Siege",
      "Развёрнут": "Deployed", "Развёртывание": "Deploying", "Походный": "Travel mode",
      "Рейдер": "Raider", "Мобильная разведка": "Mobile scout",
      "Универсал": "All-rounder", "Прорыв": "Breakthrough",
      "Засада": "Ambush", "Артиллерия": "Artillery", "Боевая роль": "Combat role",
      "Ремка": "Repair kit", "Огнетушитель": "Fire extinguisher",
      "Гусеницы": "Tracks", "Орудие": "Gun", "Бак": "Fuel tank",
      "БК башни": "Turret ammo rack", "БК корпуса": "Hull ammo rack",
      "ББ": "AP", "ПБ": "APCR", "КС": "HEAT", "ОФ": "HE", "ПТУР": "ATGM",
      "огонь": "fire", "Пулемёт": "Machine gun",
      "Боекомплект сохранён": "Ammunition loadout saved",
      "Продать": "Sell", "Купить": "Buy", "Исследовать": "Research",
      "Ремонт": "Repair", "Пополнить": "Restock", "Готов": "Ready",
      "Бой": "Battle", "Танки": "Tanks", "Дерево развития": "Tech tree",
      "Ветка": "Branch", "Не исследовано": "Not researched",
      "Нет данных": "No data", "Не найдено": "Not found",
      "Сохранено": "Saved", "Отмена": "Cancel", "Подтвердить": "Confirm",
      "Награда": "Reward", "Награды": "Rewards", "Задания": "Missions",
      "Результаты боя": "Battle results", "Уничтожен": "Destroyed"
    });

    Object.assign(englishText, {
      "Все из всех": "Free-for-all", "Контейнер ИС-4": "IS-4 container",
      "Имперский": "Imperial", "ПОРОГ: летний прорыв": "POROG: Summer Breakthrough",
      "Сыграй 50 боев с 12 июля по 1 августа и бесплатно получи танк ПОРОГ.": "Play 50 battles from July 12 to August 1 and get the POROG tank for free.",
      "Эксперимент 120 тонн": "120-ton experiment", "Соберите секретный японский сверхтяжёлый прототип": "Assemble a secret Japanese superheavy prototype",
      "Проект": "Project", "Провести 7 боёв": "Play 7 battles", "Броневые листы": "Armour plates",
      "Заблокировать 4 000 урона": "Block 4,000 damage", "Силовая установка": "Powerplant",
      "Победить в 8 боях": "Win 8 battles", "Главное орудие": "Main gun",
      "Нанести 15 000 урона": "Deal 15,000 damage", "Испытательный полигон": "Proving ground",
      "Уничтожить 15 противников": "Destroy 15 enemies", "Танкист": "Tank crew member", "Ходовая": "Suspension",
      "ПУЛЕМЁТ": "MACHINE GUN", "ОГОНЬ": "FIRE", "Колёса": "Wheels",
      "РСФСР": "RSFSR", "УССР": "Ukrainian SSR", "БССР": "Byelorussian SSR",
      "Россия": "Russia", "Российская империя": "Russian Empire",
      "Австро-Венгрия": "Austria-Hungary", "Англия": "England",
      "Веймарская республика": "Weimar Republic", "ФРГ": "West Germany",
      "США (48 звёзд)": "USA (48 stars)", "Империя Цин": "Qing Empire",
      "Цинская империя": "Qing Empire", "Тайвань": "Taiwan",
      "Китайская Республика": "Republic of China", "Японская империя": "Japanese Empire",
      "Чехия": "Czechia", "Канада": "Canada", "Венгрия": "Hungary",
      "Румыния": "Romania", "Индия": "India", "Южная Корея": "South Korea",
      "Турция": "Turkey", "Австралия": "Australia", "Иран": "Iran",
      "Пакистан": "Pakistan", "Египет": "Egypt", "Израиль": "Israel",
      "Бразилия": "Brazil", "Бельгия": "Belgium",
      "золота": "gold", "серебра": "silver", "чертежей": "blueprints",
      "опыта": "experience", "единиц": "units", "танк": "tank",
      "Тип": "Type", "тип": "type", "урон": "damage", "пробитие": "penetration",
      "Поворот корпуса": "Hull traverse", "Задержка движения": "Movement delay",
      "Задержка поворота": "Turn delay", "Шанс пробития": "Penetration chance",
      "Тип орудия": "Gun type", "Снарядов за выстрел": "Shells per shot",
      "Разброс": "Dispersion", "Цена покупки": "Purchase price",
      "Цена исследования": "Research cost", "Премиум/контейнер": "Premium/container",
      "да": "yes", "нет": "no", "Коллекционный": "Collectible",
      "Доступен ботам": "Available to bots", "Характеристика": "Stat",
      "Слишком много снарядов для боекомплекта": "Too many shells for the ammunition capacity",
      "Недостаточно серебра": "Not enough silver", "Можно сохранить": "Ready to save",
      "Мастер": "Master", "I степень": "Class I", "II степень": "Class II",
      "III степень": "Class III", "Обычный": "Regular", "Прем": "Premium",
      "Коллекц": "Collectible", "Ещё не добавлен": "Coming later",
      "Разработчик": "Developer", "Будет позже": "Coming later",
      "data.csv не загружен": "data.csv could not be loaded",
      "Для этой нации пока нет ветки прокачки": "This nation has no tech tree yet",
      "Нет доступных улучшений": "No upgrades available",
      "Сыграть бой": "Play a battle", "Ежедневная награда получена": "Daily reward claimed",
      "Сыграть 1 бой": "Play 1 battle", "Нанести 1800 урона": "Deal 1,800 damage",
      "Уничтожить 2 танка": "Destroy 2 tanks", "Попасть 6 раз": "Hit 6 times",
      "Победить 1 раз": "Win once", "Набрать 60% захвата": "Reach 60% capture",
      "Заработать 120 ролевого опыта": "Earn 120 role XP",
      "откроется позже": "unlocks later", "доступно сегодня": "available today",
      "ждёт очереди": "upcoming", "Финал получен": "Final reward claimed",
      "Получить ветку": "Unlock branch", "Контракт на чертежи": "Blueprint contract",
      "Контракт на золото": "Gold contract", "Контракт на серебро": "Silver contract",
      "Сложный контракт на танк": "Advanced tank contract",
      "случайный премиум-танк или компенсация": "random premium tank or compensation",
      "Ограниченные по времени задачи на чертежи, золото, серебро и сложный контракт на танк.": "Limited-time missions for blueprints, gold, silver, and a tank contract.",
      "Истёк": "Expired", "Получено сегодня": "Claimed today",
      "Открыть завершённое событие": "Open completed event",
      "Открыть событие": "Open event", "Подробнее о событии": "Event details",
      "Забрать награду": "Claim reward", "В процессе": "In progress",
      "К событиям": "To events", "Награда получена": "Reward claimed",
      "Событие активно": "Event active", "Скоро начнётся": "Starts soon",
      "Событие завершено": "Event ended", "Главная награда": "Main reward",
      "Идёт событие": "Event in progress", "Событие не активно": "Event inactive",
      "Не хватает чертежей": "Not enough blueprints", "В ангаре": "In hangar",
      "Получен": "Claimed", "Все танки с AD=2. Цена за золото зависит от уровня.": "All tanks with AD=2. Gold price depends on tier.",
      "Танк уже в ангаре": "Tank already in hangar", "Новый танк": "New tank",
      "Статус вкладки:": "Tab status:", "Активна": "Active", "Неактивна": "Inactive",
      "Просмотр вознаграждаемой рекламы.": "Watch a rewarded ad.", "Без класса": "Unranked",
      "Майор": "Major", "Капитан": "Captain", "Лейтенант": "Lieutenant",
      "Сержант": "Sergeant", "Новобранец": "Recruit"
    });

    Object.assign(englishText, {
      "Первая победа": "First victory", "Выиграть бой": "Win a battle",
      "Снайпер": "Sniper", "Истребитель": "Hunter",
      "10 уничтожений": "10 kills", "Коллекционер": "Collector",
      "5 единиц техники": "5 vehicles", "Инженер": "Engineer",
      "3 исследованных танка": "3 researched tanks", "Ветеран": "Veteran",
      "10 боёв": "10 battles", "100% захвата базы": "100% base capture",
      "Мастер урона": "Damage master", "10 000 урона": "10,000 damage",
      "Закрыто:": "Locked:", "класс не указан": "class unspecified",
      "Выстрелы": "Shots", "Нет записи": "No replay",
      "Реплеи": "Replays", "Сыграйте бой, чтобы появилась запись": "Play a battle to record a replay",
      "Бои": "Battles", "Победы": "Wins", "Средний урон": "Average damage",
      "Уничтожено": "Destroyed", "Опыт за бои": "Battle XP",
      "Серебро за бои": "Battle silver", "Лучшая техника": "Best vehicle",
      "Фраги": "Kills", "Исследовано": "Researched",
      "1-7 число": "Days 1–7", "11-18 число": "Days 11–18",
      "22-28 число": "Days 22–28", "Один игрок | выбор карты": "Solo | choose map",
      "Сохранение экспортировано": "Save exported",
      "Импорт заменит текущее сохранение. Продолжить?": "Import will replace the current save. Continue?",
      "Не удалось импортировать сохранение": "Could not import save",
      "Сбросить аккаунт Tanks Wars? Прогресс, валюта, профиль и статистика будут удалены.": "Reset the Tanks Wars account? Progress, currency, profile, and stats will be deleted.",
      "Речные рубежи": "River Frontiers", "Сухой перевал": "Dry Pass",
      "WARламовка": "WARlamovka", "Перекресток": "Crossroads",
      "Луна": "Moon", "Севастополь": "Sevastopol", "Рейхстаг": "Reichstag",
      "Осада сталелитейного": "Steelworks Siege", "Промышленный фронт": "Industrial Front",
      "Разрушенный город": "Ruined City", "Линия крепостей": "Fortress Line",
      "Светить цели и давать урон по засвету": "Spot targets and deal spotting damage",
      "Быстро менять фланги, светить и добивать": "Switch flanks quickly, spot and finish targets",
      "Разведка, обход и поддержка флангов": "Scout, flank and support",
      "Поддерживать тяжелых, наносить урон и брать базу": "Support heavy tanks, deal damage and capture the base",
      "Давить направление, танковать урон и открывать проход": "Push a flank, absorb damage and open a path",
      "Держать дистанцию, наносить урон и сбивать прорыв": "Keep your distance, deal damage and stop breakthroughs",
      "Поражать цели с карты и помогать по засвету": "Hit targets across the map and support spotting",
      "Наносить урон и помогать команде": "Deal damage and support the team",
      "Недостаточно серебра для ремки": "Not enough silver for a repair kit",
      "Недостаточно серебра для огнетушителя": "Not enough silver for a fire extinguisher",
      "Бот": "Bot", "есть": "available", "Огнетуш.": "Extinguisher",
      "Тактик": "Tactician", "Штурмовик": "Assaulter",
      "Осторожный": "Cautious", "Разведчик": "Scout",
      "Охотник": "Hunter", "Атакуем цель": "Attack target",
      "Атакуем указанную цель": "Attack the marked target",
      "За мной": "Follow me", "За мной, держим строй": "Follow me, stay in formation",
      "Удерживать позицию": "Hold position", "Удерживаем позицию": "Holding position",
      "Защищать базу": "Defend base", "Все на защиту базы": "Everyone defend the base",
      "Отступаем": "Retreating", "Отступаем и перегруппировываемся": "Retreat and regroup",
      "Союзник": "Ally", "приказ принят": "order acknowledged",
      "команда союзника": "ally command", "База": "Base",
      "в полёте": "in flight", "промах": "miss",
      "препятствие": "obstacle", "союзник": "ally",
      "пробил": "penetrated", "фугас": "HE hit", "не пробил": "no penetration",
      "Прорыв Гудериана": "Guderian's Breakthrough",
      "Захват базы в одиночку при менее 5% HP.": "Capture the base alone with less than 5% HP.",
      "Колобанов": "Kolobanov", "Уничтожить 5 танков и закончить бой с более 70% HP.": "Destroy 5 tanks and finish with more than 70% HP.",
      "Урон по вашему засвету": "Damage from your spotting",
      "Ролевой бонус": "Role bonus", "Роль класса": "Class role",
      "Задача роли": "Role objective", "Получено урона": "Damage received",
      "Разрушено объектов": "Objects destroyed", "Захват базы": "Base capture",
      "Попадания": "Hits", "Опыт за бой": "Battle XP",
      "Первый бой дня x2": "First battle of the day x2",
      "Серебро за бой": "Battle silver", "Пополнение БК": "Ammo restock",
      "Боев в сессии": "Session battles", "Урон в сессии": "Session damage",
      "РЕЙХСТАГ": "REICHSTAG", "Цель режима: найди и уничтожь вражеского командира.": "Mode objective: find and destroy the enemy commander.",
      "Цель режима: удерживай точки и уничтожай танки противника.": "Mode objective: hold the points and destroy enemy tanks.",
      "Цель боя: уничтожь всех врагов или помоги союзникам взять базу.": "Battle objective: destroy all enemies or help allies capture the base."
    });

    Object.assign(englishText, {
      "Обучение 1/3: управление": "Tutorial 1/3: Controls",
      "W/S или Ц/Ы - движение, A/D или Ф/В - поворот корпуса.": "W/S to move, A/D to turn the hull.",
      "Башня смотрит за мышью. Левая кнопка мыши - выстрел.": "Aim the turret with the mouse. Left click to fire.",
      "Сдвинь танк с места": "Move your tank", "Наведи башню мышью": "Aim the turret with the mouse",
      "Сделай выстрел": "Fire a shot", "Обучение 2/3: огонь и броня": "Tutorial 2/3: Fire and armour",
      "1/2/3 меняют снаряды. Если урон не проходит, смени тип снаряда или стреляй в борт.": "Use 1/2/3 to switch shells. If your shots do no damage, change shell type or aim at the side.",
      "Пока идет перезарядка, держи дистанцию и используй камни и дома как укрытие.": "Keep your distance while reloading and use rocks and buildings as cover.",
      "Смени снаряд": "Switch shell", "Нанеси урон врагу": "Damage an enemy",
      "Отследи перезарядку после выстрела": "Watch the reload after firing",
      "Обучение 3/3: тактика и прогресс": "Tutorial 3/3: Tactics and progress",
      "Оцени боевую обстановку по интерфейсу": "Read the battle information on screen",
      "Принеси пользу: урон или захват": "Contribute damage or capture",
      "Веди огонь по засвеченным целям": "Fire at spotted targets",
      "H - показать обучение": "H - show tutorial", "H - скрыть подсказки": "H - hide tips",
      "Уничтожь врагов или захвати базу": "Destroy enemies or capture the base",
      "Уничтожь противника": "Destroy the enemy",
      "Уничтожь вражеского командира": "Destroy the enemy commander",
      "Атакуй базу врага": "Attack the enemy base",
      "Наш захват": "Our capture", "Вражеский захват": "Enemy capture",
      "ПОЖАР": "FIRE", "Приказ": "Order",
      "Боекомплект пуст: пополните снаряды в ангаре": "No ammunition: restock shells in the hangar",
      "Огонь": "Fire", "Рем": "Repair", "Пож": "Extinguish", "Ком": "Command",
      "Тест-драйв: награды и прогресс отключены": "Test drive: rewards and progress disabled",
      "тест-драйв": "test drive", "серебро, золото и чертежи": "silver, gold and blueprints",
      "Бой засчитан как поражение": "Battle counted as a defeat",
      "Атаковать": "Attack", "Держать позицию": "Hold position",
      "Отступить": "Retreat", "Подарок за вход 4 июня: +500 золота": "June 4 login gift: +500 gold"
    });

    Object.assign(englishText, {
      "Продать": "Sell", "за": "for", "Снаряд": "Shell",
      "эффективность": "efficiency", "опыта экипажа": "crew XP",
      "Улучшить": "Upgrade", "Вместимость": "Capacity",
      "к оплате": "to pay", "серебра за снаряд": "silver per shell",
      "награда доступна": "reward available", "завершено этапов": "stages completed",
      "Сыграть бой на": "Play a battle in", "Нанести 1500 урона на технике": "Deal 1,500 damage in",
      "Уничтожить 2 танка на классе": "Destroy 2 tanks in class",
      "или компенсация": "or compensation", "дубль": "duplicate",
      "новый танк": "new tank", "Задание выполнено": "Mission complete",
      "Боевой пропуск": "Battle pass", "день": "day", "выполнен": "completed",
      "Награда боевого пропуска за день": "Battle pass reward for day",
      "получена": "claimed", "Ветка до": "Branch to",
      "полностью открыта": "fully unlocked", "танков": "tanks",
      "День": "Day", "Будет открыто": "Will unlock",
      "награда получена": "reward claimed", "ч.": "h",
      "Серия входов": "Login streak", "Сегодня получено": "Claimed today",
      "Сегодня": "Today", "Ограниченное событие": "Limited event",
      "августа": "August", "этапов": "stages", "Награда": "Reward",
      "Секретный проект": "Secret project",
      "коллекционный тяжёлый танк": "collectible heavy tank",
      "Завершите все этапы": "Complete all stages",
      "получен": "obtained", "Засчитываются обычные бои, дуэли, охота на командира, война и выживание.": "Regular battles, duels, commander hunt, war and survival count.",
      "Призы контейнера": "Container prizes", "Контейнер": "Container",
      "готов": "ready", "Открыть": "Open", "БК": "Ammo",
      "сер.": "silver", "Враги": "Enemies", "Осталось": "Remaining",
      "Усиление": "Boost", "Точки": "Points", "Враг": "Enemy",
      "базы": "base", "из": "of", "и": "and"
    });

    function registerTankEnglishNames(tanks) {
      englishTankNames.clear();
      tanks.forEach((tank) => {
        if (tank.name && tank.englishName) englishTankNames.set(tank.name, tank.englishName);
      });
      translationPattern = null;
      translateGameDocument();
    }

    function getTranslationPattern() {
      if (!translationPattern) {
        const keys = [...new Set([...englishTankNames.keys(), ...Object.keys(englishText)])]
          .sort((left, right) => right.length - left.length)
          .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        translationPattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${keys.join("|")})(?![\\p{L}\\p{N}])`, "gu");
      }
      return translationPattern;
    }

    function getAutomaticGameLanguage() {
      const language = window.ysdk?.environment?.i18n?.lang || window.lang || navigator.language || "ru";
      return String(language).toLowerCase().startsWith("ru") ? "ru" : "en";
    }

    function getGameLanguage() {
      const preference = typeof gameSettings !== "undefined" ? gameSettings.language : "auto";
      return preference === "ru" || preference === "en" ? preference : getAutomaticGameLanguage();
    }

    function localizeText(value) {
      if (activeGameLanguage !== "en" || typeof value !== "string") return value;
      return value.replace(getTranslationPattern(), (word) => englishTankNames.get(word) || englishText[word] || word)
        .replace(/(\d+(?:[.,]\d+)?) с(?=$|[^\p{L}\p{N}])/gu, "$1 s")
        .replace(/(\d+)с(?=\d|$)/gu, "$1s");
    }

    function translateGameDocument(root = document.documentElement) {
      if (!root) return;
      const translateNode = (node) => {
        if (/^(SCRIPT|STYLE)$/.test(node.parentElement?.tagName || "")) return;
        let record = originalUiText.get(node);
        if (!record || (node.nodeValue !== record.source && node.nodeValue !== record.rendered)) {
          record = { source: node.nodeValue, rendered: node.nodeValue };
          originalUiText.set(node, record);
        }
        const translated = localizeText(record.source);
        record.rendered = translated;
        if (node.nodeValue !== translated) node.nodeValue = translated;
      };
      if (root.nodeType === Node.TEXT_NODE) translateNode(root);
      else {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) translateNode(node);
      }
      const elements = root.nodeType === Node.ELEMENT_NODE
        ? [root, ...root.querySelectorAll("[title], [placeholder], [aria-label], [alt]")]
        : [];
      elements.forEach((element) => {
        let originals = originalUiAttributes.get(element);
        if (!originals) { originals = new Map(); originalUiAttributes.set(element, originals); }
        ["title", "placeholder", "aria-label", "alt"].forEach((attribute) => {
          if (!element.hasAttribute(attribute)) return;
          const current = element.getAttribute(attribute);
          let record = originals.get(attribute);
          if (!record || (current !== record.source && current !== record.rendered)) {
            record = { source: current, rendered: current };
            originals.set(attribute, record);
          }
          const translated = localizeText(record.source);
          record.rendered = translated;
          if (current !== translated) element.setAttribute(attribute, translated);
        });
      });
    }

    function applyGameLanguage() {
      activeGameLanguage = getGameLanguage();
      document.documentElement.lang = activeGameLanguage;
      document.title = activeGameLanguage === "en" ? "Tanks Wars" : "Танки Войны";
      translateGameDocument();
    }

    (function translateTextOutput() {
      const observer = new MutationObserver((mutations) => {
        const changed = new Set();
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") mutation.addedNodes.forEach((node) => changed.add(node));
          else changed.add(mutation.target);
        });
        changed.forEach((node) => translateGameDocument(node));
      });
      observer.observe(document.documentElement, { childList: true, characterData: true, attributes: true, subtree: true, attributeFilter: ["title", "placeholder", "aria-label", "alt"] });
      const fillText = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (text, ...args) { return fillText.call(this, localizeText(text), ...args); };
      const strokeText = CanvasRenderingContext2D.prototype.strokeText;
      CanvasRenderingContext2D.prototype.strokeText = function (text, ...args) { return strokeText.call(this, localizeText(text), ...args); };
    })();
