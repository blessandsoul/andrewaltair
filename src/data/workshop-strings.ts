/**
 * Workshop Room, ALL user-facing UI strings in one place.
 *
 * ჩაასწორე აქ, კომპონენტები ამ ფაილიდან კითხულობენ.
 * Вопросы раундов / заметки ведущего / демо-ответы живут отдельно:
 * src/data/workshop-templates.ts
 */

export const STR = {
    common: {
        loading: 'იტვირთება...',
        reconnecting: 'კავშირი დაიკარგა, ვცდილობთ აღდგენას...',
        ended: 'ვორქშოპი დასრულდა',
        endedThanks: 'დიდი მადლობა მონაწილეობისთვის!',
    },

    // order (drag-and-drop) round results
    orderResults: {
        correct: 'სწორი თანმიმდევრობა',
        pct: (p: number, total: number) => `${p}% გამოიცნო · ${total} პასუხი`,
        yours: 'თქვენი თანმიმდევრობა',
    },

    // Projector end-of-workshop summary («Итоги»)
    stats: {
        title: 'შეჯამება',
        participants: 'მონაწილე',
        chosenPhoto: 'ჩვენი ფოტო',
        avgSecond: 'საშუალო წამი',
        avgSecondUnit: (v: number) => `${v} წმ`,
        quizCorrect: 'სწორი პასუხი',
        dreams: 'თქვენი ვიდეო-ოცნებები',
        created: (n: number) => `დღეს ${n} ვიდეო-იდეა დაიბადა`,
        leaderboard: 'ლიდერბორდი',
    },

    student: {
        roomNotFound: 'ოთახი ვერ მოიძებნა',
        codeLabel: (code: string) => `კოდი: ${code}`,
        lobbySub: (n: number) => `მალე დავიწყებთ · შემოვიდა ${n}`,
        lobbyHello: (name: string) => `გამარჯობა, ${name}! დაელოდეთ წამყვანს.`,
        questionPick: 'შენი ჯერია, აირჩიე კითხვა',
        questionWatch: 'უყურე ეკრანს',
    },

    // Online mode: a one-time "tap to enable sound" gate on the student's phone.
    studentSound: {
        enable: '🔊 ხმის ჩართვა',
        hint: 'ჩართე ხმა, გაიგებ როცა ახალი კითხვა გამოჩნდება',
        skip: 'ხმის გარეშე',
    },

    nameGate: {
        roomLabel: (code: string) => `ოთახი ${code}`,
        title: 'მოგესალმებით!',
        sub: 'დაწერეთ თქვენი სახელი და შემოგვიერთდით',
        placeholder: 'თქვენი სახელი',
        join: 'შესვლა',
        joining: 'შესვლა...',
        errNotFound: 'ოთახი ვერ მოიძებნა',
        errEnded: 'ვორქშოპი უკვე დასრულდა',
        errGeneric: 'შეცდომა მოხდა, სცადეთ თავიდან',
        errNetwork: 'კავშირის შეცდომა, სცადეთ თავიდან',
        errFull: 'ოთახი სავსეა',
        errName: 'სახელი არ დაიშვება, სცადეთ სხვა',
    },

    // Цветной баннер «что делать сейчас» на телефоне
    phaseBanner: {
        open: 'ახლა თქვენი ჯერია, უპასუხეთ',
        revote: 'ხელახლა მიეცით ხმა',
        discuss: 'განიხილეთ Meet-ის ჩატში',
        revealed: 'შეხედეთ წამყვანის ეკრანს',
        closed: 'მოემზადეთ...',
    },

    round: {
        waitHost: 'დაელოდეთ წამყვანს...',
        discussTitle: 'რატომ აირჩიეთ თქვენი პასუხი?',
        discussBody: 'აირჩიეთ მიზეზი ქვემოთ ან დაწერეთ თქვენი, შემდეგ ხელახლა მისცემთ ხმას.',
        pickTitle: 'აირჩიე მზა ვარიანტი ან დაწერე შენი',
        pickBody: 'დააჭირე ვარიანტს ქვემოთ ან ჩაწერე თავისი',
        reasonOwnPlaceholder: 'თქვენი მიზეზი...',
        reasonSubmitted: 'თქვენი მიზეზი მიღებულია',
        errClosed: 'რაუნდი დაიხურა',
        errSend: 'ვერ გაიგზავნა, სცადეთ თავიდან',
        errNetwork: 'კავშირის შეცდომა',
    },

    submitted: {
        title: 'პასუხი მიღებულია',
        sub: 'დაელოდეთ შემდეგ რაუნდს',
        edit: 'პასუხის შეცვლა',
    },

    predict: {
        title: '🎯 ფსონი: ვინ მოიგებს?',
        done: 'ფსონი მიღებულია',
        win: 'გამოიცანი! +15 ქულა',
        miss: 'ამჯერად ფსონი ვერ გავიდა',
    },

    diploma: {
        ready: 'შენი დიპლომი მზადაა! 🎉',
        share: 'გაზიარება',
        shareTitle: 'ჩემი AI ვორქშოპის დიპლომი',
        square: '1:1',
        story: '9:16',
    },

    inputs: {
        textPlaceholder: 'თქვენი პასუხი...',
        send: 'გაგზავნა',
        sending: 'იგზავნება...',
        revoteHint: 'მე-2 რაუნდი, შეგიძლიათ იგივე პასუხი დატოვოთ ან ახალი გაგზავნოთ',
        seconds: 'წამი',
        orderHint: 'გადაათრიეთ კადრები სწორი თანმიმდევრობით',
        multiHint: 'მონიშნეთ ყველა სწორი, შეიძლება რამდენიმე',
        orWriteOwn: 'ან დაწერე შენი ვარიანტი',
        ownPlaceholder: 'შენი ვარიანტი...',
    },

    display: {
        badLink: 'არასწორი ბმული',
        lobby: 'მოსაცდელი',
        roundOf: (i: number, n: number) => `რაუნდი ${i} / ${n}`,
        soundOn: 'ხმის ჩართვა',
        soundOff: 'ხმის გამორთვა',
        scanQr: 'დაასკანერეთ QR კოდი',
        joined: 'შემოვიდა',
        waiting: 'ველოდებით...',
        enableSound: '🔊 ჩართეთ ხმა',
        enableSoundHint: 'პასუხების ხმოვანი სიგნალისთვის, დააჭირეთ ერთხელ სანამ დაიწყებთ',
        enableSoundSkip: 'ხმის გარეშე გაგრძელება',
        wheelPicked: 'არჩეულია',
        winnersTitle: '🏆 ლიდერბორდი',
        topAnswersTitle: '🔥 ტოპ პასუხები',
        fastest: 'ყველაზე სწრაფი',
        leaderboard: 'ლიდერბორდი',
        teamboard: 'გუნდები',
    },

    // Бейдж фазы над вопросом на проекторе
    phaseBadge: {
        closed: 'დახურულია',
        open: 'ღიაა, პასუხები მოდის',
        discuss: 'დისკუსიის ფაზა',
        revote: 'ხელახალი ხმის მიცემა',
        revealed: 'შედეგები',
    },

    results: {
        noAnswers: 'პასუხები ჯერ არ არის',
        noAnswersWaiting: 'პასუხები ჯერ არ არის, ველოდებით...',
        pinTitle: 'ეკრანზე დამაგრება',
        unpin: 'დამაგრების მოხსნა',
        writeIns: 'თქვენი ვარიანტები',
        totalVotes: (n: number) => `სულ ხმა: ${n}`,
        shiftMoved: (n: number) => `დისკუსიამ ${n} მონაწილეს აზრი შეაცვლევინა`,
        shiftSub: 'Peer Instruction მუშაობს, აზრის შეცვლა სწავლის ნიშანია',
        vote1: 'ხმა 1',
        vote2: 'ხმა 2',
        histTotal: (n: number) => `სულ: ${n}`,
        histAvg: 'საშუალო:',
        histSeconds: (n: number) => `${n} წამი`,
        yourAnswer: 'თქვენი პასუხი',
        answersCount: (n: number) => `${n} პასუხი`,
        liveHint: 'პასუხები ცოცხლად ახლდება',
        winner: 'არჩეულია',
        winnerVotes: (n: number) => `${n} ხმა`,
        // F4: «кто поменял мнение и почему»
        movesTitle: 'ვინ შეიცვალა აზრი',
        moveChanged: 'შეიცვალა',
        moveKept: 'დარჩა',
        noReason: '-',
    },

    controls: {
        firstRound: 'პირველი რაუნდი',
        openRound: 'რაუნდის გახსნა',
        discuss: 'დისკუსია',
        reveal: 'შედეგები',
        revote: 'ხელახალი ხმის მიცემა',
        revealCompare: 'შედეგები (შედარება)',
        nextRound: 'შემდეგი რაუნდი',
        back: 'წინა სლაიდი',
        reopen: 'ხელახლა გახსნა',
        wheel: 'ბორბალი, შემთხვევითი მონაწილე',
        winners: 'გამარჯვებულები, ვინ უპასუხა სწორად',
        topAnswers: 'ტოპ პასუხები, ყველაზე გავრცელებული',
        gateWarn: (a: number, b: number) =>
            `ჯერ მხოლოდ ${a}/${b}-მა უპასუხა, თუ მაინც გადასვლა გსურთ, კიდევ ერთხელ დააჭირეთ`,
        startTimer: 'ტაიმერის დაწყება',
        hotkeys: 'Space=შემდეგი · R=შედეგები · →=რაუნდი · E=დასრულება',
        seedTitle: 'Demo: სატესტო პასუხები რეპეტიციისთვის',
    },

    remote: {
        title: 'პულტი',
        notes: 'ჩემი ჩანაწერები',
        pinListHeader: 'პასუხები, დააჭირეთ ვარსკვლავს ეკრანზე გამოსატანად',
        findersHeader: 'ვინ რა მონიშნა',
        unpin: 'დამაგრების მოხსნა',
        openDisplay: 'ეკრანის გახსნა (გასაზიარებლად)',
        stop: 'ვორქშოპის დასრულება',
        stopConfirm: 'დიახ, დასრულება',
        stopCancel: 'არა',
        // история ответов (приватная панель ведущего)
        history: 'პასუხების ისტორია',
        historyByName: 'სახელების მიხედვით',
        historyByRound: 'რაუნდების მიხედვით',
        historyEmpty: 'ჯერ პასუხები არ არის',
        historyLoading: 'იტვირთება…',
        historyError: 'ჩატვირთვა ვერ მოხერხდა',
        historyClose: 'დახურვა',
        // банк демо-промптов (кнопка-попап на пульте)
        vaultTitle: 'კინო-პრომპტი',
        vaultCopy: 'კოპირება',
        vaultCopied: 'დაკოპირდა ✓',
        vaultClose: 'დახურვა',
        // секции спикер-скрипта на пульте
        scriptTitle: 'სცენარი',
        scriptCollapse: 'ჩაკეცვა',
        scriptExpand: 'გაშლა',
        questionsTitle: 'კითხვები, დააჭირე ეკრანზე გამოსატანად',
        questionDone: 'ნაპასუხები',
        script: {
            say: 'სათქმელი',
            example: 'მაგალითი',
            show: 'ჩვენება',
            ask: 'კითხვა აუდიტორიას',
            after: 'პასუხების შემდეგ',
            meta: 'შენიშვნა (არ წარმოთქვა)',
        },
    },

    // живой чат + вопросы (телефон-док + модерация на пульте)
    chat: {
        // student dock
        chatTab: 'შეტყობინება',
        questionTab: 'კითხვა',
        placeholderChat: 'დაწერე შეტყობინება...',
        placeholderQuestion: 'დასვი კითხვა...',
        sent: 'გაგზავნილია ✓',
        // projector
        live: 'LIVE',
        audienceQuestion: 'აუდიტორიის კითხვა',
        onScreenNow: 'ეკრანზე ახლა',
        // host moderation
        tabChat: 'ჩატი',
        tabQuestions: 'კითხვები',
        empty: 'ჯერ შეტყობინებები არ არის',
        anon: 'ანონიმი',
        onScreen: 'ეკრანზე',
        toScreen: 'ეკრანზე გამოტანა',
        offScreen: 'ეკრანიდან მოხსნა',
        answered: 'ნაპასუხები',
        hide: 'დამალვა',
        flagged: 'ფლაგი',
        mute: 'გაჩუმება',
        answerPlaceholder: 'პასუხი ეკრანზე...',
        slowDown: 'ნელა, ცოტა დაიცადე',
        chatOff: 'ჩატი ახლა გამორთულია',
        askAnon: 'ანონიმურად',
        questionsAsked: 'დასმული კითხვები',
        lobbyHint: 'ჩატი ჩართულია, დაასკანერე და მოგვწერე',
    },

    // Host camera/mic broadcast (LiveKit). RU: видео-вещание ведущего.
    broadcast: {
        title: 'ვიდეო-ეთერი', // RU: видео-эфир
        goLive: 'ეთერში გასვლა', // RU: выйти в эфир
        stopLive: 'ეთერის შეწყვეტა', // RU: завершить эфир
        live: 'LIVE',
        connecting: 'უკავშირდება...', // RU: подключение
        hostLive: 'წამყვანი ეთერშია', // RU: ведущий в эфире
        watchingHost: 'პირდაპირი ეთერი', // RU: прямой эфир
        cameraBlocked: 'კამერა ვერ ჩაირთო, დართე უფლება ბრაუზერში', // RU: камера заблокирована, разреши доступ в браузере
        // publisher control bar
        micMute: 'მიკროფონის გამორთვა', // RU: выключить микрофон
        micUnmute: 'მიკროფონის ჩართვა', // RU: включить микрофон
        camOff: 'კამერის გამორთვა', // RU: выключить камеру
        camOn: 'კამერის ჩართვა', // RU: включить камеру
        screen: 'ეკრანის ჩვენება', // RU: демонстрация экрана
        screenStop: 'ჩვენების შეწყვეტა', // RU: остановить демонстрацию
        flip: 'კამერის გადართვა', // RU: переключить камеру
        devices: 'მოწყობილობები', // RU: устройства
        blur: 'ფონის დაბინდვა', // RU: размытие фона
        stillLive: 'ეთერი ჩართულია, განაახლე', // RU: эфир включён, возобнови (после перезагрузки)
        // viewer states
        starting: 'ეთერი იწყება...', // RU: эфир начинается
        hostOffline: 'წამყვანი დროებით გაჩერდა', // RU: ведущий временно остановил эфир
        reconnecting: 'ხელახლა დაკავშირება...', // RU: переподключение
        collapse: 'ჩაკეცვა', // RU: свернуть
        expand: 'გაშლა', // RU: развернуть
        sharing: 'ეკრანის ჩვენება', // RU: показ экрана (плашка над видео)
        audioOnly: 'მხოლოდ ხმა', // RU: только звук (экономия трафика)
        videoOn: 'ვიდეოს ჩართვა', // RU: включить видео
        // talkback (raise hand to speak)
        raiseHand: 'ხელის აწევა', // RU: поднять руку
        handRaised: 'ხელი აწეულია', // RU: рука поднята
        youCanSpeak: 'შეგიძლია ისაუბრო', // RU: тебе дали слово
        tapToSpeak: 'მიკროფონის ჩართვა', // RU: включить микрофон
        speaking: 'ლაპარაკობ', // RU: говоришь
        // host pult talkback
        raisedHandsTitle: 'ხელის ამწევები', // RU: подняли руку
        speakersTitle: 'ეთერში', // RU: в эфире (говорящие)
        grant: 'სიტყვის მიცემა', // RU: дать слово
        revoke: 'სიტყვის ჩამორთმევა', // RU: забрать слово
        speakingNow: 'საუბრობს', // RU: говорит (плашка на проекторе)
        captions: 'სუბტიტრები', // RU: субтитры
        snapshot: 'სტოპ-კადრი', // RU: стоп-кадр (снимок)
        airTime: 'ეთერის დრო', // RU: время эфира
        transcriptTitle: 'ეთერის ტრანსკრიპტი', // RU: транскрипт эфира
        record: 'ჩაწერა', // RU: запись эфира
        recordStop: 'ჩაწერის შეწყვეტა', // RU: остановить запись
        settings: 'პარამეტრები', // RU: параметры видео
        quality: 'ხარისხი', // RU: качество
        motion: 'მოძრაობა', // RU: движение (резкость/плавность)
        sharp: 'მკვეთრი', // RU: резкость
        smooth: 'გლუვი', // RU: плавность
        cameraLabel: 'კამერა', // RU: камера (выбор устройства)
        micLabel: 'მიკროფონი', // RU: микрофон (выбор устройства)
        cameraModeDesktop: 'ეს მოწყობილობა', // RU: это устройство (камера)
        cameraModeIphone: 'iPhone', // RU: iPhone (камера)
        phoneScanHint: 'დაასკანერე QR iPhone-ით', // RU: отсканируй QR айфоном
        phoneStart: 'ეთერის დაწყება', // RU: начать эфир
        phoneStop: 'შეჩერება', // RU: остановить
    },

    stepper: {
        vote1: 'ხმა 1',
        discuss: 'დისკუსია',
        vote2: 'ხმა 2',
        result: 'შედეგი',
        answers: 'პასუხები',
    },
} as const
