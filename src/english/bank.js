(function(W){
'use strict';
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;};
const GENS=[];
const G=(c,t,l,w,f)=>GENS.push({c,t,l,w,f});
function mk(o){const a=String(o.a);const seen=new Set([a]);const d=[];for(const x of o.d){const s=String(x);if(!seen.has(s)){seen.add(s);d.push(s);}if(d.length===3)break;}const opts=shuf([a,...d]);return{q:o.q,p:o.p||null,zh:o.zh||null,opts,ans:opts.indexOf(a),ex:o.ex||''};}
function bank(c,t,w,items,lv,build){[1,2].forEach(l=>{const sub=items.filter(x=>lv(x)===l);if(sub.length)G(c,t,l,w,()=>build(pick(sub)));});}
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

/* ---------- verb helpers ---------- */
function s3(v){if(v==='have')return'has';if(v==='do')return'does';if(v==='go')return'goes';if(/[^aeiou]y$/.test(v))return v.slice(0,-1)+'ies';if(/(s|sh|ch|x|z|o)$/.test(v))return v+'es';return v+'s';}
const DBL={run:'running',swim:'swimming',sit:'sitting',stop:'stopping',get:'getting',put:'putting',cut:'cutting',begin:'beginning',hit:'hitting',shop:'shopping',win:'winning',forget:'forgetting',drop:'dropping'};
function ing(v){if(DBL[v])return DBL[v];if(/ie$/.test(v))return v.slice(0,-2)+'ying';if(/[^e]e$/.test(v))return v.slice(0,-1)+'ing';if(/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(v))return v+v.slice(-1)+'ing';return v+'ing';}

/* ========== GRAMMAR ========== */
const PAST=[
['Yesterday, Mei Ling ___ to the library.','go','went'],
['Last Sunday, we ___ a big cake for Grandma.','make','made'],
['Ravi ___ his homework after dinner last night.','do','did'],
['I ___ a strange noise outside my window last night.','hear','heard'],
['Siti ___ her umbrella on the bus yesterday.','leave','left'],
['We ___ many sharks at the aquarium last week.','see','saw'],
['Ben ___ a glass of milk this morning.','drink','drank'],
['The children ___ a song for their teacher yesterday.','sing','sang'],
['Dad ___ me a new storybook last weekend.','buy','bought'],
['Two days ago, the boys ___ football in the field.','play','played'],
['Last night, I ___ a funny dream.','have','had'],
['The baby ___ for two hours yesterday afternoon.','sleep','slept'],
['Mum ___ us a story at bedtime last night.','tell','told'],
['Kumar ___ the race last Friday.','win','won'],
['We ___ in the pool for an hour yesterday.','swim','swam'],
['Yesterday, a bird ___ into our classroom.','fly','flew'],
['Grandpa ___ a letter to me last month.','write','wrote'],
['I ___ my new shoes to school yesterday.','wear','wore'],
['Yesterday, the vase ___ when it fell off the table.','break','broke'],
['Last Saturday, Jun Jie ___ his bicycle to the park.','ride','rode'],
['Priya ___ a picture of the sea last week.','draw','drew'],
['Yesterday, the teacher ___ us some sweets.','give','gave'],
['I ___ my keys under the sofa this morning.','find','found'],
['The children ___ their lunch quickly yesterday.','eat','ate'],
['Mr Tan ___ his car to work last Monday.','drive','drove'],
['The cat ___ on the mat all afternoon yesterday.','sit','sat'],
['Ravi ___ the ball very high just now.','throw','threw'],
['I ___ Grandma a card on her birthday last week.','send','sent'],
['The school bell ___ at ten o’clock yesterday.','ring','rang'],
['Last night, the wind ___ very strongly.','blow','blew'],
['Yesterday, the man ___ the heavy box up the stairs.','carry','carried'],
['Last week, our class ___ a trip to the Science Centre.','take','took'],
['Mei ___ her mother wash the dishes last night.','help','helped'],
['Yesterday, it ___ heavily in the afternoon.','rain','rained'],
['I ___ my best friend at the playground last Sunday.','meet','met'],
['Yesterday, the thief ___ away from the police.','run','ran'],
['Last night, Dad ___ dinner for the whole family.','cook','cooked'],
['Ali ___ his best in the spelling test yesterday.','try','tried'],
['Kumar ___ his water bottle at home yesterday.','forget','forgot'],
['Last week, Hui Min ___ a sandcastle at the beach.','build','built'],
['Siti ___ the answer to the riddle just now.','know','knew'],
['Yesterday, Ben ___ off his bicycle.','fall','fell'],
['Last night, I ___ to bed at nine o’clock.','go','went'],
['Two weeks ago, we ___ a party for our teacher.','have','had'],
['The audience ___ loudly after the show last night.','clap','clapped'],
];
G('gram','Past tense · 过去式',1,1.2,()=>{const [s,b,p]=pick(PAST);const m=(s.match(/yesterday|last \w+|\w+ (?:days?|weeks?|months?) ago|just now|this morning/i)||['时间词'])[0];
  return mk({q:s,zh:'找一找句子里的时间词（yesterday / last … / … ago / just now）。',a:p,d:[b,s3(b),ing(b)],ex:`句子里有 “${m}”，说的是已经发生的事 → 用过去式：${b} → **${p}**。`});});

const SG=['My sister','Ali','He','She','My best friend','Siti','My cousin','Kumar','Mei Ling'];
const PL=['They','The boys','We','The children','My friends','Ali and Ben','I','You','The twins'];
const PF=[['walk','walked','to school','every day'],['drink','drank','milk','every morning'],['go','went','swimming','every Saturday'],['watch','watched','cartoons','every evening'],['play','played','chess','on Sundays'],['visit','visited','the library','every Friday'],['take','took','the bus to school','every morning'],['eat','ate','bread for breakfast','every day'],['fly','flew','kites in the park','every weekend'],['wash','washed','the dishes','every night'],['do','did','homework','every afternoon'],['brush','brushed','teeth before bed','every night'],['catch','caught','the school bus','every morning'],['feed','fed','the fish','every day']];
G('gram','Present tense · 现在时',1,1,()=>{const [b,p,r,t]=pick(PF);const sing=Math.random()<.55;const S=sing?pick(SG):pick(PL);
  let rest=r;if(b==='brush')rest=(S==='I'?'my':S==='You'?'your':sing?(['She','Siti','My sister','Mei Ling'].includes(S)?'her':'his'):S==='We'?'our':'their')+' teeth before bed';
  const a=sing?s3(b):b;const ex=sing?`“${t}” 说的是平常的习惯 → 用现在时。${S} 是一个人 → 动词加 s：**${a}**。`:(S==='I'||S==='You')?`“${t}” 说的是平常的习惯 → 用现在时。主语是 ${S} → 动词不加 s：**${a}**。`:`“${t}” 说的是平常的习惯 → 用现在时。${S} 是很多人 → 动词不加 s：**${a}**。`;
  return mk({q:`${S} ___ ${rest} ${t}.`,zh:'这是平常的习惯（every day…）。主语是一个人，还是很多人？',a,d:[sing?b:s3(b),p,ing(b)],ex});});

const CF=[['play','played','football in the field'],['swim','swam','in the pool'],['eat','ate','ice cream'],['run','ran','around the track'],['fly','flew','a kite'],['draw','drew','a dragon'],['sing','sang','a song'],['wash','washed','the car'],['ride','rode','a bicycle'],['bake','baked','a cake'],['climb','climbed','a tree'],['feed','fed','the ducks'],['build','built','a sandcastle'],['skip','skipped','with a rope']];
G('gram','Happening now · 进行时',1,.8,()=>{const [b,p,r]=pick(CF);const sing=Math.random()<.5;const S=sing?pick(SG):pick(PL.filter(x=>x!=='I'&&x!=='You'));const be=sing?'is':'are';const look=Math.random()<.5;
  const q=look?`Look! ${S} ___ ${r}.`:`${S} ___ ${r} right now.`;
  return mk({q,zh:'Look! / right now 表示“正在做”。主语是一个还是很多？',a:`${be} ${ing(b)}`,d:[`${sing?'are':'is'} ${ing(b)}`,sing?s3(b):b,p],ex:`“${look?'Look!':'right now'}” 表示正在发生 → is / are + ing。${S} 是${sing?'一个人，用 is':'很多人，用 are'}：**${be} ${ing(b)}**。`});});

const BE=[
['The children ___ very happy at the party yesterday.',['were','was','are','is'],'yesterday 是过去；children 是很多人 → **were**。'],
['My mother ___ a nurse.',['is','are','am','be'],'My mother 是一个人，说的是现在 → **is**。'],
['I ___ very hungry now.',['am','is','are','be'],'主语是 I → **am**。'],
['There ___ many apples in the basket now.',['are','is','am','be'],'many apples 是很多个 → **are**。'],
['Last year, Ben ___ in Primary 2.',['was','were','is','are'],'Last year 是过去；Ben 一个人 → **was**。'],
['Ali and I ___ in the same class.',['are','is','am','be'],'Ali and I 是两个人 → **are**。'],
['Where ___ my shoes? I cannot find them.',['are','is','am','be'],'shoes 是复数 → **are**。'],
['There ___ a lot of people at the beach last Sunday.',['were','was','are','is'],'last Sunday 是过去；people 是很多人 → **were**。'],
['Siti ___ two brothers.',['has','have','having','is'],'Siti 一个人 → **has**。'],
['We ___ art lessons every Friday.',['have','has','having','are'],'主语是 We → **have**。'],
['The dog ___ a long tail.',['has','have','is','having'],'The dog 是一只 → **has**。'],
['The weather ___ very hot yesterday.',['was','were','is','are'],'yesterday 是过去；weather 是一个 → **was**。'],
['___ you ready for the test?',['Are','Is','Am','Be'],'you 要用 **are**。'],
['My grandparents ___ a big garden.',['have','has','are','having'],'grandparents 是两个人 → **have**。'],
];
G('gram','is · are · was · were',1,.8,()=>{const [q,o,ex]=pick(BE);return mk({q,zh:'主语是一个还是很多？说的是现在还是过去？',a:o[0],d:o.slice(1),ex});});

const PRON=[
['Mei Ling lost her pencil, so Ben lent ___ his.',['her','she','hers','him'],'借给“她” → 放在动词后面用 **her**。',1],
['Ali and I are good friends. ___ play together every day.',['We','Us','Our','They'],'Ali and I = 我们，放在句子开头 → **We**。',1],
['Ravi is hungry. ___ wants some bread.',['He','Him','His','She'],'Ravi 是男孩，放在句子开头 → **He**。',1],
['The children waved at Mr Tan, and he waved back at ___.',['them','they','their','us'],'向“他们”挥手，放在 at 后面 → **them**。',1],
['This is my brother. ___ name is Jun.',['His','He','Him','Her'],'“他的”名字 → **His**。',1],
['Please give the book back to ___. It is my book.',['me','I','my','mine'],'放在 to 后面 → **me**。',1],
['Our teacher, Mrs Lee, is very kind. We like ___ very much.',['her','she','hers','him'],'Mrs Lee 是女的，放在 like 后面 → **her**。',1],
['The boys are playing football. Let us join ___.',['them','they','their','theirs'],'放在 join 后面 → **them**。',1],
['I can see a bird. ___ is singing in the tree.',['It','They','Its','Them'],'一只鸟 → **It**。',1],
['This bag belongs to me. It is ___.',['mine','my','me','I'],'“是我的”，后面没有东西了 → **mine**。',2],
['Mum baked a cake for Siti and me. She baked it for ___.',['us','we','our','them'],'Siti and me = 我们，放在 for 后面 → **us**。',2],
['The cat is licking ___ paws.',['its','it’s','it','their'],'its = 它的；it’s = it is。这里是“它的爪子” → **its**。',2],
['Ben and Kai lost ___ way in the park.',['their','there','they','them'],'“他们的”路 → **their**。there 是“那里”。',2],
['That pencil belongs to Siti. It is ___.',['hers','her','she','his'],'“是她的”，后面没有东西了 → **hers**。',2],
['My friends and ___ went to the zoo.',['I','me','my','mine'],'放在句子前面，是做事的人 → **I**。',2],
['Dad bought a present for my sister and ___.',['me','I','my','mine'],'放在 for 后面 → **me**。',2],
['Kumar hurt ___ when he fell off the swing.',['himself','him','his','he'],'伤到“他自己” → **himself**。',2],
];
bank('gram','Pronouns · 代词',.9,PRON,x=>x[3],([q,o,ex])=>mk({q,zh:'空格要的是：做事的人（he）、被做的人（him），还是“…的”（his）？',a:o[0],d:o.slice(1),ex}));

const PREP=[
['My birthday is ___ June.',['in','on','at','of'],'月份前面用 in：**in** June。'],
['We have art lessons ___ Friday.',['on','in','at','of'],'星期几前面用 on：**on** Friday。'],
['School starts ___ 7.30 a.m.',['at','on','in','of'],'几点几分前面用 at：**at** 7.30 a.m.。'],
['Siti is good ___ drawing.',['at','of','on','to'],'good **at** = 擅长。'],
['Ben is afraid ___ big dogs.',['of','at','from','with'],'afraid **of** = 害怕。'],
['Thank you ___ the lovely present.',['for','to','of','with'],'thank you **for** … = 谢谢你的……'],
['Please listen ___ your teacher.',['to','at','for','on'],'listen **to** = 听……'],
['We waited ___ the bus for twenty minutes.',['for','to','at','on'],'wait **for** = 等……'],
['This book belongs ___ Ravi.',['to','at','with','for'],'belong **to** = 属于。'],
['Look ___ the board, please.',['at','to','on','for'],'look **at** = 看……'],
['Mum cut the cake ___ eight pieces.',['into','on','at','of'],'cut **into** = 切成……'],
['Ali lives ___ Singapore.',['in','at','on','of'],'国家、城市前面用 **in**。'],
['Grandpa was born ___ 1955.',['in','on','at','of'],'年份前面用 **in**。'],
['We go to school ___ bus.',['by','on','in','with'],'by bus = 坐巴士：**by**。'],
['Hui Min shared her sweets ___ her friends.',['with','to','for','at'],'share **with** = 和……分享。'],
['I am proud ___ you!',['of','for','at','with'],'proud **of** = 为……骄傲。'],
['Dad is ___ work now.',['at','in','on','to'],'**at** work = 在上班。'],
['We will go cycling ___ the evening.',['in','on','at','of'],'**in** the morning / afternoon / evening。'],
['The stars come out ___ night.',['at','in','on','of'],'**at** night = 在晚上。'],
['Kumar is interested ___ dinosaurs.',['in','on','at','of'],'interested **in** = 对……感兴趣。'],
['Do not laugh ___ other people’s mistakes.',['at','to','on','for'],'laugh **at** = 嘲笑。'],
['The shop is open ___ Monday to Saturday.',['from','since','at','in'],'**from** … to … = 从……到……'],
];
G('gram','Prepositions · 介词',2,.8,()=>{const [q,o,ex]=pick(PREP);return mk({q,zh:'想一想：是时间、地点，还是固定搭配（good at / afraid of）？',a:o[0],d:o.slice(1),ex});});

const QUANT=[
['I bought ___ umbrella because it was raining.',['an','a','many','much'],'umbrella 第一个音是元音 u → **an**。',1],
['She is eating ___ orange.',['an','a','many','much'],'orange 第一个音是元音 o → **an**。',1],
['There is ___ cat sleeping on the roof.',['a','an','many','much'],'cat 第一个音不是元音 → **a**。',1],
['We saw ___ elephant at the zoo.',['an','a','many','much'],'elephant 第一个音是元音 e → **an**。',1],
['He wants to be ___ doctor when he grows up.',['a','an','many','much'],'doctor 第一个音不是元音 → **a**。',1],
['Ravi ate ___ egg for breakfast.',['an','a','many','much'],'egg 第一个音是元音 e → **an**。',1],
['It takes ___ hour to get there.',['an','a','many','much'],'hour 的 h 不发音，读起来是元音开头 → **an**。',2],
['There is only ___ water left in the bottle.',['a little','a few','many','several'],'water 不能一个一个数 → **a little**。',2],
['Can I have ___ sweets? Just two or three, please.',['a few','a little','much','an'],'sweets 可以一个一个数，又只要几个 → **a few**。',2],
['How ___ apples are there in the box?',['many','much','little','lot'],'apples 可以数 → How **many**。',2],
['How ___ sugar do you need?',['much','many','few','lot'],'sugar 不能数 → How **much**。',2],
['There are ___ books on the shelf.',['many','much','a little','an'],'books 可以数 → **many**。',2],
['Hurry up! We do not have ___ time left.',['much','many','a few','few'],'time 不能数 → **much**。',2],
['She put ___ salt in the soup, just a pinch.',['a little','a few','many','several'],'salt 不能数、又很少 → **a little**。',2],
['There are only ___ eggs in the fridge, so we need to buy more.',['a few','a little','much','an'],'eggs 可以数、又很少 → **a few**。',2],
];
bank('gram','a · an · many · much',.8,QUANT,x=>x[3],([q,o,ex])=>mk({q,zh:o.includes('an')&&o.includes('a')?'读一读后面那个词：第一个音是不是 a、e、i、o、u？':'后面的东西能不能一个一个数？',a:o[0],d:o.slice(1),ex}));

const CONJ=[
['I was hungry, ___ I ate a sandwich.',['so','because','but','although'],'先饿，结果去吃东西 → **so**（所以）。'],
['Mei Ling stayed at home ___ she was sick.',['because','so','but','or'],'在家的原因是生病 → **because**（因为）。'],
['Ben wanted to play outside, ___ it was raining.',['but','because','so','or'],'想出去玩，可是下雨 → **but**（但是）。'],
['___ it was raining, the children still played football.',['Although','Because','So','Or'],'虽然下雨，还是踢球 → **Although**（虽然）。'],
['Would you like tea ___ coffee?',['or','but','so','because'],'两样选一样 → **or**（还是）。'],
['Look left and right ___ you cross the road.',['before','after','because','although'],'过马路之前先看 → **before**（之前）。'],
['The bus was late, ___ we were late for school.',['so','because','but','or'],'巴士迟到，结果我们迟到 → **so**。'],
['Ravi is small, ___ he is very strong.',['but','so','because','or'],'个子小，但是很强壮 → **but**。'],
['Kumar opened the window ___ it was very hot.',['because','so','but','or'],'开窗的原因是热 → **because**。'],
['It was very hot, ___ Kumar opened the window.',['so','because','but','or'],'很热，所以开窗 → **so**。'],
['We waited under the shelter ___ the rain stopped.',['until','but','or','so'],'一直等到雨停 → **until**（直到）。'],
['I will call you ___ I reach home.',['when','but','so','or'],'到家的时候打电话 → **when**（……的时候）。'],
['___ he was very tired, Ali finished his homework.',['Although','Because','So','Or'],'虽然很累，还是做完 → **Although**。'],
['Hurry up, ___ you will miss the bus!',['or','because','until','when'],'快点，不然会错过 → **or**（不然）。'],
['Jun Jie was sleeping ___ the phone rang.',['when','so','or','because'],'他在睡觉的时候电话响了 → **when**。'],
['We played in the park ___ it got dark.',['until','or','so','because'],'一直玩到天黑 → **until**。'],
['He did not go to school ___ he had a fever.',['because','so','or','until'],'没上学的原因是发烧 → **because**。'],
['The shop was closed, ___ we went home.',['so','because','or','until'],'店关了，所以回家 → **so**。'],
['Siti likes apples ___ oranges.',['and','so','because','until'],'两样都喜欢 → **and**。'],
['Mum was cooking ___ Dad was washing the car.',['while','so','or','until'],'两件事同时发生 → **while**（同时）。'],
];
G('gram','Joining words · 连接词',2,.9,()=>{const [q,o,ex]=pick(CONJ);return mk({q,zh:'两部分是什么关系：原因、结果、但是、虽然，还是时间？',a:o[0],d:o.slice(1),ex});});

const DEM=[
['___ is my pencil. I am holding it in my hand.',['This','That','These','Those'],'在手上（近）、一支 → **This**。'],
['Look at ___ birds far away in the sky!',['those','this','these','that'],'远处、很多只 → **those**。'],
['___ shoes I am wearing now are new.',['These','This','That','Those'],'穿在身上（近）、一双（复数）→ **These**。'],
['Can you pass me ___ book over there?',['that','this','these','those'],'over there 远处、一本 → **that**。'],
['___ children sitting next to me are my cousins.',['These','This','That','Those'],'next to me 很近、很多人 → **These**。'],
['Do you see ___ tall building far away?',['that','this','these','those'],'远处、一栋 → **that**。'],
['I picked ___ flowers in my hand from the garden.',['these','this','that','those'],'在手里（近）、很多朵 → **these**。'],
['___ is my house over there, the one with the red roof.',['That','This','These','Those'],'over there 远处、一栋 → **That**。'],
];
G('gram','this · that · these · those',1,.5,()=>{const [q,o,ex]=pick(DEM);return mk({q,zh:'近还是远？一个还是很多？',a:o[0],d:o.slice(1),ex});});

const PLUR=[['box',['boxes','boxs','boxies','boxses']],['baby',['babies','babys','babyes','babis']],['leaf',['leaves','leafs','leafes','leavs']],['child',['children','childs','childrens','childes']],['mouse',['mice','mouses','mices','mousies']],['tooth',['teeth','tooths','teeths','toothes']],['foot',['feet','foots','feets','footes']],['sheep',['sheep','sheeps','sheepes','sheepies']],['man',['men','mans','mens','manes']],['knife',['knives','knifes','knifs','knivs']],['story',['stories','storys','storyes','storeis']],['bus',['buses','buss','busies','bussies']],['toy',['toys','toies','toyes','toyses']],['potato',['potatoes','potatos','potatoies','potatoss']],['woman',['women','womans','womens','womanes']],['goose',['geese','gooses','geeses','goosies']],['city',['cities','citys','cityes','citis']],['watch',['watches','watchs','watchies','watchess']],['dish',['dishes','dishs','dishies','dishess']],['wolf',['wolves','wolfs','wolfes','wolvs']],['brush',['brushes','brushs','brushies','brushess']],['monkey',['monkeys','monkies','monkeyes','monkeis']]];
/* plurals removed for the same reason: every distractor was a made-up wrong spelling (boxs, childs) */

const SYN=[
['I was tired.','I went to bed early.',['I was tired, so I went to bed early.','I was tired because I went to bed early.','I was tired, but I went to bed early.','I was tired or I went to bed early.'],'累了 → 结果早睡：用 **so**。'],
['Mei Ling stayed at home.','She was sick.',['Mei Ling stayed at home because she was sick.','Mei Ling stayed at home, so she was sick.','Mei Ling stayed at home, but she was sick.','Mei Ling was sick because she stayed at home.'],'在家的原因是生病：**because** 后面接原因。'],
['It was raining.','We still went to the park.',['Although it was raining, we still went to the park.','Because it was raining, we still went to the park.','It was raining, so we still went to the park.','It was raining because we still went to the park.'],'虽然下雨，还是去了：**Although**。'],
['The boy is my cousin.','He is wearing a red cap.',['The boy who is wearing a red cap is my cousin.','The boy which is wearing a red cap is my cousin.','The boy who is my cousin wearing a red cap.','The boy is my cousin who a red cap.'],'说明“是哪个男孩”：人后面用 **who**。'],
['Ali finished his homework.','Then he watched TV.',['After Ali finished his homework, he watched TV.','Before Ali finished his homework, he watched TV.','Ali finished his homework because he watched TV.','Ali finished his homework or he watched TV.'],'先做完功课，再看电视：**After**。'],
['Siti wanted to buy the doll.','She did not have enough money.',['Siti wanted to buy the doll, but she did not have enough money.','Siti wanted to buy the doll, so she did not have enough money.','Siti wanted to buy the doll because she did not have enough money.','Siti wanted to buy the doll or she did not have enough money.'],'想买，可是钱不够：**but**。'],
['The cake was delicious.','Mum baked the cake.',['The cake which Mum baked was delicious.','The cake who Mum baked was delicious.','Mum baked the cake was delicious.','The cake was delicious which Mum.'],'说明“是哪个蛋糕”：东西后面用 **which**。'],
['Kumar fell down.','He was running in the rain.',['Kumar fell down when he was running in the rain.','Kumar fell down, so he was running in the rain.','Kumar fell down, but he was running in the rain.','Kumar fell down or he was running in the rain.'],'摔倒发生在跑步的时候：**when**。'],
['Look both ways.','Then cross the road.',['Look both ways before you cross the road.','Look both ways after you cross the road.','Look both ways because you cross the road.','Look both ways, so you cross the road.'],'先看，再过马路：**before**。'],
['The girl is my sister.','She is singing on the stage.',['The girl who is singing on the stage is my sister.','The girl which is singing on the stage is my sister.','The girl is singing who is my sister on the stage.','The girl who is my sister singing on the stage.'],'说明“是哪个女孩”：人后面用 **who**。'],
['Hui Min was very nervous.','She did well in her piano exam.',['Although Hui Min was very nervous, she did well in her piano exam.','Because Hui Min was very nervous, she did well in her piano exam.','Hui Min was very nervous, so she did well in her piano exam.','Hui Min was very nervous until she did well in her piano exam.'],'虽然紧张，还是考得好：**Although**。'],
['Ben ran very fast.','He won the race.',['Ben ran very fast, so he won the race.','Ben ran very fast because he won the race.','Ben ran very fast, but he won the race.','Ben ran very fast or he won the race.'],'跑得快 → 结果赢了：**so**。'],
];
G('gram','Joining sentences · 句子合并',2,.7,()=>{const [a,b,o,ex]=pick(SYN);return mk({q:`Join the two sentences.\n① ${a}\n② ${b}`,zh:'两句话是什么关系？因为、所以、但是、虽然、先后，还是说明“哪一个”？',a:o[0],d:o.slice(1),ex});});

/* ========== WORDS ========== */
const VOC=[
['The elephant was **enormous**. It was as big as a lorry.','enormous',['very big','very small','very noisy','very slow'],'巨大的',1],
['The ant is **tiny**. You can hardly see it.','tiny',['very small','very big','very fast','very angry'],'很小的',1],
['The chicken rice was **delicious**. I wanted another plate.','delicious',['tasted very good','tasted bad','was very hot','was very cheap'],'好吃的',1],
['The kitten was **frightened** by the thunder and hid under the bed.','frightened',['scared','sleepy','excited','hungry'],'害怕的',1],
['The **brave** firefighter ran into the burning house to save the boy.','brave',['not afraid','very lazy','very rude','very weak'],'勇敢的',1],
['Our **cheerful** neighbour always smiles and says hello.','cheerful',['happy','sad','angry','tired'],'开朗的、高兴的',1],
['It is **polite** to say “thank you”.','polite',['showing good manners','rude','lazy','funny'],'有礼貌的',1],
['It is **rude** to shout at your grandparents.','rude',['not polite','very kind','very brave','very quiet'],'没礼貌的',1],
['His shoes were **filthy** after he played in the mud.','filthy',['very dirty','very new','very clean','very small'],'非常脏的',1],
['Mei was **delighted** with her birthday present.','delighted',['very pleased','very angry','very scared','very tired'],'很高兴的',1],
['The new boy felt **lonely** because he had no friends yet.','lonely',['sad and alone','happy and busy','angry','proud'],'孤单的',1],
['Be **gentle** with the baby rabbit.','gentle',['soft and careful','rough','loud','quick'],'温柔的、轻轻的',1],
['The water is **shallow**, so the children can stand in it.','shallow',['not deep','very deep','very cold','very dirty'],'浅的',1],
['Phil was **fearless**. He was not scared of anything.','fearless',['not afraid at all','very afraid','very hungry','very loud'],'无所畏惧的',1],
['Can you **fetch** the ball for me?','fetch',['go and bring back','throw away','kick','hide'],'去拿来',1],
['Oh no! Ben **spilt** the milk all over the table.','spilt',['let it pour out by accident','drank it all','bought it','heated it'],'不小心洒了',1],
['Dad was **furious** when the window broke. His face turned red.','furious',['very angry','very happy','very sleepy','very hungry'],'非常生气的',2],
['After running ten rounds, Ali was **exhausted** and lay down.','exhausted',['very tired','very excited','very cold','very proud'],'筋疲力尽的',2],
['Kai was **curious** about the box. He wanted to know what was inside.','curious',['wanting to find out','feeling sleepy','feeling angry','not interested'],'好奇的',2],
['Grandpa is **grumpy** when he is woken up early. He frowns and complains.','grumpy',['in a bad mood','very cheerful','very quiet','very generous'],'脾气不好的',2],
['Siti is **generous**. She always shares her snacks with others.','generous',['happy to give','unwilling to share','very shy','very clever'],'大方的',2],
['Mei **shivered** in the cold rain.','shivered',['shook because of the cold','laughed loudly','ran quickly','fell asleep'],'发抖',2],
['Ben **whispered** the secret so that no one else could hear.','whispered',['spoke very softly','shouted','sang','cried'],'小声说',2],
['The hungry boy **gobbled** up his food in one minute.','gobbled',['ate very quickly','ate very slowly','threw away','cooked'],'狼吞虎咽',2],
['Be careful with the glass. It is **fragile**.','fragile',['breaks easily','very heavy','very cheap','very dirty'],'易碎的',2],
['The towel is still **damp**. It has not dried yet.','damp',['a little wet','very dry','very hot','very soft'],'潮湿的',2],
['Ravi **glanced** at the clock and kept writing.','glanced',['looked quickly','looked for a long time','closed his eyes','pointed'],'很快地看一眼',2],
['Hui Min felt **nervous** before her piano exam. Her hands were shaking.','nervous',['worried','proud','bored','sleepy'],'紧张的',2],
['The **ancient** temple was built a thousand years ago.','ancient',['very old','very new','very tall','very dirty'],'古老的',2],
['The sea was **sparkling** in the sunlight.','sparkling',['shining brightly','very dark','very cold','very noisy'],'闪闪发光',2],
['The cat **crept** quietly towards the bird.','crept',['moved slowly and quietly','jumped high','ran noisily','flew'],'悄悄地爬过去',2],
['We were **drenched** after walking in the heavy rain.','drenched',['very wet','very dry','very warm','very clean'],'湿透的',2],
['Mum **scolded** Ben for breaking the vase.','scolded',['spoke angrily to him','praised him','hugged him','ignored him'],'责骂',2],
['The teacher **praised** Siti for her neat work.','praised',['said good things about her','shouted at her','laughed at her','punished her'],'表扬',2],
['The **stubborn** goat would not move, no matter how hard we pulled.','stubborn',['refusing to change','very kind','very small','very fast'],'固执的',2],
['The magician waved his wand and the rabbit **disappeared**.','disappeared',['could not be seen any more','grew bigger','came back','fell down'],'消失了',2],
['The tired runner **collapsed** at the finish line.','collapsed',['fell down','jumped up','shouted','waved'],'倒下',2],
['Kai **peered** through the window to see who was outside.','peered',['looked carefully','knocked','shouted','ran'],'仔细地看',2],
['The **clumsy** boy kept dropping things.','clumsy',['often drops or bumps into things','very careful','very neat','very quiet'],'笨手笨脚的',2],
['It was a **scorching** day, so we stayed indoors.','scorching',['very hot','very cold','very rainy','very windy'],'非常炎热的',2],
['Grandma cooked a **feast** for Chinese New Year.','feast',['a big meal','a small snack','a game','a song'],'丰盛的大餐',2],
['We were **astonished** to see snow in Singapore!','astonished',['very surprised','very bored','very sleepy','very angry'],'非常吃惊的',2],
['The mouse **scurried** into its hole.','scurried',['ran quickly with small steps','walked slowly','flew','swam'],'急匆匆地跑',2],
['The sky was **gloomy**, so we brought our umbrellas.','gloomy',['dark and grey','bright and sunny','very clear','very hot'],'阴沉的',2],
['A lion is a **predator**. It hunts other animals for food.','predator',['an animal that hunts others','an animal that eats only plants','a baby animal','a pet'],'捕食者',2],
['The mouse is the owl’s **prey**.','prey',['an animal that is hunted','a hunter','a home','a friend'],'猎物',2],
['The puppy **wagged** its tail when it saw Ben.','wagged',['moved from side to side','bit','hid','washed'],'摇（尾巴）',1],
['The room was so **tidy** that Mum smiled.','tidy',['neat','messy','dark','noisy'],'整齐的',1],
['The baby **giggled** when Dad made a funny face.','giggled',['laughed softly','cried','shouted','slept'],'咯咯地笑',1],
['Ali **grabbed** the ball before it rolled into the drain.','grabbed',['took hold of it quickly','kicked it','threw it','looked at it'],'一把抓住',1],
['The **sleepy** boy yawned and rubbed his eyes.','sleepy',['wanting to sleep','very angry','wide awake','very hungry'],'困的',1],
['The old bridge was **dangerous**, so nobody was allowed to cross it.','dangerous',['not safe','very new','very pretty','very long'],'危险的',1],
['Mum **wiped** the table with a cloth.','wiped',['cleaned it by rubbing','painted it','broke it','moved it'],'擦',1],
['Siti **hugged** her grandmother tightly.','hugged',['held her in her arms','pushed her','called her','waved at her'],'拥抱',1],
['A sports car **zoomed** past us.','zoomed',['went past very fast','stopped','went slowly','turned back'],'飞驰而过',1],
['The hikers finally **reached** the top of the hill.','reached',['arrived at','left','fell off','looked for'],'到达',1],
['The kitten **purred** happily on Mei’s lap.','purred',['made a soft, happy sound','scratched','jumped down','cried loudly'],'（猫）满足地呼噜呼噜',2],
['Kumar **hesitated** before he jumped into the pool.','hesitated',['stopped for a moment because he was unsure','jumped at once','laughed','shouted'],'犹豫',2],
['The **cautious** girl looked left and right twice before crossing.','cautious',['very careful','very fast','very careless','very noisy'],'小心谨慎的',2],
['The **timid** rabbit hid behind its mother.','timid',['shy and easily scared','brave','big','hungry'],'胆小的',2],
['After the party, the floor was **littered** with paper and cups.','littered',['covered with rubbish','very clean','painted','wet'],'到处是垃圾',2],
['Dad **repaired** the broken chair.','repaired',['fixed','broke','sold','painted'],'修理',2],
['The children **dashed** to the ice-cream van.','dashed',['ran very fast','walked slowly','crawled','drove'],'冲过去',2],
['The **anxious** mother waited for news about her son.','anxious',['worried','happy','sleepy','angry'],'焦急的、担心的',2],
['Ben **grumbled** about having to tidy his room.','grumbled',['complained in a low voice','sang happily','shouted for help','whispered a secret'],'嘟囔着抱怨',2],
['The **mischievous** monkey stole a visitor’s cap.','mischievous',['naughty in a playful way','very kind','very tired','very quiet'],'调皮捣蛋的',2],
['The water in the glass was **transparent**. We could see right through it.','transparent',['clear, so you can see through it','very dirty','very heavy','brightly coloured'],'透明的',2],
['The **elderly** man walked slowly with a stick.','elderly',['old','young','tall','rich'],'年长的',2],
['The teacher asked us to **observe** the caterpillar every day.','observe',['watch carefully','feed','draw quickly','throw away'],'观察',2],
['Hui Min was **thrilled** when she won the prize.','thrilled',['very excited and happy','very sad','very worried','very bored'],'非常兴奋',2],
['The cookies were **crispy** on the outside.','crispy',['hard and crunchy','soft and wet','very hot','very sweet'],'脆脆的',2],
];
bank('word','Word meaning · 词义',1.2,VOC,x=>x[4],([s,w,o,z])=>mk({q:`${s}\nWhat does “${w}” mean?`,zh:'看看句子里别的词，猜一猜这个词的意思。',a:o[0],d:o.slice(1),ex:`**${w}** = ${z}。`}));

const OPP=[
['noisy','吵闹的',['quiet','loud','happy','angry'],'安静的',1],
['empty','空的',['full','light','clean','open'],'满的',1],
['heavy','重的',['light','big','thick','strong'],'轻的',1],
['narrow','窄的',['wide','short','long','thin'],'宽的',1],
['early','早的',['late','fast','soon','quick'],'晚的',1],
['strong','强壮的',['weak','big','tall','brave'],'弱的',1],
['first','第一',['last','next','early','second'],'最后',1],
['top','顶部',['bottom','side','middle','front'],'底部',1],
['float','浮',['sink','swim','fly','drift'],'沉',1],
['remember','记得',['forget','think','know','learn'],'忘记',1],
['difficult','难的',['easy','hard','tiring','long'],'容易的',1],
['dangerous','危险的',['safe','scary','strong','careful'],'安全的',1],
['cheap','便宜的',['expensive','new','cheerful','small'],'贵的',1],
['tidy','整齐的',['messy','clean','neat','new'],'乱的',1],
['shallow','浅的',['deep','wet','clean','wide'],'深的',2],
['polite','有礼貌的',['rude','kind','quiet','clever'],'没礼貌的',2],
['arrive','到达',['leave','reach','enter','stay'],'离开',2],
['asleep','睡着的',['awake','tired','lazy','quiet'],'醒着的',2],
['smooth','光滑的',['rough','soft','shiny','flat'],'粗糙的',2],
['generous','大方的',['selfish','kind','rich','happy'],'自私的',2],
['fresh','新鲜的',['stale','new','cold','sweet'],'不新鲜的、放久了的',2],
['sharp','锋利的',['blunt','pointed','thin','round'],'钝的',2],
['borrow','借（进来）',['lend','take','buy','keep'],'借（出去）',2],
['accept','接受',['refuse','agree','take','allow'],'拒绝',2],
['wild','野生的',['tame','fierce','big','free'],'驯服的',2],
['dull','暗淡的、无聊的',['bright','dark','boring','soft'],'明亮的',2],
['brave','勇敢的',['cowardly','strong','clever','proud'],'胆小的',2],
['young','年轻的',['old','small','new','short'],'老的',1],
['open','开着的',['closed','wide','empty','big'],'关着的',1],
['clean','干净的',['dirty','wet','new','tidy'],'脏的',1],
['laugh','笑',['cry','smile','talk','sing'],'哭',1],
['above','在……上面',['below','beside','behind','near'],'在……下面',2],
['whisper','小声说',['shout','talk','sing','listen'],'大声喊',2],
['tight','紧的',['loose','small','short','hard'],'松的',2],
['ancient','古老的',['modern','old','huge','broken'],'现代的',2],
];
bank('word','Opposites · 反义词',.8,OPP,x=>x[4],([w,wz,o,az])=>mk({q:`What is the opposite of “${w}”?`,zh:'找意思相反的词。',a:o[0],d:o.slice(1),ex:`${w}（${wz}）↔ **${o[0]}**（${az}）。`}));

const SPELL=[
[['because','becuase','becos','beacuse'],1],[['beautiful','beutiful','beautifull','beatiful'],1],[['friend','freind','frend','friendd'],1],
[['Wednesday','Wensday','Wednesdy','Wenesday'],2],[['February','Febuary','Februery','Febrary'],2],[['library','libary','liberry','librery'],1],
[['different','diffrent','diferent','differant'],1],[['favourite','favourit','faverite','favrite'],1],[['tomorrow','tommorow','tomorow','tommorrow'],2],
[['science','sience','scince','sciense'],1],[['exercise','excercise','exersise','exercize'],2],[['delicious','delicous','dilicious','delicius'],2],
[['surprise','suprise','surprize','sirprise'],2],[['animal','animel','anamal','aminal'],1],[['teacher','teecher','techer','teachar'],1],
[['school','scool','shcool','skool'],1],[['people','peaple','poeple','peple'],1],[['answer','anser','ansewr','answar'],1],
[['enough','enuf','enogh','enouhg'],2],[['which','wich','whitch','whicth'],1],[['their','thier','theyr','ther'],2],
[['until','untill','untel','antil'],2],[['vegetable','vegtable','vegetabel','vejetable'],2],[['careful','carefull','carful','cairful'],1],
[['beginning','begining','beginnig','beggining'],2],[['heavy','heavey','hevy','heavvy'],1],[['caught','caugth','cought','cauht'],2],
[['thought','thougth','thort','thoght'],2],[['minute','minit','minnute','minuet'],1],[['island','iland','islend','eyeland'],2],
[['restaurant','resturant','restaurent','restrant'],2],[['quiet','qiuet','quiat','queit'],1],
];
/* spelling-choice questions removed: a child still building spelling memory should only see correct spellings */

const FILL=[
['It was raining heavily, so Ali opened his ___.',['umbrella','window','lunchbox','book'],1],
['The baby is ___. Please do not make any noise.',['sleeping','shouting','dancing','running'],1],
['Mum used a ___ to cut the vegetables.',['knife','spoon','towel','pillow'],1],
['The ___ checked my teeth and said they were healthy.',['dentist','pilot','chef','postman'],1],
['Siti ___ out the candles on her birthday cake.',['blew','threw','washed','planted'],1],
['The ice cream ___ quickly under the hot sun.',['melted','froze','grew','barked'],1],
['Ben was so ___ that he finished three bowls of rice.',['hungry','sleepy','scared','cold'],1],
['Please ___ your hands before you eat.',['wash','throw','fold','paint'],1],
['The ___ flew the plane safely to Japan.',['pilot','nurse','farmer','dentist'],1],
['Kai put on his ___ because it was very cold.',['jacket','swimsuit','sandals','sunglasses'],1],
['The cat ___ up the tree to catch the bird.',['climbed','swam','sang','cooked'],1],
['After the long walk, our legs were ___.',['tired','noisy','hungry','early'],1],
['Ravi ___ his friend a postcard from Japan.',['sent','ate','grew','wore'],1],
['The farmer ___ seeds in the field.',['planted','drank','wore','read'],1],
['Please switch ___ the lights when you leave the room.',['off','up','in','at'],1],
['The shop was ___, so we could not buy anything.',['closed','open','big','new'],1],
['We need a ___ to see the tiny insects clearly.',['magnifying glass','pillow','ladder','blanket'],2],
['Grandma ___ a scarf for me with red wool.',['knitted','cooked','drove','planted'],2],
['The firefighters ___ out the fire quickly.',['put','lit','cooked','bought'],2],
['The road was ___ after the rain, so Dad drove slowly.',['slippery','dry','sunny','noisy'],2],
['The ___ in the zoo looked after the sick tiger.',['vet','pilot','librarian','baker'],2],
['Mei Ling ___ her friend’s birthday, so she did not buy a present.',['forgot','remembered','celebrated','enjoyed'],2],
['The thirsty dog ___ the bowl of water quickly.',['drank','wrote','sang','built'],2],
['The boy was ___ because he had lost his favourite toy.',['upset','delighted','excited','proud'],2],
['The baby bird opened its ___ and waited for food.',['beak','wings','tail','nest'],1],
['Mei put the milk back in the ___ to keep it cold.',['fridge','oven','cupboard','bag'],1],
['Ali brushed his ___ after breakfast.',['teeth','soup','homework','pillow'],1],
['The ___ delivered a parcel to our door.',['postman','dentist','pilot','chef'],1],
['It was so dark that Ravi switched on his ___.',['torch','fan','tap','shoes'],1],
['The children ___ their hands to answer the question.',['raised','washed','hid','folded'],1],
['Please ___ the door quietly. The baby is asleep.',['close','kick','paint','eat'],1],
['Siti ___ her name at the top of the worksheet.',['wrote','ate','kicked','drank'],1],
['The tired baby ___ and closed her eyes.',['yawned','swam','wrote','painted'],1],
['We use a ___ to find out how heavy something is.',['weighing scale','ruler','clock','thermometer'],2],
['Grandpa needs his ___ to read the small words.',['spectacles','slippers','umbrella','towel'],2],
['The ___ sold us fresh fish at the market.',['fishmonger','librarian','pilot','dentist'],2],
['The ___ was so loud that Kai covered his ears.',['thunder','sunshine','rainbow','breeze'],2],
['There was a long ___ of people waiting to buy bubble tea.',['queue','bowl','shelf','roof'],2],
['The train was ___, so we had to stand all the way.',['crowded','empty','quiet','slow'],2],
['The ice cream was ___, so Ben ate it quickly.',['melting','frozen hard','burning','raw'],2],
];
bank('word','Which word fits? · 选词填空',1,FILL,x=>x[2],([s,o])=>mk({q:s,zh:'把每个答案放进句子里读一读，哪个说得通？',a:o[0],d:o.slice(1),ex:`放进去读一读：${s.replace('___','**'+o[0]+'**')}`}));

/* ========== READING ========== */
const QW=[
{n:'Ali',P:'He',v:'go',vp:'went',pl:'to the library',tm:'after school',why:'he wanted to borrow a book about sharks',feel:'excited'},
{n:'Siti',P:'She',v:'go',vp:'went',pl:'to the beach',tm:'on Sunday morning',why:'she wanted to collect shells',feel:'happy'},
{n:'Ravi',P:'He',v:'run',vp:'ran',pl:'to the bus stop',tm:'at seven o’clock',why:'he was late for school',feel:'worried'},
{n:'Mei Ling',P:'She',v:'go',vp:'went',pl:'to the clinic',tm:'yesterday afternoon',why:'she had a bad cough',feel:'tired'},
{n:'Ben',P:'He',v:'cycle',vp:'cycled',pl:'to the park',tm:'after lunch',why:'he wanted to fly his new kite',feel:'excited'},
{n:'Farah',P:'She',v:'hurry',vp:'hurried',pl:'to the canteen',tm:'during recess',why:'she was very hungry',feel:'hungry'},
{n:'Kumar',P:'He',v:'walk',vp:'walked',pl:'to the shop',tm:'after dinner',why:'his mother needed some eggs',feel:'proud'},
{n:'Hui Min',P:'She',v:'go',vp:'went',pl:'to the school hall',tm:'at ten o’clock',why:'she had to sing in a concert',feel:'nervous'},
{n:'Kai',P:'He',v:'rush',vp:'rushed',pl:'to the window',tm:'when he heard the thunder',why:'he wanted to see the lightning',feel:'curious'},
{n:'Priya',P:'She',v:'go',vp:'went',pl:'to the zoo',tm:'last Saturday',why:'it was her birthday',feel:'delighted'},
{n:'Jun Jie',P:'He',v:'swim',vp:'swam',pl:'to the edge of the pool',tm:'after ten minutes',why:'his legs were tired',feel:'tired'},
{n:'Aisha',P:'She',v:'walk',vp:'walked',pl:'to her grandmother’s flat',tm:'on Saturday afternoon',why:'she wanted to give her some cookies',feel:'happy'},
];
G('read','Answering questions · 答题句',1,1,()=>{const e=pick(QW),t=Math.floor(Math.random()*4);
  const ans=[`${e.P} ${e.vp} ${e.pl}.`,`${e.P} ${e.vp} there ${e.tm}.`,`${e.P} ${e.vp} there because ${e.why}.`,`${e.P} felt ${e.feel}.`];
  const qs=[`Where did ${e.n} ${e.v} ${e.tm}?`,`When did ${e.n} ${e.v} ${e.pl}?`,`Why did ${e.n} ${e.v} ${e.pl}?`,`How did ${e.n} feel?`];
  const ex=['**Where** 问“去哪里 / 在哪里” → 答案要说地方。','**When** 问“什么时候” → 答案要说时间。','**Why** 问“为什么” → 用 because 回答。','**How did … feel?** 问感觉 → 用 felt + 感觉的词。'];
  return mk({q:`Which is the best answer to this question?\n**${qs[t]}**`,zh:'先看问题的第一个词：Where（哪里）/ When（什么时候）/ Why（为什么）/ How … feel（感觉）。',a:ans[t],d:ans.filter((x,i)=>i!==t),ex:ex[t]});});

const RP=[
{p:'Max is Sam’s dog. Max is brown and has a short tail. Every evening, Sam takes Max for a walk in the park.',q:[
 ['When does Sam take Max for a walk?',['every evening','every morning','after lunch','on Sundays'],'短文说：**Every evening**, Sam takes Max for a walk。',1],
 ['What colour is Max?',['brown','black','white','grey'],'短文说：Max is **brown**。',1]]},
{p:'Mei Ling woke up late on Monday. She missed the school bus, so her father drove her to school. She reached school just before the bell rang.',q:[
 ['How did Mei Ling get to school?',['Her father drove her.','She took the school bus.','She walked.','She cycled.'],'短文说：her father **drove her** to school。',1],
 ['Why did Mei Ling miss the school bus?',['She woke up late.','The bus came early.','She was sick.','She forgot her bag.'],'第一句：Mei Ling **woke up late**。',2]]},
{p:'Ravi planted a bean seed in a pot. He watered it every day and put it near the window. After a week, a tiny green shoot came out of the soil.',q:[
 ['What did Ravi do every day?',['He watered the seed.','He dug up the seed.','He moved the pot outside.','He ate a bean.'],'短文说：He **watered it every day**。',1],
 ['How long did it take for the shoot to come out?',['about a week','one day','a month','a year'],'短文说：**After a week**, a tiny green shoot came out。',2]]},
{p:'Siti’s grandmother lives in Malaysia. Siti visits her every school holiday. Grandmother always cooks Siti’s favourite dish, chicken curry.',q:[
 ['What is Siti’s favourite dish?',['chicken curry','fried rice','fish soup','noodles'],'短文说：Siti’s favourite dish, **chicken curry**。',1],
 ['How often does Siti visit her grandmother?',['every school holiday','every weekend','every day','once in five years'],'短文说：Siti visits her **every school holiday**。',2]]},
{p:'The class went to the zoo. Ben’s favourite animal was the orang utan. He watched it swing from tree to tree, and he took many photos of it.',q:[
 ['What did the orang utan do?',['It swung from tree to tree.','It swam in the pond.','It slept on a rock.','It ate a fish.'],'短文说：He watched it **swing from tree to tree**。',1],
 ['What was Ben’s favourite animal?',['the orang utan','the tiger','the elephant','the penguin'],'短文说：Ben’s favourite animal was **the orang utan**。',1]]},
{p:'Kai’s kite got stuck in a tall tree. He could not reach it. His neighbour, Mr Lim, brought a ladder and helped him get it down. Kai thanked him.',q:[
 ['Who helped Kai?',['Mr Lim','his mother','his teacher','his sister'],'短文说：His neighbour, **Mr Lim**, … helped him。',1],
 ['Why did Kai thank Mr Lim?',['Mr Lim helped him get his kite down.','Mr Lim gave him a new kite.','Mr Lim bought him ice cream.','Mr Lim fixed his bicycle.'],'Mr Lim 搬来梯子，**帮他把风筝拿下来**，所以 Kai 谢谢他。',2]]},
{p:'It rained heavily on Saturday. Hui Min could not go to the playground. Instead, she baked cookies with her mother. The cookies were shaped like stars.',q:[
 ['Why couldn’t Hui Min go to the playground?',['It rained heavily.','She was sick.','The playground was closed.','She had homework.'],'第一句：It **rained heavily** on Saturday。',1],
 ['What shape were the cookies?',['stars','hearts','circles','squares'],'短文说：The cookies were shaped like **stars**。',1]]},
{p:'Jun Jie lost his water bottle at school. He looked for it in his classroom and in the canteen. At last, he found it at the football field.',q:[
 ['Where did Jun Jie find his water bottle?',['at the football field','in the classroom','in the canteen','at home'],'短文说：At last, he found it **at the football field**。教室和食堂是他找过、但没找到的地方。',2],
 ['What did Jun Jie lose?',['his water bottle','his bag','his pencil case','his shoe'],'第一句：Jun Jie lost his **water bottle**。',1]]},
{p:'Farah’s cat, Snowy, is white with black spots. Snowy likes to sleep on the sofa. When Farah comes home, Snowy runs to the door to meet her.',q:[
 ['Where does Snowy like to sleep?',['on the sofa','on the bed','under the table','in a box'],'短文说：Snowy likes to sleep **on the sofa**。',1],
 ['How do you know Snowy is happy to see Farah?',['It runs to the door to meet her.','It sleeps on the sofa.','It is white with black spots.','It hides under the bed.'],'How do you know 要找“证据”：Farah 一回家，Snowy **就跑到门口迎接她**。',2]]},
{p:'Kumar was the last runner in his team. When he got the baton, his team was behind. Kumar ran as fast as he could and crossed the finish line first. His team cheered loudly.',q:[
 ['How did Kumar’s team feel at the end?',['happy','sad','angry','bored'],'他们赢了，还 **cheered loudly**（大声欢呼）→ happy。',2],
 ['Was Kumar’s team in front when he got the baton?',['No, it was behind.','Yes, it was in front.','Yes, it was first.','No, it was not in the race.'],'短文说：his team was **behind**（落后）。',2]]},
{p:'Priya wanted to buy a book that cost $12. She had only $8. She saved her pocket money for two weeks. Then she bought the book.',q:[
 ['How much more money did Priya need at first?',['$4','$8','$12','$20'],'书 $12，她只有 $8：$12 − $8 = **$4**。',2],
 ['What did Priya do to get enough money?',['She saved her pocket money.','She asked her mother.','She sold her toys.','She found money on the floor.'],'短文说：She **saved her pocket money** for two weeks。',1]]},
{p:'Every Sunday, Grandpa and Ali go fishing at the jetty. Grandpa brings the fishing rods. Ali brings the bread for bait. Last Sunday, they caught three fish.',q:[
 ['What does Ali bring?',['bread','fishing rods','a bucket','a net'],'短文说：Ali brings the **bread** for bait。鱼竿是爷爷带的。',1],
 ['How many fish did they catch last Sunday?',['three','two','one','none'],'短文说：they caught **three** fish。',1]]},
{p:'The school library has a new rule. Pupils can borrow only three books at a time. They must return the books within two weeks.',q:[
 ['How many books can a pupil borrow at a time?',['three','two','four','ten'],'短文说：borrow only **three** books at a time。',1],
 ['When must pupils return the books?',['within two weeks','within three days','within a month','within a week'],'短文说：return the books **within two weeks**。',2]]},
{p:'Ben forgot to bring his lunch to school. His best friend, Kai, shared his sandwich with him. Ben promised to bring an extra snack for Kai the next day.',q:[
 ['What did Kai do?',['He shared his sandwich with Ben.','He bought Ben a meal.','He told the teacher.','He laughed at Ben.'],'短文说：Kai **shared his sandwich** with him。',1],
 ['What did Ben promise to do?',['bring an extra snack for Kai','buy Kai lunch','never forget his lunch again','give Kai his toy'],'短文说：Ben promised to **bring an extra snack for Kai**。',2]]},
{p:'A caterpillar ate leaves all day long. It grew bigger and bigger. Then it made a hard case around itself. Two weeks later, a beautiful butterfly came out.',q:[
 ['What did the caterpillar eat?',['leaves','flowers','fruit','small insects'],'第一句：A caterpillar ate **leaves** all day long。',1],
 ['What came out of the hard case?',['a butterfly','a caterpillar','an egg','a bird'],'最后一句：a beautiful **butterfly** came out。',1]]},
{p:'Mrs Tan’s class collected old newspapers for recycling. Class 3A collected 25 kg. Class 3B collected 10 kg more than Class 3A.',q:[
 ['How much did Class 3B collect?',['35 kg','15 kg','25 kg','10 kg'],'3B 比 3A **多** 10 kg：25 + 10 = **35 kg**。',2]]},
{p:'The sky turned dark and the wind blew strongly. Mum told the children to bring the clothes inside. A few minutes later, it started to pour.',q:[
 ['Why did Mum tell the children to bring the clothes inside?',['It was going to rain.','The clothes were dirty.','It was night time.','The clothes were too dry.'],'天变黑、风很大 → 快要下雨了，所以要收衣服。',2],
 ['What does “pour” mean here?',['rain very heavily','stop raining','become sunny','become windy'],'**pour** 在这里 = 下倾盆大雨。',2]]},
{p:'Lina has two brothers. Tim is older than Lina. Sam is younger than Lina.',q:[
 ['Who is the youngest?',['Sam','Tim','Lina','They are the same age.'],'Tim 比 Lina 大，Sam 比 Lina 小 → **Sam** 最小。',2]]},
{p:'On Sports Day, the pupils wore their house colours. Ali is in Red House. His friend Siti is in Blue House. They cheered for each other.',q:[
 ['Which house is Siti in?',['Blue House','Red House','Green House','Yellow House'],'短文说：Siti is in **Blue House**。Red House 是 Ali 的。',1]]},
{p:'Dad wanted to make pancakes. He needed eggs, flour and milk. There was no milk in the fridge, so he asked Kai to buy some from the shop downstairs.',q:[
 ['What did Kai have to buy?',['milk','eggs','flour','pancakes'],'短文说：There was no **milk** in the fridge。',1],
 ['Why did Kai go to the shop?',['There was no milk at home.','He wanted some sweets.','Dad was not hungry.','The shop was having a sale.'],'冰箱里**没有牛奶**，所以爸爸让他去买。',2]]},
{p:'At the beach, Mei found a shell. It was pink and shaped like a fan. She put it in her pocket so that she could show it to her teacher.',q:[
 ['What did Mei want to do with the shell?',['show it to her teacher','throw it into the sea','give it to her mother','sell it'],'短文说：so that she could **show it to her teacher**。',1],
 ['What colour was the shell?',['pink','white','blue','brown'],'短文说：It was **pink**。',1]]},
{p:'Ravi practises the piano for thirty minutes every day. Next month, he will play at a concert. He feels a little nervous but also excited.',q:[
 ['How does Ravi feel about the concert?',['nervous and excited','angry','bored','sad and lonely'],'短文说：He feels a little **nervous** but also **excited**。',1],
 ['When is the concert?',['next month','next week','tomorrow','last month'],'短文说：**Next month**, he will play at a concert。',1]]},
{p:'Aisha and her brother wanted to watch the fireworks. They waited at the river for an hour. At nine o’clock, the sky lit up with red and gold. Aisha clapped her hands.',q:[
 ['How long did they wait at the river?',['an hour','ten minutes','all day','two hours'],'短文说：They waited at the river for **an hour**。',1],
 ['How do you know Aisha liked the fireworks?',['She clapped her hands.','She waited for an hour.','The sky was red and gold.','She went home early.'],'找证据：Aisha **clapped her hands**（拍手）。',2]]},
];
const P=(p,...q)=>RP.push({p,q});
/* --- everyday stories --- */
P('Wei Jie got a skateboard for his birthday. Every evening, he practised at the park near his block. At first, he fell many times. His knees were scraped, but he did not give up. After two weeks, he could turn around the corner without falling.',
 ['Where did Wei Jie practise?',['at the park near his block','at school','in his room','at the beach'],'短文说：he practised **at the park near his block**。',1],
 ['Which words tell you that Wei Jie did not stop trying?',['he did not give up','he fell many times','he got a skateboard','his knees were scraped'],'**did not give up** = 没有放弃。',2],
 ['How long did it take Wei Jie to learn to turn without falling?',['two weeks','two days','one evening','two months'],'短文说：**After two weeks**, he could turn…',1]);
P('Kai and his sister Lin were playing a video game. Lin was stuck on a hard level with a big dragon. Kai showed her how to jump over the fireballs. On her third try, Lin beat the dragon. She gave Kai a high five.',
 ['What was Lin stuck on?',['a hard level with a big dragon','a Maths question','a tall tree','a puzzle book'],'短文说：Lin was stuck on **a hard level with a big dragon**。',1],
 ['How many tries did Lin need to beat the dragon?',['three','one','two','four'],'“On her **third** try” = 第三次。',1],
 ['Why did Lin give Kai a high five?',['She was happy that he had helped her.','She was angry with him.','She wanted to stop playing.','He lost the game.'],'Kai 教她跳过火球，她赢了，开心地和他击掌。',2]);
P('On Friday night, Ravi’s family had dinner at the hawker centre. It was very crowded. Ravi’s father put a packet of tissue on a table to keep the seats. Then they went to buy food. Ravi ordered chicken rice, and his sister ordered laksa.',
 ['Why did Ravi’s father put a packet of tissue on the table?',['to keep the seats for the family','to clean the table','to give it to the stall owner','because he had a cold'],'短文说：to **keep the seats**（占位子）。',2],
 ['What did Ravi’s sister order?',['laksa','chicken rice','fried noodles','satay'],'Ravi 点鸡饭，他姐姐点 **laksa**。',1],
 ['When did the family have dinner at the hawker centre?',['on Friday night','on Sunday morning','on Saturday afternoon','on Monday night'],'第一句：**On Friday night**。',1]);
P('The MRT train was full. Aisha was sitting near the door. At the next station, an old man with a walking stick got on. Aisha stood up at once and gave him her seat. The old man smiled and said, “Thank you, young lady.”',
 ['Who got on the train at the next station?',['an old man with a walking stick','a young lady','Aisha’s teacher','a mother with a baby'],'短文说：**an old man with a walking stick** got on。',1],
 ['What does “at once” mean in the story?',['immediately','slowly','later','twice'],'**at once** = 马上、立刻。',2],
 ['Who does “young lady” refer to?',['Aisha','the old man','Aisha’s mother','the train driver'],'老人在谢 Aisha，“young lady” 指的就是 **Aisha**。',2]);
P('It was raining all day, so Ben and his brother could not go out. They pulled the cushions off the sofa and covered two chairs with a big blanket. Inside their fort, they read comics with a torch. Mum laughed when she saw the messy living room.',
 ['What did the boys use to cover the chairs?',['a big blanket','the cushions','a torch','comics'],'短文说：covered two chairs with **a big blanket**。',1],
 ['Why couldn’t the boys go out?',['It was raining all day.','Mum was angry.','They were sick.','It was too late.'],'第一句：It was **raining all day**。',1],
 ['What did the boys do inside their fort?',['They read comics with a torch.','They slept.','They ate dinner.','They watched TV.'],'短文说：they **read comics with a torch**。',1]);
P('On the way home, Siti heard a soft crying sound under a bench. It was a small brown puppy with a red collar. The collar had a phone number on it. Siti’s mother called the number. Half an hour later, a girl came running to get her puppy. She hugged it tightly and thanked them again and again.',
 ['Where did Siti find the puppy?',['under a bench','in a drain','at the playground','in a box'],'短文说：a soft crying sound **under a bench**。',1],
 ['How did Siti’s mother find the owner?',['She called the number on the collar.','She put up a poster.','She asked the police.','She asked the neighbours.'],'项圈上有电话号码，妈妈**打了那个号码**。',2],
 ['How did the girl feel when she got her puppy back?',['very happy and thankful','angry','scared','bored'],'她紧紧抱着小狗、**一次又一次地道谢** → 很开心、很感激。',2]);
P('Grandma’s 70th birthday was on Sunday. Mei Ling and her cousins wanted to surprise her. They hid behind the door with balloons. When Grandma came in, they jumped out and shouted, “Happy birthday!” Grandma was so surprised that she nearly dropped her bag.',
 ['How old was Grandma turning?',['70','17','60','7'],'短文说：Grandma’s **70th** birthday。',1],
 ['Where did the children hide?',['behind the door','under the table','in the kitchen','behind the sofa'],'短文说：They hid **behind the door**。',1],
 ['Which words tell you Grandma was very surprised?',['she nearly dropped her bag','Grandma came in','her 70th birthday','they hid behind the door'],'吓到**包都差点掉了** → 非常惊讶。',2]);
P('Jun Jie ran the second part of the relay race. When he passed the baton to Arjun, it fell onto the track. Arjun picked it up quickly and ran as fast as he could. Their team came in third. Jun Jie said sorry, but Arjun told him, “It’s okay. We did our best.”',
 ['What happened when Jun Jie passed the baton?',['It fell onto the track.','Arjun ran away.','Jun Jie fell down.','The race stopped.'],'短文说：it **fell onto the track**。',1],
 ['In which position did their team finish?',['third','first','second','last'],'短文说：Their team came in **third**。',1],
 ['What kind of friend is Arjun?',['kind and understanding','angry and rude','lazy','selfish'],'Arjun 说 “It’s okay. We did our best.”，没有怪 Jun Jie → 善良、体谅人。',2]);
P('Class 3E has a pet hamster called Peanut. Each week, two pupils take turns to feed him and clean his cage. This week, it was Farah and Daniel’s turn. Farah gave Peanut sunflower seeds, while Daniel filled up his water bottle.',
 ['What is the name of the class pet?',['Peanut','Farah','Daniel','Sunny'],'第一句：a pet hamster called **Peanut**。',1],
 ['What did Daniel do?',['He filled up Peanut’s water bottle.','He gave Peanut sunflower seeds.','He took Peanut home.','He cleaned the classroom.'],'Farah 喂瓜子，**Daniel 加水**。别把两个人做的事弄反。',2],
 ['How many pupils look after Peanut each week?',['two','one','three','the whole class'],'短文说：Each week, **two** pupils take turns。',1]);
P('Last month, Priya’s family moved to a new flat in Punggol. Her new room was bigger, and she could see the river from her window. But Priya missed her old neighbours. On the first weekend, she made cards for them, and her father drove her back to give them out.',
 ['What could Priya see from her new window?',['the river','the sea','her school','her old flat'],'短文说：she could see **the river** from her window。',1],
 ['Why did Priya make cards?',['She missed her old neighbours.','It was her birthday.','Her teacher asked her to.','She wanted to sell them.'],'短文说：Priya **missed her old neighbours**，所以做卡片送给他们。',2],
 ['Which word in the story is the opposite of “smaller”?',['bigger','new','old','first'],'smaller（更小）↔ **bigger**（更大）。',2]);
P('On the first day of Chinese New Year, Wei Ming wore a new red shirt. He visited his relatives with his parents. He brought two mandarin oranges to each home. His aunties and uncles gave him red packets. At night, he counted his red packets and put the money in the bank.',
 ['What colour was Wei Ming’s new shirt?',['red','gold','blue','white'],'短文说：a new **red** shirt。',1],
 ['What did Wei Ming bring to each home?',['two mandarin oranges','red packets','a cake','flowers'],'短文说：He brought **two mandarin oranges** to each home。',1],
 ['What did Wei Ming do with the money?',['He put it in the bank.','He bought toys.','He gave it to his aunties.','He lost it.'],'最后一句：put the money **in the bank**。',1]);
P('During Hari Raya Puasa, Nur and her family visited her grandparents in Malacca. Nur wore a new baju kurung. Grandma cooked ketupat and rendang. In the evening, the children played with sparklers in the garden.',
 ['Where do Nur’s grandparents live?',['in Malacca','in Singapore','in Penang','in Johor'],'短文说：her grandparents **in Malacca**。',1],
 ['What did the children do in the evening?',['They played with sparklers.','They went swimming.','They cooked rendang.','They slept early.'],'最后一句：the children **played with sparklers**。',1]);
P('A few days before Deepavali, Kavya helped her mother make a kolam at the front door. They used coloured rice powder to draw a big flower. Kavya chose bright pink and orange. When it was done, her mother said it was the most beautiful kolam they had ever made.',
 ['What did they use to make the kolam?',['coloured rice powder','crayons','paint','real flowers'],'短文说：They used **coloured rice powder**。',1],
 ['What shape was the kolam?',['a flower','a star','a lamp','a heart'],'短文说：to draw **a big flower**。',1],
 ['How did Kavya’s mother feel about the kolam?',['She was very pleased with it.','She did not like the colours.','She was too busy to look.','She wanted to wash it away.'],'妈妈说这是她们做过**最漂亮的**一个 → 很满意。',2]);
P('On the night of the Mid-Autumn Festival, the moon was big and round. Li Ting carried a rabbit lantern around the void deck. Her little brother had a fish lantern. Suddenly, his lantern caught fire! Dad quickly poured water on it. Luckily, nobody was hurt.',
 ['What kind of lantern did Li Ting have?',['a rabbit lantern','a fish lantern','a star lantern','a moon lantern'],'Li Ting 拿**兔子灯笼**，弟弟拿的才是鱼灯笼。',1],
 ['What happened to the brother’s lantern?',['It caught fire.','It flew away.','It got wet in the rain.','It was lost.'],'短文说：his lantern **caught fire**!',1],
 ['Which word tells you that it was good that nobody was hurt?',['Luckily','Suddenly','quickly','round'],'**Luckily** = 幸好。',2]);
P('Daniel was scared of the dentist. He held his mother’s hand tightly in the waiting room. The dentist, Dr Wong, was very gentle. She showed him her tools and let him hold the small mirror. In the end, Daniel was not scared any more. He even got a sticker for being brave.',
 ['Who is Dr Wong?',['the dentist','Daniel’s mother','Daniel’s teacher','a nurse'],'短文说：The dentist, **Dr Wong**。',1],
 ['Why did Daniel get a sticker?',['for being brave','for brushing his teeth','for holding the mirror','for being quiet'],'短文说：a sticker **for being brave**。',1],
 ['How did Daniel’s feelings change?',['He was scared at first, but not at the end.','He was happy at first, but scared at the end.','He was angry the whole time.','He was bored the whole time.'],'一开始 scared，最后 **not scared any more**。',2]);
P('Hui Min’s family had a picnic at the Botanic Gardens. They spread a mat under a big tree. Soon, a line of ants marched towards their sandwiches. Hui Min shouted, and everyone moved the food away. In the end, they ate their lunch on a bench instead.',
 ['What came towards the sandwiches?',['a line of ants','a dog','some birds','a squirrel'],'短文说：**a line of ants** marched towards their sandwiches。',1],
 ['Where did they eat their lunch in the end?',['on a bench','on the mat','under the tree','at home'],'短文说：In the end, they ate **on a bench** instead。',2],
 ['What does “marched” mean in the story?',['walked in a line','flew','jumped','swam'],'蚂蚁排成一行走 → **marched** = 排队行进。',2]);
P('At the Science Centre, Kumar touched a silver ball and his hair stood up! Everyone around him laughed. The guide explained that it was because of static electricity. Kumar wanted to try again, but there was a long queue.',
 ['What happened when Kumar touched the silver ball?',['His hair stood up.','He fell down.','The ball broke.','The lights went off.'],'第一句：**his hair stood up**!',1],
 ['Why couldn’t Kumar try again?',['There was a long queue.','The guide said no.','The ball was broken.','It was time to go home.'],'短文说：but there was **a long queue**（排长队）。',2],
 ['Who explained what happened?',['the guide','Kumar','Kumar’s teacher','his friends'],'短文说：**The guide** explained…',1]);
P('Ahmad was learning to swim. On his first lesson, he was afraid to put his face in the water. His coach gave him a pair of goggles. With the goggles, Ahmad could see the bottom of the pool clearly. By the end of the lesson, he could float on his back for ten seconds.',
 ['What did the coach give Ahmad?',['a pair of goggles','a float','a towel','a swimming cap'],'短文说：His coach gave him **a pair of goggles**。',1],
 ['What was Ahmad afraid to do at first?',['put his face in the water','float on his back','talk to his coach','jump into the pool'],'短文说：afraid to **put his face in the water**。',1],
 ['How did the goggles help Ahmad?',['He could see clearly under the water.','He could swim faster.','He could breathe under water.','He could stay warm.'],'戴上泳镜，他**看得清池底** → 不怕了。',2]);
P('While playing ball in the living room, Arjun knocked over Mum’s blue vase. It broke into pieces. Arjun was afraid, but he told Mum the truth. Mum was sad about the vase, but she was glad that Arjun was honest. She reminded him not to play ball in the house.',
 ['What did Arjun break?',['Mum’s blue vase','a window','a plate','his toy'],'短文说：knocked over **Mum’s blue vase**。',1],
 ['Why was Mum glad?',['Arjun told the truth.','The vase was old.','Arjun cleaned up.','She wanted a new vase.'],'短文说：she was glad that Arjun was **honest**（说了实话）。',2],
 ['Which word in the story means “telling the truth”?',['honest','afraid','glad','reminded'],'**honest** = 诚实。',2]);
P('Siti forgot to bring her English worksheet to school. She did not want to lie, so she told her teacher, Mrs Goh. Mrs Goh said Siti could bring it the next day. That night, Siti packed her bag before she went to bed.',
 ['What did Siti forget?',['her English worksheet','her water bottle','her lunch','her pencil case'],'第一句：forgot to bring her **English worksheet**。',1],
 ['What did Siti do that night?',['She packed her bag before bed.','She did more homework.','She called Mrs Goh.','She went to bed without packing.'],'最后一句：Siti **packed her bag** before she went to bed。',1],
 ['Why do you think Siti packed her bag that night?',['so that she would not forget the worksheet again','because she was going on a trip','because Mrs Goh scolded her','because she lost her bag'],'前一天忘了带，所以晚上先收好书包，**不想再忘记**。',2]);
P('Ali borrowed a book about space from the library. He enjoyed it so much that he read it three times. But he forgot to return it on time. The library sent him a reminder. Ali returned the book the next day and borrowed another book about planets.',
 ['What was the book about?',['space','dinosaurs','cooking','football'],'第一句：a book **about space**。',1],
 ['How many times did Ali read the book?',['three','one','two','four'],'短文说：he read it **three times**。',1],
 ['Why did the library send Ali a reminder?',['He did not return the book on time.','He lost the book.','He tore the book.','He wanted another book.'],'短文说：he forgot to **return it on time**。',2]);
P('Dad and Emma baked chocolate cookies on Saturday. They mixed the flour, butter, sugar and eggs in a big bowl. While the cookies were in the oven, they started watching a movie. Suddenly, they smelled something burning! The cookies were black. They laughed and made a new batch.',
 ['What did Dad and Emma do while the cookies were in the oven?',['They watched a movie.','They washed the bowl.','They went shopping.','They ate lunch.'],'短文说：they started **watching a movie**。',1],
 ['Why were the cookies black?',['They were left in the oven too long.','They used black sugar.','Emma painted them.','They fell on the floor.'],'看电影忘了时间，饼干**烤太久**烧焦了。',2],
 ['What does “a new batch” mean here?',['another tray of cookies','a new oven','a new movie','a new bowl'],'**a new batch** = 再做一批（饼干）。',2]);
P('On a windy Sunday, Jun Jie and his father flew a kite at Marina Barrage. The kite was shaped like an eagle. It flew higher and higher. Then the string snapped, and the eagle flew away over the water. Jun Jie was sad, but his father promised to make a new one with him.',
 ['What was the kite shaped like?',['an eagle','a dragon','a fish','a butterfly'],'短文说：shaped like **an eagle**。',1],
 ['What happened to the string?',['It snapped.','It got wet.','It was too short.','It got caught in a tree.'],'短文说：the string **snapped**（断了）。',1],
 ['What did Jun Jie’s father promise?',['to make a new kite with him','to buy him ice cream','to take him swimming','to find the kite in the water'],'短文说：promised to **make a new one with him**。',2]);
P('Class 3B went to the Night Safari. They rode on a tram in the dark. Their guide used a soft light so that the animals would not be scared. Ravi saw a tiger walking near the tram. He held his breath and did not make a sound.',
 ['How did the class go around the Night Safari?',['on a tram','on foot','by bus','by boat'],'短文说：They rode **on a tram**。',1],
 ['Why did the guide use a soft light?',['so that the animals would not be scared','because it was raining','so that the pupils could sleep','because the batteries were weak'],'短文说：**so that the animals would not be scared**。',2],
 ['Why did Ravi hold his breath and keep quiet?',['He did not want to scare the tiger.','He was swimming.','He was sick.','He was trying not to laugh.'],'老虎就在旁边，他不出声，**怕吓到老虎**。',2]);
P('Kai and his uncle cycled along East Coast Park. After an hour, Kai’s back tyre went flat. They pushed their bicycles to a bicycle shop nearby. The man there fixed the tyre in ten minutes. Then they cycled to a stall and had cold coconut drinks.',
 ['Which tyre went flat?',['Kai’s back tyre','Kai’s front tyre','both tyres','his uncle’s tyre'],'短文说：Kai’s **back tyre** went flat。',1],
 ['How long did the man take to fix the tyre?',['ten minutes','an hour','one day','thirty minutes'],'短文说：fixed the tyre **in ten minutes**。“an hour” 是他们骑了多久。',2],
 ['What did they do after the tyre was fixed?',['They had cold coconut drinks.','They went home.','They went swimming.','They bought a new bicycle.'],'最后一句：had **cold coconut drinks**。',1]);
P('Priya found a small nest in the bush outside her window. There were three tiny eggs inside. Every morning, she watched the mother bird sitting on the eggs. Her father told her not to touch the nest. After two weeks, Priya heard chirping. The eggs had hatched!',
 ['How many eggs were in the nest?',['three','two','four','one'],'短文说：**three** tiny eggs。',1],
 ['Why did her father tell her not to touch the nest?',['so that the mother bird would not be frightened away','because the nest was dirty','because the eggs were fake','because the nest was too high'],'碰了鸟巢，鸟妈妈可能会被吓跑、不回来。',2],
 ['How did Priya know the eggs had hatched?',['She heard chirping.','She saw the mother bird fly away.','Her father told her.','She touched the nest.'],'短文说：Priya **heard chirping**（听到小鸟叫）。',2]);
P('It started to rain after school. Mei Ling saw a new classmate, Aisha, standing alone at the gate. Aisha did not have an umbrella. Mei Ling walked over and shared her umbrella with her. They walked to the bus stop together and found out that they lived in the same block.',
 ['Who did not have an umbrella?',['Aisha','Mei Ling','the teacher','the bus driver'],'短文说：**Aisha** did not have an umbrella。',1],
 ['What did Mei Ling and Aisha find out?',['They lived in the same block.','They had the same birthday.','They were cousins.','They liked the same food.'],'最后一句：they lived in **the same block**。',1],
 ['Which word best describes Mei Ling?',['kind','rude','lazy','scared'],'她主动和新同学共撑一把伞 → **kind**（善良）。',2]);
P('Farah was in the school spelling bee. When it was her turn, her mouth felt dry and her legs were shaking. The word was “necessary”. She took a deep breath and spelt it slowly. The judge said, “Correct!” Farah smiled widely.',
 ['Which words tell you Farah was nervous?',['her legs were shaking','she smiled widely','the judge said “Correct!”','it was her turn'],'嘴巴干、**腿发抖** → 很紧张。',2],
 ['What did Farah do before she spelt the word?',['She took a deep breath.','She ran away.','She asked for water.','She sat down.'],'短文说：She **took a deep breath** and spelt it slowly。',1],
 ['What word did Farah spell?',['necessary','spelling','correct','judge'],'短文说：The word was “**necessary**”。',1]);
P('Ben’s little brother, Sam, copies everything Ben does. When Ben eats cereal, Sam wants cereal too. When Ben wears a cap, Sam puts on a cap. One day, Ben began to read a book quietly. Sam sat next to him and opened a book too. Mum smiled. She was happy that Sam was learning to read.',
 ['What does Sam do?',['He copies everything Ben does.','He reads to Ben.','He cooks cereal.','He sells caps.'],'第一句：Sam **copies everything Ben does**（学哥哥）。',1],
 ['In “Sam sat next to him”, who does “him” refer to?',['Ben','Sam','Dad','Mum'],'Ben 在看书，Sam 坐到他旁边 → **him = Ben**。',2],
 ['Why was Mum happy?',['Sam was learning to read.','Ben ate his cereal.','Sam wore a cap.','Ben was quiet.'],'最后一句：Sam was **learning to read**。',2]);
P('For a science project, each pupil planted a sunflower seed. Arjun watered his every day and put it in the sun. Daniel forgot to water his. After three weeks, Arjun’s sunflower was taller than his ruler. Daniel’s pot only had dry soil.',
 ['Whose sunflower grew taller than a ruler?',['Arjun’s','Daniel’s','the teacher’s','both boys’'],'短文说：**Arjun’s** sunflower was taller than his ruler。',1],
 ['Why didn’t Daniel’s seed grow?',['He forgot to water it.','He put it in the sun.','He watered it too much.','The pot was broken.'],'短文说：Daniel **forgot to water** his。',2],
 ['What was this activity for?',['a science project','a birthday present','an art lesson','a garden competition'],'第一句：For **a science project**。',1]);
P('During a big storm, the lights in Siti’s flat suddenly went off. Everything was dark. Siti’s little sister started to cry. Father found a torch and lit some candles. They sat together and told stories until the lights came back on.',
 ['What happened during the storm?',['The lights went off.','The window broke.','The water stopped.','The door flew open.'],'第一句：the lights **went off**（停电）。',1],
 ['What did Father find?',['a torch','a book','an umbrella','a phone'],'短文说：Father found **a torch**。',1],
 ['What did the family do until the lights came back on?',['They told stories.','They went to sleep.','They watched TV.','They went outside.'],'短文说：They sat together and **told stories**。',1]);
P('There was a building contest at the library. Each child had one hour to build something with plastic blocks. Wei Ming built a tall tower with a lift that could go up and down. The judges liked it so much that he won first prize — a big box of new blocks.',
 ['How long did each child have to build?',['one hour','two hours','ten minutes','one day'],'短文说：Each child had **one hour**。',1],
 ['What was special about Wei Ming’s tower?',['It had a lift that could go up and down.','It was made of paper.','It was the shortest.','It could fly.'],'短文说：a tower with **a lift that could go up and down**。',2],
 ['What was the first prize?',['a big box of new blocks','a trophy','a book','some money'],'短文说：first prize — **a big box of new blocks**。',1]);
P('Our school held a recycling drive. Pupils brought old newspapers, cans and plastic bottles. Class 3A collected the most cans. Class 3C collected the most newspapers. The principal thanked everyone for helping to keep the Earth clean.',
 ['Which class collected the most newspapers?',['Class 3C','Class 3A','Class 3B','the principal'],'3A 收的罐子最多，**3C 收的报纸最多**。',1],
 ['Why did the principal thank everyone?',['They helped to keep the Earth clean.','They won a race.','They cleaned the classroom.','They bought new books.'],'最后一句：for helping to **keep the Earth clean**。',2]);
P('Mrs Lim, an old lady, lives next door to Kumar. One afternoon, Kumar saw her carrying heavy bags of groceries from the lift. He ran over and carried two bags for her. Mrs Lim gave him a packet of biscuits to say thank you.',
 ['Who is Mrs Lim?',['Kumar’s neighbour','Kumar’s teacher','Kumar’s aunt','a shopkeeper'],'短文说：Mrs Lim … lives **next door** to Kumar → 邻居。',1],
 ['How many bags did Kumar carry?',['two','one','three','four'],'短文说：carried **two** bags for her。',1],
 ['Why did Mrs Lim give Kumar biscuits?',['to say thank you','because it was his birthday','because she did not want them','because he asked for them'],'短文说：**to say thank you**。',2]);
P('Aisha’s little brother, Adam, wanted to tie his own shoelaces. Aisha showed him how to make two “bunny ears” and cross them over. Adam tried many times. His fingers got tired, but he kept going. On the seventh try, he did it! He jumped up and down with joy.',
 ['What did Adam want to learn?',['to tie his shoelaces','to ride a bicycle','to draw a bunny','to swim'],'第一句：wanted to **tie his own shoelaces**。',1],
 ['On which try did Adam succeed?',['the seventh','the first','the third','the tenth'],'短文说：On the **seventh** try, he did it!',1],
 ['Which words show that Adam did not give up?',['he kept going','his fingers got tired','he jumped up and down','Aisha showed him'],'手指累了，**but he kept going**（还是继续）。',2]);
P('Emma’s front tooth was loose for a week. While she was eating an apple, the tooth came out! She put it in a small box. Her mother said that a new tooth would grow in its place. Emma looked in the mirror and laughed at the gap in her smile.',
 ['What was Emma eating when her tooth came out?',['an apple','a sandwich','a sweet','rice'],'短文说：While she was eating **an apple**。',1],
 ['Where did Emma put her tooth?',['in a small box','under her pillow','in the bin','in her pocket'],'短文说：She put it **in a small box**。',1],
 ['How did Emma feel about the gap in her smile?',['She found it funny.','She was angry.','She was scared.','She cried.'],'她看着镜子 **laughed**（笑了）→ 觉得好玩。',2]);
P('Ravi’s toy robot stopped walking. One of its legs was loose. Ravi was upset because it was his favourite toy. Grandpa took out a small screwdriver and tightened the screw. He put in new batteries too. Soon, the robot was walking again, and Ravi gave Grandpa a big hug.',
 ['What was wrong with the robot?',['One of its legs was loose.','It had no head.','It was wet.','It was too big.'],'短文说：One of its legs **was loose**（松了）。',1],
 ['What two things did Grandpa do?',['He tightened the screw and put in new batteries.','He painted it and washed it.','He threw it away and bought a new one.','He took it to a shop and paid for it.'],'爷爷**拧紧螺丝**，还**换了电池**。',2],
 ['Why did Ravi hug Grandpa?',['Grandpa fixed his robot.','It was Grandpa’s birthday.','Grandpa was sad.','Ravi was cold.'],'机器人又能走了，是爷爷修好的。',2]);
P('Li Ting and Farah both wanted the swing at the playground. They argued and stopped talking to each other. The next day, Li Ting felt bad. She brought two packets of raisins and gave one to Farah. Farah said sorry too. Then they took turns on the swing.',
 ['Why did the girls argue?',['They both wanted the swing.','They lost a ball.','Farah took Li Ting’s raisins.','They were late.'],'第一句：both wanted **the swing**。',1],
 ['What did Li Ting bring the next day?',['two packets of raisins','a new swing','a card','some sweets'],'短文说：She brought **two packets of raisins**。',1],
 ['How did the girls solve the problem?',['They took turns on the swing.','They went home.','They asked a teacher.','They found another playground.'],'最后一句：they **took turns** on the swing（轮流）。',2]);
P('Hui Min was going to be a tree in the school concert. Her mother helped her make a costume with brown paper and green cloth leaves. On the day of the concert, one leaf fell off. Her friend quickly stuck it back with tape. Hui Min stood very still on stage, just like a real tree.',
 ['What part did Hui Min play in the concert?',['a tree','a flower','a bird','a princess'],'第一句：going to be **a tree**。',1],
 ['Who helped Hui Min when a leaf fell off?',['her friend','her mother','her teacher','nobody'],'妈妈帮她做服装；叶子掉了，是**她的朋友**帮她贴回去。',2],
 ['What does “stood very still” mean?',['did not move at all','danced around','jumped up and down','sang loudly'],'**stood very still** = 站着一动不动，像真的树。',2]);
P('Kai’s parents made a rule: he can play video games for 30 minutes after he finishes his homework. One day, Kai played for too long and forgot the time. The next day, he set a timer. When the timer rang, he saved his game and switched it off.',
 ['When can Kai play video games?',['after he finishes his homework','before school','during dinner','any time he wants'],'短文说：**after he finishes his homework**。',1],
 ['How long can Kai play each time?',['30 minutes','one hour','10 minutes','the whole day'],'短文说：for **30 minutes**。',1],
 ['Why did Kai set a timer?',['so that he would not play for too long again','to wake up early','to cook rice','to time a race'],'前一天玩太久忘了时间，所以用计时器**提醒自己**。',2]);
P('At Sentosa, Mei Ling and her cousin built a sandcastle with four towers. They decorated it with shells. Suddenly, a big wave came and washed half of it away. Instead of crying, they laughed and started building again, further away from the sea.',
 ['What did the girls decorate the sandcastle with?',['shells','flags','leaves','stones'],'短文说：They decorated it with **shells**。',1],
 ['What happened to the sandcastle?',['A big wave washed half of it away.','A dog stepped on it.','It fell over in the wind.','Their brother kicked it.'],'短文说：**a big wave** came and washed half of it away。',1],
 ['Why did they build again further away from the sea?',['so that the waves could not reach it','because the sand was nicer there','because their parents were there','because it was shady'],'离海远一点，**浪就打不到**了。',2]);
P('Firefighters visited Kumar’s school. They showed the pupils their big red fire engine and their heavy helmets. Kumar was allowed to sit in the driver’s seat. One firefighter taught them what to do in a fire: stay low, cover your nose and get out quickly.',
 ['What colour was the fire engine?',['red','yellow','white','blue'],'短文说：their big **red** fire engine。',1],
 ['Where was Kumar allowed to sit?',['in the driver’s seat','on the roof','on the ladder','on a helmet'],'短文说：sit **in the driver’s seat**。',1],
 ['Which is one thing you should do in a fire?',['stay low','hide under the bed','open all the windows','go back for your toys'],'消防员说：**stay low**（压低身体）、捂住鼻子、快点出去。',2]);
P('Arjun gets $2 of pocket money every school day. He spends $1 on food and saves the rest in a piggy bank. After four weeks, he had saved enough to buy a comic book for his little sister’s birthday.',
 ['How much pocket money does Arjun get each school day?',['$2','$1','$4','$5'],'第一句：**$2** of pocket money every school day。',1],
 ['How much does Arjun save each school day?',['$1','$2','$3','nothing'],'$2 花掉 $1，剩下的存起来：$2 − $1 = **$1**。',2],
 ['What did Arjun buy with his savings?',['a comic book for his sister','a toy for himself','some food','a piggy bank'],'最后一句：a **comic book** for his little sister’s birthday。',1]);
P('Daniel’s class walked along a boardwalk in the mangroves. Below them, they saw crabs running in and out of holes in the mud. Some fish were climbing on the tree roots with their fins. Their teacher said that these fish are called mudskippers.',
 ['Where were the crabs running?',['in and out of holes in the mud','up the trees','on the boardwalk','in the sea'],'短文说：crabs running **in and out of holes in the mud**。',1],
 ['What are the fish that climb on roots called?',['mudskippers','crabs','roots','mangroves'],'短文说：these fish are called **mudskippers**（弹涂鱼）。',1],
 ['What did the mudskippers use to climb?',['their fins','their tails','their teeth','their legs'],'短文说：climbing on the tree roots **with their fins**。',2]);
/* --- facts --- */
P('Otters can often be seen along the rivers in Singapore. They are good swimmers and have webbed feet. Otters live in family groups. They eat fish, crabs and prawns. Sometimes, they can be seen rolling on the grass to dry their fur.',
 ['What do otters eat?',['fish, crabs and prawns','grass and leaves','fruit','insects'],'短文说：They eat **fish, crabs and prawns**。',1],
 ['Why do otters roll on the grass?',['to dry their fur','to find food','to sleep','to play with people'],'短文说：rolling on the grass **to dry their fur**。',1],
 ['Which part of the otter helps it to swim well?',['its webbed feet','its fur','its whiskers','its teeth'],'短文说：good swimmers and have **webbed feet**（有蹼的脚）。',2]);
P('Penguins are birds, but they cannot fly. They use their wings like flippers to swim fast under the water. Most penguins live in very cold places. They have thick feathers and a layer of fat to keep them warm.',
 ['How do penguins use their wings?',['like flippers to swim','to fly','to dig','to hold food'],'短文说：use their wings **like flippers to swim**。',1],
 ['What keeps penguins warm?',['thick feathers and a layer of fat','the sun','their nests','swimming fast'],'短文说：**thick feathers and a layer of fat** keep them warm。',2],
 ['Which sentence is true?',['Penguins are birds that cannot fly.','Penguins are fish.','Penguins live in hot deserts.','Penguins have no feathers.'],'第一句：Penguins are **birds**, but they **cannot fly**。',2]);
P('Bees visit flowers to collect a sweet juice called nectar. They carry the nectar back to their hive. Inside the hive, the bees turn the nectar into honey. They store the honey to eat when there are not many flowers.',
 ['What is nectar?',['a sweet juice in flowers','a type of bee','the bees’ home','a honey jar'],'第一句：a sweet juice called **nectar**（花蜜）。',1],
 ['Where do bees make honey?',['inside the hive','inside the flowers','in the river','in the soil'],'短文说：**Inside the hive**, the bees turn the nectar into honey。',1],
 ['When do bees eat the honey they store?',['when there are not many flowers','every morning','when it rains','only at night'],'最后一句：to eat **when there are not many flowers**。',2]);
P('A chameleon is a kind of lizard. It can change the colour of its skin. It does this to show how it feels, or when the temperature changes. A chameleon also has a very long, sticky tongue. It shoots out its tongue to catch insects.',
 ['What kind of animal is a chameleon?',['a lizard','a frog','a snake','an insect'],'第一句：a kind of **lizard**。',1],
 ['How does a chameleon catch insects?',['It shoots out its long, sticky tongue.','It runs after them.','It changes colour.','It waits in the water.'],'最后一句：It **shoots out its tongue** to catch insects。',1],
 ['What is one reason a chameleon changes colour?',['to show how it feels','to grow bigger','to catch insects','to fall asleep'],'短文说：**to show how it feels**，或者温度变化的时候。',2]);
P('The durian is called the “King of Fruits”. It has a hard shell with sharp thorns. Inside, the flesh is soft and yellow. Some people love its strong smell, but others cannot stand it. In Singapore, you are not allowed to bring durians on the MRT.',
 ['What is the durian called?',['the King of Fruits','the Queen of Fruits','the Smelly Fruit','the Yellow Fruit'],'第一句：the “**King of Fruits**”。',1],
 ['What is the outside of a durian like?',['hard, with sharp thorns','soft and yellow','smooth and red','thin and green'],'短文说：a **hard shell with sharp thorns**。soft and yellow 是里面。',1],
 ['What does “cannot stand it” mean here?',['really do not like it','cannot stand up','love it very much','cannot see it'],'**cannot stand** 在这里 = 受不了、很不喜欢。',2]);
P('Pulau Ubin is a small island off the north-east of Singapore. People take a bumboat to get there. There are no tall buildings on the island. Visitors like to cycle around and see the old kampong houses, birds and wild boars.',
 ['How do people get to Pulau Ubin?',['by bumboat','by MRT','by plane','by bus'],'短文说：People take **a bumboat**。',1],
 ['What can visitors see on the island?',['old kampong houses','tall buildings','a big shopping mall','an airport'],'短文说：see the **old kampong houses**, birds and wild boars。',1],
 ['Which sentence is NOT true?',['There are many tall buildings on Pulau Ubin.','Pulau Ubin is a small island.','Visitors can cycle there.','Wild boars live there.'],'短文说：There are **no tall buildings**，所以“有很多高楼”不对。',2]);
P('Dolphins live in the sea, but they are not fish. They are mammals. They breathe air through a blowhole on top of their heads. Dolphins are very clever. They talk to one another using clicks and whistles.',
 ['How do dolphins breathe?',['through a blowhole on top of their heads','through gills','through their mouths under water','through their skin'],'短文说：through **a blowhole on top of their heads**。',1],
 ['How do dolphins talk to one another?',['using clicks and whistles','using their tails','by jumping','by changing colour'],'最后一句：using **clicks and whistles**。',1],
 ['Why are dolphins NOT fish?',['They are mammals that breathe air.','They live in the sea.','They are very clever.','They can swim fast.'],'短文说：They are **mammals**，用喷气孔呼吸空气。',2]);
P('Sleep is very important for children. When we sleep, our bodies grow and our brains rest. Children aged 6 to 12 need about 9 to 12 hours of sleep every night. Using a phone or tablet before bed can make it harder to fall asleep.',
 ['How many hours of sleep do children aged 6 to 12 need?',['about 9 to 12 hours','about 5 hours','about 15 hours','about 2 hours'],'短文说：about **9 to 12 hours**。',1],
 ['What can make it harder to fall asleep?',['using a phone or tablet before bed','reading a book','brushing your teeth','drinking water'],'最后一句：**Using a phone or tablet before bed**。',1],
 ['What happens to our brains when we sleep?',['They rest.','They stop working forever.','They grow bigger.','They get more tired.'],'短文说：our brains **rest**。',2]);
P('Ants live and work together in large groups called colonies. Some ants go out to look for food. When an ant finds food, it leaves a smell on the ground on its way back. Other ants follow the smell to find the food. That is why we often see ants walking in a line.',
 ['What is a large group of ants called?',['a colony','a hive','a flock','a team'],'第一句：large groups called **colonies**（一群叫 a colony）。',1],
 ['Why do ants often walk in a line?',['They follow a smell to the food.','They are playing a game.','They are tired.','They cannot see well.'],'找到食物的蚂蚁留下气味，别的蚂蚁**跟着气味走**。',2]);
/* --- notices, posters, menus --- */
P('LIBRARY WEEK — 13 to 17 July\nMonday: Storytelling at recess\nWednesday: Bookmark-making (bring your own colour pencils)\nFriday: Book sale — every book at $1\nBorrow 3 books during the week and get a free sticker!',
 ['On which day is the book sale?',['Friday','Monday','Wednesday','Tuesday'],'通告写着：**Friday**: Book sale。',1],
 ['What must pupils bring for bookmark-making?',['their own colour pencils','$1','three books','a sticker'],'通告写着：bring your own **colour pencils**。',1],
 ['How can a pupil get a free sticker?',['by borrowing 3 books during the week','by making a bookmark','by buying a book','by telling a story'],'最后一行：**Borrow 3 books** during the week。',2]);
P('LOST CAT\nName: Mochi\nGrey cat with a white tail and a blue collar\nLast seen: near Block 123, Bishan, on Tuesday evening\nIf you find Mochi, please call Mei at 9123 4567.\nReward: $50',
 ['What colour is Mochi’s tail?',['white','grey','blue','black'],'海报写着：Grey cat with a **white tail**。灰色是身体，蓝色是项圈。',1],
 ['When was Mochi last seen?',['on Tuesday evening','on Monday morning','on Sunday','last week'],'海报写着：Last seen … **on Tuesday evening**。',1],
 ['What will the person who finds Mochi get?',['$50','a cat','a blue collar','a phone'],'最后一行：Reward（奖励）: **$50**。',2]);
P('UNCLE TAN’S DRINKS\nKopi — $1.20\nTeh — $1.20\nMilo — $1.50\nOrange juice — $2.00\nAdd ice: 20 cents more',
 ['How much is a cup of Milo?',['$1.50','$1.20','$2.00','20 cents'],'菜单：Milo — **$1.50**。',1],
 ['Which drink is the most expensive?',['orange juice','kopi','Milo','teh'],'Orange juice **$2.00** 最贵。',1],
 ['Ali buys a teh with ice. How much does he pay?',['$1.40','$1.20','$1.50','$2.20'],'Teh $1.20，加冰再加 20 cents：$1.20 + $0.20 = **$1.40**。',2]);
P('You are invited to Jun Jie’s 9th birthday party!\nDate: Saturday, 8 August\nTime: 2 p.m. to 5 p.m.\nPlace: Block 45, Tampines Street 2, #05-12\nThere will be games, cake and a magic show.\nPlease reply to Jun Jie’s mum by 1 August.',
 ['How old will Jun Jie be?',['9','8','5','12'],'第一行：Jun Jie’s **9th** birthday。',1],
 ['What time does the party end?',['5 p.m.','2 p.m.','8 p.m.','12 p.m.'],'Time: 2 p.m. to **5 p.m.** → 5 点结束。',1],
 ['By when must the guests reply?',['1 August','8 August','2 August','5 August'],'最后一行：reply … **by 1 August**。8 August 是派对那天。',2],
 ['Which is NOT mentioned as part of the party?',['swimming','games','cake','a magic show'],'请柬写了 games、cake、a magic show，**没有 swimming**。',2]);
P('KAI’S SATURDAY\n8.30 a.m. — Swimming lesson\n10.30 a.m. — Chinese tuition\n12.30 p.m. — Lunch with Grandma\n3.00 p.m. — Free time\n7.00 p.m. — Dinner',
 ['What does Kai do at 10.30 a.m.?',['Chinese tuition','swimming','lunch with Grandma','free time'],'时间表：10.30 a.m. — **Chinese tuition**。',1],
 ['Who does Kai have lunch with?',['Grandma','his swimming coach','his tutor','his friends'],'时间表：Lunch with **Grandma**。',1],
 ['What does Kai do after lunch with Grandma?',['He has free time.','He goes swimming.','He has Chinese tuition.','He has breakfast.'],'午饭（12.30）后面是 3.00 p.m. — **Free time**。',2]);
P('SWIMMING POOL RULES\n1. Shower before you enter the pool.\n2. No running on the pool deck.\n3. Children under 7 must be with an adult.\n4. No food or drinks in the pool area.',
 ['What must you do before you enter the pool?',['shower','eat','run','have a drink'],'规则 1：**Shower** before you enter the pool。',1],
 ['Who must be with an adult?',['children under 7','all children','children over 7','swimmers who cannot dive'],'规则 3：**Children under 7** must be with an adult。',1],
 ['Ben, who is 9, is eating a sandwich by the pool. Which rule is he breaking?',['Rule 4','Rule 1','Rule 2','Rule 3'],'规则 4：No **food** or drinks in the pool area。',2]);
P('ART COMPETITION for Primary 3 and 4 pupils\nTheme: My Favourite Place in Singapore\nSize: A3 paper\nHand in your drawing to Mr Ong by 30 September.\nPrizes: 1st — $30 book voucher, 2nd — $20 book voucher, 3rd — $10 book voucher',
 ['Who can join the competition?',['Primary 3 and 4 pupils','all pupils','only Primary 3 pupils','teachers'],'第一行：for **Primary 3 and 4** pupils。',1],
 ['What is the theme?',['My Favourite Place in Singapore','My Family','Animals','The Sea'],'Theme（主题）: **My Favourite Place in Singapore**。',1],
 ['What will the second prize winner get?',['a $20 book voucher','a $30 book voucher','a $10 book voucher','A3 paper'],'2nd（第二名）— **$20** book voucher。',2]);
P('EASY FRUIT SALAD (for 4 people)\n1. Wash 2 apples and a bunch of grapes.\n2. Ask an adult to cut the apples into small pieces.\n3. Peel 2 bananas and slice them.\n4. Mix all the fruit in a bowl.\n5. Add 2 spoons of yoghurt and stir.',
 ['How many people is this fruit salad for?',['4','2','5','1'],'标题：for **4** people。',1],
 ['Who should cut the apples?',['an adult','the child','a friend','no one'],'第 2 步：Ask **an adult** to cut the apples。',1],
 ['What do you do just after mixing the fruit?',['add yoghurt and stir','peel the bananas','wash the apples','cut the apples'],'第 4 步是 mix，下一步第 5 步：**add yoghurt and stir**。',2]);
P('WEATHER THIS WEEK\nMonday: Sunny, 33°C\nTuesday: Cloudy, 31°C\nWednesday: Thunderstorms in the afternoon, 29°C\nThursday: Rainy, 28°C\nFriday: Sunny, 32°C',
 ['Which day is the hottest?',['Monday','Tuesday','Friday','Thursday'],'Monday **33°C** 最高。',1],
 ['On which day will there be thunderstorms?',['Wednesday','Monday','Thursday','Friday'],'**Wednesday**: Thunderstorms in the afternoon。',1],
 ['Siti wants to have a picnic on a sunny day. Which days can she choose?',['Monday or Friday','Tuesday or Wednesday','Wednesday or Thursday','Thursday only'],'写着 Sunny 的是 **Monday 和 Friday**。',2]);
P('Dear Ben,\nI will be home late today. There is fried rice in the fridge. Heat it up in the microwave for 2 minutes. Please finish your Maths homework before you play games. Remember to feed the fish!\nLove, Mum',
 ['Where is the fried rice?',['in the fridge','in the microwave','on the table','in the oven'],'纸条写着：There is fried rice **in the fridge**。',1],
 ['What must Ben do before he plays games?',['finish his Maths homework','feed the fish','eat dinner','call Mum'],'纸条写着：finish your **Maths homework** before you play games。',1],
 ['Why did Mum write this note?',['She will be home late.','She is on holiday.','Ben is sick.','The fish is hungry.'],'第一句：I will be **home late** today。',2]);
P('CITY ZOO\nOpen daily: 8.30 a.m. to 6 p.m.\nTickets: Adult $40, Child (3 to 12 years) $28, Below 3 years: free\nFeeding time: Elephants at 11 a.m., Sea lions at 2 p.m.',
 ['How much is a ticket for a child aged 9?',['$28','$40','free','$12'],'Child (3 to 12 years) **$28**，9 岁在里面。',1],
 ['At what time can you watch the sea lions being fed?',['2 p.m.','11 a.m.','8.30 a.m.','6 p.m.'],'Sea lions at **2 p.m.**。11 a.m. 是大象。',1],
 ['Mei is 2 years old. How much does she pay?',['nothing','$28','$40','$3'],'Below 3 years: **free** → 不用钱。',2]);
P('P3 CAMP — THINGS TO BRING\n• 2 sets of clothes\n• Towel and toothbrush\n• Water bottle\n• Raincoat\n• Torch\nDo NOT bring: phones, games or snacks',
 ['How many sets of clothes should pupils bring?',['2','1','3','5'],'清单：**2** sets of clothes。',1],
 ['Which of these must pupils NOT bring?',['snacks','a towel','a torch','a raincoat'],'Do NOT bring: phones, games or **snacks**。',1],
 ['Why do you think pupils need a raincoat?',['in case it rains','to sleep on','to swim in','to keep snacks dry'],'带雨衣是**以防下雨**。',2]);
const RD=[];RP.forEach(r=>r.q.forEach(x=>RD.push([r.p,...x])));
bank('read','Reading · 阅读',2.4,RD,x=>x[4],([p,q,o,ex])=>mk({p,q,zh:'回到短文里，找到和问题一样的词，答案就在附近。',a:o[0],d:o.slice(1),ex}));

/* ---------- word cards: one set of 5 a week. [word, 中文, simple meaning, example with **word**] ---------- */
const WORDSETS=[
{title:'Feelings 1',zh:'感受 1',words:[
 ['delighted','很高兴的','very pleased and happy','Mei was **delighted** with her birthday present.'],
 ['nervous','紧张的','a little scared about something that is going to happen','Ben felt **nervous** before his spelling test.'],
 ['furious','非常生气的','very, very angry','Dad was **furious** when someone scratched his car.'],
 ['exhausted','筋疲力尽的','very, very tired','After the long walk, we were **exhausted**.'],
 ['curious','好奇的','wanting to know or find out','The **curious** cat looked inside the box.']]},
{title:'Feelings 2',zh:'感受 2',words:[
 ['proud','自豪的','happy about something good you did','Siti was **proud** of her drawing.'],
 ['worried','担心的','thinking that something bad may happen','Mum was **worried** because it was very late.'],
 ['relieved','松了一口气的','happy that something bad did not happen','Kai was **relieved** when he found his wallet.'],
 ['lonely','孤单的','sad because you are alone','The new boy felt **lonely** at recess.'],
 ['frightened','害怕的','scared','The **frightened** kitten hid under the bed.']]},
{title:'Ways of moving',zh:'怎么走、怎么跑',words:[
 ['rush','赶紧去','go somewhere very quickly','We had to **rush** to catch the bus.'],
 ['creep','悄悄地走','move slowly and quietly','Let us **creep** past the sleeping baby.'],
 ['stumble','绊了一下','almost fall while walking','Be careful not to **stumble** on the stairs.'],
 ['wander','闲逛','walk around slowly with no plan','We like to **wander** around the night market.'],
 ['dash','猛冲','run very fast for a short way','I saw the boy **dash** across the field.']]},
{title:'Looking and speaking',zh:'看和说',words:[
 ['glance','瞥一眼','a very quick look','Ravi took a quick **glance** at the clock.'],
 ['stare','盯着看','look at something for a long time','It is rude to **stare** at people.'],
 ['peer','仔细地看','look closely because it is hard to see','Kai had to **peer** into the dark cupboard.'],
 ['whisper','小声说','speak very softly','Please **whisper** in the library.'],
 ['grumble','嘟囔着抱怨','complain in a low voice','Ben likes to **grumble** about homework.']]},
{title:'Story words',zh:'讲故事常用词',words:[
 ['suddenly','突然','quickly, when you do not expect it','**Suddenly**, the lights went off.'],
 ['instead','改为、反而','in place of something else','It rained, so we stayed at home **instead**.'],
 ['although','虽然','even though','**Although** it was late, Ali kept reading.'],
 ['finally','终于','at last, after a long time','We **finally** reached the top of the hill.'],
 ['however','但是、然而','but (at the start of a sentence)','The test was hard. **However**, Siti did well.']]},
{title:'Describing things',zh:'形容东西',words:[
 ['enormous','巨大的','very, very big','The whale was **enormous**.'],
 ['tiny','很小的','very, very small','The ant is **tiny**.'],
 ['ancient','古老的','very, very old','We visited an **ancient** temple.'],
 ['fragile','易碎的','easy to break','Be careful, the glass is **fragile**.'],
 ['filthy','很脏的','very dirty','His shoes were **filthy** after the rain.']]},
{title:'Describing people',zh:'形容人',words:[
 ['generous','大方的','happy to give and share','My **generous** aunt shared her cake with everyone.'],
 ['brave','勇敢的','not afraid to do something scary','The **brave** girl jumped into the deep pool.'],
 ['polite','有礼貌的','showing good manners','It is **polite** to say thank you.'],
 ['stubborn','固执的','not willing to change your mind','The **stubborn** goat would not move.'],
 ['clumsy','笨手笨脚的','often drops or bumps into things','I was **clumsy** and dropped my bowl.']]},
{title:'Places and weather',zh:'地方和天气',words:[
 ['crowded','拥挤的','full of people','The MRT was very **crowded** this morning.'],
 ['scorching','非常炎热的','very, very hot','It was a **scorching** afternoon.'],
 ['gloomy','阴沉的','dark and grey','The sky was **gloomy** before the storm.'],
 ['shallow','浅的','not deep','The children played in the **shallow** water.'],
 ['damp','潮湿的','a little wet','The towel is still **damp**.']]},
{title:'People watching',zh:'看的人',words:[
 ['spectators','观众（看比赛的）','people who watch a sports event','The **spectators** cheered when Ali scored a goal.'],
 ['audience','观众（看演出的）','people who watch a show or concert','The **audience** clapped at the end of the play.'],
 ['onlookers','围观的人','people who stop to watch something happening','A crowd of **onlookers** watched the firemen at work.'],
 ['witnesses','目击者','people who saw something happen','The police spoke to the **witnesses** of the accident.'],
 ['pedestrians','行人','people walking on the road','**Pedestrians** must use the zebra crossing.']]},
{title:'Animal groups',zh:'动物的“群”',words:[
 ['herd','（牛、大象）群','a big group of cows or elephants','A **herd** of elephants walked to the river.'],
 ['flock','（羊、鸟）群','a group of sheep or birds','A **flock** of sheep followed the farmer.'],
 ['troop','（猴子）群','a group of monkeys','A **troop** of monkeys played in the trees.'],
 ['swarm','（蜜蜂、昆虫）群','a big group of bees or insects','A **swarm** of bees flew out of the hive.'],
 ['pack','（狼、狗）群','a group of wolves or wild dogs','A **pack** of wolves hunted at night.']]},
{title:'Ways of walking',zh:'怎么走 2',words:[
 ['limp','一瘸一拐地走','walk slowly because your leg is hurt','Ben had to **limp** home after he hurt his ankle.'],
 ['trudge','拖着沉重的脚步走','walk slowly because you are tired','We had to **trudge** up the hill in the heat.'],
 ['tiptoe','踮着脚走','walk quietly on your toes','I **tiptoe** past the baby’s room so I do not wake her.'],
 ['scurry','小步快跑','run quickly with small steps','The mice **scurry** away when they see the cat.'],
 ['shuffle','拖着脚走','walk without lifting your feet much','Grandpa likes to **shuffle** around the house in his slippers.']]},
{title:'How people do things',zh:'怎么做',words:[
 ['cautiously','小心地','carefully, to stay safe','Siti **cautiously** crossed the busy road.'],
 ['reluctantly','不情愿地','doing something you do not want to do','Kai **reluctantly** shared his sweets with his brother.'],
 ['nervously','紧张地','in a worried, scared way','Mei **nervously** walked up to the stage.'],
 ['gracefully','优美地','moving in a smooth and beautiful way','The swan glided **gracefully** across the lake.'],
 ['punctually','准时地','at exactly the right time, not late','Ravi always arrives **punctually** for his lessons.']]},
{title:'Feelings 3',zh:'感受 3',words:[
 ['ashamed','羞愧的','feeling bad about something wrong you did','Kumar felt **ashamed** after he lied to his mother.'],
 ['grateful','感激的','wanting to thank someone','Mei was **grateful** to her friend for helping her.'],
 ['terrified','非常害怕的','very, very scared','The little boy was **terrified** of the thunder.'],
 ['thrilled','非常兴奋的','very excited and happy','Ali was **thrilled** to win the first prize.'],
 ['annoyed','恼火的','a little angry','Dad was **annoyed** when the neighbour’s dog kept barking.']]},
{title:'Strong or weak',zh:'结实还是不结实',words:[
 ['flimsy','单薄不结实的（东西）','thin and easy to break','The **flimsy** paper bag tore open.'],
 ['frail','虚弱的（老人）','old and weak','My **frail** great-grandmother walks with a stick.'],
 ['feeble','无力的（生病后）','very weak, often after being ill','After his fever, Ben felt too **feeble** to play.'],
 ['sturdy','结实的','strong and not easy to break','We sat on a **sturdy** wooden bench.'],
 ['brittle','脆的、易断的','hard but breaks easily','Dry twigs are **brittle** and snap easily.']]},
{title:'Look-alike words',zh:'长得像的词',words:[
 ['recipe','食谱','the steps for cooking a dish','Mum followed the **recipe** to bake the cake.'],
 ['menu','菜单','a list of food you can order','The waiter gave us the **menu**.'],
 ['ingredients','原料','the things you mix to cook a dish','Flour and eggs are the **ingredients** for this cake.'],
 ['fee','费用（门票、学费）','money you pay to enter or join something','We paid an entrance **fee** at the museum.'],
 ['fare','车费','money you pay for a bus, train or taxi ride','The bus **fare** was two dollars.']]},
{title:'Sayings',zh:'习语',words:[
 ['as quiet as a mouse','非常安静','very quiet','The children were **as quiet as a mouse** during the test.'],
 ['as strong as an ox','非常强壮','very strong','Uncle Raj is **as strong as an ox**.'],
 ['like two peas in a pod','长得一模一样','looking almost the same','The twins are **like two peas in a pod**.'],
 ['butterflies in my stomach','心里发慌、很紧张','feeling very nervous','I had **butterflies in my stomach** before my speech.'],
 ['stuck out like a sore thumb','特别显眼','was very easy to see because it looked different','His red shirt **stuck out like a sore thumb** in the photo.']]},
{title:'Tricky spellings',zh:'难拼的词',words:[
 ['embarrassed','难为情的','feeling shy and silly in front of others','Ben was **embarrassed** when he fell on stage.'],
 ['immediately','马上','right now, at once','Please come here **immediately**.'],
 ['beautiful','美丽的','very pretty','The sunset was **beautiful**.'],
 ['disappeared','消失了','could not be seen any more','The rabbit **disappeared** into its hole.'],
 ['shelves','架子（复数）','more than one shelf','The **shelves** in the library are full of books.']]}
];

/* ---------- write it down: one prompt after each round, answered on paper. [prompt, 中文, model answer] ---------- */


/* ========== GRAMMAR CELLS (P3) ==========
   The P3/P4 papers ask the same small set of grammar points again and again. Each point is one "cell" with its own topic name,
   so the records show how each cell is going. Every explanation is one line: which clue word decides it. Level 2 = the traps. */
function cell(t,w,items,zh){[1,2].forEach(l=>{const sub=items.filter(x=>x[3]===l);if(sub.length)G('gram',t,l,w,()=>{const [q,o,ex]=pick(sub);return mk({q,zh,a:o[0],d:o.slice(1),ex});});});}
cell('were · 复数主语',.9,[
['Ravi and Ben ___ tired after the race yesterday.',['were','was','is','be'],'Ravi and Ben = 两个人，yesterday = 过去 → **were**。',1],
['My sister and I ___ at the beach last Sunday.',['were','was','am','is'],'my sister and I = 两个人，last Sunday = 过去 → **were**。',1],
['The puppies ___ hungry when we came home.',['were','was','is','be'],'puppies = 很多只，came = 过去 → **were**。',1],
['Mum and Dad ___ proud of me when I won the prize.',['were','was','is','be'],'Mum and Dad = 两个人，过去 → **were**。',1],
['We ___ late for school this morning because the bus broke down.',['were','was','is','be'],'We = 很多人，过去 → **were**。',1],
['There ___ many people at the zoo last Saturday.',['were','was','is','be'],'many people = 很多人，last Saturday = 过去 → **were**。',1],
['The twins ___ excited about the school trip yesterday.',['were','was','is','be'],'twins = 两个人，yesterday = 过去 → **were**。',1],
['You ___ very kind to help the old man just now.',['were','was','is','be'],'You 永远配 **were**（过去）。',2],
['Both girls ___ happy with their presents last Christmas.',['were','was','is','be'],'Both = 两个人 → **were**。',2],
['The books on the shelf ___ dusty when we cleaned the room.',['were','was','is','be'],'真正的主语是 books（很多本），不是 shelf → **were**。',2],
['Yesterday, buckets of water ___ poured on the small fire.',['were','was','is','be'],'主语是 buckets（很多桶）→ **were**。',2],
['The children in my class ___ quiet during the test.',['were','was','is','be'],'主语是 children（很多人），不是 class → **were**。',2],
],'先找真正做事的人：一个，还是很多个？');
cell('was · 单数主语',.9,[
['Siti ___ sick yesterday, so she stayed at home.',['was','were','is','are'],'Siti 一个人，yesterday = 过去 → **was**。',1],
['The weather ___ very hot last Monday.',['was','were','is','are'],'weather 一个，last Monday = 过去 → **was**。',1],
['I ___ very hungry after the swimming lesson.',['was','were','is','are'],'I 在过去用 **was**。',1],
['The cake ___ delicious. Everyone wanted more.',['was','were','is','are'],'cake 一个，wanted = 过去 → **was**。',1],
['My teacher ___ happy with my work yesterday.',['was','were','is','are'],'My teacher 一个人，yesterday = 过去 → **was**。',1],
['The library ___ closed last Sunday.',['was','were','is','are'],'library 一个，last Sunday = 过去 → **was**。',1],
['Everyone ___ quiet when the principal walked in.',['was','were','is','are'],'everyone 算一个 → **was**。',2],
['Mr Lee, together with his grandsons, ___ at the park yesterday.',['was','were','is','are'],'together with … 不算进主语，主语是 Mr Lee → **was**。',2],
['This box of crayons ___ given to me by my aunt.',['was','were','is','are'],'主语是 box（一盒），不是 crayons → **was**。',2],
['The furniture ___ delivered yesterday.',['was','were','is','are'],'furniture 不能数，算一个 → **was**。',2],
['Nobody ___ at home when the postman came.',['was','were','is','are'],'nobody 算一个 → **was**。',2],
['Collecting stamps ___ Grandpa’s hobby when he was young.',['was','were','is','are'],'Collecting stamps 是一件事 → **was**。',2],
],'先找真正做事的人：一个，还是很多个？');
cell('Happening now · 进行时',.7,[
['"Keep quiet! The baby ___," said Mum.',['is sleeping','sleeps','slept','was sleeping'],'Keep quiet = 现在正在发生 → **is sleeping**。',2],
['"Please call back later. Dad ___ a shower at the moment."',['is taking','takes','took','was taking'],'at the moment = 现在 → **is taking**。',2],
['"Don’t disturb Mei. She ___ for her test now."',['is studying','studies','studied','are studying'],'now = 现在正在，Mei 一个人 → **is studying**。',2],
['"Listen! Someone ___ the piano."',['is playing','plays','played','was playing'],'Listen! = 现在正在发生 → **is playing**。',2],
['My brother and I ___ a movie tomorrow. We already have the tickets.',['are watching','watch','watched','were watching'],'已经安排好的事（tomorrow、买了票）也用 **are watching**。',2],
['"I ___ football with Ravi later!" said Ben happily.',['am playing','play','played','was playing'],'later 已经约好的事 → **am playing**。',2],
],'现在正在发生的事（now / Look! / Keep quiet），用 is / are + ing。');
cell('While … · 过去进行时',1,[
['I ___ my bath when the lights went out.',['was taking','took','am taking','were taking'],'洗澡正在做，灯突然灭了 → **was taking**。',1],
['The children ___ in the field when it started to rain.',['were playing','played','are playing','was playing'],'正在玩，突然下雨；children 很多人 → **were playing**。',1],
['Mum ___ dinner when the phone rang.',['was cooking','cooked','is cooking','were cooking'],'正在煮，电话突然响 → **was cooking**。',1],
['We ___ TV when we heard a loud bang.',['were watching','watched','are watching','was watching'],'正在看，突然一声响；We → **were watching**。',1],
['Ali ___ his bicycle when he fell.',['was riding','rode','is riding','were riding'],'正在骑，突然摔倒 → **was riding**。',1],
['The baby ___ when the doorbell rang.',['was sleeping','slept','is sleeping','were sleeping'],'正在睡，门铃突然响 → **was sleeping**。',1],
['While Siti ___ her homework, her brother played games.',['was doing','did','does','were doing'],'While + 正在做的事 → **was doing**。',2],
['As the boys ___ to school, they saw a rainbow.',['were walking','walked','walk','was walking'],'As + 正在做的事，boys 很多人 → **were walking**。',2],
['While everyone ___ lunch, Kai went to the library.',['was eating','ate','were eating','eats'],'While + 正在做；everyone 算一个 → **was eating**。',2],
['Grandma ___ in the garden when it began to rain.',['was working','worked','works','were working'],'正在干活，突然下雨 → **was working**。',2],
['While Dad ___ the car, I washed the windows.',['was washing','washed','washes','were washing'],'While + 正在做的事 → **was washing**。',2],
['The birds ___ loudly when we woke up this morning.',['were singing','sang','sing','was singing'],'我们醒来时鸟正在叫；birds 很多只 → **were singing**。',2],
],'一件事正在做，另一件事突然发生：正在做的那件用 was / were + ing。');
cell('many · a few · 可数',1,[
['There were ___ children at the playground.',['many','much','a little','little'],'children 能数，很多 → **many**。',1],
['How ___ books did you borrow?',['many','much','a little','little'],'books 能数 → How **many**。',1],
['I have ___ friends in my new class.',['many','much','little','a little'],'friends 能数，很多 → **many**。',1],
['There are only ___ sweets left in the jar.',['a few','a little','much','many'],'sweets 能数，only 后面 → **a few**。',1],
['Can you wait for ___ minutes? I am almost ready.',['a few','a little','much','little'],'minutes 能数，几分钟 → **a few**。',1],
['There were too ___ people on the bus, so we waited for the next one.',['many','much','little','a little'],'people 能数，太多 → **many**。',1],
['Very ___ pupils came to school on the stormy day. The class was almost empty.',['few','a few','little','much'],'pupils 能数，很少、不够 → **few**。',2],
['We are going away for ___ days. We will be back on Sunday.',['a few','a little','much','little'],'days 能数，几天 → **a few**。',2],
['The stall is popular. There are ___ customers every day.',['many','much','a little','little'],'customers 能数，很多 → **many**。',2],
['Ben made ___ mistakes because he was careless.',['many','much','a little','little'],'mistakes 能数，很多 → **many**。',2],
['Only ___ pupils knew the answer.',['a few','a little','much','little'],'pupils 能数，only 后面 → **a few**。',2],
],'后面的东西能不能一个一个数？是多还是少？');
cell('much · a little · 不可数',1,[
['The tea is too sweet. It has too ___ sugar.',['much','many','a few','few'],'sugar 不能数，太甜 = 太多 → too **much**。',1],
['Hurry up! We do not have ___ time.',['much','many','a few','few'],'time 不能数，否定句 → **much**。',1],
['How ___ money do you have?',['much','many','a few','few'],'money 不能数 → How **much**。',1],
['Please add ___ salt to the soup.',['some','many','a few','few'],'add 一些，salt 不能数 → **some**。',1],
['There is ___ milk left. We need to buy more.',['little','few','many','a few'],'milk 不能数，不够了 → **little**。',1],
['Could I have ___ water, please?',['some','many','few','a few'],'请求“一些”，water 不能数 → **some**。',1],
['The soup was tasteless because Mum put too ___ salt in it.',['little','much','many','few'],'tasteless 没味道 = 盐太少 → too **little**。',2],
['There isn’t ___ rice left in the pot.',['much','many','little','few'],'否定句，rice 不能数 → **much**。',2],
['I have ___ homework today, so I will finish it quickly.',['a little','a few','many','few'],'homework 不能数，一点点 → **a little**。',2],
['Too ___ sun is bad for your skin.',['much','many','a few','few'],'sun 不能数，太多 → too **much**。',2],
['There was ___ food left after the party. What a waste!',['a lot of','many','a few','few'],'What a waste = 剩了很多，food 不能数 → **a lot of**。',2],
],'后面的东西能不能一个一个数？是多还是少？');
cell('myself · themselves · 反身代词',.6,[
['The twins made the cake by ___.',['themselves','himself','herself','ourselves'],'twins = 他们两个 → **themselves**。',1],
['Mei hurt ___ when she fell.',['herself','himself','themselves','myself'],'Mei 是女孩 → **herself**。',1],
['I can tie my shoelaces by ___.',['myself','himself','yourself','ourselves'],'I → **myself**。',1],
['Ravi taught ___ to swim.',['himself','herself','themselves','myself'],'Ravi 是男孩 → **himself**。',1],
['Dad and I painted the room by ___.',['ourselves','themselves','himself','myself'],'Dad and I = 我们 → **ourselves**。',1],
['"Children, please help ___ to the food," said Mrs Tan.',['yourselves','yourself','themselves','ourselves'],'对很多孩子说“你们自己” → **yourselves**。',2],
['The cat cleaned ___ after eating.',['itself','himself','herself','themselves'],'一只猫 → **itself**。',2],
['"Be careful, Ben, or you will cut ___!"',['yourself','yourselves','himself','myself'],'对 Ben 一个人说“你自己” → **yourself**。',2],
['The girls looked at ___ in the mirror.',['themselves','herself','ourselves','yourselves'],'girls 很多人 → **themselves**。',2],
],'是谁自己做的？一个人还是很多人？');
cell('Question tags · 反问句尾',.6,[
['Mei is your sister, ___?',['isn’t she','is she','doesn’t she','wasn’t she'],'前面是 is（肯定）→ 后面 **isn’t she**。',1],
['You like chocolate, ___?',['don’t you','do you','aren’t you','didn’t you'],'like 是现在的动词 → **don’t you**。',1],
['Ben can swim, ___?',['can’t he','can he','doesn’t he','isn’t he'],'前面是 can → 后面 **can’t he**。',1],
['They are late, ___?',['aren’t they','are they','don’t they','weren’t they'],'前面是 are → 后面 **aren’t they**。',1],
['It will rain later, ___?',['won’t it','will it','isn’t it','doesn’t it'],'前面是 will → 后面 **won’t it**。',1],
['Siti went to the zoo, ___?',['didn’t she','did she','wasn’t she','doesn’t she'],'went 是过去的动词 → **didn’t she**。',1],
['She looked scared, ___?',['didn’t she','wasn’t she','did she','doesn’t she'],'looked 是过去的动词（不是 was）→ **didn’t she**。',2],
['Jun does not eat fish, ___?',['does he','doesn’t he','is he','isn’t he'],'前面是否定（does not）→ 后面肯定 **does he**。',2],
['You were at home yesterday, ___?',['weren’t you','were you','didn’t you','aren’t you'],'前面是 were → 后面 **weren’t you**。',2],
['Your mother isn’t a teacher, ___?',['is she','isn’t she','does she','was she'],'前面是否定（isn’t）→ 后面肯定 **is she**。',2],
['We should leave now, ___?',['shouldn’t we','should we','don’t we','aren’t we'],'前面是 should → 后面 **shouldn’t we**。',2],
],'前面肯定，后面就否定；前面否定，后面就肯定。用前面的那个小词（is / can / did…）。');
cell('this · that · these · those',.4,[
['"___ books on the top shelf over there are mine."',['Those','These','That','This'],'over there（远）+ 很多本 → **Those**。',2],
['"___ cup I am holding is very hot."',['This','That','These','Those'],'在我手上（近）+ 一个 → **This**。',2],
['"Look at ___ monkeys over there!"',['those','these','that','this'],'over there（远）+ 很多只 → **those**。',2],
['"___ shoes here are too small for me."',['These','Those','This','That'],'here（近）+ 一双（复数）→ **These**。',2],
],'近还是远（here / over there）？一个还是很多？');
cell('Joining words · 连接词',.5,[
['Henry went out to play ___ he had finished his homework.',['since','but','or','until'],'后半句是原因 → **since**（since 也可以是“因为”）。',2],
['Sam wore a jacket ___ it was cold.',['because','but','or','so'],'后半句是原因 → **because**。',2],
['It was raining, ___ we stayed indoors.',['so','because','but','or'],'后半句是结果 → **so**。',2],
['Ali likes durian ___ his sister does not.',['but','so','because','or'],'前后相反 → **but**。',2],
['You can have juice ___ milk.',['or','but','so','because'],'两样选一样 → **or**。',2],
['Both Mei ___ Siti are in the choir.',['and','or','but','so'],'both … **and** …。',2],
],'两部分是什么关系：原因、结果、相反，还是选一个？');

/* ---------- subject and verb: the real subject, two choices ---------- */
const SVA=[
['The smell of the cookies ___ the kitchen.',['fills','fill'],'真正的主语是 smell（一个），不是 cookies → **fills**。'],
['One of my friends ___ near the school.',['lives','live'],'one of … = 一个 → **lives**。'],
['Every child ___ a turn on the swing.',['gets','get'],'every child = 每一个 → **gets**。'],
['The boys in the band ___ every Friday.',['practise','practises'],'主语是 boys（很多人）→ **practise**。'],
['There ___ many ways to save water.',['are','is'],'There ___ 看后面：many ways（很多）→ **are**。'],
['There ___ a small path behind the house.',['is','are'],'There ___ 看后面：a small path（一条）→ **is**。'],
['Each of the girls ___ a red ribbon.',['wears','wear'],'each of … = 每一个 → **wears**。'],
['The noise from the cars ___ the baby.',['wakes','wake'],'真正的主语是 noise（一个），不是 cars → **wakes**。'],
['Baby elephants that ___ lost need help.',['are','is'],'that 前面是 elephants（很多）→ **are**。'],
['Mr Tan, as well as his sons, ___ fishing.',['loves','love'],'as well as … 不算进主语，主语是 Mr Tan → **loves**。'],
['Everyone in the class ___ the answer.',['knows','know'],'everyone 算一个 → **knows**。'],
['The leaves on that tree ___ yellow in autumn.',['turn','turns'],'主语是 leaves（很多片），不是 tree → **turn**。'],
];
G('gram','Subject and verb · 主谓一致',2,.8,()=>{const [q,o,ex]=pick(SVA);return mk({q,zh:'先找真正的主语（中间的介词短语不算），一个还是很多？',a:o[0],d:o.slice(1),ex});});

/* ---------- pronoun cloze: a short story on top, one blank at a time ---------- */
const PCL=[
['Mei and Jun went to the beach. {They} built a big sandcastle. A wave came and washed {it} away. Mei laughed and said, "Let’s build {it} again!"',
 ['开头做事的是 Mei and Jun 两个人 → They。','被冲走的是 sandcastle（一个东西）→ it。','再建的还是那个 sandcastle → it。']],
['Ravi has a little dog. {Its} name is Lucky. Every evening, Ravi takes {him} for a walk. Lucky always wags {his} tail when he sees Ravi.',
 ['“它的”名字，名词 name 前面 → Its。','Ravi 带“他”（Lucky）去散步，放在动词后面 → him。','“他的”尾巴，名词 tail 前面 → his。']],
['Grandma lives with {us}. She tells my brother and {me} stories every night. {We} love her stories very much.',
 ['住在“我们”家，放在 with 后面 → us。','my brother and ___ 放在动词后面 → me。','开头做事的是我和弟弟 → We。']],
['The children found a bird with a broken wing. {They} put {it} in a box. Their teacher helped {them} to take care of the bird.',
 ['开头做事的是 children → They。','放进盒子的是 bird（一只）→ it。','老师帮助“他们”，放在动词后面 → them。']],
['Mum said to my sister and me, "{You} must tidy {your} room before dinner." We tidied {it} quickly.',
 ['妈妈对我们说“你们” → You。','“你们的”房间，名词 room 前面 → your。','收拾的是 room（一个房间）→ it。']],
['Kai and his father went fishing. {They} caught three fish. Kai’s mother cooked {them} for dinner. {She} is a very good cook.',
 ['开头做事的是 Kai and his father → They。','煮的是 fish（三条）→ them。','Kai 的妈妈是女的，做事的人 → She。']],
['The cat climbed up a tall tree. {It} could not come down. A kind man used {his} ladder to reach {it}.',
 ['爬树的是 cat → It。','“他的”梯子，名词 ladder 前面 → his。','够到的是 cat → it。']],
];
const PRONS=['he','she','it','they','we','you','i','him','her','them','us','me','his','its','their','our','your','my'];
function pclOpts(a){const A=a.toLowerCase();const fam={he:['him','his','she'],she:['her','hers','he'],it:['its','they','them'],they:['them','their','it'],we:['us','our','they'],you:['your','yours','them'],i:['me','my','we'],him:['he','his','them'],her:['she','hers','him'],them:['they','their','it'],us:['we','our','them'],me:['i','my','us'],his:['he','him','her'],its:['it','it’s','their'],their:['they','them','there'],our:['we','us','their'],your:['you','yours','their'],my:['me','i','mine']}[A]||['it','they','them'];
  const up=/^[A-Z]/.test(a)||A==='i';return [a,...fam.map(x=>up?cap(x):x)];}
G('gram','Pronoun cloze · 代词完形',2,.8,()=>{const [text,why]=pick(PCL);const ans=[];let k=0;
  const p=text.replace(/\{([^}]+)\}/g,(m,x)=>{ans.push(x);k++;return `___(${k})`;});
  return ans.map((a,i)=>{const q=mk({q:`What goes in blank (${i+1})?`,p,zh:'空格要的是：做事的人（they）、被做的人（them），还是“…的”（their）？',a,d:pclOpts(a).slice(1),ex:why[i]});q.step=(i+1)+'/'+ans.length;return q;});});

