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
    },

    student: {
        roomNotFound: 'ოთახი ვერ მოიძებნა',
        codeLabel: (code: string) => `კოდი: ${code}`,
        lobbySub: (n: number) => `მალე დავიწყებთ · შემოვიდა ${n}`,
        lobbyHello: (name: string) => `გამარჯობა, ${name}! დაელოდეთ წამყვანს.`,
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
        winnersTitle: '🏆 გამარჯვებულები',
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
        hotkeys: 'Space=შემდეგი · R=შედეგები · →=რაუნდი · E=დასრულება',
        seedTitle: 'Demo: სატესტო პასუხები რეპეტიციისთვის',
    },

    remote: {
        title: 'პულტი',
        notes: 'ჩემი ჩანაწერები',
        pinListHeader: 'პასუხები, დააჭირეთ ვარსკვლავს ეკრანზე გამოსატანად',
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
        // секции спикер-скрипта на пульте
        scriptTitle: 'სცენარი',
        scriptCollapse: 'ჩაკეცვა',
        scriptExpand: 'გაშლა',
        script: {
            say: 'სათქმელი',
            example: 'მაგალითი',
            show: 'ჩვენება',
            ask: 'კითხვა აუდიტორიას',
            after: 'პასუხების შემდეგ',
            meta: 'შენიშვნა (არ წარმოთქვა)',
        },
    },

    stepper: {
        vote1: 'ხმა 1',
        discuss: 'დისკუსია',
        vote2: 'ხმა 2',
        result: 'შედეგი',
        answers: 'პასუხები',
    },
} as const
