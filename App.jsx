import { useState, useRef } from "react";

// ── Color palette ──────────────────────────────────────────────────────────────
const C = {
  red:"#B83232", redLight:"#F7E8E8",
  blue:"#1A4F7A", blueLight:"#E8F0F8", blueMid:"#2471A3",
  bg:"#F4F5F7", card:"#FFFFFF", border:"#DDE1E7",
  text:"#1C2833", muted:"#6B7280", light:"#EAECEF",
  green:"#1A6B3A", greenLight:"#E4F4EC",
};

const TABS = ["Home", "Flashcards", "B1 Review", "Grammar", "Word", "Chat"];

// ── Word of the Day data ───────────────────────────────────────────────────────
const WORD_OF_THE_DAY = [
  { kr:"반갑습니다",rom:"bangapseumnida",en:"Nice to meet you",origin:"From 반갑다 — a pure native Korean word expressing genuine delight at meeting someone.",uses:["Formal first meeting","After an introduction","More heartfelt than 안녕하세요 alone"],examples:[{kr:"처음 뵙겠습니다. 반갑습니다!",rom:"Cheoeum boepgesseumnida. Bangapseumnida!",en:"Nice to meet you for the first time!"},{kr:"만나서 반갑습니다.",rom:"Mannaseo bangapseumnida.",en:"I'm glad to meet you."}],tip:"Koreans often say this right after their name and job title when being introduced. Replying with the same phrase is perfectly natural."},
  { kr:"괜찮아요",rom:"gwaenchanayo",en:"It's okay / I'm fine / No worries",origin:"From 괜찮다 — universally used to express that something is acceptable or fine.",uses:["Declining an offer politely","Reassuring someone","Saying you're okay after a mishap"],examples:[{kr:"도와드릴까요? 아, 괜찮아요!",rom:"Dowadeurilkkayo? A, gwaenchanayo!",en:"Can I help you? Oh, I'm fine!"},{kr:"늦어서 미안해요. — 괜찮아요!",rom:"Neujeoseo mianhaeyo. — Gwaenchanayo!",en:"Sorry I'm late. — No worries!"}],tip:"This one word can replace 'sorry', 'no thank you', 'it's alright', and 'I'm okay' — incredibly versatile!"},
  { kr:"어서 오세요",rom:"eoseo oseyo",en:"Welcome!",origin:"어서 means 'quickly/hurry' and 오세요 means 'please come'. Together it expresses an eager, warm welcome.",uses:["Said by shopkeepers and restaurant staff","Welcoming guests to your home","You'll hear this constantly in Korea"],examples:[{kr:"어서 오세요! 몇 분이세요?",rom:"Eoseo oseyo! Myeot buniseyo?",en:"Welcome! How many in your party?"},{kr:"어서 오세요, 앉으세요!",rom:"Eoseo oseyo, anjeuseyo!",en:"Welcome, please sit down!"}],tip:"You don't need to respond to this — just smile and nod."},
  { kr:"잠깐만요",rom:"jamkkanmanyo",en:"Just a moment / One second",origin:"잠깐 means 'a brief moment' + 만 (only) + 요 (polite ending).",uses:["Asking someone to wait","Buying time when you don't understand","Stopping someone before they leave"],examples:[{kr:"잠깐만요! 질문이 있어요.",rom:"Jamkkanmanyo! Jilmuni isseoyo.",en:"One moment! I have a question."},{kr:"잠깐만요, 다시 말해주세요.",rom:"Jamkkanmanyo, dasi malhaejuseyo.",en:"Hold on, please say that again."}],tip:"Perfect phrase when you need a second to think."},
  { kr:"맛있어요",rom:"masisseoyo",en:"It's delicious",origin:"맛 (taste) + 있다 (to have/exist) = literally 'to have taste'.",uses:["Complimenting food at a restaurant","Thanking a host who cooked for you","Reacting to street food"],examples:[{kr:"와, 정말 맛있어요!",rom:"Wa, jeongmal masisseoyo!",en:"Wow, this is really delicious!"},{kr:"어머니, 음식이 너무 맛있어요.",rom:"Eomeoni, eumsigi neomu masisseoyo.",en:"Mom, the food is so delicious."}],tip:"Saying this to a Korean host is one of the best compliments you can give!"},
  { kr:"화이팅",rom:"hwaiting",en:"You can do it! / Go!",origin:"A Korean adaptation of the English word 'fighting' — used as a cheer of encouragement.",uses:["Cheering someone on before an exam","Encouraging a friend","Self-motivation"],examples:[{kr:"시험 잘 봐요! 화이팅!",rom:"Siheom jal bwayo! Hwaiting!",en:"Do well on your exam! You got this!"},{kr:"오늘도 화이팅!",rom:"Oneuldo hwaiting!",en:"You've got this today too!"}],tip:"It's one of those words that makes Koreans smile when a foreigner uses it naturally."},
  { kr:"천천히",rom:"cheoncheonhi",en:"Slowly / Take your time",origin:"From 천천하다 — a pure Korean expression meaning 'to be slow and relaxed'.",uses:["Asking someone to speak slower","Telling a driver to slow down","Telling yourself to relax"],examples:[{kr:"천천히 말해주세요.",rom:"Cheoncheonhi malhaejuseyo.",en:"Please speak slowly."},{kr:"천천히 드세요!",rom:"Cheoncheonhi deuseyo!",en:"Take your time eating!"}],tip:"천천히 드세요 is what Koreans say as food is served — like 'bon appétit'."},
];