/* ---------- clue words: four words that all look possible; one word in the sentence decides ---------- */
const CLUE=[
['Ali had hurt his knee, so he ___ slowly to the classroom.',['limped','marched','skipped','dashed'],'hurt his knee','受伤了，走路一瘸一拐 → limped。'],
['The vase is very ___. Please hold it with both hands.',['fragile','flimsy','frail','feeble'],'vase','东西容易碎 → fragile。'],
['Grandma is old and ___, so she walks with a stick.',['frail','fragile','flimsy','sturdy'],'old','老人身体虚弱 → frail。'],
['The paper plate was too ___ to hold the heavy curry.',['flimsy','fragile','frail','sturdy'],'paper plate … too … to hold','东西单薄、不结实 → flimsy。'],
['Mei ___ into the room so that she would not wake the baby.',['tiptoed','stomped','marched','raced'],'would not wake the baby','怕吵醒人，踮着脚走 → tiptoed。'],
['After the long hike, the tired boys ___ back to the bus.',['trudged','skipped','raced','tiptoed'],'tired … long hike','累了，脚步沉重 → trudged。'],
['The mice ___ into their hole when they saw the cat.',['scurried','strolled','trudged','marched'],'saw the cat','看到猫，小步飞快地跑 → scurried。'],
['The old man ___ along the corridor in his slippers.',['shuffled','sprinted','skipped','leapt'],'old man … slippers','老人拖着脚走 → shuffled。'],
['Thousands of ___ cheered as the runners crossed the finish line.',['spectators','audience','witnesses','passengers'],'runners … finish line','看比赛的人 → spectators。'],
['The ___ clapped loudly at the end of the concert.',['audience','spectators','witnesses','pedestrians'],'concert','看演出的人 → audience。'],
['The police asked the ___ what they had seen at the accident.',['witnesses','audience','spectators','customers'],'what they had seen','看到事情发生的人 → witnesses。'],
['The ___ waited at the traffic light before crossing the road.',['pedestrian','passenger','driver','spectator'],'crossing the road','走路过马路的人 → pedestrian。'],
['A ___ of cows was eating grass in the field.',['herd','flock','troop','swarm'],'cows','一群牛 → herd。'],
['A ___ of sheep followed the farmer.',['flock','herd','troop','swarm'],'sheep','一群羊 → flock。'],
['A ___ of monkeys swung from tree to tree.',['troop','flock','herd','swarm'],'monkeys','一群猴子 → troop。'],
['A ___ of bees flew out of the hive.',['swarm','troop','flock','herd'],'bees','一群蜜蜂 → swarm。'],
['Kai did not want to share his toys, so he gave them to his sister ___.',['reluctantly','eagerly','happily','proudly'],'did not want to','不想做但还是做了 → reluctantly。'],
['The cat moved ___ towards the bird so that it would not fly away.',['stealthily','noisily','carelessly','cheerfully'],'so that it would not fly away','悄悄地，不让鸟发现 → stealthily。'],
['The dancer moved ___ across the stage like a swan.',['gracefully','clumsily','angrily','lazily'],'like a swan','像天鹅一样优美 → gracefully。'],
['Siti always arrives ___. She is never late.',['punctually','lazily','slowly','rudely'],'never late','准时 → punctually。'],
['Mum followed the ___ carefully to bake the cake.',['recipe','menu','ingredients','receipt'],'followed … to bake','做菜的步骤 → recipe。'],
['The waiter gave us the ___ so that we could choose our food.',['menu','recipe','ingredients','fee'],'choose our food','选菜用的菜单 → menu。'],
['Flour, eggs and sugar are the ___ for this cake.',['ingredients','recipe','menu','fare'],'Flour, eggs and sugar','做菜的原料 → ingredients。'],
['The bus ___ to the zoo was two dollars.',['fare','fee','menu','recipe'],'bus','坐车的钱 → fare。'],
['We paid an entrance ___ to visit the museum.',['fee','fare','menu','recipe'],'entrance','进门、上课要交的钱 → fee。'],
['Ben felt ___ when he wore odd socks to school and everyone laughed.',['embarrassed','grateful','relieved','curious'],'everyone laughed','大家笑他，很难为情 → embarrassed。'],
['Mei was ___ when she found her lost puppy.',['relieved','ashamed','annoyed','curious'],'found her lost puppy','找到了，松了一口气 → relieved。'],
['Ravi was ___ to his neighbour for helping him fix his bicycle.',['grateful','ashamed','curious','annoyed'],'for helping him','感谢别人帮忙 → grateful。'],
['Kumar felt ___ after he lied to his mother.',['ashamed','grateful','relieved','thrilled'],'lied','做错事，觉得羞愧 → ashamed。'],
];
G('word','Clue words · 找证据词',2,1,()=>{const [q,o,c,why]=pick(CLUE);return mk({q,zh:'四个词都像对的。先在句子里找一个能定答案的词。',a:o[0],d:o.slice(1),ex:`证据词：**${c}** → ${why}`});});

