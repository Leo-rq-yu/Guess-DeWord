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
    youArePicker: '你是出题者，等待其他玩家猜测',
    youGuessedCorrectly: '你已猜对！等待其他玩家...',
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
    loginToSaveScore: '登录以保存积分',
    
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
    youArePicker: "You're the picker, wait for others to guess",
    youGuessedCorrectly: 'You got it! Waiting for others...',
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
    loginToSaveScore: 'Login to save your score',
    
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
    
    // Errors
    roomNotFound: 'Room not found',
    roomFull: 'Room is full',
    roomStarted: 'Game already started',
    connectionError: 'Connection error',
  }
} as const;

export type TranslationKey = keyof typeof translations.zh;

