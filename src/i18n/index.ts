export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // App
    appName: '猜词大作战',
    welcome: '欢迎',
    
    // Nickname
    selectAvatar: '选择头像',
    nickname: '昵称',
    enterNickname: '输入你的昵称...',
    enterGame: '进入游戏',
    
    // Lobby
    createRoom: '创建房间',
    createNewRoom: '创建新游戏房间',
    enterRoomCode: '输入房间码',
    joinByCode: '通过房间码加入',
    publicRooms: '公开房间',
    noPublicRooms: '暂无公开房间',
    createRoomHint: '创建一个房间开始游戏吧！',
    join: '加入',
    players: '玩家',
    
    // Create Room Modal
    roomName: '房间名称',
    enterRoomName: '给房间起个名字...',
    roomType: '房间类型',
    public: '公开',
    visibleInLobby: '大厅可见',
    private: '私密',
    inviteOnly: '仅限邀请',
    cancel: '取消',
    create: '创建',
    
    // Join Room Modal
    roomCode: '房间码',
    enter6DigitCode: '输入6位房间码...',
    
    // Waiting Room
    waiting: '等待中',
    host: '房主',
    ready: '已准备',
    notReady: '未准备',
    offline: '掉线',
    online: '在线',
    startGame: '开始游戏',
    needMorePlayers: '至少需要2名玩家',
    waitingForPlayers: '等待所有玩家准备...',
    cancelReady: '取消准备',
    getReady: '准备',
    
    // Game
    round: '第 {n} 轮',
    pickingWord: '出题',
    timer: '倒计时',
    selectWord: '选择一个词语',
    afterSelectHint: '选择后其他玩家将开始猜测',
    waitingForPicker: '等待出题者选词',
    pickerSelecting: '正在选择词语...',
    realTimeRanking: '实时排名',
    picker: '出题',
    roundEnded: '本轮结束',
    correctAnswer: '正确答案是',
    preparingNextRound: '准备下一轮...',
    nextRound: '下一轮',
    waitingForHost: '等待房主开始下一轮...',
    
    // Chat
    guessChat: '猜词聊天',
    noGuessesYet: '还没有人猜测',
    beFirstToGuess: '快来第一个猜吧！',
    enterYourGuess: '输入你的猜测...',
    sendMessage: '发送消息...',
    youArePicker: '你是出题者，等待其他玩家猜测',
    youArePickerCanChat: '你是出题者，可以发送消息但不能透露答案哦',
    youGuessedCorrectly: '你已猜对！等待其他玩家...',
    youGuessedCorrectlyCanChat: '已猜对！可以继续聊天',
    guessedCorrectly: '猜对了！',
    yourWord: '你的词语是',
    youGuessedCorrectlyPoints: '你已猜对！获得 {n} 分',
    
    // Game End
    gameEnded: '游戏结束',
    finalRanking: '最终排名',
    backToLobby: '返回大厅',
    
    // Auth
    login: '登录',
    register: '注册',
    logout: '退出登录',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    anonymous: '匿名用户',
    totalScore: '总积分',
    gamesPlayed: '游戏场数',
    loginRequired: '请先登录',
    loginRequiredHint: '登录后即可创建房间或加入游戏',
    
    // Settings
    settings: '设置',
    language: '语言',
    chinese: '中文',
    english: 'English',
    
    // Status
    autoRefresh: '自动刷新',
    connecting: '连接中...',
    loginToSeeLobby: '登录后查看公开房间',
    loginToSeeLobbyHint: '登录后即可实时看到其他玩家创建的房间',
    
    // Hints
    hints: '提示',
    addHint: '添加提示',
    changeHint: '更改提示',
    noHintsYet: '出题人还没有给出提示',
    selectHintType: '选择提示类型',
    selectHintOption: '选择提示内容',
    backToTypes: '返回类型选择',
    alreadyUsed: '已使用',
    
    // How to Play - Full Page
    howToPlay: '游戏玩法',
    howToPlaySubtitle: '快速了解猜词大作战的规则',
    startPlaying: '开始游戏',
    
    step1Title: '第一步：创建或加入房间',
    step1Point1: '创建房间：点击"创建房间"，设置房间名称，选择公开或私密',
    step1Point2: '加入房间：输入6位房间码加入朋友的房间',
    step1Point3: '公开房间会显示在大厅，任何人都可以加入',
    roomCodeTip: '私密房间需要分享房间码给朋友才能加入',
    
    step2Title: '第二步：等待房间',
    step2Point1: '房主可以在所有人准备后开始游戏',
    step2Point2: '非房主玩家需要点击"准备"按钮',
    step2Point3: '需要至少2名玩家才能开始游戏',
    
    step3Title: '第三步：出题选词',
    step3Point1: '出题者从3个词语中选择1个',
    step3Point2: '其他玩家只能看到词语长度（下划线数量）',
    step3Point3: '同时会显示词语的分类提示',
    wordLengthExample: '词语长度示例',
    threeCharWord: '= 三个字',
    categoryExample: '分类提示',
    
    step4Title: '第四步：提示系统',
    step4Point1: '出题者最多可以发送5个提示',
    step4Point2: '每个提示由类型+内容组成（如：颜色 → 红色）',
    step4Point3: '选择合适的提示帮助队友猜词，但不能太简单',
    
    step5Title: '第五步：猜词',
    step5Point1: '在聊天区输入你的猜测',
    step5Point2: '可以无限次猜测，直到猜对为止',
    step5Point3: '猜对后会显示"+分数"，之后不能再发消息',
    
    step6Title: '第六步：得分',
    guesserScoring: '猜词者得分',
    pickerScoring: '出题者得分',
    pickerScoringDesc: '出题者根据未猜对人数得分：每个未猜对的玩家 = +20分',
    
    step7Title: '第七步：倒计时',
    step7Point1: '每轮有120秒的猜词时间',
    step7Point2: '所有人猜对则提前结束',
    step7Point3: '时间结束后揭晓答案，进入下一轮',
    
    proTips: '游戏小技巧',
    tip1: '作为出题者，选择适中难度的词语更容易获得高分',
    tip2: '善用提示系统，每个提示都要有价值',
    tip3: '猜词时先从最明显的特征开始推理',
    tip4: '注意其他玩家的猜测，可能会给你灵感',
    
    // How to Play - Game Rules Modal
    pickerGuide: '出题者指南',
    guesserGuide: '猜词者指南',
    gotIt: '我知道了',
    
    yourTask: '你的任务',
    pickerTask1: '你已选择词语，现在要通过提示帮助队友猜到它',
    pickerTask2: '但记住：不能直接说出答案或太明显的提示！',
    
    hintsGuide: '提示系统',
    hintsGuide1: '点击"添加提示"发送最多5个提示',
    hintsGuide2: '每个提示由类型（颜色/味道/形状等）和内容组成',
    
    chatGuide: '聊天功能',
    pickerChatGuide: '你可以在聊天区发送消息互动，但不能透露答案！',
    
    yourScoring: '你的得分',
    pickerScoringGuide: '每个没猜对的玩家给你+20分，所以适度的难度更好',
    pickerScoringExample: '例：4人游戏，2人没猜对 = 你得40分',
    
    wordClues: '词语线索',
    wordClues1: '观察下划线数量（词语长度）和分类提示开始推理',
    wordLength: '词语长度',
    category: '分类',
    
    hintsFromPicker: '出题者提示',
    hintsFromPicker1: '关注出题者发送的提示，它们是关键线索',
    hintsFromPicker2: '综合所有提示推理答案',
    
    howToGuess: '如何猜词',
    howToGuess1: '在聊天区输入你的答案并发送',
    howToGuess2: '可以无限次猜测，大胆尝试！',
    correctGuessNote: '猜对后你的答案会显示为"猜对了"，不会泄露给其他人',
    
    timeLimit: '时间限制',
    timeLimitNote: '本轮有120秒，抓紧时间！越早猜对分数越高',
    
    // Errors
    roomNotFound: '房间不存在',
    roomFull: '房间已满',
    roomStarted: '游戏已开始',
    connectionError: '连接错误',
  },
  en: {
    // App
    appName: 'Word Guess Battle',
    welcome: 'Welcome',
    
    // Nickname
    selectAvatar: 'Select Avatar',
    nickname: 'Nickname',
    enterNickname: 'Enter your nickname...',
    enterGame: 'Enter Game',
    
    // Lobby
    createRoom: 'Create Room',
    createNewRoom: 'Create a new game room',
    enterRoomCode: 'Enter Room Code',
    joinByCode: 'Join by room code',
    publicRooms: 'Public Rooms',
    noPublicRooms: 'No public rooms',
    createRoomHint: 'Create a room to start playing!',
    join: 'Join',
    players: 'Players',
    
    // Create Room Modal
    roomName: 'Room Name',
    enterRoomName: 'Name your room...',
    roomType: 'Room Type',
    public: 'Public',
    visibleInLobby: 'Visible in lobby',
    private: 'Private',
    inviteOnly: 'Invite only',
    cancel: 'Cancel',
    create: 'Create',
    
    // Join Room Modal
    roomCode: 'Room Code',
    enter6DigitCode: 'Enter 6-digit code...',
    
    // Waiting Room
    waiting: 'Waiting',
    host: 'Host',
    ready: 'Ready',
    notReady: 'Not Ready',
    offline: 'Offline',
    online: 'Online',
    startGame: 'Start Game',
    needMorePlayers: 'Need at least 2 players',
    waitingForPlayers: 'Waiting for players to ready up...',
    cancelReady: 'Cancel Ready',
    getReady: 'Ready',
    
    // Game
    round: 'Round {n}',
    pickingWord: 'Picking',
    timer: 'Timer',
    selectWord: 'Select a word',
    afterSelectHint: 'Others will start guessing after you select',
    waitingForPicker: 'Waiting for picker to choose',
    pickerSelecting: 'is selecting a word...',
    realTimeRanking: 'Live Ranking',
    picker: 'Picker',
    roundEnded: 'Round Ended',
    correctAnswer: 'The answer was',
    preparingNextRound: 'Preparing next round...',
    nextRound: 'Next Round',
    waitingForHost: 'Waiting for host to start next round...',
    
    // Chat
    guessChat: 'Guess Chat',
    noGuessesYet: 'No guesses yet',
    beFirstToGuess: 'Be the first to guess!',
    enterYourGuess: 'Enter your guess...',
    sendMessage: 'Send a message...',
    youArePicker: "You're the picker, wait for others to guess",
    youArePickerCanChat: "You're the picker - chat but don't reveal the answer!",
    youGuessedCorrectly: 'You got it! Waiting for others...',
    youGuessedCorrectlyCanChat: 'Correct! You can keep chatting',
    guessedCorrectly: 'Correct!',
    yourWord: 'Your word is',
    youGuessedCorrectlyPoints: 'Correct! +{n} points',
    
    // Game End
    gameEnded: 'Game Over',
    finalRanking: 'Final Ranking',
    backToLobby: 'Back to Lobby',
    
    // Auth
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    anonymous: 'Anonymous',
    totalScore: 'Total Score',
    gamesPlayed: 'Games Played',
    loginRequired: 'Login Required',
    loginRequiredHint: 'Please login to create or join a game',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    chinese: '中文',
    english: 'English',
    
    // Status
    autoRefresh: 'Auto-refresh',
    connecting: 'Connecting...',
    loginToSeeLobby: 'Login to see public rooms',
    loginToSeeLobbyHint: 'Sign in to see rooms created by other players in real-time',
    
    // Hints
    hints: 'Hints',
    addHint: 'Add Hint',
    changeHint: 'Change',
    noHintsYet: 'Picker hasn\'t given any hints yet',
    selectHintType: 'Select Hint Type',
    selectHintOption: 'Select Hint',
    backToTypes: 'Back to types',
    alreadyUsed: 'Already used',
    
    // How to Play - Full Page
    howToPlay: 'How to Play',
    howToPlaySubtitle: 'Learn the rules of Word Guess Battle',
    startPlaying: 'Start Playing',
    
    step1Title: 'Step 1: Create or Join a Room',
    step1Point1: 'Create Room: Click "Create Room", set a name, choose public or private',
    step1Point2: 'Join Room: Enter a 6-digit room code to join a friend\'s room',
    step1Point3: 'Public rooms are visible in the lobby for anyone to join',
    roomCodeTip: 'Private rooms require sharing the room code with friends',
    
    step2Title: 'Step 2: Waiting Room',
    step2Point1: 'The host can start the game when everyone is ready',
    step2Point2: 'Non-host players need to click "Ready"',
    step2Point3: 'At least 2 players are required to start',
    
    step3Title: 'Step 3: Word Selection',
    step3Point1: 'The picker chooses 1 word from 3 options',
    step3Point2: 'Other players only see the word length (underscores)',
    step3Point3: 'A category hint is also displayed',
    wordLengthExample: 'Word Length Example',
    threeCharWord: '= 3 characters',
    categoryExample: 'Category Hint',
    
    step4Title: 'Step 4: Hint System',
    step4Point1: 'The picker can send up to 5 hints',
    step4Point2: 'Each hint has a type + value (e.g., Color → Red)',
    step4Point3: 'Choose helpful hints but not too obvious!',
    
    step5Title: 'Step 5: Guessing',
    step5Point1: 'Type your guess in the chat area',
    step5Point2: 'You can guess unlimited times until correct',
    step5Point3: 'Correct guesses show "+points", then you can\'t send more messages',
    
    step6Title: 'Step 6: Scoring',
    guesserScoring: 'Guesser Scoring',
    pickerScoring: 'Picker Scoring',
    pickerScoringDesc: 'Picker scores based on players who didn\'t guess: each = +20 points',
    
    step7Title: 'Step 7: Timer',
    step7Point1: 'Each round has 120 seconds',
    step7Point2: 'Round ends early if everyone guesses correctly',
    step7Point3: 'When time runs out, the answer is revealed and next round begins',
    
    proTips: 'Pro Tips',
    tip1: 'As a picker, medium difficulty words score better',
    tip2: 'Use the hint system wisely - every hint should count',
    tip3: 'When guessing, start with the most obvious features',
    tip4: 'Watch other players\' guesses for inspiration',
    
    // How to Play - Game Rules Modal
    pickerGuide: 'Picker\'s Guide',
    guesserGuide: 'Guesser\'s Guide',
    gotIt: 'Got it!',
    
    yourTask: 'Your Task',
    pickerTask1: 'You\'ve chosen a word, now help others guess it with hints',
    pickerTask2: 'Remember: Don\'t reveal the answer or give obvious hints!',
    
    hintsGuide: 'Hint System',
    hintsGuide1: 'Click "Add Hint" to send up to 5 hints',
    hintsGuide2: 'Each hint has a type (color/taste/shape etc.) and value',
    
    chatGuide: 'Chat Feature',
    pickerChatGuide: 'You can chat to interact, but don\'t reveal the answer!',
    
    yourScoring: 'Your Scoring',
    pickerScoringGuide: 'Each player who doesn\'t guess = +20 points for you',
    pickerScoringExample: 'Example: 4 players, 2 didn\'t guess = you get 40 points',
    
    wordClues: 'Word Clues',
    wordClues1: 'Look at the underscores (word length) and category to start reasoning',
    wordLength: 'Word Length',
    category: 'Category',
    
    hintsFromPicker: 'Hints from Picker',
    hintsFromPicker1: 'Pay attention to hints - they\'re key clues',
    hintsFromPicker2: 'Combine all hints to deduce the answer',
    
    howToGuess: 'How to Guess',
    howToGuess1: 'Type your answer in the chat and send',
    howToGuess2: 'Guess as many times as you want!',
    correctGuessNote: 'Correct guesses show as "Correct!" - answer hidden from others',
    
    timeLimit: 'Time Limit',
    timeLimitNote: '120 seconds this round - be quick! Earlier guesses score higher',
    
    // Errors
    roomNotFound: 'Room not found',
    roomFull: 'Room is full',
    roomStarted: 'Game already started',
    connectionError: 'Connection error',
  }
} as const;

export type TranslationKey = keyof typeof translations.zh;