/* ========== PHRASES (介词卡): the 143 cards of 英文介词卡_题目清单, in 25 groups.
   Groups 1–6: common phrases; 7–13: grammar MCQ; 14–17: grammar cloze; 18–22: open cloze; 23–25: two-word verbs.
   Each card: [sentence with the answer in {}, 用法, words that would ALSO be right here (never offered)]. ========== */
const PPG=[
{t:"Time and place",zh:"时间和地点",pool:["in", "on", "at", "for", "of", "by", "to"],w:[["The bus came {on} time.", "准时", ["in"]], ["Ali stood {in} front of the class.", "在……前面", []], ["The cat sat {on} top of the cupboard.", "在……上面", []], ["Jay was late {for} school.", "……迟到", ["to"]], ["Father is busy {at} the moment.", "此刻", []], ["Please wait here {for} a while.", "一会儿", []]]},
{t:"Feelings",zh:"感觉",pool:["of", "with", "to", "for", "in", "at", "about"],w:[["Mother was proud {of} me.", "为……骄傲", []], ["The jar is filled {with} sweets.", "装满", []], ["Mei is afraid {of} the dark.", "害怕", []], ["The box is full {of} toys.", "满是", []], ["Be kind {to} animals.", "对……友善", []], ["Mother was angry {with} me.", "生……的气", ["at"]]]},
{t:"Good at, known for",zh:"擅长、出名",pool:["for", "in", "at", "of", "with", "on", "to"],w:[["This town is known {for} its food.", "因……出名", []], ["These shoes are suitable {for} hiking.", "适合", []], ["Ben is interested {in} insects.", "对……感兴趣", []], ["Siti is good {at} drawing.", "擅长", []], ["Grandpa has a good sense {of} humour.", "幽默感", []], ["This is part {of} my project.", "……的一部分", []]]},
{t:"Doing words",zh:"动作词组",pool:["at", "for", "with", "about", "on", "in", "of", "to"],w:[["Look {at} the rainbow!", "看", ["for", "to"]], ["I am looking {for} my pencil.", "找", ["at"]], ["We waited {for} the bus.", "等", ["on", "in", "at"]], ["Kai likes to play {with} his puppy.", "和……玩", []], ["Do not stare {at} people.", "盯着看", []], ["Think {about} your answer first.", "想", ["of", "on"]]]},
{t:"Doing words 2",zh:"动作词组 2",pool:["in", "of", "for", "with", "at", "on", "to"],w:[["We took part {in} the race.", "参加", []], ["Please take care {of} your sister.", "照顾", []], ["They live {in} a flat.", "住在", []], ["We search {for} shells on the beach.", "寻找", []], ["The game stopped because {of} the rain.", "因为（后面接东西）", []], ["I bought a pair {of} socks.", "一双", ["for"]], ["We climbed to the top {of} the hill.", "……的顶上", []]]},
{t:"Two-word verbs",zh:"短语动词",pool:["up", "on", "out", "off", "down", "in", "away", "at"],w:[["Please pick {up} the rubbish.", "捡起", ["out"]], ["I wake {up} at six every day.", "醒来", []], ["Put {on} your jacket.", "穿上", ["down", "away", "up", "off"]], ["Let's find {out} who did it.", "查出", []], ["I signed {up} for the camp.", "报名", ["on", "in"]], ["Look {up} the word in the dictionary.", "查（字典）", ["at", "for", "out"]]]},
{t:"During and on",zh:"during 和 on",pool:["during", "on", "at", "for", "since", "of"],w:[["The children played tag {during} recess.", "课间休息时", ["at"]], ["Sarah visited her grandparents {during} the school holidays.", "假期里", ["in", "over", "for", "on"]], ["Pay attention {during} the morning assembly.", "早会时", ["at", "in", "to", "for"]], ["Ravi's worksheet is due {on} Monday.", "星期几", ["by"]], ["Our extra classes are held {on} Monday afternoons.", "星期几的下午", ["during"]], ["The contest is {on} the last day of the term.", "具体某一天", ["during"]]]},
{t:"On and at",zh:"on 和 at",pool:["on", "at", "in", "for", "since", "of"],w:[["Sam dropped his pen {on} the floor.", "掉在地上", ["to", "onto"]], ["My painting is displayed {on} the wall.", "挂在墙上", []], ["The teacher tapped {on} my table.", "敲在桌面上", ["at"]], ["The carnival starts {at} noon tomorrow.", "中午", []], ["{At} midnight, the fireworks will start.", "半夜", []], ["The recess bell rings {at} 9 a.m. daily.", "钟点", []]]},
{t:"At and for",zh:"at 和 for",pool:["at", "for", "in", "on", "since", "by"],w:[["I will see you {at} home later.", "在家", []], ["I bought some stationery {at} the school bookshop.", "在某个店", ["in", "from", "by"]], ["Tina's grandparents live {at} 3, Jalan Ang Mo Kio.", "门牌地址", ["on"]], ["Mei has not seen Mr Tan {for} two weeks.", "一段时间", ["in"]], ["James jogged every day {for} a week.", "一段时间", []], ["We use ice {for} cooling down hot drinks.", "用来做……（后面加 -ing）", ["in"]]]},
{t:"For and in",zh:"for 和 in",pool:["for", "in", "on", "at", "of", "by"],w:[["Suzy bought some fruit {for} making desserts.", "用来做……（后面加 -ing）", []], ["The meeting was held {for} the purpose of planning the camp.", "for the purpose of 为了", []], ["The class will vote {for} Susan as their leader.", "投票给", []], ["Lily's birthday is {in} October.", "月份", []], ["The concert was at seven o'clock {in} the evening.", "晚上", []], ["You can see beautiful artworks {in} the school hall.", "在大空间里", ["at", "by"]]]},
{t:"By and since",zh:"by 和 since",pool:["by", "in", "at", "on", "for", "since", "of", "with", "to"],w:[["You can buy some fruit {in} that supermarket.", "在店里面", ["at", "from", "for", "by"]], ["The bear was waiting {by} the river.", "在旁边", ["at", "near", "for", "beside", "across", "on", "in"]], ["Please stay {by} my side in the crowd.", "在身边", ["at", "on", "beside"]], ["Mia completed the project all {by} herself.", "自己做", ["for"]], ["Return the books {by} Monday.", "最迟在……之前", ["on", "before", "for"]], ["Mr Lim has waited for the bus {since} 2 o'clock.", "从某个时间点起", ["at"]]]},
{t:"Since, through, behind",zh:"since、through、behind",pool:["since", "through", "between", "behind", "among", "in", "for", "of", "at"],w:[["Sandy has played the piano {since} she was five.", "从……时候起", ["for"]], ["I take a walk {through} the park every evening.", "穿过", ["in", "around", "across", "behind", "at"]], ["The thief came in {through} the window.", "从……进来", ["at"]], ["The silver car is parked {between} the yellow car and the black van.", "两者之间", ["behind"]], ["My cat hid {behind} the door.", "在后面", ["by", "near", "beside", "at"]]]},
{t:"Among, against, over",zh:"among、against、over",pool:["against", "over", "with", "towards", "among", "at", "of", "since", "for", "by"],w:[["The rescuers searched {among} the rubble for survivors.", "在一堆东西中间", ["through", "in", "under", "behind", "between", "for", "at", "over", "by"]], ["Do not lean {against} the bookshelf.", "靠着", ["on", "over", "towards", "by"]], ["Mrs Lim leaned {over} and tapped my shoulder.", "俯身", ["in", "forward", "down", "across"]], ["The scientist experimented {with} some chemicals.", "用……做实验", ["on"]], ["Walk {towards} the office and you will see the bookshop.", "朝……走", ["to", "past", "into", "through", "around", "by", "over"]]]},
{t:"In a passage",zh:"短文里的介词",pool:["for", "in", "across", "from", "through", "to", "of", "at", "on", "with"],w:[["We had berries {for} breakfast.", "当早餐", ["at", "with"]], ["We left our bowls {in} the sink.", "在里面", ["by", "near", "at", "on"]], ["Schools {across} the country celebrate Racial Harmony Day.", "遍及全国", ["in", "around", "throughout", "through", "of", "from"]], ["We tasted food {from} different cultures.", "来自", ["of", "across", "through"]], ["We remember what we went {through} as a country.", "经历", ["for"]]]},
{t:"In a passage 2",zh:"短文里的介词 2",pool:["to", "from", "for", "up", "off", "in", "at", "on", "with"],w:[["Mrs Tan went up {to} Bernice.", "走到……面前", []], ["Her quick thinking saved her {from} being scolded.", "免于", []], ["The bridge only had space {for} one goat.", "给……的", []], ["The two goats ended {up} butting heads.", "结果", ["in"]], ["Both goats tumbled {off} the bridge.", "从……掉下", ["from", "down", "over"]]]},
{t:"In a passage 3",zh:"短文里的介词 3",pool:["up", "on", "against", "inside", "in", "at", "for", "off", "with", "from"],w:[["The otter swims {up} to the surface.", "向上", ["back", "out"]], ["It puts a flat stone {on} its stomach.", "放在上面", ["against"]], ["The otter smashes the shell {against} the flat stone.", "往……上砸", ["on", "with", "at"]], ["It eats the juicy meat {inside} the sea urchin.", "在里面", ["of", "in", "from", "on"]], ["Maisie the spider lived {in} Robert's house.", "住在里面", ["at", "inside"]]]},
{t:"In a passage 4",zh:"短文里的介词 4",pool:["by", "from", "across", "with", "of", "in", "at", "on", "for", "to"],w:[["She was resting {by} her favourite window.", "在旁边", ["at", "near", "on", "beside", "in"]], ["Robert came home {from} work.", "从……回来", ["after", "for"]], ["The spider spun webs {across} the whole room.", "整片", ["in", "around", "over", "throughout", "on"]], ["The shuttlecock is made {with} a rubber disc and feathers.", "made with：用了哪些东西做成", ["from", "of"]], ["The table is made {of} wood.", "made of：东西本身是什么材料", ["from", "with"]]]},
{t:"Fixed phrases with of",zh:"带 of 的固定搭配",pool:["of", "in", "with", "for", "from", "at", "on", "to"],w:[["Sneezing helps us get rid {of} dust.", "get rid of 去掉", []], ["The otters were in danger {of} becoming extinct.", "in danger of 有……的危险", []], ["Yeast is a type {of} fungus.", "a type of 一种", []], ["Her room is filled with pictures {of} animals.", "pictures of ……的图片", ["with", "for"]], ["We can take the bus instead {of} driving.", "instead of 而不是", []], ["We all let out a sigh {of} relief.", "a sigh of relief 松了一口气", []]]},
{t:"With and about",zh:"with 和 about",pool:["with", "about", "to", "in", "at", "for", "on", "of", "from"],w:[["Be careful when you interact {with} wild animals.", "interact with 和……接触", []], ["Hobbies help children connect {with} their friends.", "connect with 和……联系", ["to"]], ["Its colours help it blend in {with} the trees.", "blend in with 和……融在一起", ["to"]], ["Mrs Lee was worried {about} their safety.", "worried about 担心", ["for"]], ["They go {about} their daily activities as usual.", "go about 照常做", ["on", "with"]], ["Children fear things they do not know {about}.", "know about 知道、了解", ["of"]]]},
{t:"Look forward, at night",zh:"look forward、at night",pool:["forward", "for", "at", "back", "up", "with", "on", "in", "by", "of"],w:[["Kai looked {forward} to seeing Ben again.", "look forward to 盼望", ["back"]], ["{For} example, ladybugs eat harmful insects.", "for example 例如", []], ["The boy held on {for} dear life.", "for dear life 拼命", []], ["Elly sits {at} her piano every day.", "坐在钢琴前", ["by", "near", "beside", "with"]], ["Visit the Gardens {at} night.", "at night 在晚上", ["by"]]]},
{t:"In, from, out",zh:"in、from、out",pool:["in", "from", "out", "at", "on", "of", "with", "for", "to"],w:[["This snail is only found {in} forests.", "在森林里", []], ["Small steps can make a big difference {in} keeping the Earth clean.", "在……方面", ["by", "to"]], ["Keep a safe distance away {from} the otters.", "away from 离……远", []], ["Please stay away {from} the oily beaches.", "stay away from 远离", []], ["Suddenly, the lights went {out}.", "灯灭了", ["off", "on", "down", "up"]], ["Sneezing helps to clear {out} the dust.", "清出去", ["away", "up", "off"]]]},
{t:"Through, after, without",zh:"through、after、without",pool:["through", "after", "without", "over", "towards", "for", "in", "by", "with", "of", "at", "on"],w:[["{Through} drawing, children can express their ideas.", "通过", ["by", "in", "with", "after", "without"]], ["{After} seeing that, Ali called his neighbour.", "看到之后", ["on", "upon", "without", "by", "through"]], ["{Without} waiting for a reply, Nathan went on talking.", "没等", ["after", "by", "through", "in"]], ["Two boys were climbing {over} the fence.", "爬过", ["up", "on", "onto", "down", "towards", "at"]], ["Peter saw Mrs Li walking {towards} them.", "朝着", ["to", "past", "with", "behind", "by", "after", "without"]], ["Hamsters need big cages, so buy one {for} them.", "给……的", ["of", "with"]], ["Dinosaurs were grey or green {in} colour.", "in colour 颜色上", []]]},
{t:"Two-word verbs 2",zh:"短语动词 2",pool:["down", "into", "up", "along", "out", "off", "on", "in", "away"],w:[["Our old car broke {down} on the road.", "坏了", []], ["Burglars broke {into} the house last night.", "闯进", ["in"]], ["All my friends turned {up} for my party.", "到场", ["out"]], ["James turned {down} the invitation politely.", "拒绝", ["away"]], ["The twins get {along} well with everyone.", "相处得好", ["on"]], ["Our teacher asked us to come {up} with new ideas.", "想出", ["out"]]]},
{t:"Two-word verbs 3",zh:"短语动词 3",pool:["out", "away", "in", "up", "on", "off", "down", "into"],w:[["It is time to carry {out} our plans.", "执行", ["on", "off"]], ["Mr Kwan put {away} his uniform in the cupboard.", "收好", ["back", "up"]], ["Simon threw water on the stove to put {out} the fire.", "扑灭", []], ["Mother finally gave {in} and bought the bag.", "让步", ["up"]], ["The fox decided to give {up} and go home.", "放弃", ["in"]]]},
{t:"Two-word verbs 4",zh:"短语动词 4",pool:["out", "away", "off", "on", "at", "up", "down", "in", "for"],w:[["Peter and John fell {out} over a silly problem.", "闹翻", []], ["The dogs growled at me, so I backed {away} slowly.", "往后退", ["off", "up", "out"]], ["After the quarrel, I walked {off} angrily.", "走开", ["away", "out", "on"]], ["The players played {on} although it was raining.", "继续", []], ["To get better, you must work {at} it.", "努力练", ["on"]]]}
];
/* every card: id (the full sentence), the answer, the sentence with a blank */
const PP=[];
PPG.forEach((g,gi)=>g.w.forEach(([s,zh,also])=>{const i=s.indexOf('{'),j=s.indexOf('}'),key=s.slice(i+1,j),pre=s.slice(0,i),post=s.slice(j+1);
  PP.push({id:pre+key+post,key,zh,pre,post,ex:pre+'**'+key+'**'+post,exB:pre+'___'+post,blank:pre+'___'+post,also:also.map(x=>x.toLowerCase()),g:gi});}));