// ── Grammar questions ──────────────────────────────────────────────────────────
const GRAMMAR_QUESTIONS = [
  { q:"Which particle marks the subject in Korean?",opts:["을/를","이/가","에서","한테"],ans:1,exp:"이/가 marks the subject. 을/를 marks the object."},
  { q:"How do you say 'I am a student'?",opts:["저는 학생이에요","나를 학생","학생은 저","저가 학생을"],ans:0,exp:"저는 학생이에요 — 저는 (I/topic), 학생이에요 (am a student)"},
  { q:"What does '고 싶어요' express?",opts:["Past tense","Want to do","Must do","Can do"],ans:1,exp:"~고 싶어요 expresses desire: 'I want to...'"},
  { q:"Which is the polite speech level ending?",opts:["-야","-어","-아요/어요","-지"],ans:2,exp:"-아요/어요 is the standard polite (존댓말) ending."},
  { q:"Korean sentence order is:",opts:["SVO","VSO","SOV","OVS"],ans:2,exp:"Korean follows Subject-Object-Verb order, unlike English."},
  { q:"Which particle marks the object of a verb?",opts:["이/가","은/는","을/를","에서"],ans:2,exp:"을/를 marks the direct object. Use 을 after consonant, 를 after vowel."},
  { q:"How do you make 하다 polite present tense?",opts:["하요","했어요","해요","하세요"],ans:2,exp:"하다 → 해요. All 하다 verbs follow this pattern."},
  { q:"What is the topic marker particle?",opts:["이/가","을/를","은/는","에"],ans:2,exp:"은/는 marks the topic. Use 은 after consonant, 는 after vowel."},
  { q:"What does 에 express when used with location?",opts:["Action at a place","Static location / existence","Direction","Time"],ans:1,exp:"에 marks static location with 있다/없다. 방에 있어요 = It's in the room."},
  { q:"What does 에서 express?",opts:["Static existence","Direction","Where an action happens","Possession"],ans:2,exp:"에서 = where an action takes place. 카페에서 공부해요."},
  { q:"Which counter is used for general objects?",opts:["마리","잔","개","권"],ans:2,exp:"개 is the general object counter. 사과 두 개 = two apples."},
  { q:"Which counter is used for animals?",opts:["개","마리","명","대"],ans:1,exp:"마리 is used for animals. 고양이 한 마리 = one cat."},
  { q:"What is the polite way to say 'Please give me X'?",opts:["X 줘","X 드려요","X 주세요","X 가져요"],ans:2,exp:"X 주세요 = Please give me X. 커피 주세요 = Coffee please."},
  { q:"What is the past tense ending for 하다 verbs?",opts:["했어요","하었어요","했습니다만","하아요"],ans:0,exp:"하다 → 했어요 (past). 공부하다 → 공부했어요."},
  { q:"How do you say 'I want to eat'?",opts:["먹어요","먹고 싶어요","먹을게요","먹었어요"],ans:1,exp:"Verb stem + 고 싶어요 = want to. 먹다 → 먹고 싶어요."},
  { q:"What does 안 do when placed before a verb?",opts:["Makes it past tense","Makes it negative","Makes it formal","Makes it a question"],ans:1,exp:"안 + verb = negation. 안 가요 = I'm not going."},
  { q:"What is the negative form of 있어요?",opts:["있지 않아요","없어요","아니에요","안 있어요"],ans:1,exp:"없어요 is the direct opposite of 있어요."},
  { q:"What does 도 mean as a particle?",opts:["Only","Also / Too","But","Because"],ans:1,exp:"도 = also, too, even. 저도 = me too."},
  { q:"What is the difference between 저 and 나?",opts:["No difference","저 is formal/polite, 나 is casual","나 is formal, 저 is casual","저 is for males only"],ans:1,exp:"저 = polite 'I'. 나 = casual 'I'."},
  { q:"What does ~(으)면 mean?",opts:["Even though","If / When","Because","But"],ans:1,exp:"~(으)면 = if / when. 시간이 있으면 = if you have time."},
];

