/**
 * Workshop Room — ALL user-facing UI strings in one place.
 *
 * ჩაასწორე აქ — კომპონენტები ამ ფაილიდან კითხულობენ.
 * Вопросы раундов / заметки ведущего / демо-ответы живут отдельно:
 * src/data/workshop-templates.ts
 */

export const STR = {
    common: {
        loading: 'იტვირთება...',
        reconnecting: 'კავშირი წყდება — ვცდილობთ აღდგენას...',
        ended: 'სემინარი დასრულდა',
        endedThanks: 'დიდი მადლობა მონაწილეობისთვის!',
    },

    student: {
        roomNotFound: 'ოთახი ვერ მოიძებნა',
        codeLabel: (code: string) => `კოდი: ${code}`,
        lobbySub: (n: number) => `მალე დავიწყებთ · შემოვიდა ${n}`,
        lobbyHello: (name: string) => `გამარჯობა, ${name}! დაელოდეთ წამყვანს.`,
    },

    nameGate: {
        roomLabel: (code: string) => `ოთახი ${code}`,
        title: 'მოგესალმებით!',
        sub: 'დაწერეთ თქვენი სახელი და შემოგვიერთდით',
        placeholder: 'თქვენი სახელი',
        join: 'შესვლა',
        joining: 'შესვლა...',
        errNotFound: 'ოთახი ვერ მოიძებნა',
        errEnded: 'სემინარი უკვე დასრულდა',
        errGeneric: 'შეცდომა მოხდა — სცადეთ თავიდან',
        errNetwork: 'კავშირის შეცდომა — სცადეთ თავიდან',
    },

    // Цветной баннер «что делать сейчас» на телефоне
    phaseBanner: {
        open: 'ახლა თქვენი ჯერია — უპასუხეთ',
        revote: 'ხელახლა მიეცით ხმა',
        discuss: 'განიხილეთ Meet-ის ჩატში',
        revealed: 'შეხედეთ წამყვანის ეკრანს',
        closed: 'მოემზადეთ...',
    },

    round: {
        waitHost: 'დაელოდეთ წამყვანს...',
        discussTitle: 'რატომ აირჩიეთ თქვენი პასუხი?',
        discussBody: 'დაწერეთ არგუმენტი ჩატში და წაიკითხეთ სხვების მოსაზრებები — შემდეგ ხელახლა მისცემთ ხმას.',
        errClosed: 'რაუნდი დაიხურა',
        errSend: 'ვერ გაიგზავნა — სცადეთ თავიდან',
        errNetwork: 'კავშირის შეცდომა',
    },

    submitted: {
        title: 'პასუხი მიღებულია',
        sub: 'დაელოდეთ შემდეგ რაუნდს',
        edit: 'პასუხის შეცვლა',
    },

    inputs: {
        textPlaceholder: 'თქვენი პასუხი...',
        send: 'გაგზავნა',
        sending: 'იგზავნება...',
        revoteHint: 'მეორე რაუნდი — შეგიძლიათ იგივე ან ახალი პასუხი',
        seconds: 'წამი',
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
    },

    // Бейдж фазы над вопросом на проекторе
    phaseBadge: {
        closed: 'დახურულია',
        open: 'ღიაა — პასუხები მოდის',
        discuss: 'დისკუსიის ფაზა',
        revote: 'ხელახალი ხმის მიცემა',
        revealed: 'შედეგები',
    },

    results: {
        noAnswers: 'პასუხები ჯერ არ არის',
        noAnswersWaiting: 'პასუხები ჯერ არ არის — ველოდებით...',
        pinTitle: 'დაამაგრე ეკრანზე',
        unpin: 'მოხსნა',
        totalVotes: (n: number) => `სულ ხმა: ${n}`,
        shiftMoved: (n: number) => `დისკუსიამ აზრი შეაცვლევინა ${n} მონაწილეს`,
        shiftSub: 'Peer Instruction მუშაობს — აზრის შეცვლა სწავლის ნიშანია',
        vote1: 'ხმა 1',
        vote2: 'ხმა 2',
        histTotal: (n: number) => `სულ: ${n}`,
        histAvg: 'საშუალო:',
        histSeconds: (n: number) => `${n} წამი`,
    },

    controls: {
        firstRound: 'პირველი რაუნდი',
        openRound: 'რაუნდის გახსნა',
        discuss: 'დისკუსია',
        reveal: 'შედეგები',
        revote: 'ხელახალი ხმის მიცემა',
        revealCompare: 'შედეგები (შედარება)',
        nextRound: 'შემდეგი რაუნდი',
        gateWarn: (a: number, b: number) =>
            `ჯერ მხოლოდ ${a}/${b}-მა უპასუხა — დააჭირეთ კიდევ ერთხელ, თუ მაინც გადახვალთ`,
        hotkeys: 'Space=შემდეგი · R=შედეგები · →=რაუნდი · E=დასრულება',
        seedTitle: 'Demo: სატესტო პასუხები რეპეტიციისთვის',
    },

    remote: {
        title: 'პულტი',
        notes: 'ჩემი ჩანაწერები',
        pinListHeader: 'პასუხები — დააჭირეთ ვარსკვლავს ეკრანზე გამოსატანად',
        unpin: 'დამაგრების მოხსნა',
        openDisplay: 'ეკრანის გახსნა (გასაზიარებლად)',
        stop: 'სემინარის დასრულება',
        stopConfirm: 'დიახ, დასრულება',
        stopCancel: 'არა',
    },

    stepper: {
        vote1: 'ხმა 1',
        discuss: 'დისკუსია',
        vote2: 'ხმა 2',
        result: 'შედეგი',
        answers: 'პასუხები',
    },
} as const