/* the answer and three words from the group's list that are wrong here; a blank at the start of a sentence gets capitals */
function ppOpts(p){const cap=/^[A-Z]/.test(p.key),no=new Set([p.key.toLowerCase(),...p.also]);
  const d=shuf(PPG[p.g].pool.filter(x=>!no.has(x))).slice(0,3);return [p.key,...d.map(x=>cap?x[0].toUpperCase()+x.slice(1):x)];}
const ppQ=(p,q,zh,ex,t)=>{const o=ppOpts(p),r=mk({q,zh,a:o[0],d:o.slice(1),ex});r.c='word';r.t=t;r.l=1;r.pp=p.id;return r;};
const PPX={
  /* learning: the card sentence with its 用法 as a hint */
  word:p=>ppQ(p,p.exB,`提示：${p.zh}`,`${p.ex}\n用法：${p.zh}`,'Prepositions · 介词卡'),
  /* review: the same sentence, no hint */
  sentence:p=>ppQ(p,p.exB,'空格里填哪个小词？',`${p.ex}\n用法：${p.zh}`,'Prepositions · 介词卡'),
  story:()=>[],
  /* which sentence has the wrong small word? */
  wrong:list=>{const four=shuf(list).slice(0,4);if(four.length<4)return null;const bad=four[0],o=ppOpts(bad);
    const sent=x=>x.id;const wrongS=bad.pre+o[1]+bad.post;
    const opts=shuf([wrongS,...four.slice(1).map(sent)]);
    return {q:'Which sentence has a wrong small word?',p:null,zh:'四句里有一句的小词用错了。',opts,ans:opts.indexOf(wrongS),ex:`应该是：${bad.ex}（${bad.zh}）`,c:'word',t:'Prepositions: spot the mistake · 找错',l:2,pp:bad.id};}};