// ── Flashcard data ─────────────────────────────────────────────────────────────
const BASE_CARDS = {
  "Verbs":[{kr:"먹다",rom:"meokda",en:"to eat"},{kr:"마시다",rom:"masida",en:"to drink"},{kr:"가다",rom:"gada",en:"to go"},{kr:"오다",rom:"oda",en:"to come"},{kr:"보다",rom:"boda",en:"to see / watch"},{kr:"듣다",rom:"deutda",en:"to listen"},{kr:"말하다",rom:"malhada",en:"to speak"},{kr:"읽다",rom:"ikda",en:"to read"},{kr:"쓰다",rom:"sseuda",en:"to write"},{kr:"자다",rom:"jada",en:"to sleep"},{kr:"일하다",rom:"ilhada",en:"to work"},{kr:"공부하다",rom:"gongbuhada",en:"to study"},{kr:"좋아하다",rom:"joahada",en:"to like"},{kr:"있다",rom:"itda",en:"to exist / to have"},{kr:"없다",rom:"eopda",en:"to not exist / to not have"},{kr:"하다",rom:"hada",en:"to do"},{kr:"만나다",rom:"mannada",en:"to meet"},{kr:"알다",rom:"alda",en:"to know"},{kr:"사다",rom:"sada",en:"to buy"},{kr:"주다",rom:"juda",en:"to give"},{kr:"받다",rom:"batda",en:"to receive"},{kr:"앉다",rom:"anda",en:"to sit"},{kr:"걷다",rom:"geotda",en:"to walk"},{kr:"뛰다",rom:"ttwida",en:"to run"},{kr:"만들다",rom:"mandeulda",en:"to make"},{kr:"씻다",rom:"ssitda",en:"to wash"},{kr:"기다리다",rom:"gidarida",en:"to wait"},{kr:"생각하다",rom:"saenggakada",en:"to think"},{kr:"시작하다",rom:"sijakhada",en:"to start"},{kr:"끝나다",rom:"kkeunnada",en:"to finish / end"}],
  "Expressions":[{kr:"안녕하세요",rom:"annyeonghaseyo",en:"Hello (formal)"},{kr:"감사합니다",rom:"gamsahamnida",en:"Thank you"},{kr:"잘 지내요",rom:"jal jinaeyo",en:"I'm doing well"},{kr:"괜찮아요",rom:"gwaenchanayo",en:"It's okay / I'm fine"},{kr:"모르겠어요",rom:"moreugesseoyo",en:"I don't know"},{kr:"다시 말해주세요",rom:"dasi malhaejuseyo",en:"Please say it again"},{kr:"맞아요",rom:"majayo",en:"That's right"},{kr:"아니요",rom:"aniyo",en:"No"},{kr:"네 / 예",rom:"ne / ye",en:"Yes"},{kr:"화이팅!",rom:"hwaiting!",en:"You got this!"},{kr:"잠깐만요",rom:"jamkkanmanyo",en:"Just a moment"},{kr:"어서 오세요",rom:"eoseo oseyo",en:"Welcome! (to a store)"},{kr:"여기요",rom:"yeogiyo",en:"Here you go / Excuse me"}],
  "Everyday Objects":[{kr:"물",rom:"mul",en:"water"},{kr:"커피",rom:"keopi",en:"coffee"},{kr:"밥",rom:"bap",en:"rice / cooked rice"},{kr:"김치",rom:"gimchi",en:"kimchi"},{kr:"라면",rom:"ramyeon",en:"ramen noodles"},{kr:"사과",rom:"sagwa",en:"apple"},{kr:"빵",rom:"ppang",en:"bread"},{kr:"연필",rom:"yeonpil",en:"pencil"},{kr:"가방",rom:"gabang",en:"bag"},{kr:"시계",rom:"sigye",en:"clock / watch"},{kr:"안경",rom:"angyeong",en:"glasses"},{kr:"휴대전화",rom:"hyudaejeonhwa",en:"mobile phone"},{kr:"지갑",rom:"jigap",en:"wallet"},{kr:"우산",rom:"usan",en:"umbrella"},{kr:"충전기",rom:"chungjeongi",en:"charger"},{kr:"이어폰",rom:"ieopon",en:"earphones"},{kr:"노트북",rom:"noteubuk",en:"laptop"},{kr:"마스크",rom:"maseukeu",en:"mask"}],
  "Home & Furniture":[{kr:"방",rom:"bang",en:"room"},{kr:"거실",rom:"geosil",en:"living room"},{kr:"부엌",rom:"bueok",en:"kitchen"},{kr:"화장실",rom:"hwajangsil",en:"bathroom"},{kr:"침대",rom:"chimdae",en:"bed"},{kr:"소파",rom:"sopa",en:"sofa"},{kr:"책상",rom:"chaeksang",en:"desk"},{kr:"의자",rom:"uija",en:"chair"},{kr:"냉장고",rom:"naengjanggo",en:"refrigerator"},{kr:"텔레비전",rom:"tellebijeon",en:"television"},{kr:"창문",rom:"changmun",en:"window"},{kr:"문",rom:"mun",en:"door"},{kr:"책",rom:"chaek",en:"book"}],
  "Locations":[{kr:"위",rom:"wi",en:"on top / above"},{kr:"아래",rom:"arae",en:"below / under"},{kr:"옆",rom:"yeop",en:"beside / next to"},{kr:"앞",rom:"ap",en:"in front of"},{kr:"뒤",rom:"dwi",en:"behind"},{kr:"안",rom:"an",en:"inside"},{kr:"밖",rom:"bak",en:"outside"},{kr:"병원",rom:"byeongwon",en:"hospital"},{kr:"학교",rom:"hakgyo",en:"school"},{kr:"식당",rom:"sikdang",en:"restaurant"},{kr:"공원",rom:"gongwon",en:"park"},{kr:"은행",rom:"eunhaeng",en:"bank"},{kr:"마트",rom:"mateu",en:"supermarket"},{kr:"공항",rom:"gonghang",en:"airport"},{kr:"편의점",rom:"pyeonuijeom",en:"convenience store"}],
  "Numbers & Counters":[{kr:"하나 / 한",rom:"hana / han",en:"1 (native Korean)"},{kr:"둘 / 두",rom:"dul / du",en:"2 (native Korean)"},{kr:"셋 / 세",rom:"set / se",en:"3 (native Korean)"},{kr:"넷 / 네",rom:"net / ne",en:"4 (native Korean)"},{kr:"다섯",rom:"daseot",en:"5 (native Korean)"},{kr:"열",rom:"yeol",en:"10 (native Korean)"},{kr:"개",rom:"gae",en:"counter: general objects"},{kr:"명 / 분",rom:"myeong / bun",en:"counter: people"},{kr:"마리",rom:"mari",en:"counter: animals"},{kr:"잔",rom:"jan",en:"counter: cups/glasses"},{kr:"권",rom:"gwon",en:"counter: books"},{kr:"병",rom:"byeong",en:"counter: bottles"}],
  "Days":[{kr:"월요일",rom:"woryoil",en:"Monday"},{kr:"화요일",rom:"hwayoil",en:"Tuesday"},{kr:"수요일",rom:"suyoil",en:"Wednesday"},{kr:"목요일",rom:"mogyoil",en:"Thursday"},{kr:"금요일",rom:"geumyoil",en:"Friday"},{kr:"토요일",rom:"toyoil",en:"Saturday"},{kr:"일요일",rom:"iryoil",en:"Sunday"},{kr:"오늘",rom:"oneul",en:"today"},{kr:"어제",rom:"eoje",en:"yesterday"},{kr:"내일",rom:"naeil",en:"tomorrow"},{kr:"주말",rom:"jumal",en:"weekend"},{kr:"아침",rom:"achim",en:"morning"},{kr:"저녁",rom:"jeonyeok",en:"evening"}],
  "Colors":[{kr:"빨간색",rom:"ppalganssaek",en:"red"},{kr:"파란색",rom:"paranssaek",en:"blue"},{kr:"노란색",rom:"noranssaek",en:"yellow"},{kr:"초록색",rom:"chorokssaek",en:"green"},{kr:"하얀색",rom:"hayanssaek",en:"white"},{kr:"검은색",rom:"geomeunssaek",en:"black"},{kr:"분홍색",rom:"bunhongssaek",en:"pink"},{kr:"보라색",rom:"borassaek",en:"purple"},{kr:"갈색",rom:"galssaek",en:"brown"}],
  "Adjectives":[{kr:"크다",rom:"keuda",en:"big"},{kr:"작다",rom:"jakda",en:"small"},{kr:"좋다",rom:"jota",en:"good / nice"},{kr:"나쁘다",rom:"nappeuda",en:"bad"},{kr:"맛있다",rom:"masitda",en:"delicious"},{kr:"비싸다",rom:"bissada",en:"expensive"},{kr:"싸다",rom:"ssada",en:"cheap"},{kr:"바쁘다",rom:"bappeuda",en:"busy"},{kr:"피곤하다",rom:"pigonhada",en:"tired"},{kr:"재미있다",rom:"jaemiitda",en:"fun / interesting"},{kr:"쉽다",rom:"swipda",en:"easy"},{kr:"어렵다",rom:"eoryeopda",en:"difficult"},{kr:"귀엽다",rom:"gwiyeopda",en:"cute"},{kr:"예쁘다",rom:"yeppeuda",en:"pretty"},{kr:"멋있다",rom:"meositda",en:"cool / stylish"}],
};

const REVERSE_CATS = new Set(["Numbers & Counters","Days","Colors","Adjectives"]);
const ALL_CARDS = Object.values(BASE_CARDS).flat();
const FLASHCARDS = { "🌀 Hybrid": ALL_CARDS, ...BASE_CARDS };
const ALL_CATS = Object.keys(FLASHCARDS);
const EMPTY_PROGRESS = () => Object.fromEntries(ALL_CATS.map(c => [c, []]));