/* ---------- engine ---------- */
const CATW={gram:.33,word:.3,read:.37};
function wpick(arr,wf){let t=0;arr.forEach(x=>t+=wf(x));let r=Math.random()*t;for(const x of arr){r-=wf(x);if(r<=0)return x;}return arr[arr.length-1];}
function pickCat(){return wpick(Object.keys(CATW),k=>CATW[k]);}
function key(q){if(Array.isArray(q))q=q[0];   /* a step-by-step question is known by its first step */
  return (q.p||'')+'|'+q.q+'|'+q.opts.slice().sort().join('|');}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
/* fresh: never seen before; ok2: at least not seen recently */
function make(c,l,fresh,ok2){let pool=GENS.filter(g=>g.c===c&&g.l===l);if(!pool.length)pool=GENS.filter(g=>g.c===c);let q;
  const one=()=>{const g=wpick(pool,x=>x.w);const x=g.f();(Array.isArray(x)?x:[x]).forEach(y=>{y.c=c;y.t=g.t;y.l=g.l;});return x;};
  for(let k=0;k<80;k++){q=one();if(!fresh||fresh(key(q)))return q;}
  if(ok2)for(let k=0;k<40;k++){q=one();if(ok2(key(q)))return q;}
  return q;}
function size(){return PAST.length+PF.length*18+CF.length*14+BE.length+PRON.length+PREP.length+QUANT.length+CONJ.length+DEM.length+PLUR.length+SYN.length+VOC.length+OPP.length+SPELL.length+FILL.length+QW.length*4+RD.length;}
W.QB={GENS,make,pickCat,key,hash,shuf,size,WORDSETS,spell:true,PPG,PP,PPX};
})(typeof window!=='undefined'?window:globalThis);