// ── B1 Data ────────────────────────────────────────────────────────────────────
const B1_SUBTABS = ["Introductions","Occupations","Locations","Adjacencies","House Objects","Prices & Quantities"];
const B1_DATA = {
  "Introductions": [
    { q:"How do you say your name?", kr:"저는 [이름]이에요/예요.", rom:"Jeoneun [name]ieyo/yeyo.", en:"I am [name].", note:"Use 이에요 after consonant-ending syllable, 예요 after vowel-ending syllable." },
    { q:"How do you ask 'where are you from?'", kr:"어디에서 왔어요?", rom:"Eodie-seo wasseoyo?", en:"Where did you come from?", note:"Also: 어느 나라 사람이에요? = Which country are you from?" },
    { q:"How do you ask where someone lives?", kr:"어디에서 살아요?", rom:"Eodie-seo sarayo?", en:"Where do you live?", note:"Answer: [City]에 살아요 = I live in [City]." },
    { q:"How do you ask about family size?", kr:"가족이 몇 명이에요?", rom:"Gajogi myeot myeongieyo?", en:"How many people are in your family?", note:"Use native Korean numbers with 명." },
    { q:"How do you ask someone's job?", kr:"무슨 일 해요? / 직업이 뭐예요?", rom:"Museun il haeyo? / Jigibi mwoyeyo?", en:"What do you do? / What is your job?", note:"Both are natural. 무슨 일 해요 is slightly more casual." },
  ],
  "Occupations": [
    { q:"How do you say 'I am a student'?", kr:"저는 학생이에요.", rom:"Jeoneun haksaengieyo.", en:"I am a student.", note:"학생 ends in consonant → use 이에요." },
    { q:"How do you say 'I am a teacher'?", kr:"저는 선생님이에요.", rom:"Jeoneun seonsaengnim-ieyo.", en:"I am a teacher.", note:"선생님 ends in consonant → 이에요." },
    { q:"How do you say 'I am a doctor'?", kr:"저는 의사예요.", rom:"Jeoneun uisayeyo.", en:"I am a doctor.", note:"의사 ends in vowel → 예요." },
    { q:"How do you say 'I am a singer'?", kr:"저는 가수예요.", rom:"Jeoneun gasuyeyo.", en:"I am a singer.", note:"가수 ends in vowel → 예요." },
    { q:"How do you say 'I am an office worker'?", kr:"저는 회사원이에요.", rom:"Jeoneun hoesawon-ieyo.", en:"I am an office worker.", note:"회사원 ends in consonant → 이에요." },
  ],
  "Locations": [
    { q:"How do you ask 'where is it'?", kr:"어디에 있어요?", rom:"Eodie isseoyo?", en:"Where is it?", note:"어디 = where. 에 = location particle. 있어요 = it exists." },
    { q:"How do you say 'It is in the room'?", kr:"방에 있어요.", rom:"Bange isseoyo.", en:"It is in the room.", note:"방 = room. 에 = at/in (static location)." },
    { q:"How do you say 'I study at the café'?", kr:"카페에서 공부해요.", rom:"Kapeeseo gongbuhaeyo.", en:"I study at the café.", note:"에서 = where an action takes place." },
    { q:"How do you say 'I live in Seoul'?", kr:"서울에 살아요.", rom:"Seoure sarayo.", en:"I live in Seoul.", note:"에 = in (for living)." },
    { q:"How do you say 'I go to the hospital'?", kr:"병원에 가요.", rom:"Byeongwone gayo.", en:"I go to the hospital.", note:"에 = to (direction/destination)." },
  ],
  "Adjacencies": [
    { q:"How do you say 'on top of the desk'?", kr:"책상 위에 있어요.", rom:"Chaeksang wie isseoyo.", en:"It is on top of the desk.", note:"위 = above/on top." },
    { q:"How do you say 'under the bed'?", kr:"침대 아래에 있어요.", rom:"Chimdae araee isseoyo.", en:"It is under the bed.", note:"아래 = below/under." },
    { q:"How do you say 'next to the chair'?", kr:"의자 옆에 있어요.", rom:"Uija yeope isseoyo.", en:"It is next to the chair.", note:"옆 = beside/next to." },
    { q:"How do you say 'in front of the door'?", kr:"문 앞에 있어요.", rom:"Mun ape isseoyo.", en:"It is in front of the door.", note:"앞 = in front of." },
    { q:"How do you say 'behind the sofa'?", kr:"소파 뒤에 있어요.", rom:"Sopa dwie isseoyo.", en:"It is behind the sofa.", note:"뒤 = behind/back." },
  ],
  "House Objects": [
    { q:"Bed — sentence", kr:"방에 침대가 있어요.", rom:"Bange chimdaega isseoyo.", en:"There is a bed in the room.", note:"침대 = bed. 방 = room." },
    { q:"Desk — sentence", kr:"방에 책상이 있어요.", rom:"Bange chaeksangi isseoyo.", en:"There is a desk in the room.", note:"책상 = desk." },
    { q:"Refrigerator — sentence", kr:"부엌에 냉장고가 있어요.", rom:"Bueoge naengjanggo-ga isseoyo.", en:"There is a refrigerator in the kitchen.", note:"부엌 = kitchen. 냉장고 = refrigerator." },
    { q:"Wardrobe — sentence", kr:"옷장이 침대 옆에 있어요.", rom:"Otjang-i chimdae yeope isseoyo.", en:"The wardrobe is next to the bed.", note:"옷장 = wardrobe/closet." },
    { q:"Mirror — sentence", kr:"화장실에 거울이 있어요.", rom:"Hwajangsire geoul-i isseoyo.", en:"There is a mirror in the bathroom.", note:"거울 = mirror. 화장실 = bathroom." },
  ],
  "Prices & Quantities": [
    { q:"How do you ask 'how much?'", kr:"얼마예요?", rom:"Eolmayeyo?", en:"How much is it?", note:"이거 얼마예요? = How much is this?" },
    { q:"How do you say '1,000 won'?", kr:"천 원이에요.", rom:"Cheon won ieyo.", en:"It is 1,000 won.", note:"천 = 1,000. 만 = 10,000." },
    { q:"Counter: cups/glasses — 잔", kr:"잔", rom:"jan", en:"counter for cups / glasses", note:"커피 한 잔 = one cup of coffee." },
    { q:"Counter: general objects — 개", kr:"개", rom:"gae", en:"counter for general objects", note:"사과 두 개 = two apples." },
    { q:"Counter: animals — 마리", kr:"마리", rom:"mari", en:"counter for animals", note:"고양이 한 마리 = one cat." },
    { q:"How do you say 'Please give me ___'?", kr:"___ 주세요.", rom:"___ juseyo.", en:"Please give me ___.", note:"커피 한 잔 주세요! = One coffee please!" },
    { q:"How do you say 'it's too expensive'?", kr:"너무 비싸요.", rom:"Neomu bissayo.", en:"It's too expensive.", note:"너무 = too (much)." },
  ],
};

// ── System prompt ──────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert Korean language tutor helping a beginner-intermediate learner. 
Your role:
1. Have natural conversations in Korean (with English translations in parentheses)
2. Gently correct grammar/vocabulary mistakes inline
3. After each user message, provide a JSON feedback block at the END of your response in this exact format:
---FEEDBACK---
{"corrections": ["correction1"], "praise": ["praise1"], "tip": "one helpful tip", "newWords": ["word1 (meaning)"], "proficiency": 2}
---END---
Proficiency scale 1-5. Keep corrections gentle and encouraging. Mix Korean and English naturally for a beginner.`;

const INITIAL_GOALS = [
  { id:1, text:"Learn 50 common Korean words", done:false },
  { id:2, text:"Master basic sentence structure (SOV)", done:false },
  { id:3, text:"Practice Korean greetings & polite speech", done:false },
];

// ── B1Card sub-component ───────────────────────────────────────────────────────
function B1Card({ card, index, total, onMastered, onAgain }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:8, fontSize:13, color:C.muted }}>{index + 1} / {total}</div>
      <div style={{ background:"#fff", borderRadius:16, padding:"28px 24px", border:`1px solid ${C.border}`, marginBottom:16, minHeight:200, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
        <div style={{ fontSize:13, fontWeight:600, color:C.muted, marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>{card.q}</div>
        {!revealed ? (
          <button onClick={() => setRevealed(true)} style={{ marginTop:8, padding:"10px 28px", background:C.blue, color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontWeight:600, fontSize:14 }}>Reveal</button>
        ) : (
          <div style={{ width:"100%", marginTop:4 }}>
            <div style={{ fontSize:28, fontWeight:800, color:C.blue, marginBottom:4 }}>{card.kr}</div>
            <div style={{ fontSize:13, color:C.muted, fontStyle:"italic", marginBottom:6 }}>{card.rom}</div>
            <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:12 }}>{card.en}</div>
            {card.note && <div style={{ background:C.blueLight, borderRadius:10, padding:"8px 14px", fontSize:13, color:C.blue, textAlign:"left", lineHeight:1.6 }}>{card.note}</div>}
          </div>
        )}
      </div>
      {revealed && (
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={() => { setRevealed(false); onAgain(); }} style={{ padding:"10px 24px", background:"#fff", color:C.red, border:`1.5px solid ${C.red}`, borderRadius:10, cursor:"pointer", fontWeight:600 }}>Again</button>
          <button onClick={() => { setRevealed(false); onMastered(); }} style={{ padding:"10px 24px", background:"#fff", color:C.green, border:`1.5px solid ${C.green}`, borderRadius:10, cursor:"pointer", fontWeight:600 }}>Got it ✓</button>
        </div>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("Home");
  const [mode, setMode] = useState("casual");
  const [messages, setMessages] = useState([{ role:"assistant", text:"안녕하세요! I'm your Korean tutor. Let's start chatting! You can write in English or try some Korean — I'll help you along the way. 😊" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const todayWord = WORD_OF_THE_DAY[new Date().getDate() % WORD_OF_THE_DAY.length];
  const [fcCategory, setFcCategory] = useState("🌀 Hybrid");
  const [fcIndex, setFcIndex] = useState(0);
  const [fcRevealed, setFcRevealed] = useState(false);
  const [fcMastered, setFcMastered] = useState(EMPTY_PROGRESS());
  const [fcMissed, setFcMissed] = useState(EMPTY_PROGRESS());
  const [dailyMastered, setDailyMastered] = useState(EMPTY_PROGRESS());
  const [dailyMissed, setDailyMissed] = useState(EMPTY_PROGRESS());
  const [gqIndex, setGqIndex] = useState(0);
  const [gqSelected, setGqSelected] = useState(null);
  const [gqScore, setGqScore] = useState(0);
  const [gqDone, setGqDone] = useState(false);
  const [stats, setStats] = useState({ words:3, grammar:30, msgs:1 });
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [b1Sub, setB1Sub] = useState(B1_SUBTABS[0]);
  const [b1Index, setB1Index] = useState(0);
  const [b1Mastered, setB1Mastered] = useState({});

  const chatEndRef = useRef(null);
  const convHistory = useRef([]);

  const currentCards = FLASHCARDS[fcCategory] || [];
  const totalCards = currentCards.length;
  const totalMastered = (fcMastered[fcCategory] || []).length;
  const totalMissed = (fcMissed[fcCategory] || []).length;
  const dailyMasteredCount = Object.values(dailyMastered).flat().length;
  const dailyMissedCount = Object.values(dailyMissed).flat().length;
  const isReverse = REVERSE_CATS.has(fcCategory);
  const b1Cards = B1_DATA[b1Sub] || [];
  const b1MasteredCount = Object.keys(b1Mastered).length;
  const b1TotalCount = Object.values(B1_DATA).flat().length;

  const parseFeedback = (text) => {
    const match = text.match(/---FEEDBACK---\s*([\s\S]*?)\s*---END---/);
    const clean = text.replace(/---FEEDBACK---[\s\S]*?---END---/, "").trim();
    let fb = null;
    if (match) { try { fb = JSON.parse(match[1]); } catch {} }
    return { clean, feedback: fb };
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role:"user", text:userMsg }]);
    convHistory.current.push({ role:"user", content:userMsg });
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system: SYSTEM_PROMPT + (mode==="lesson"?"\n\nLESSON MODE: give structured teaching with examples.":""), messages:convHistory.current }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "Sorry, couldn't respond.";
      const { clean, feedback:fb } = parseFeedback(raw);
      convHistory.current.push({ role:"assistant", content:raw });
      setMessages(m => [...m, { role:"assistant", text:clean }]);
      if (fb) {
        setFeedback(fb);
        if (fb.newWords?.length) setStats(s=>({...s,words:s.words+fb.newWords.length,msgs:s.msgs+1}));
        if (fb.corrections?.length) setStats(s=>({...s,grammar:Math.min(100,s.grammar+5)}));
      }
    } catch { setMessages(m=>[...m,{role:"assistant",text:"Connection error. Please try again."}]); }
    setLoading(false);
    setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };

  // NOTE: The API key must be injected via a proxy or environment variable.
  // Never expose API keys in frontend code in production!

  return (
    <div style={{ fontFamily:"'Segoe UI', system-ui, sans-serif", background:C.bg, minHeight:"100vh", color:C.text, maxWidth:960, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.blue},${C.blueMid})`, padding:"12px 16px", display:"flex", alignItems:"center", position:"sticky", top:0, zIndex:10 }}>
        <span style={{ fontSize:24, marginRight:10 }}>🇰🇷</span>
        <div>
          <div style={{ fontWeight:800, fontSize:18, color:"#fff", letterSpacing:2 }}>KORHYEAN</div>
          <div style={{ fontSize:11, color:"#AED6F1" }}>나의 한국어 선생님</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:"#fff", borderBottom:`2px solid ${C.border}`, overflowX:"auto", position:"sticky", top:56, zIndex:9 }}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"10px 10px", border:"none", cursor:"pointer", fontWeight:600, fontSize:11, background:"transparent", color:tab===t?C.blue:C.muted, borderBottom:tab===t?`3px solid ${C.red}`:"3px solid transparent", whiteSpace:"nowrap", flex:1 }}>{t}</button>
        ))}
      </div>

      {/* HOME */}
      {tab==="Home" && (
        <div style={{ padding:20 }}>
          <div style={{ background:`linear-gradient(135deg,${C.blue},${C.blueMid})`, borderRadius:16, padding:"24px 20px", marginBottom:20, color:"#fff", textAlign:"center" }}>
            <div style={{ fontSize:28, fontWeight:800, marginBottom:4, letterSpacing:1 }}>KORHYEAN</div>
            <div style={{ fontSize:13, opacity:0.85 }}>나의 한국어 선생님 · Your Korean Learning Hub</div>
          </div>
          <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Go To</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
            {[{label:"Flashcards",desc:"Vocab decks by category",tab:"Flashcards"},{label:"B1 Review",desc:"Class slides & grammar",tab:"B1 Review"},{label:"Grammar Quiz",desc:"Test your grammar",tab:"Grammar"},{label:"Word of the Day",desc:"Daily vocab deep-dive",tab:"Word"},{label:"Chat Tutor",desc:"Practice conversation",tab:"Chat"}].map(({label,desc,tab:t})=>(
              <div key={label} onClick={()=>setTab(t)} style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:"14px", cursor:"pointer" }}>
                <div style={{ fontWeight:700, fontSize:13, color:C.blue, marginBottom:2 }}>{label}</div>
                <div style={{ fontSize:11, color:C.muted }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:18 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:12 }}>Progress</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.green, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Today</div>
                <div style={{ display:"flex", justifyContent:"space-around" }}>
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:20, fontWeight:800, color:C.green }}>{dailyMasteredCount}</div><div style={{ fontSize:10, color:C.muted }}>Knew</div></div>
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:20, fontWeight:800, color:C.red }}>{dailyMissedCount}</div><div style={{ fontSize:10, color:C.muted }}>Again</div></div>
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:20, fontWeight:800, color:C.blue }}>{stats.msgs}</div><div style={{ fontSize:10, color:C.muted }}>Msgs</div></div>
                </div>
              </div>
              <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.blue, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>All Time</div>
                <div style={{ display:"flex", justifyContent:"space-around" }}>
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:20, fontWeight:800, color:C.blue }}>{Object.values(fcMastered).flat().length}</div><div style={{ fontSize:10, color:C.muted }}>Cards</div></div>
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:20, fontWeight:800, color:C.green }}>{b1MasteredCount}/{b1TotalCount}</div><div style={{ fontSize:10, color:C.muted }}>B1</div></div>
                  <div style={{ textAlign:"center" }}><div style={{ fontSize:20, fontWeight:800, color:C.red }}>{stats.words}</div><div style={{ fontSize:10, color:C.muted }}>Words</div></div>
                </div>
              </div>
            </div>
            {[{label:"Vocabulary",val:Math.min(100,stats.words*4),color:C.blue},{label:"Grammar",val:stats.grammar,color:C.green},{label:"Flashcards",val:Math.round(Object.values(fcMastered).flat().length/ALL_CARDS.length*100)||0,color:C.blue},{label:"B1 Review",val:Math.round(b1MasteredCount/b1TotalCount*100)||0,color:C.green}].map(({label,val,color})=>(
              <div key={label} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                  <span style={{ color:C.muted }}>{label}</span><span style={{ color, fontWeight:700 }}>{val}%</span>
                </div>
                <div style={{ height:6, background:C.light, borderRadius:10, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${val}%`, background:color, borderRadius:10 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHAT */}
      {tab==="Chat" && (
        <div style={{ display:"flex", height:"calc(100vh - 108px)" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"8px 12px", background:"#fff", display:"flex", gap:8, borderBottom:`1px solid ${C.border}` }}>
              {["casual","lesson"].map(m=>(
                <button key={m} onClick={()=>setMode(m)} style={{ padding:"4px 14px", borderRadius:20, border:`1.5px solid ${mode===m?C.blue:C.border}`, background:mode===m?C.blueLight:"#fff", color:mode===m?C.blue:C.muted, fontWeight:600, fontSize:12, cursor:"pointer" }}>
                  {m==="casual"?"💬 Casual":"📚 Lesson"}
                </button>
              ))}
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:12, display:"flex", flexDirection:"column", gap:10 }}>
              {messages.map((m,i)=>(
                <div key={i} style={{ display:"flex", flexDirection:m.role==="user"?"row-reverse":"row", gap:6 }}>
                  <div style={{ maxWidth:"75%", background:m.role==="user"?C.redLight:"#fff", borderRadius:m.role==="user"?"16px 4px 16px 16px":"4px 16px 16px 16px", padding:"10px 14px", fontSize:14, lineHeight:1.6, border:`1px solid ${m.role==="user"?"#F1948A":C.border}` }}>{m.text}</div>
                </div>
              ))}
              {loading && <div style={{ fontSize:13, color:C.muted }}>튜터가 답변 중… ✍️</div>}
              <div ref={chatEndRef} />
            </div>
            {feedback && (
              <div style={{ background:C.blueLight, borderTop:`1px solid #AED6F1`, padding:"8px 12px", fontSize:12 }}>
                {feedback.praise?.[0] && <div style={{ color:C.green }}>✅ {feedback.praise[0]}</div>}
                {feedback.corrections?.[0] && <div style={{ color:C.red, marginTop:2 }}>💡 {feedback.corrections[0]}</div>}
                {feedback.tip && <div style={{ color:C.blue, marginTop:2 }}>🔑 {feedback.tip}</div>}
              </div>
            )}
            <div style={{ padding:"10px 12px", background:"#fff", borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Type in Korean or English…" style={{ flex:1, background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"10px 14px", fontSize:14, outline:"none" }} />
              <button onClick={sendMessage} disabled={loading} style={{ padding:"10px 16px", background:loading?C.muted:C.blue, color:"#fff", border:"none", borderRadius:12, cursor:"pointer", fontWeight:700, fontSize:16 }}>→</button>
            </div>
          </div>
          <div style={{ width:220, background:"#fff", borderLeft:`1px solid ${C.border}`, padding:14, overflowY:"auto", display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontWeight:700, fontSize:13, color:C.blue }}>📡 Live Feedback</div>
            {!feedback ? <div style={{ fontSize:12, color:C.muted }}>Send a message to get feedback…</div> : (
              <>
                {feedback.corrections?.length>0 && <div><div style={{ fontSize:11, fontWeight:700, color:C.red, marginBottom:4 }}>CORRECTIONS</div>{feedback.corrections.map((c,i)=><div key={i} style={{ fontSize:12, color:C.text, marginBottom:4, background:C.redLight, borderRadius:8, padding:"4px 8px" }}>💡 {c}</div>)}</div>}
                {feedback.praise?.length>0 && <div><div style={{ fontSize:11, fontWeight:700, color:C.green, marginBottom:4 }}>PRAISE</div>{feedback.praise.map((p,i)=><div key={i} style={{ fontSize:12, color:C.text, marginBottom:4, background:C.greenLight, borderRadius:8, padding:"4px 8px" }}>✅ {p}</div>)}</div>}
                {feedback.tip && <div><div style={{ fontSize:11, fontWeight:700, color:C.blue, marginBottom:4 }}>TIP</div><div style={{ fontSize:12, color:C.text, background:C.blueLight, borderRadius:8, padding:"4px 8px" }}>🔑 {feedback.tip}</div></div>}
                {feedback.newWords?.length>0 && <div><div style={{ fontSize:11, fontWeight:700, color:C.blue, marginBottom:4 }}>NEW WORDS</div>{feedback.newWords.map((w,i)=><div key={i} style={{ fontSize:12, color:C.text, marginBottom:4, background:C.blueLight, borderRadius:8, padding:"4px 8px" }}>{w}</div>)}</div>}
              </>
            )}
            <div style={{ marginTop:"auto" }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.blue, marginBottom:8 }}>🎯 GOALS</div>
              {goals.map(g=>(
                <div key={g.id} onClick={()=>setGoals(gs=>gs.map(x=>x.id===g.id?{...x,done:!x.done}:x))} style={{ fontSize:11, color:g.done?C.green:C.muted, marginBottom:6, cursor:"pointer", display:"flex", gap:6 }}>
                  <span>{g.done?"✅":"⬜"}</span><span style={{ textDecoration:g.done?"line-through":"none" }}>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FLASHCARDS */}
      {tab==="Flashcards" && (
        <div style={{ padding:16 }}>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:12 }}>
            {ALL_CATS.map(cat=>(
              <button key={cat} onClick={()=>{setFcCategory(cat);setFcIndex(0);setFcRevealed(false);}} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${fcCategory===cat?C.blue:C.border}`, background:fcCategory===cat?C.blueLight:"#fff", color:fcCategory===cat?C.blue:C.muted, fontWeight:600, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
                {cat}
              </button>
            ))}
          </div>
          {isReverse && <div style={{ background:C.blueLight, borderRadius:8, padding:"6px 12px", fontSize:12, color:C.blue, marginBottom:10 }}>Reverse mode — English shown, guess the Korean</div>}
          {currentCards.length>0 && (
            <>
              <div style={{ textAlign:"center", marginBottom:10, fontSize:13, color:C.muted }}>
                {fcIndex+1} / {totalCards} · <span style={{ color:C.green }}>{totalMastered} knew</span> · <span style={{ color:C.red }}>{totalMissed} again</span>
              </div>
              <div style={{ background:"#fff", borderRadius:16, padding:"32px 24px", textAlign:"center", border:`1.5px solid ${fcRevealed?C.blue:C.border}`, marginBottom:14, minHeight:180, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                {isReverse ? (
                  <>
                    <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>ENGLISH</div>
                    <div style={{ fontSize:24, fontWeight:700, color:C.text, marginBottom:8 }}>{currentCards[fcIndex].en}</div>
                    {fcRevealed && <div style={{ marginTop:10, borderTop:`1px solid ${C.border}`, paddingTop:10, width:"100%" }}>
                      <div style={{ fontSize:32, fontWeight:800, color:C.blue, marginBottom:4 }}>{currentCards[fcIndex].kr}</div>
                      <div style={{ fontSize:13, color:C.muted, fontStyle:"italic" }}>{currentCards[fcIndex].rom}</div>
                    </div>}
                  </>
                ) : (
                  <>
                    <div style={{ fontSize:36, fontWeight:800, color:C.blue, marginBottom:8 }}>{currentCards[fcIndex].kr}</div>
                    <div style={{ fontSize:14, color:C.muted }}>{currentCards[fcIndex].rom}</div>
                    {fcRevealed && <div style={{ marginTop:12, borderTop:`1px solid ${C.border}`, paddingTop:10, width:"100%", textAlign:"center" }}>
                      <div style={{ fontSize:18, fontWeight:600, color:C.text }}>{currentCards[fcIndex].en}</div>
                    </div>}
                  </>
                )}
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:12 }}>
                {!fcRevealed ? (
                  <button onClick={()=>setFcRevealed(true)} style={{ padding:"11px 32px", background:C.blue, color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontWeight:600 }}>Reveal</button>
                ) : (
                  <>
                    <button onClick={()=>{setFcMissed(p=>{const arr=[...(p[fcCategory]||[])];if(!arr.includes(fcIndex))arr.push(fcIndex);return{...p,[fcCategory]:arr}});setDailyMissed(p=>{const arr=[...(p[fcCategory]||[])];if(!arr.includes(fcIndex))arr.push(fcIndex);return{...p,[fcCategory]:arr}});setFcMastered(p=>{const arr=(p[fcCategory]||[]).filter(x=>x!==fcIndex);return{...p,[fcCategory]:arr}});setFcIndex(i=>(i+1)%totalCards);setFcRevealed(false);}} style={{ padding:"11px 24px", background:"#fff", color:C.red, border:`1.5px solid ${C.red}`, borderRadius:10, cursor:"pointer", fontWeight:600 }}>Again</button>
                    <button onClick={()=>{setFcMastered(p=>{const arr=[...(p[fcCategory]||[])];if(!arr.includes(fcIndex))arr.push(fcIndex);return{...p,[fcCategory]:arr}});setDailyMastered(p=>{const arr=[...(p[fcCategory]||[])];if(!arr.includes(fcIndex))arr.push(fcIndex);return{...p,[fcCategory]:arr}});setFcMissed(p=>{const arr=(p[fcCategory]||[]).filter(x=>x!==fcIndex);return{...p,[fcCategory]:arr}});setFcIndex(i=>(i+1)%totalCards);setFcRevealed(false);}} style={{ padding:"11px 24px", background:"#fff", color:C.green, border:`1.5px solid ${C.green}`, borderRadius:10, cursor:"pointer", fontWeight:600 }}>Got it ✓</button>
                  </>
                )}
              </div>
              <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:16 }}>
                <button onClick={()=>{setFcIndex(i=>(i-1+totalCards)%totalCards);setFcRevealed(false);}} style={{ padding:"7px 18px", background:C.light, border:"none", borderRadius:10, cursor:"pointer", color:C.text, fontSize:13 }}>← Prev</button>
                <button onClick={()=>{setFcIndex(i=>(i+1)%totalCards);setFcRevealed(false);}} style={{ padding:"7px 18px", background:C.light, border:"none", borderRadius:10, cursor:"pointer", color:C.text, fontSize:13 }}>Next →</button>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, justifyContent:"center" }}>
                {currentCards.map((_,i)=>{
                  const mastered=(fcMastered[fcCategory]||[]).includes(i);
                  const missed=(fcMissed[fcCategory]||[]).includes(i);
                  const isCurrent=i===fcIndex;
                  return <div key={i} onClick={()=>{setFcIndex(i);setFcRevealed(false);}} style={{ width:isCurrent?13:9, height:isCurrent?13:9, borderRadius:"50%", background:mastered?C.green:missed?C.red:"#CBD5E1", border:isCurrent?`2px solid ${C.blue}`:"2px solid transparent", cursor:"pointer", transition:"all 0.15s" }} />;
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* B1 REVIEW */}
      {tab==="B1 Review" && (
        <div style={{ padding:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <h2 style={{ color:C.blue, fontSize:17, margin:0, fontWeight:700 }}>B1 Class Review</h2>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>세종실용한국어 1</div>
            </div>
            <div style={{ background:C.blueLight, color:C.blue, borderRadius:16, padding:"4px 12px", fontSize:12, fontWeight:600 }}>{b1MasteredCount}/{b1TotalCount}</div>
          </div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
            {B1_SUBTABS.map(st=>(
              <button key={st} onClick={()=>{setB1Sub(st);setB1Index(0);}} style={{ padding:"6px 12px", borderRadius:16, border:`1.5px solid ${b1Sub===st?C.blue:C.border}`, background:b1Sub===st?C.blueLight:"#fff", color:b1Sub===st?C.blue:C.muted, fontWeight:600, fontSize:11, cursor:"pointer", whiteSpace:"nowrap" }}>
                {st}
              </button>
            ))}
          </div>
          {b1Cards.length > 0 && <B1Card card={b1Cards[b1Index]} index={b1Index} total={b1Cards.length} onMastered={()=>{ setB1Mastered(p=>({...p,[b1Sub+"_"+b1Index]:true})); setB1Index(i=>(i+1)%b1Cards.length); }} onAgain={()=>setB1Index(i=>(i+1)%b1Cards.length)} />}
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:14 }}>
            <button onClick={()=>setB1Index(i=>(i-1+b1Cards.length)%b1Cards.length)} style={{ padding:"8px 20px", background:C.light, border:"none", borderRadius:10, cursor:"pointer", color:C.text, fontWeight:600 }}>← Prev</button>
            <button onClick={()=>setB1Index(i=>(i+1)%b1Cards.length)} style={{ padding:"8px 20px", background:C.light, border:"none", borderRadius:10, cursor:"pointer", color:C.text, fontWeight:600 }}>Next →</button>
          </div>
        </div>
      )}

      {/* GRAMMAR */}
      {tab==="Grammar" && (
        <div style={{ padding:16 }}>
          <h2 style={{ color:C.blue, fontSize:18, marginBottom:16 }}>📝 Grammar Quiz</h2>
          {!gqDone ? (
            <>
              <div style={{ background:"#fff", borderRadius:16, padding:20, border:`1px solid ${C.border}`, marginBottom:16 }}>
                <div style={{ fontSize:13, color:C.muted, marginBottom:8 }}>Question {gqIndex+1} of {GRAMMAR_QUESTIONS.length}</div>
                <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:16 }}>{GRAMMAR_QUESTIONS[gqIndex].q}</div>
                {GRAMMAR_QUESTIONS[gqIndex].opts.map((opt,i)=>(
                  <button key={i} onClick={()=>{if(gqSelected!==null)return;setGqSelected(i);if(i===GRAMMAR_QUESTIONS[gqIndex].ans)setGqScore(s=>s+1);}}
                    style={{ display:"block", width:"100%", padding:"10px 16px", marginBottom:8, borderRadius:12, border:`1.5px solid ${gqSelected===null?C.border:i===GRAMMAR_QUESTIONS[gqIndex].ans?"#1E8449":i===gqSelected?C.red:C.border}`, background:gqSelected===null?"#fff":i===GRAMMAR_QUESTIONS[gqIndex].ans?"#D5F5E3":i===gqSelected?C.redLight:"#fff", cursor:gqSelected===null?"pointer":"default", textAlign:"left", fontSize:14, fontWeight:500 }}>
                    {opt}
                  </button>
                ))}
                {gqSelected!==null && <div style={{ background:C.blueLight, borderRadius:10, padding:"10px 14px", fontSize:13, color:C.blue, marginTop:8 }}>💡 {GRAMMAR_QUESTIONS[gqIndex].exp}</div>}
              </div>
              {gqSelected!==null && <button onClick={()=>{if(gqIndex+1>=GRAMMAR_QUESTIONS.length){setGqDone(true);}else{setGqIndex(i=>i+1);setGqSelected(null);}}} style={{ padding:"12px 28px", background:C.blue, border:"none", borderRadius:12, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:15 }}>{gqIndex+1>=GRAMMAR_QUESTIONS.length?"Finish":"Next Question →"}</button>}
            </>
          ) : (
            <div style={{ textAlign:"center", padding:32 }}>
              <div style={{ fontSize:52 }}>{gqScore>=Math.round(GRAMMAR_QUESTIONS.length*0.85)?"🏆":gqScore>=Math.round(GRAMMAR_QUESTIONS.length*0.6)?"⭐":"📚"}</div>
              <div style={{ fontSize:30, fontWeight:700, color:C.blue, marginTop:12 }}>{gqScore}/{GRAMMAR_QUESTIONS.length}</div>
              <div style={{ color:C.muted, marginTop:8 }}>{gqScore===GRAMMAR_QUESTIONS.length?"Perfect! 대단해요!":"Keep going! 화이팅!"}</div>
              <button onClick={()=>{setGqIndex(0);setGqSelected(null);setGqScore(0);setGqDone(false);}} style={{ marginTop:20, padding:"12px 28px", background:C.red, border:"none", borderRadius:12, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:15 }}>Try Again</button>
            </div>
          )}
        </div>
      )}

      {/* WORD OF THE DAY */}
      {tab==="Word" && (
        <div style={{ padding:16, maxWidth:560, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <h2 style={{ color:C.blue, fontSize:18, margin:0 }}>✨ Word of the Day</h2>
            <div style={{ background:C.blueLight, color:C.blue, borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:600 }}>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
          </div>
          <div style={{ background:`linear-gradient(135deg,${C.blue},${C.blueMid})`, borderRadius:20, padding:"28px 24px", textAlign:"center", marginBottom:14 }}>
            <div style={{ fontSize:44, fontWeight:800, color:"#fff", letterSpacing:1 }}>{todayWord.kr}</div>
            <div style={{ fontSize:16, color:"#AED6F1", marginTop:6 }}>{todayWord.rom}</div>
            <div style={{ marginTop:12, background:"rgba(255,255,255,0.15)", borderRadius:12, padding:"8px 18px", display:"inline-block" }}>
              <span style={{ fontSize:15, color:"#fff", fontWeight:600 }}>{todayWord.en}</span>
            </div>
          </div>
          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.red, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>📜 Word Origin</div>
            <div style={{ fontSize:14, color:C.text, lineHeight:1.7 }}>{todayWord.origin}</div>
          </div>
          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.red, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>💡 When to Use It</div>
            {todayWord.uses.map((u,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:4 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:C.blue, flexShrink:0, marginTop:6 }} />
                <span style={{ fontSize:14, color:C.text, lineHeight:1.6 }}>{u}</span>
              </div>
            ))}
          </div>
          <div style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.red, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>🗣️ Example Sentences</div>
            {todayWord.examples.map((ex,i)=>(
              <div key={i} style={{ background:C.blueLight, borderRadius:12, padding:"12px 14px", borderLeft:`3px solid ${C.blue}`, marginBottom:8 }}>
                <div style={{ fontSize:15, fontWeight:700, color:C.blue, marginBottom:3 }}>{ex.kr}</div>
                <div style={{ fontSize:12, color:C.blueMid, marginBottom:4, fontStyle:"italic" }}>{ex.rom}</div>
                <div style={{ fontSize:13, color:C.text }}>{ex.en}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"#FFFBEB", border:"1px solid #FCD34D", borderRadius:14, padding:"14px 16px" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#92400E", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>🌟 Pro Tip</div>
            <div style={{ fontSize:14, color:"#78350F", lineHeight:1.7 }}>{todayWord.tip}</div>
          </div>
        </div>
      )}
    </div>
  );
}
