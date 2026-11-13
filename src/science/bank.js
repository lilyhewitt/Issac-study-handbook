(function(W){
'use strict';
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;};
const GENS=[];
const G=(c,t,l,w,f)=>GENS.push({c,t,l,w,f});
/* options are written "English|中文"; the first one is the correct answer */
function mkz(q,qz,o,ex,p,pz){const oe=o.map(x=>x.split('|')[0]),oz=o.map(x=>x.split('|')[1]||x.split('|')[0]);const idx=shuf(o.map((_,i)=>i));
  return{q,p:p||null,zh:(pz?pz+'\n\n':'')+qz,zo:idx.map(i=>oz[i]),opts:idx.map(i=>oe[i]),ans:idx.indexOf(0),ex};}

const TOP={
 living:['life','Living things · 生物'],plants:['life','Plants · 植物分类'],animals:['life','Animals · 动物分类'],fungi:['life','Fungi & bacteria · 真菌和细菌'],
 plantlife:['life','Plant life cycle · 植物生命周期'],animallife:['life','Animal life cycles · 动物生命周期'],
 materials:['mat','Materials · 材料'],magnets:['mat','Magnets · 磁铁'],
 plantparts:['p4','Plant parts · 植物的构造'],digest:['p4','Digestion · 消化'],matter:['p4','Matter · 物质'],light:['p4','Light · 光'],heat:['p4','Heat · 热']
};

const Q=[
/* ===== P3: living / non-living ===== */
['living',1,'Which of these is a living thing?','下面哪一个是生物？',['a mushroom|蘑菇','a rock|石头','a toy robot|玩具机器人','a cloud|云'],'蘑菇会生长、需要水和养分，是生物。石头、玩具、云都不是。'],
['living',1,'Which of these is a non-living thing?','下面哪一个是非生物？',['a stone|石头','a fern|蕨','a cat|猫','a mushroom|蘑菇'],'石头不会生长、不需要食物，是非生物。'],
['living',1,'All living things need ___.','所有生物都需要什么？',['air, food and water|空气、食物和水','sunlight only|只要阳光','soil only|只要泥土','a house|房子'],'所有生物都需要空气、食物和水。'],
['living',2,'Which of these is NOT true of ALL living things?','下面哪一句不是“所有生物”都有的特征？',['They can walk.|它们会走路。','They grow.|它们会生长。','They reproduce.|它们会繁殖。','They respond to changes.|它们会对变化做出反应。'],'植物不会走路，所以“会走路”不是所有生物的特征。'],
['living',1,'A plant bends towards the light. This shows that living things can ___.','植物弯向有光的地方。这说明生物会……',['respond to changes|对变化做出反应','reproduce|繁殖','make noise|发出声音','move from place to place|到处走动'],'弯向光 = 对周围的变化有反应（respond）。'],
['living',1,'A hen lays eggs that hatch into chicks. This shows that living things can ___.','母鸡下蛋，孵出小鸡。这说明生物会……',['reproduce|繁殖','respond to changes|对变化做出反应','fly|飞','breathe|呼吸'],'生出下一代 = 繁殖（reproduce）。'],
['living',1,'A baby grows into an adult. This shows that living things ___.','婴儿长成大人。这说明生物会……',['grow|生长','reproduce|繁殖','respond|反应','need light|需要光'],'从小长大 = 生长（grow）。'],
['living',2,'A car can move. Why is it NOT a living thing?','汽车会动，为什么它不是生物？',['It cannot grow or reproduce.|它不会生长，也不会繁殖。','It is made of metal.|它是金属做的。','It is too big.|它太大了。','It has wheels.|它有轮子。'],'会动不代表是生物。汽车不会长大，也不会生出小汽车。'],
['living',2,'Which of these can make its own food?','下面哪一个能自己制造食物？',['a plant|植物','a mushroom|蘑菇','a dog|狗','a bird|鸟'],'植物用阳光自己制造食物。蘑菇是真菌，不能。'],
['living',1,'You pull your hand away quickly when you touch a hot pot. This shows that living things ___.','摸到热锅马上缩手。这说明生物会……',['respond to changes|对变化做出反应','grow|生长','reproduce|繁殖','need food|需要食物'],'对热有反应 = respond to changes。'],
/* ===== P3: plants ===== */
['plants',1,'Which plant does NOT have flowers?','哪一种植物不开花？',['fern|蕨','hibiscus|大红花','sunflower|向日葵','rose|玫瑰'],'蕨（fern）不开花，用孢子繁殖。'],
['plants',1,'Ferns reproduce by ___.','蕨靠什么繁殖？',['spores|孢子','seeds|种子','fruits|果实','flowers|花'],'蕨用孢子（spores）繁殖。'],
['plants',1,'Moss reproduces by ___.','苔藓靠什么繁殖？',['spores|孢子','seeds|种子','fruits|果实','roots|根'],'苔藓（moss）也用孢子繁殖。'],
['plants',1,'Which plant grows from a seed?','哪一种植物是从种子长出来的？',['a mango tree|芒果树','a fern|蕨','moss|苔藓','a mushroom|蘑菇'],'芒果树开花、结果，果实里有种子。'],
['plants',2,'A mushroom is NOT a plant because ___.','蘑菇不是植物，因为……',['it cannot make its own food|它不能自己制造食物','it is not green|它不是绿色的','it is small|它很小','it grows in soil|它长在泥土里'],'蘑菇是真菌，不能自己制造食物。'],
['plants',1,'Which part of a flowering plant becomes a fruit?','开花植物的哪一部分会变成果实？',['the flower|花','the leaf|叶','the root|根','the stem|茎'],'花会发育成果实，果实里有种子。'],
['plants',2,'Which of these is a non-flowering plant?','哪一个是不开花的植物？',['moss|苔藓','balsam|凤仙花','rice plant|稻','orchid|兰花'],'苔藓不开花。凤仙花、稻、兰花都会开花。'],
['plants',2,'How are a fern and a mango tree different?','蕨和芒果树有什么不同？',['A fern reproduces by spores, but a mango tree reproduces by seeds.|蕨用孢子繁殖，芒果树用种子繁殖。','A fern is not a living thing.|蕨不是生物。','A mango tree does not need water.|芒果树不需要水。','A fern makes fruits.|蕨会结果实。'],'蕨：孢子；芒果树：种子。两个都是生物，都需要水。'],
/* ===== P3: animals ===== */
['animals',1,'Which animal is a mammal?','哪一种动物是哺乳动物？',['whale|鲸','shark|鲨鱼','penguin|企鹅','crocodile|鳄鱼'],'鲸用肺呼吸、喂奶，是哺乳动物。'],
['animals',1,'Which animal is NOT a mammal?','哪一种动物不是哺乳动物？',['penguin|企鹅','bat|蝙蝠','dolphin|海豚','cat|猫'],'企鹅有羽毛、下蛋，是鸟。'],
['animals',1,'Mammals have ___ on their bodies.','哺乳动物身上有什么？',['hair or fur|毛发','feathers|羽毛','scales|鳞片','moist skin|湿润的皮肤'],'哺乳动物身上有毛发。'],
['animals',1,'Mammals feed their young on ___.','哺乳动物用什么喂小宝宝？',['milk|奶','insects|昆虫','seeds|种子','worms|虫子'],'哺乳动物喂奶。'],
['animals',2,'Which mammal lays eggs?','哪一种哺乳动物会下蛋？',['platypus|鸭嘴兽','dolphin|海豚','bat|蝙蝠','whale|鲸'],'鸭嘴兽是会下蛋的哺乳动物，很特别。'],
['animals',1,'Which body covering do all birds have?','所有的鸟身上都有什么？',['feathers|羽毛','fur|毛','scales|鳞片','a shell|壳'],'鸟都有羽毛。'],
['animals',2,'An ostrich cannot fly. Why is it still a bird?','鸵鸟不会飞，为什么还是鸟？',['It has feathers and a beak.|它有羽毛和喙。','It runs very fast.|它跑得很快。','It is very big.|它很大。','It eats seeds.|它吃种子。'],'有羽毛、有喙、下蛋 → 是鸟。会不会飞不重要。'],
['animals',1,'Fish breathe through their ___.','鱼用什么呼吸？',['gills|鳃','lungs|肺','skin|皮肤','noses|鼻子'],'鱼用鳃（gills）呼吸。'],
['animals',2,'A dolphin lives in the sea. Why is it NOT a fish?','海豚住在海里，为什么不是鱼？',['It breathes through lungs and feeds its young on milk.|它用肺呼吸，还喂奶。','It swims very fast.|它游得很快。','It is very clever.|它很聪明。','It has fins.|它有鳍。'],'海豚用肺呼吸、喂奶 → 哺乳动物。'],
['animals',1,'Which animal is a reptile?','哪一种是爬行动物？',['lizard|蜥蜴','frog|青蛙','eel|鳗鱼','whale|鲸'],'蜥蜴皮肤干、有鳞片，是爬行动物。'],
['animals',1,'Reptiles have ___ skin.','爬行动物的皮肤是怎样的？',['dry and scaly|干燥、有鳞片','moist|湿润','furry|有毛','feathery|有羽毛'],'爬行动物：干燥、有鳞片的皮肤。'],
['animals',1,'Which animal is an amphibian?','哪一种是两栖动物？',['frog|青蛙','snake|蛇','turtle|乌龟','goldfish|金鱼'],'青蛙是两栖动物，皮肤湿润，小时候住在水里。'],
['animals',1,'Amphibians have ___ skin.','两栖动物的皮肤是怎样的？',['moist|湿润','dry and scaly|干燥、有鳞片','furry|有毛','feathery|有羽毛'],'两栖动物的皮肤是湿润的（moist）。'],
['animals',1,'How many legs does an insect have?','昆虫有几条腿？',['6','8','4','10'],'昆虫有 6 条腿。'],
['animals',1,'An insect’s body has ___ parts.','昆虫的身体分几部分？',['3','2','4','6'],'头、胸、腹，一共 3 部分。'],
['animals',2,'Why is a spider NOT an insect?','为什么蜘蛛不是昆虫？',['It has 8 legs.|它有 8 条腿。','It spins webs.|它会织网。','It eats insects.|它吃昆虫。','It is very small.|它很小。'],'蜘蛛有 8 条腿，身体只有 2 部分，所以不是昆虫。'],
['animals',1,'Which animal is an insect?','哪一种是昆虫？',['ant|蚂蚁','spider|蜘蛛','snail|蜗牛','earthworm|蚯蚓'],'蚂蚁有 6 条腿、身体 3 部分 → 昆虫。'],
['animals',2,'A snake has no legs. Which group does it belong to?','蛇没有脚，它属于哪一类？',['reptiles|爬行动物','amphibians|两栖动物','fish|鱼类','insects|昆虫'],'蛇的皮肤干燥、有鳞片 → 爬行动物。'],
['animals',2,'A bat can fly. Which group does it belong to?','蝙蝠会飞，它属于哪一类？',['mammals|哺乳动物','birds|鸟类','insects|昆虫','reptiles|爬行动物'],'蝙蝠有毛、喂奶 → 哺乳动物，不是鸟。'],
['animals',1,'Guppies have scales, fins and gills. They are ___.','孔雀鱼有鳞片、鳍和鳃。它们是……',['fish|鱼类','amphibians|两栖动物','reptiles|爬行动物','mammals|哺乳动物'],'有鳞、鳍、鳃 → 鱼。'],
['animals',1,'Which animal gives birth to live young?','哪一种动物直接生下小宝宝（不下蛋）？',['cat|猫','chicken|鸡','turtle|乌龟','frog|青蛙'],'猫是哺乳动物，直接生小猫。'],
['animals',2,'Which animal has scaly skin AND lays its eggs on land?','哪一种动物皮肤有鳞片，又在陆地上下蛋？',['turtle|乌龟','frog|青蛙','dolphin|海豚','goldfish|金鱼'],'乌龟是爬行动物：有鳞片，爬到岸上下蛋。'],
/* ===== P3: fungi & bacteria ===== */
['fungi',1,'Which of these is a fungus?','哪一个是真菌？',['mushroom|蘑菇','fern|蕨','moss|苔藓','grass|草'],'蘑菇是真菌（fungus）。'],
['fungi',1,'Bread mould is a type of ___.','面包上的霉是什么？',['fungus|真菌','plant|植物','animal|动物','insect|昆虫'],'霉菌（mould）是真菌。'],
['fungi',1,'Fungi reproduce by ___.','真菌靠什么繁殖？',['spores|孢子','seeds|种子','eggs|卵','flowers|花'],'真菌用孢子繁殖。'],
['fungi',2,'Fungi get their food from ___.','真菌从哪里得到食物？',['the things they grow on|它们生长的东西上','sunlight|阳光','the air|空气','rocks|石头'],'真菌不能自己制造食物，从它们生长的东西上得到养分（例如面包、腐烂的木头）。'],
['fungi',2,'Bread grows mould fastest in a ___ place.','面包放在哪种地方最快发霉？',['warm and damp|温暖潮湿','cold and dry|寒冷干燥','sunny and dry|晒太阳又干燥','freezing|结冰'],'真菌喜欢温暖、潮湿的地方。'],
['fungi',1,'Which fungus is useful to us?','哪一种真菌对我们有用？',['yeast, used to make bread|做面包用的酵母','mould on rotten fruit|烂水果上的霉','mould on wet walls|湿墙上的霉','fungus that causes itchy skin|让皮肤发痒的真菌'],'酵母（yeast）用来做面包。'],
['fungi',1,'Bacteria are very tiny. We need a ___ to see them.','细菌非常小，要用什么才看得见？',['microscope|显微镜','mirror|镜子','telescope|望远镜','torch|手电筒'],'要用显微镜（microscope）。'],
['fungi',1,'Which bacteria are useful?','哪一种细菌是有用的？',['bacteria used to make yoghurt|做酸奶的细菌','bacteria that cause food poisoning|让人食物中毒的细菌','bacteria that cause tooth decay|让牙齿蛀坏的细菌','bacteria that cause a sore throat|让人喉咙痛的细菌'],'做酸奶要用到细菌。'],
['fungi',1,'Why should we wash our hands before eating?','为什么吃东西前要洗手？',['to remove harmful bacteria|洗掉有害的细菌','to make our hands warm|让手变暖','to help fungi grow|帮真菌生长','to make the food taste better|让食物更好吃'],'洗手可以洗掉有害的细菌。'],
['fungi',2,'We keep food in the fridge because ___.','我们把食物放冰箱，因为……',['bacteria and fungi grow slowly in the cold|细菌和真菌在冷的地方长得慢','food is heavier when cold|冷的食物比较重','fridges are dark|冰箱里很暗','cold food has more water|冷的食物水比较多'],'冷的地方细菌和真菌长得慢，食物不容易坏。'],
['fungi',2,'Fungi and bacteria break down dead plants and animals. Why is this useful?','真菌和细菌分解死去的动植物，有什么用？',['It returns nutrients to the soil.|把养分还给泥土。','It makes the air dirty.|让空气变脏。','It makes plants die.|让植物死掉。','It makes animals sick.|让动物生病。'],'分解后养分回到泥土，植物可以再用。'],
/* ===== P3: plant life cycle ===== */
['plantlife',1,'What is the correct order of a plant’s life cycle?','植物生命周期的正确顺序是？',['seed → seedling → adult plant|种子 → 幼苗 → 成株','seedling → seed → adult plant|幼苗 → 种子 → 成株','adult plant → seedling → seed|成株 → 幼苗 → 种子','seed → adult plant → seedling|种子 → 成株 → 幼苗'],'种子 → 幼苗 → 成株（再开花结果，产生新种子）。'],
['plantlife',2,'Which is NOT needed for a seed to germinate?','种子发芽不需要哪一样？',['soil|泥土','water|水','air|空气','warmth|温暖'],'种子发芽需要水、空气和温暖，不一定要泥土（湿棉花上也能发芽）。'],
['plantlife',2,'A seed needs water, air and ___ to germinate.','种子发芽需要水、空气和……',['warmth|温暖','light|光','soil|泥土','fertiliser|肥料'],'还需要温暖（warmth）。发芽时不需要光。'],
['plantlife',1,'The seed leaves give ___ to the young plant.','子叶给小植物提供什么？',['food|养分','water|水','air|空气','light|光'],'子叶里储存着养分（food）。'],
['plantlife',1,'What is inside a fruit?','果实里面有什么？',['seeds|种子','spores|孢子','roots|根','leaves|叶子'],'果实里有种子。'],
['plantlife',2,'When a seed germinates, which part grows out first?','种子发芽时，哪一部分最先长出来？',['the root|根','the leaf|叶','the flower|花','the fruit|果实'],'最先长出的是根，往下长。'],
['plantlife',2,'Why does an adult plant produce flowers?','成株为什么会开花？',['to make fruits and seeds|为了结果实、产生种子','to make food|为了制造食物','to take in water|为了吸水','to hold the plant up|为了撑住植物'],'花 → 果实 → 种子，这样才能长出新植物。'],
['plantlife',1,'A young plant that has just grown from a seed is called a ___.','刚从种子长出来的小植物叫什么？',['seedling|幼苗','spore|孢子','fruit|果实','pupa|蛹'],'幼苗叫 seedling。'],
['plantlife',2,'Young plants near a window grow towards it. Why?','窗边的小植物往窗户那边长，为什么？',['They need light to make food.|它们需要光来制造食物。','They need soil.|它们需要泥土。','They need air from outside.|它们需要外面的空气。','They want to be cold.|它们想要凉快。'],'植物需要光来制造食物，所以往有光的地方长。'],
/* ===== P3: animal life cycles ===== */
['animallife',1,'How many stages are there in the life cycle of a butterfly?','蝴蝶的生命周期有几个阶段？',['4','3','2','5'],'卵 → 幼虫 → 蛹 → 成虫，一共 4 个阶段。'],
['animallife',1,'What is the correct order of a butterfly’s life cycle?','蝴蝶生命周期的正确顺序是？',['egg → caterpillar → pupa → adult|卵 → 毛毛虫 → 蛹 → 成虫','egg → pupa → caterpillar → adult|卵 → 蛹 → 毛毛虫 → 成虫','caterpillar → egg → pupa → adult|毛毛虫 → 卵 → 蛹 → 成虫','egg → adult → pupa → caterpillar|卵 → 成虫 → 蛹 → 毛毛虫'],'卵 → 毛毛虫（幼虫）→ 蛹 → 成虫。'],
['animallife',1,'At which stage does a butterfly eat the most?','蝴蝶在哪个阶段吃得最多？',['caterpillar (larva)|毛毛虫（幼虫）','egg|卵','pupa|蛹','adult|成虫'],'毛毛虫一直吃叶子，长得很快。'],
['animallife',2,'Which stage of a butterfly does not eat and is covered in a hard case?','蝴蝶的哪个阶段不吃东西，外面有硬壳？',['pupa|蛹','caterpillar (larva)|毛毛虫（幼虫）','adult|成虫','nymph|若虫'],'蛹（pupa）不吃不动，在里面慢慢变成蝴蝶。'],
['animallife',1,'How many stages are there in the life cycle of a grasshopper?','蚱蜢的生命周期有几个阶段？',['3','4','2','5'],'卵 → 若虫 → 成虫，一共 3 个阶段。'],
['animallife',1,'The young of a cockroach is called a ___.','蟑螂的幼体叫什么？',['nymph|若虫','larva|幼虫','pupa|蛹','tadpole|蝌蚪'],'蟑螂、蚱蜢的幼体叫若虫（nymph）。'],
['animallife',1,'The young of a frog is called a ___.','青蛙的幼体叫什么？',['tadpole|蝌蚪','nymph|若虫','caterpillar|毛毛虫','chick|小鸡'],'蝌蚪（tadpole）。'],
['animallife',1,'Where does a tadpole live?','蝌蚪住在哪里？',['in water|水里','on land|陆地上','in a tree|树上','under the ground|地底下'],'蝌蚪住在水里，用鳃呼吸。'],
['animallife',1,'Where are mosquito larvae found?','蚊子的幼虫在哪里？',['in water|水里','on leaves|叶子上','in the soil|泥土里','in the air|空中'],'孑孓（蚊子幼虫）在水里。'],
['animallife',2,'Why should we not leave water in flower pot plates?','为什么花盆底盘不能积水？',['Mosquitoes can lay eggs there.|蚊子会在那里产卵。','The water will turn into ice.|水会结冰。','The plants will grow too fast.|植物会长太快。','The water smells nice.|水很香。'],'蚊子会在积水里产卵，幼虫在水里长大。'],
['animallife',1,'Which animal has a 3-stage life cycle?','哪一种动物的生命周期有 3 个阶段？',['chicken|鸡','butterfly|蝴蝶','mosquito|蚊子','beetle|甲虫'],'鸡：蛋 → 小鸡 → 成鸡。另外三个都是 4 个阶段。'],
['animallife',1,'A young grasshopper looks like its parent but has no wings. It is called a ___.','小蚱蜢像父母但没有翅膀，叫什么？',['nymph|若虫','larva|幼虫','pupa|蛹','chick|小鸡'],'若虫（nymph）像成虫，但没有翅膀。'],
['animallife',2,'Whose young does NOT look like the adult?','谁的幼体长得不像成体？',['butterfly|蝴蝶','cat|猫','grasshopper|蚱蜢','chicken|鸡'],'毛毛虫和蝴蝶长得完全不一样。'],
['animallife',2,'The life cycle of a beetle is most like that of a ___.','甲虫的生命周期最像哪一种？',['butterfly|蝴蝶','grasshopper|蚱蜢','chicken|鸡','cockroach|蟑螂'],'甲虫和蝴蝶都是 4 个阶段：卵、幼虫、蛹、成虫。'],
['animallife',1,'A frog’s life cycle: egg → ___ → adult frog.','青蛙：卵 → ？ → 成蛙',['tadpole|蝌蚪','pupa|蛹','nymph|若虫','larva|幼虫'],'青蛙是三个阶段：卵 → 蝌蚪（tadpole）→ 成蛙。'],
/* ===== P3: materials ===== */
['materials',1,'Which material lets you see through it clearly?','哪一种材料可以清楚地看穿？',['clear glass|透明玻璃','wood|木头','metal|金属','rubber|橡胶'],'透明玻璃可以让光通过，看得清楚。'],
['materials',1,'Raincoats are made of plastic because plastic is ___.','雨衣用塑料做，因为塑料……',['waterproof|防水','magnetic|会被磁铁吸','heavy|很重','soft like cloth|像布一样软'],'塑料防水（waterproof）。'],
['materials',1,'Which material can bend easily without breaking?','哪一种材料能弯曲而不会断？',['rubber|橡胶','glass|玻璃','wood|木头','ceramic|陶瓷'],'橡胶有弹性，容易弯曲（flexible）。'],
['materials',1,'A bicycle frame is made of metal because metal is ___.','脚车的车架用金属做，因为金属……',['strong|坚固','transparent|透明','flexible|容易弯曲','able to absorb water|会吸水'],'金属坚固（strong），可以承受重量。'],
['materials',1,'Which material absorbs water?','哪一种材料会吸水？',['cloth|布','plastic|塑料','glass|玻璃','metal|金属'],'布会吸水。'],
['materials',1,'Windows are made of glass so that ___.','窗户用玻璃做，是为了……',['light can pass through|光可以透进来','they can bend|可以弯曲','they can float|可以浮','they are soft|很软'],'玻璃透明，光可以透进来。'],
['materials',1,'Which object floats on water?','哪一样东西会浮在水上？',['a wooden block|木块','a metal spoon|金属汤匙','a glass marble|玻璃弹珠','a stone|石头'],'木块会浮在水上。'],
['materials',2,'Why is a tyre made of rubber?','为什么轮胎用橡胶做？',['Rubber is strong and flexible.|橡胶坚固又有弹性。','Rubber is transparent.|橡胶是透明的。','Rubber is magnetic.|橡胶会被磁铁吸。','Rubber absorbs water.|橡胶会吸水。'],'橡胶又坚固又有弹性，适合做轮胎。'],
['materials',2,'Which material is NOT suitable for making an umbrella?','哪一种材料不适合做雨伞？',['paper|纸','plastic|塑料','nylon|尼龙','waterproof cloth|防水布'],'纸会吸水、容易破，不适合做雨伞。'],
['materials',2,'A ceramic plate breaks when it is dropped. This is because ceramic is ___.','陶瓷盘子掉下去会碎，因为陶瓷……',['not flexible|不能弯曲','waterproof|防水','transparent|透明','light|很轻'],'陶瓷不能弯曲，摔到就会碎。'],
['materials',1,'Which of these is a metal?','哪一个是金属？',['steel|钢','rubber|橡胶','wood|木头','plastic|塑料'],'钢（steel）是金属。'],
['materials',2,'Kai wants to make a toy boat that floats. Which material should he use?','Kai 想做会浮的玩具船，应该用哪一种材料？',['foam|泡沫','a stone|石头','a metal block|金属块','clay|黏土'],'泡沫（foam）很轻，会浮在水上。'],
['materials',1,'Which object is made of rubber?','哪一样东西是橡胶做的？',['an eraser|橡皮擦','a spoon|汤匙','a window|窗户','a book|书'],'橡皮擦是橡胶做的。'],
['materials',1,'Which object is made of fabric (cloth)?','哪一样东西是布做的？',['a T-shirt|T 恤','a fork|叉子','a cup|杯子','a pencil|铅笔'],'T 恤是布（fabric）做的。'],
['materials',1,'Which material is NOT waterproof?','哪一种材料不防水？',['paper|纸','plastic|塑料','rubber|橡胶','glass|玻璃'],'纸会吸水，所以不防水。'],
['materials',2,'A sponge absorbs a lot of water. Which object should be made from a material like this?','海绵很会吸水。哪一样东西适合用这种材料做？',['a mop|拖把','a raincoat|雨衣','an umbrella|雨伞','rain boots|雨靴'],'拖把要吸水；雨衣、雨伞、雨靴都要防水。'],
['materials',1,'Which material is hard and cannot be scratched easily?','哪种材料很硬、不容易被刮花？',['steel|钢','sponge|海绵','cloth|布','rubber|橡胶'],'钢最硬。'],
['materials',2,'Why are drinking glasses made of glass and not wood?','为什么水杯用玻璃做，不用木头？',['Glass is waterproof and we can see the drink inside.|玻璃防水，还看得见里面的饮料。','Glass is flexible.|玻璃容易弯曲。','Glass floats on water.|玻璃会浮。','Glass absorbs water.|玻璃会吸水。'],'玻璃不吸水、透明。木头会吸水，也看不见里面。'],
/* ===== P3: magnets ===== */
['magnets',1,'Which object is attracted by a magnet?','哪一样东西会被磁铁吸住？',['an iron nail|铁钉','a plastic ruler|塑料尺','a wooden pencil|木铅笔','a rubber band|橡皮筋'],'铁钉是铁做的，会被吸住。'],
['magnets',2,'Which material is NOT attracted by a magnet?','哪一种材料不会被磁铁吸住？',['copper|铜','iron|铁','steel|钢','nickel|镍'],'铜（copper）不会被吸。铁、钢、镍会。'],
['magnets',2,'An aluminium can is ___ by a magnet.','铝罐会被磁铁怎样？',['not attracted|不会被吸','attracted|会被吸住','made into a magnet|变成磁铁','pushed into pieces|推成碎片'],'铝不是磁性材料，不会被吸。'],
['magnets',1,'The two ends of a bar magnet are called the ___.','条形磁铁的两端叫什么？',['poles|磁极','sides|边','corners|角','middles|中间'],'两端叫磁极（poles）：N 极和 S 极。'],
['magnets',1,'Which part of a bar magnet is the strongest?','条形磁铁哪里磁力最强？',['the poles|两极','the middle|中间','it is the same everywhere|到处都一样','the sides|侧面'],'两极（poles）磁力最强。'],
['magnets',1,'Two north poles are brought close together. What happens?','两个 N 极靠近会怎样？',['They push each other away.|互相推开。','They pull each other.|互相吸住。','Nothing happens.|什么都不会发生。','They stick together.|黏在一起。'],'同极相斥：N 和 N 互相推开（repel）。'],
['magnets',1,'A north pole and a south pole are brought close together. What happens?','N 极和 S 极靠近会怎样？',['They pull each other.|互相吸住。','They push each other away.|互相推开。','Nothing happens.|什么都不会发生。','They become weaker.|变弱。'],'异极相吸：N 和 S 互相吸引（attract）。'],
['magnets',2,'A magnet attracts a paper clip through a sheet of paper. This shows that ___.','隔着一张纸，磁铁还能吸住回形针。这说明……',['magnetic force can pass through paper|磁力能穿过纸','paper is magnetic|纸是磁性材料','the paper clip is a magnet|回形针是磁铁','magnets attract paper|磁铁会吸纸'],'磁力可以穿过纸这种非磁性材料。'],
['magnets',2,'A bar magnet hangs freely from a string. When it stops moving, it points ___.','用线吊起条形磁铁，停下来时指向哪里？',['the North-South direction|南北方向','east and west|东西方向','up and down|上下','towards the nearest wall|最近的墙'],'自由悬挂的磁铁会指向南北方向。'],
['magnets',2,'How can you be SURE that a steel bar is a magnet?','怎样才能确定一根钢条是磁铁？',['It pushes away one end of a magnet.|它会推开磁铁的一端。','It is pulled by a magnet.|它会被磁铁吸住。','It is shiny.|它亮亮的。','It is heavy.|它很重。'],'只有“互相推开”（repel）才能证明它是磁铁。被吸住的也可能只是普通的铁。'],
['magnets',2,'To make a magnet, stroke a steel bar with a magnet ___.','用摩擦法做磁铁，要怎样摩擦？',['in one direction only|只朝一个方向','back and forth|来回摩擦','in circles|画圈','in any direction|随便哪个方向'],'要朝同一个方向摩擦，每次都提起来再从头开始。'],
['magnets',1,'How can we make a magnet using electricity?','怎样用电做磁铁？',['Coil wire around an iron nail and connect it to a battery.|把电线绕在铁钉上，再接上电池。','Put an iron nail in water.|把铁钉放进水里。','Heat an iron nail.|把铁钉加热。','Paint an iron nail.|给铁钉上漆。'],'铁钉绕上电线、接电池 → 电磁铁。'],
['magnets',2,'How can you make an electromagnet stronger?','怎样让电磁铁更强？',['Wind more turns of wire around the nail.|在铁钉上多绕几圈电线。','Use fewer coils.|少绕几圈。','Use a wooden stick.|改用木棒。','Use plastic string instead of wire.|用塑料绳代替电线。'],'线圈绕得越多，电磁铁越强。'],
['magnets',1,'The needle of a compass is a ___.','指南针的针是什么？',['magnet|磁铁','piece of plastic|塑料片','piece of glass|玻璃片','piece of copper|铜片'],'指南针的针是一块小磁铁，所以会指南北。'],
['magnets',1,'Magnets are used at a scrapyard to ___.','废铁场用磁铁来……',['pick up iron and steel|吸起铁和钢','pick up plastic bottles|吸起塑料瓶','pick up paper|吸起纸','cut wood|切木头'],'大磁铁可以吸起铁和钢。'],
['magnets',2,'Dropping or heating a magnet many times can make it ___.','磁铁常常摔或加热，会变得怎样？',['weaker|更弱','stronger|更强','bigger|更大','heavier|更重'],'摔或加热会让磁铁变弱。'],
['magnets',1,'A magnet attracts things made of ___.','磁铁会吸住什么材料做的东西？',['iron or steel|铁或钢','wood|木头','glass|玻璃','plastic|塑料'],'铁、钢（还有镍、钴）是磁性材料。'],
['magnets',2,'Kai wants to separate iron filings (tiny bits of iron) from sand. What is the best thing to use?','Kai 想把铁屑从沙子里分出来，用什么最好？',['a magnet|磁铁','water|水','a cloth|布','a spoon|汤匙'],'磁铁只吸铁屑，不吸沙子。'],
['magnets',2,'Ben brought magnet A near magnet B. Magnet B moved away. Which poles were facing each other?','Ben 把磁铁 A 靠近磁铁 B，B 被推开了。面对面的是哪两个极？',['two north poles or two south poles|两个 N 极或两个 S 极','a north pole and a south pole|一个 N 极和一个 S 极','the middles of the magnets|两块磁铁的中间','we cannot tell|无法判断'],'被推开 = 相斥 → 同极：N 对 N 或 S 对 S。'],
/* ===== P4: plant parts ===== */
['plantparts',1,'Which part of a plant takes in water from the soil?','植物的哪一部分从泥土吸水？',['the roots|根','the stem|茎','the leaves|叶','the flowers|花'],'根（roots）从泥土里吸收水分。'],
['plantparts',1,'Which part of a plant makes food?','植物的哪一部分制造食物？',['the leaves|叶','the roots|根','the stem|茎','the fruit|果实'],'叶子利用阳光制造食物。'],
['plantparts',1,'What does a plant need to make food?','植物制造食物需要什么？',['sunlight, water and air|阳光、水和空气','soil only|只要泥土','darkness and water|黑暗和水','sugar|糖'],'植物用阳光、水和空气（二氧化碳）制造食物。'],
['plantparts',1,'What is one job of the stem?','茎的一个作用是什么？',['to hold the plant up|撑住植物','to make seeds|产生种子','to attract insects|吸引昆虫','to make food in the dark|在黑暗中制造食物'],'茎撑住植物，也运送水分和养分。'],
['plantparts',1,'Which part of a plant holds it firmly in the ground?','植物的哪一部分把它牢牢固定在地里？',['the roots|根','the leaves|叶','the flowers|花','the fruit|果实'],'根把植物固定在泥土里。'],
['plantparts',2,'Why are most leaves broad and flat?','为什么大多数叶子又宽又平？',['to trap more sunlight|接收更多阳光','to hold water|装水','to scare animals away|吓走动物','to make the plant heavy|让植物变重'],'又宽又平，能照到更多阳光，好制造食物。'],
['plantparts',2,'What can a flower develop into?','花可以发育成什么？',['a fruit|果实','a root|根','a leaf|叶','a stem|茎'],'花可以发育成果实（fruit），果实里面有种子。'],
['plantparts',2,'A celery stalk was put in red-coloured water. After a few hours, red lines appeared in the stalk. This shows that the stem ___.','把芹菜放进红色的水里，几个小时后茎里出现红线。这说明茎……',['carries water up the plant|把水往上运','makes food|制造食物','takes in sunlight|吸收阳光','stores seeds|储存种子'],'红色的水顺着茎里的管子往上走 → 茎运送水分。'],
['plantparts',2,'Which of these do we eat as a ROOT?','下面哪一样，我们吃的是“根”？',['carrot|胡萝卜','cabbage|包菜','tomato|番茄','celery|芹菜'],'胡萝卜是根。包菜是叶，番茄是果实，芹菜是茎。'],
['plantparts',2,'Which of these do we eat as a LEAF?','下面哪一样，我们吃的是“叶”？',['spinach|菠菜','carrot|胡萝卜','tomato|番茄','potato|马铃薯'],'菠菜吃的是叶子。'],
['plantparts',2,'Which of these do we eat as a FRUIT?','下面哪一样，我们吃的是“果实”？',['tomato|番茄','spinach|菠菜','carrot|胡萝卜','celery|芹菜'],'番茄有种子，是果实。'],
['plantparts',1,'Water moves from the roots to the leaves through the ___.','水从根运到叶子，要经过……',['stem|茎','flower|花','fruit|果实','seed|种子'],'水经过茎往上运到叶子。'],
['plantparts',2,'What would most likely happen to a plant if its roots were cut off?','如果把植物的根剪掉，最可能会怎样？',['It would wilt because it cannot take in water.|会枯萎，因为吸不到水。','It would grow faster.|会长得更快。','It would make more flowers.|会开更多花。','Nothing would happen.|什么都不会发生。'],'没有根就吸不到水，植物会枯萎。'],
['plantparts',1,'Which part of a plant carries food from the leaves to other parts?','植物的哪一部分把叶子做的食物运到别的部分？',['the stem|茎','the flower|花','the seed|种子','the fruit|果实'],'茎里有管子，运送水分和食物。'],
['plantparts',2,'The money plant has a weak stem. How does it grow upwards?','黄金葛的茎很软，它怎样往上长？',['It climbs on a support.|攀着支撑物往上爬。','It floats on water.|浮在水上。','It grows only underground.|只在地下长。','It does not grow at all.|根本不会长。'],'茎软的植物会攀着柱子、墙或其他植物往上长。'],
['plantparts',2,'A plant was kept in a dark cupboard for two weeks. What would most likely happen?','把一盆植物放在黑暗的柜子里两个星期，最可能会怎样？',['It would become weak and yellow.|会变得虚弱、发黄。','It would grow more flowers.|会开更多花。','It would turn greener.|会变得更绿。','It would make more food.|会制造更多食物。'],'没有光就不能制造食物，植物会变黄、变弱。'],
['plantparts',1,'Which part of a plant usually grows under the ground?','植物的哪一部分通常长在地下？',['the roots|根','the flowers|花','the leaves|叶','the fruits|果实'],'根通常长在泥土里。'],
['plantparts',1,'The main job of a flower is to ___.','花最主要的作用是……',['make seeds so that new plants can grow|产生种子，长出新植物','make food|制造食物','take in water|吸水','hold up the plant|撑住植物'],'花会变成果实，果实里有种子。'],
/* ===== P4: digestion ===== */
['digest',1,'Where does digestion begin?','消化从哪里开始？',['in the mouth|口腔','in the stomach|胃','in the small intestine|小肠','in the large intestine|大肠'],'食物一进嘴巴，牙齿和唾液就开始消化了。'],
['digest',2,'Which is the correct order of the digestive system?','消化系统的正确顺序是？',['mouth → gullet → stomach → small intestine → large intestine|口 → 食道 → 胃 → 小肠 → 大肠','mouth → stomach → gullet → small intestine → large intestine|口 → 胃 → 食道 → 小肠 → 大肠','mouth → gullet → small intestine → stomach → large intestine|口 → 食道 → 小肠 → 胃 → 大肠','mouth → gullet → stomach → large intestine → small intestine|口 → 食道 → 胃 → 大肠 → 小肠'],'口 → 食道 → 胃 → 小肠 → 大肠。'],
['digest',1,'What is the job of our teeth?','牙齿的作用是什么？',['to cut and grind food into smaller pieces|把食物切碎、磨碎','to absorb digested food|吸收消化好的食物','to store food|储存食物','to take water out of food|把水从食物里取出'],'牙齿把食物切小、磨碎，好消化。'],
['digest',1,'The gullet ___.','食道的作用是……',['carries food from the mouth to the stomach|把食物从口送到胃','digests all the food|消化所有食物','absorbs water|吸收水分','stores waste|储存废物'],'食道（gullet）是一条管子，把食物送到胃。'],
['digest',2,'Where is digestion completed?','消化在哪里完成？',['in the small intestine|小肠','in the mouth|口腔','in the stomach|胃','in the large intestine|大肠'],'食物在小肠里完全消化。'],
['digest',2,'Where is digested food absorbed into the blood?','消化好的食物在哪里被吸收进血液？',['in the small intestine|小肠','in the gullet|食道','in the mouth|口腔','in the large intestine|大肠'],'小肠吸收消化好的食物。大肠吸收的是水分。'],
['digest',2,'What is the main job of the large intestine?','大肠的主要作用是什么？',['to absorb water from undigested food|从没消化的食物里吸收水分','to chew food|嚼食物','to digest food completely|把食物完全消化','to make saliva|产生唾液'],'大肠从剩下的食物里吸收水分。'],
['digest',1,'Saliva in the mouth helps to ___.','口里的唾液可以……',['soften food and start digesting it|让食物变软，开始消化','clean the stomach|清洁胃','absorb water|吸收水分','make food cold|让食物变冷'],'唾液让食物变软，也开始消化一部分食物。'],
['digest',1,'Which organ churns food and mixes it with digestive juices?','哪一个器官会搅拌食物，和消化液混合？',['the stomach|胃','the gullet|食道','the large intestine|大肠','the teeth|牙齿'],'胃会搅拌食物，和胃液混在一起。'],
['digest',2,'Why do we need to digest food?','为什么我们要消化食物？',['to break it down into simpler substances the body can absorb|把它分解成身体能吸收的东西','to make food taste nicer|让食物更好吃','to make food heavier|让食物更重','to keep food in the body forever|把食物永远留在身体里'],'食物要先分解成很小、很简单的物质，身体才吸收得了。'],
['digest',2,'Which part of the digestive system is the longest?','消化系统哪一部分最长？',['the small intestine|小肠','the gullet|食道','the stomach|胃','the mouth|口腔'],'小肠虽然叫“小”，却是最长的，大约好几米。'],
['digest',1,'Why should we chew our food well?','为什么吃东西要好好咀嚼？',['Smaller pieces of food are easier to digest.|小块的食物比较容易消化。','It makes food hotter.|让食物更热。','It stops digestion.|会停止消化。','It makes us hungry.|会让我们饿。'],'嚼碎了，食物更容易消化。'],
['digest',1,'Undigested food leaves the body through the ___.','没有消化的食物从哪里排出身体？',['anus|肛门','mouth|口','stomach|胃','small intestine|小肠'],'从肛门（anus）排出。'],
['digest',2,'Digestive juices are found in the ___.','哪里有消化液？',['mouth, stomach and small intestine|口、胃和小肠','gullet only|只有食道','large intestine only|只有大肠','teeth only|只有牙齿'],'口里有唾液，胃里有胃液，小肠里也有消化液。'],
['digest',1,'Which body system breaks down the food we eat?','哪一个身体系统负责分解食物？',['the digestive system|消化系统','the respiratory system|呼吸系统','the skeletal system|骨骼系统','the muscular system|肌肉系统'],'消化系统（digestive system）。'],
['digest',1,'Which of these is NOT part of the digestive system?','哪一个不属于消化系统？',['the lungs|肺','the stomach|胃','the gullet|食道','the small intestine|小肠'],'肺属于呼吸系统。'],
/* ===== P4: matter ===== */
['matter',1,'Matter is anything that has ___ and occupies space.','物质是有……而且占空间的东西。',['mass|质量','colour|颜色','smell|气味','light|光'],'有质量（mass）、占空间（occupies space）就是物质。'],
['matter',2,'Which of these is NOT matter?','哪一个不是物质？',['light|光','air|空气','water|水','a stone|石头'],'光没有质量，也不占空间，所以不是物质。空气是物质。'],
['matter',1,'Which of these is a gas?','哪一个是气体？',['air|空气','water|水','ice|冰','sand|沙'],'空气是气体。'],
['matter',2,'A solid has ___.','固体有……',['a definite shape and a definite volume|固定的形状和固定的体积','no definite shape and no definite volume|没有固定形状，也没有固定体积','a definite shape but no definite volume|有固定形状，没有固定体积','no definite volume|没有固定体积'],'固体：形状和体积都固定。'],
['matter',1,'A liquid takes the shape of its ___.','液体会变成什么的形状？',['container|容器','lid|盖子','colour|颜色','mass|质量'],'液体倒进什么容器，就变成什么形状。'],
['matter',2,'Which state of matter has no definite shape and no definite volume?','哪一种状态的物质没有固定形状，也没有固定体积？',['gas|气体','solid|固体','liquid|液体','all of them|都是'],'气体会充满整个容器，形状和体积都不固定。'],
['matter',2,'Water is poured from a cup into a bottle. What stays the same?','把水从杯子倒进瓶子，什么不会变？',['its volume|体积','its shape|形状','its container|容器','its height|高度'],'液体的体积固定，形状会跟着容器变。'],
['matter',2,'Can a gas be squashed into a smaller space?','气体可以被压进更小的空间吗？',['Yes, a gas can be compressed.|可以，气体可以被压缩。','No, never.|不可以，永远不行。','Only solids can be compressed.|只有固体可以被压缩。','Only liquids can be compressed.|只有液体可以被压缩。'],'气体可以被压缩，比如把很多空气打进轮胎。'],
['matter',1,'Which of these is a liquid?','哪一个是液体？',['milk|牛奶','an ice cube|冰块','steam|蒸汽','a wooden block|木块'],'牛奶是液体。'],
['matter',1,'When ice melts, it changes from a ___ to a ___.','冰融化时，从……变成……',['solid; liquid|固体；液体','liquid; gas|液体；气体','gas; liquid|气体；液体','liquid; solid|液体；固体'],'冰（固体）融化成水（液体）。'],
['matter',1,'When water boils, it changes into ___.','水沸腾时变成……',['steam (a gas)|水蒸气（气体）','ice|冰','a solid|固体','sand|沙'],'水沸腾变成水蒸气，是气体。'],
['matter',1,'A balloon gets bigger when we blow into it. This shows that air ___.','往气球里吹气，气球变大。这说明空气……',['occupies space|占空间','has no mass|没有质量','is a liquid|是液体','is a solid|是固体'],'空气占空间，所以气球被撑大。'],
['matter',2,'A sponge gets smaller when it is squeezed. Why?','挤海绵，海绵会变小。为什么？',['Air in the holes of the sponge is pushed out.|海绵小洞里的空气被挤出来了。','The sponge melts.|海绵融化了。','The sponge is a gas.|海绵是气体。','The sponge loses its mass for ever.|海绵永远失去质量。'],'海绵有很多小洞，里面是空气，挤的时候空气被挤出来。'],
['matter',1,'An “empty” bottle is not really empty. It is filled with ___.','“空”瓶子其实不是空的，里面有……',['air|空气','nothing|什么都没有','water|水','light|光'],'“空”瓶子里装满了空气。'],
['matter',2,'Which of these has a definite volume but no definite shape?','哪一个有固定体积，但没有固定形状？',['orange juice|橙汁','a pencil|铅笔','the air in a ball|球里的空气','a coin|硬币'],'液体（橙汁）体积固定、形状不固定。'],
['matter',2,'Sugar can be poured like water. Is sugar a liquid?','糖可以像水一样倒出来。糖是液体吗？',['No. Each grain of sugar is a solid with its own shape.|不是。每一粒糖都是有固定形状的固体。','Yes, because it can be poured.|是，因为它能倒。','Yes, because it is sweet.|是，因为它是甜的。','No, it is a gas.|不是，它是气体。'],'能倒出来的不一定是液体。每粒糖都有固定的形状和体积 → 固体。'],
['matter',1,'What do we use to measure mass?','我们用什么量质量？',['an electronic balance|电子秤','a ruler|尺','a thermometer|温度计','a measuring cylinder|量筒'],'质量用电子秤（electronic balance）量。'],
['matter',1,'What do we use to measure the volume of a liquid?','我们用什么量液体的体积？',['a measuring cylinder|量筒','a ruler|尺','a thermometer|温度计','an electronic balance|电子秤'],'液体体积用量筒（measuring cylinder）量。'],
/* ===== P4: light ===== */
['light',1,'Which of these gives off its own light?','哪一样会自己发光？',['the Sun|太阳','the Moon|月亮','a mirror|镜子','a white wall|白墙'],'太阳自己发光，是光源。'],
['light',2,'We can see an object when light from the object ___.','我们看得见东西，是因为东西发出或反射的光……',['enters our eyes|进入我们的眼睛','leaves our eyes|离开我们的眼睛','hits the ceiling|照到天花板','is blocked|被挡住'],'光进入眼睛，我们才看得见。'],
['light',2,'The Moon is not a source of light because it ___.','月亮不是光源，因为它……',['only reflects light from the Sun|只是反射太阳的光','is too far away|太远了','is round|是圆的','is cold|是冷的'],'月亮自己不发光，只是反射太阳光。'],
['light',1,'A shadow is formed when an object ___.','物体……的时候会形成影子。',['blocks light|挡住光','reflects all the light|反射所有的光','gives off light|发光','lets all light through|让光全部通过'],'物体挡住光，后面就形成影子。'],
['light',1,'Which material lets the most light pass through?','哪一种材料让最多的光通过？',['clear glass|透明玻璃','frosted glass|磨砂玻璃','wood|木头','cardboard|硬纸板'],'透明玻璃让大部分光通过。'],
['light',2,'Frosted glass lets some light through, but you cannot see clearly through it. It is ___.','磨砂玻璃让一部分光通过，但看不清楚后面。它是……',['translucent|半透明','transparent|透明','opaque|不透明','shiny|闪亮'],'让一部分光通过 = 半透明（translucent）。'],
['light',2,'Which object would form the darkest shadow?','哪一样东西形成的影子最暗？',['a wooden block|木块','a clear plastic sheet|透明塑料片','tracing paper|描图纸','clear glass|透明玻璃'],'木头不透光（opaque），影子最暗。'],
['light',1,'A mirror ___ light.','镜子会……光。',['reflects|反射','gives off|发出','eats up|吃掉','makes|制造'],'镜子反射（reflect）光。'],
['light',2,'What happens to your shadow when you move closer to a torch?','你走近手电筒时，影子会怎样？',['It becomes bigger.|变大。','It becomes smaller.|变小。','It disappears.|不见了。','It stays the same.|不变。'],'离光源越近，挡住的光越多，影子越大。'],
['light',1,'Light travels in ___.','光是怎样传播的？',['straight lines|直线','curves|曲线','circles|圆圈','zigzags|之字形'],'光沿直线传播。'],
['light',2,'Why is it hard to see things in a dark room?','为什么在黑暗的房间里很难看清东西？',['Very little light enters our eyes.|很少光进入我们的眼睛。','Our eyes are closed.|我们闭着眼睛。','The room is cold.|房间很冷。','Things disappear in the dark.|东西在黑暗中消失了。'],'没有光照到东西、再进入眼睛，就看不见。'],
['light',1,'Which material is opaque?','哪一种材料不透明？',['cardboard|硬纸板','clear glass|透明玻璃','clear plastic|透明塑料','clean water|清水'],'硬纸板不让光通过 → 不透明（opaque）。'],
['light',2,'Why do cyclists wear shiny strips at night?','为什么骑脚车的人晚上要戴反光条？',['The strips reflect light so that drivers can see them.|反光条会反射光，让司机看得见。','The strips give off their own light.|反光条自己会发光。','The strips keep cyclists warm.|反光条让人暖和。','The strips make bicycles faster.|反光条让脚车更快。'],'反光条反射车灯的光，司机就看得见。'],
['light',1,'Which of these is NOT a light source?','哪一个不是光源？',['the Moon|月亮','a candle flame|蜡烛的火焰','a torch that is switched on|打开的手电筒','the Sun|太阳'],'月亮只反射太阳光，不是光源。'],
['light',2,'A shadow is always on the side of the object that is ___.','影子总是在物体的哪一边？',['away from the light source|背着光源的那边','facing the light source|对着光源的那边','on top of the object|物体上面','inside the object|物体里面'],'光被物体挡住，影子出现在背着光的那一边。'],
['light',2,'In the morning, the Sun is low in the east. In which direction will your shadow point?','早上太阳在东边低处。你的影子会指向哪边？',['west|西边','east|东边','north|北边','there is no shadow|没有影子'],'影子在背着太阳的那一边 → 太阳在东，影子朝西。'],
/* ===== P4: heat ===== */
['heat',1,'What is our main source of heat?','我们最主要的热源是什么？',['the Sun|太阳','the Moon|月亮','a fridge|冰箱','ice|冰'],'太阳是最主要的热源。'],
['heat',1,'Temperature tells us ___.','温度告诉我们……',['how hot or cold something is|东西有多热或多冷','how heavy something is|东西有多重','how big something is|东西有多大','how bright something is|东西有多亮'],'温度 = 冷热的程度。'],
['heat',1,'We measure temperature using a ___.','我们用什么量温度？',['thermometer|温度计','ruler|尺','electronic balance|电子秤','measuring cylinder|量筒'],'温度计（thermometer）。'],
['heat',2,'Heat always flows from a ___ place to a ___ place.','热总是从……的地方流到……的地方。',['hotter; colder|较热；较冷','colder; hotter|较冷；较热','dark; bright|暗；亮','high; low|高；低'],'热从热的地方流向冷的地方。'],
['heat',2,'Your hand feels cold when you hold a cold can drink. Why?','拿着冰凉的罐装饮料，手会觉得冷。为什么？',['Your hand loses heat to the can.|你的手把热传给了罐子。','The can gives “cold” to your hand.|罐子把“冷”传给你的手。','The can is wet.|罐子是湿的。','Your hand gains heat.|你的手得到了热。'],'热从较热的手流到较冷的罐子，手失去热，所以觉得冷。'],
['heat',1,'Which material is a good conductor of heat?','哪一种材料容易导热？',['metal|金属','wood|木头','plastic|塑料','cloth|布'],'金属是热的良导体（good conductor）。'],
['heat',2,'Why are pot handles often made of plastic or wood?','为什么锅的把手常用塑料或木头做？',['They are poor conductors of heat, so the handle does not get too hot.|它们不容易导热，把手不会太烫。','They are shiny.|它们亮亮的。','They are magnetic.|它们会被磁铁吸。','They melt easily.|它们容易融化。'],'塑料、木头不容易导热，手拿着不烫。'],
['heat',2,'Why do people wear thick jackets in cold places?','为什么在冷的地方要穿厚外套？',['The jacket is a poor conductor of heat and keeps body heat in.|外套不容易导热，能留住身体的热。','The jacket gives off heat.|外套自己会发热。','The jacket makes the air colder.|外套让空气更冷。','The jacket is heavy.|外套很重。'],'外套不容易导热，身体的热不容易跑掉。外套自己不会发热。'],
['heat',1,'Most things ___ when they are heated.','大多数东西受热时会……',['expand (get bigger)|膨胀（变大）','contract (get smaller)|收缩（变小）','disappear|消失','become heavier|变重'],'受热膨胀（expand）。'],
['heat',1,'Most things ___ when they are cooled.','大多数东西变冷时会……',['contract (get smaller)|收缩（变小）','expand (get bigger)|膨胀（变大）','disappear|消失','become lighter in colour|颜色变浅'],'遇冷收缩（contract）。'],
['heat',2,'Why are small gaps left between the sections of a railway track?','为什么铁轨之间要留小缝？',['so that the metal can expand on hot days|天热时金属可以膨胀','to save metal|节省金属','to make a nice sound|发出好听的声音','to make trains go faster|让火车更快'],'天热时铁轨受热膨胀，留缝才不会挤弯。'],
['heat',2,'A metal lid on a glass jar is too tight to open. Why does putting the lid in hot water help?','玻璃瓶的金属盖太紧打不开。为什么把盖子放进热水里会有帮助？',['The metal lid expands and becomes looser.|金属盖受热膨胀，变松了。','The lid contracts.|盖子收缩了。','The jar becomes heavier.|瓶子变重了。','The hot water makes it slippery.|热水让它变滑。'],'金属盖受热膨胀，比玻璃瓶口松一点，就容易打开。'],
['heat',2,'Which sentence is correct?','哪一句是对的？',['Heat is a form of energy; temperature is how hot something is.|热是一种能量；温度是冷热的程度。','Heat and temperature are the same thing.|热和温度是一样的。','Temperature is a form of energy.|温度是一种能量。','Heat is measured with a ruler.|热用尺来量。'],'热是能量；温度是冷热的程度，用温度计量。'],
['heat',1,'A hot drink is left on the table. What happens to it?','热饮放在桌上会怎样？',['It loses heat and becomes cooler.|失去热，慢慢变凉。','It gains heat and becomes hotter.|得到热，变得更热。','It stays hot for ever.|永远都很热。','It turns into ice.|变成冰。'],'热饮把热传给周围比较冷的空气，慢慢变凉。'],
['heat',2,'Which is the best material for a cooler box to keep drinks cold?','哪一种材料最适合做冰箱盒，让饮料保持冰凉？',['foam|泡沫','thin metal|薄金属','glass|玻璃','aluminium foil|铝箔'],'泡沫不容易导热，外面的热很难进去。'],
['heat',1,'Water boils at ___.','水在几度沸腾？',['100 °C','0 °C','50 °C','37 °C'],'水在 100°C 沸腾。'],
['heat',1,'Ice melts at ___.','冰在几度融化？',['0 °C','100 °C','10 °C','37 °C'],'冰在 0°C 融化。'],
['heat',1,'Our normal body temperature is about ___.','我们正常的体温大约是多少？',['37 °C','100 °C','0 °C','20 °C'],'正常体温大约 37°C。'],
];
Q.forEach(([tp,l,q,qz,o,ex])=>{const [c,t]=TOP[tp];GENS.push({c,t,l,w:1,f:()=>mkz(q,qz,o,ex)});});

/* ===== experiments: read a table, then answer ===== */
const EXP=[
['mat',{p:'Ali tested how many paper clips each magnet could pick up.\nMagnet A: 5 paper clips\nMagnet B: 12 paper clips\nMagnet C: 8 paper clips',pz:'Ali 测试每块磁铁能吸起几个回形针。A：5 个，B：12 个，C：8 个。'},[
 [1,'Which magnet is the strongest?','哪一块磁铁最强？',['Magnet B|磁铁 B','Magnet A|磁铁 A','Magnet C|磁铁 C','They are equally strong.|一样强'],'吸起的回形针最多（12 个）→ B 最强。'],
 [2,'What must Ali keep the same to make it a fair test?','要做公平测试，Ali 要保持什么一样？',['the type of paper clips used|用同一种回形针','the magnet used|用的磁铁','the number of paper clips picked up|吸起的回形针数量','his answer|他的答案'],'只改变“用哪一块磁铁”，回形针要用同一种。']]],
['mat',{p:'Siti poured 100 ml of water onto four pieces of cloth of the same size. She measured how much water each cloth absorbed.\nCloth P: 20 ml\nCloth Q: 65 ml\nCloth R: 40 ml\nCloth S: 10 ml',pz:'Siti 在四块一样大的布上各倒 100 ml 水，量每块布吸了多少水。P：20 ml，Q：65 ml，R：40 ml，S：10 ml。'},[
 [1,'Which cloth absorbed the most water?','哪一块布吸水最多？',['Cloth Q|布 Q','Cloth P|布 P','Cloth R|布 R','Cloth S|布 S'],'Q 吸了 65 ml，最多。'],
 [2,'Which cloth would be the best for making a raincoat?','哪一块布最适合做雨衣？',['Cloth S|布 S','Cloth Q|布 Q','Cloth R|布 R','Cloth P|布 P'],'雨衣要防水 → 选吸水最少的 S（10 ml）。'],
 [2,'Why did Siti use pieces of cloth of the same size?','为什么 Siti 用一样大的布？',['to make it a fair test|为了公平测试','to make it faster|为了快一点','because she had no other cloth|因为没有别的布','to keep the cloths dry|为了让布保持干'],'只改变“布的种类”，其他都一样，比较才公平。']]],
['mat',{p:'Kai put different sheets between a magnet and a paper clip. He wrote down if the paper clip was still attracted.\nPaper: yes\nPlastic: yes\nThin wood: yes\nSteel sheet: no',pz:'Kai 在磁铁和回形针之间放不同的片子，看回形针还会不会被吸。纸：会，塑料：会，薄木片：会，钢片：不会。'},[
 [1,'Which sheet stopped the magnet from attracting the paper clip?','哪一种片子让磁铁吸不到回形针？',['the steel sheet|钢片','the paper|纸','the plastic|塑料','the thin wood|薄木片'],'只有钢片挡住了，回形针没被吸。'],
 [2,'What does this experiment show?','这个实验说明什么？',['Magnetic force can pass through paper, plastic and thin wood.|磁力能穿过纸、塑料和薄木片。','Magnets attract paper.|磁铁会吸纸。','Plastic is magnetic.|塑料是磁性材料。','Magnets do not work through anything.|磁力什么都穿不过。'],'回形针隔着纸、塑料、薄木片还是被吸 → 磁力能穿过它们。']]],
['mat',{p:'Mei put four objects into a tank of water.\nCork: floats\nCoin: sinks\nPlastic ball: floats\nGlass marble: sinks',pz:'Mei 把四样东西放进水里。软木塞：浮；硬币：沉；塑料球：浮；玻璃弹珠：沉。'},[
 [1,'Which objects sank?','哪些东西沉下去了？',['the coin and the glass marble|硬币和玻璃弹珠','the cork and the coin|软木塞和硬币','the plastic ball and the cork|塑料球和软木塞','all of them|全部'],'表上写 sinks 的是硬币和玻璃弹珠。'],
 [1,'Mei wants to make a raft that floats. Which should she use?','Mei 想做会浮的木筏，应该用哪一样？',['cork|软木塞','coins|硬币','glass marbles|玻璃弹珠','stones|石头'],'软木塞会浮。']]],
['mat',{p:'Jun Jie made electromagnets with different numbers of coils of wire.\n10 coils: picked up 3 pins\n20 coils: picked up 7 pins\n30 coils: picked up 12 pins',pz:'Jun Jie 用不同圈数的电线做电磁铁。10 圈吸 3 根针，20 圈吸 7 根，30 圈吸 12 根。'},[
 [1,'How many pins did the electromagnet with 20 coils pick up?','20 圈的电磁铁吸起几根针？',['7','3','12','20'],'表上：20 coils → 7 pins。'],
 [2,'What happens when the number of coils increases?','线圈越多会怎样？',['The electromagnet picks up more pins.|电磁铁吸起更多针。','The electromagnet picks up fewer pins.|吸起的针更少。','Nothing changes.|没有变化。','The electromagnet stops working.|电磁铁不能用了。'],'圈数越多，吸的针越多 → 电磁铁越强。']]],
['life',{p:'Ravi put bean seeds in four containers and checked them after 5 days.\nA: wet cotton wool, warm room → germinated\nB: dry cotton wool, warm room → did not germinate\nC: wet cotton wool, in the fridge → did not germinate\nD: wet cotton wool, dark warm cupboard → germinated',pz:'Ravi 把豆子放在四个容器里，5 天后检查。A：湿棉花、温暖房间 → 发芽；B：干棉花、温暖房间 → 没发芽；C：湿棉花、冰箱里 → 没发芽；D：湿棉花、黑暗温暖的柜子 → 发芽。'},[
 [2,'Compare A and B. What do seeds need to germinate?','比较 A 和 B，种子发芽需要什么？',['water|水','light|光','soil|泥土','cold|寒冷'],'A 和 B 只差在湿和干 → 种子需要水。'],
 [2,'Compare A and C. What do seeds need to germinate?','比较 A 和 C，种子发芽需要什么？',['warmth|温暖','water|水','light|光','soil|泥土'],'A 和 C 只差在温暖和冰箱 → 种子需要温暖。'],
 [2,'What does container D show?','容器 D 说明什么？',['Seeds do not need light to germinate.|种子发芽不需要光。','Seeds need light to germinate.|种子发芽需要光。','Seeds need soil to germinate.|种子发芽需要泥土。','Seeds cannot grow in a cupboard.|种子在柜子里不能长。'],'D 在黑暗里也发芽了 → 发芽不需要光。']]],
['life',{p:'Hui Min left three slices of the same bread in different places for 5 days.\nIn the fridge: a little mould\nIn a warm, damp cupboard: a lot of mould\nIn the freezer: no mould',pz:'Hui Min 把三片一样的面包放在不同地方 5 天。冰箱：一点点霉；温暖潮湿的柜子：很多霉；冷冻库：没有霉。'},[
 [1,'Where did the most mould grow?','哪里长的霉最多？',['in the warm, damp cupboard|温暖潮湿的柜子','in the fridge|冰箱','in the freezer|冷冻库','the same everywhere|到处一样'],'温暖潮湿的柜子霉最多。'],
 [2,'What does this experiment show?','这个实验说明什么？',['Mould grows best in warm, damp places.|霉在温暖潮湿的地方长得最好。','Mould grows best in cold places.|霉在冷的地方长得最好。','Mould needs light to grow.|霉需要光才能长。','Bread never grows mould.|面包不会发霉。'],'越温暖潮湿，霉长得越多；越冷越少。']]],
['p4',{p:'Daniel measured the length of his shadow at different times on a sunny day.\n9 a.m.: 150 cm\n12 noon: 30 cm\n4 p.m.: 140 cm',pz:'Daniel 在晴天的不同时间量自己的影子长度。早上 9 点：150 cm；中午 12 点：30 cm；下午 4 点：140 cm。'},[
 [1,'When was his shadow the shortest?','什么时候影子最短？',['at 12 noon|中午 12 点','at 9 a.m.|早上 9 点','at 4 p.m.|下午 4 点','always the same|一直一样'],'中午 12 点只有 30 cm，最短。'],
 [2,'Why was his shadow the shortest at noon?','为什么中午影子最短？',['The Sun was high up in the sky.|太阳在天空很高的地方。','The Sun was low in the sky.|太阳在很低的地方。','There was no sunlight.|没有阳光。','Daniel was sitting down.|Daniel 坐着。'],'中午太阳在头顶上方，影子就短。']]],
['p4',{p:'Priya put ice cubes of the same size in three places and timed how long they took to melt.\nUnder the sun: 10 minutes\nIn the classroom: 25 minutes\nIn a cooler box: 60 minutes',pz:'Priya 把一样大的冰块放在三个地方，记录多久融化。太阳下：10 分钟；教室里：25 分钟；冰箱盒里：60 分钟。'},[
 [1,'Where did the ice melt the fastest?','冰在哪里融化得最快？',['under the sun|太阳下','in the classroom|教室里','in the cooler box|冰箱盒里','it was the same|一样快'],'太阳下只要 10 分钟，最快。'],
 [2,'Why did the ice in the cooler box take the longest to melt?','为什么冰箱盒里的冰最久才融化？',['Less heat could reach the ice.|比较少热能传到冰。','The cooler box gave out cold.|冰箱盒会放出冷。','The ice in the box was bigger.|盒子里的冰比较大。','There was no air in the box.|盒子里没有空气。'],'冰箱盒不容易导热，外面的热很难进去。冰块是一样大的。']]],
['p4',{p:'Ben put four spoons of the same size into a bowl of hot water. After 2 minutes, he touched the handles.\nMetal spoon: very hot\nPlastic spoon: warm\nWooden spoon: slightly warm',pz:'Ben 把一样大的汤匙放进热水里，2 分钟后摸把手。金属汤匙：很烫；塑料汤匙：温温的；木汤匙：有一点温。'},[
 [1,'Which spoon is the best conductor of heat?','哪一支汤匙最容易导热？',['the metal spoon|金属汤匙','the plastic spoon|塑料汤匙','the wooden spoon|木汤匙','they are all the same|都一样'],'金属汤匙最烫 → 最容易导热。'],
 [2,'Which material is the best for making the handle of a cooking pot?','哪一种材料最适合做锅的把手？',['wood|木头','metal|金属','plastic film|塑料薄膜','glass|玻璃'],'木汤匙最不烫 → 木头最不容易导热，适合做把手。']]],
['p4',{p:'Two similar plants were given the same amount of water. Plant X was kept near a sunny window. Plant Y was kept in a dark cupboard. After one week, Plant X was green and healthy, but Plant Y was yellow and weak.',pz:'两盆差不多的植物浇一样多的水。X 放在有阳光的窗边，Y 放在黑暗的柜子里。一个星期后，X 绿绿的很健康，Y 变黄、很弱。'},[
 [2,'What was different between the two plants?','两盆植物有什么不同的条件？',['the amount of light|光的多少','the amount of water|水的多少','the type of plant|植物的种类','the size of the pot|花盆大小'],'水一样多、植物差不多 → 只有光不同。'],
 [2,'What does this experiment show?','这个实验说明什么？',['Plants need light to stay healthy.|植物需要光才能健康。','Plants do not need water.|植物不需要水。','Plants grow better in the dark.|植物在黑暗中长得更好。','Plants need cupboards.|植物需要柜子。'],'没有光的 Y 变黄变弱 → 植物需要光来制造食物。']]],
];
EXP.forEach(([c,pp,qs])=>qs.forEach(([l,q,qz,o,ex])=>GENS.push({c,t:'Experiment · 实验',l,w:1.1,f:()=>mkz(q,qz,o,ex,pp.p,pp.pz)})));

/* ---------- word cards: one set of 5 a week, in the handbook's topic order. [word, 中文, simple meaning, example with **word**] ---------- */
const WORDSETS=[
{title:'Plant parts',zh:'植物',words:[
 ['root','根','the part of a plant under the ground that takes in water','The **root** takes in water from the soil.'],
 ['stem','茎','the part of a plant that holds it up','The **stem** carries water up to the leaves.'],
 ['absorb','吸收','take in water or food','The roots **absorb** water from the soil.'],
 ['transport','运送','carry from one place to another','The stem helps to **transport** water.'],
 ['support','支撑','hold something up','The stem helps to **support** the plant.']]},
{title:'Matter',zh:'物质',words:[
 ['solid','固体','has its own shape, like a stone','Ice is a **solid**.'],
 ['liquid','液体','flows and takes the shape of its container, like water','Milk is a **liquid**.'],
 ['gas','气体','spreads out to fill any space, like air','Air is a **gas**.'],
 ['volume','体积','how much space something takes up','We measured the **volume** of water in the cup.'],
 ['mass','质量','how much matter something has','We used a scale to find the **mass** of the bag.']]},
{title:'Digestion',zh:'消化',words:[
 ['digest','消化','break food down so the body can use it','Our bodies **digest** the food we eat.'],
 ['saliva','唾液','the liquid in your mouth','**Saliva** makes food soft.'],
 ['stomach','胃','the bag-like organ that churns food','Food goes from the gullet to the **stomach**.'],
 ['intestine','肠','the long tube after the stomach','Digested food is taken in by the small **intestine**.'],
 ['organ','器官','a body part that does a special job','The heart is an **organ**.']]},
{title:'Light',zh:'光',words:[
 ['source','来源（光源）','where something comes from','The Sun is a **source** of light.'],
 ['reflect','反射','bounce light back','A mirror can **reflect** light.'],
 ['shadow','影子','a dark shape made when light is blocked','My **shadow** is long in the evening.'],
 ['transparent','透明的','lets light through, so you can see through it','Clear glass is **transparent**.'],
 ['opaque','不透明的','does not let light through','Wood is **opaque**.']]},
{title:'Heat',zh:'热',words:[
 ['temperature','温度','how hot or cold something is','The **temperature** today is 33 °C.'],
 ['conductor','导体','lets heat pass through easily','Metal is a good **conductor** of heat.'],
 ['insulator','隔热的东西','does not let heat pass through easily','Wood is a good **insulator**.'],
 ['expand','膨胀','get bigger','Most things **expand** when they are heated.'],
 ['contract','收缩','get smaller','Most things **contract** when they are cooled.']]},
{title:'Magnets and materials (P3)',zh:'磁铁和材料',words:[
 ['attract','吸引','pull towards','A magnet can **attract** iron nails.'],
 ['repel','排斥','push away','Two north poles **repel** each other.'],
 ['magnetic','有磁性的','can be attracted by a magnet','Iron is **magnetic**.'],
 ['flexible','能弯曲的','can bend without breaking','Rubber is **flexible**.'],
 ['waterproof','防水的','does not let water through','My raincoat is **waterproof**.']]},
{title:'Life cycles (P3)',zh:'生命周期',words:[
 ['reproduce','繁殖','make young ones of the same kind','All living things **reproduce**.'],
 ['germinate','发芽','when a seed starts to grow','The bean seed began to **germinate**.'],
 ['larva','幼虫','the young of some insects, like a caterpillar','A caterpillar is a **larva**.'],
 ['pupa','蛹','the stage inside a hard case, before becoming an adult','The **pupa** does not eat.'],
 ['nymph','若虫','a young insect that looks like its parent but has no wings','A young grasshopper is a **nymph**.']]},
{title:'Exam words',zh:'考试指令词',words:[
 ['describe','描述','say what something is like','**Describe** what happened to the ice.','<p><b>答题时：</b>说出看到的样子或变化，比如 The ice melted and became water.</p>'],
 ['explain','解释','say why or how','**Explain** why the plant died.','<p><b>答题时：</b>一定要说原因：用 because…，so… 连起来，比如 The plant did not get water, so it died.</p>'],
 ['compare','比较','say how things are the same or different','**Compare** the two shadows.','<p><b>答题时：</b>两样都要说到：A is … than B，比如 Shadow A is longer than shadow B.</p>'],
 ['observe','观察','look carefully','**Observe** the seed every day.','<p><b>答题时：</b>写下看到了什么，不用解释原因。</p>'],
 ['state','写出、说出','give a short, clear answer','**State** one property of rubber.','<p><b>答题时：</b>一个短答案就够，不用解释，比如 It is flexible.</p>']]},
];

/* ---------- write it down: one prompt after each round, answered on paper. [prompt, 中文, model answer] ---------- */

/* ---------- engine ---------- */
const CATW={life:.38,mat:.27,p4:.35};
function wpick(arr,wf){let t=0;arr.forEach(x=>t+=wf(x));let r=Math.random()*t;for(const x of arr){r-=wf(x);if(r<=0)return x;}return arr[arr.length-1];}
function pickCat(){return wpick(Object.keys(CATW),k=>CATW[k]);}
function key(q){return (q.p||'')+'|'+q.q;}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
function make(c,l,fresh,ok2){let pool=GENS.filter(g=>g.c===c&&g.l===l);if(!pool.length)pool=GENS.filter(g=>g.c===c);let q;
  const one=()=>{const g=wpick(pool,x=>x.w);const x=g.f();x.c=c;x.t=g.t;x.l=g.l;return x;};
  for(let k=0;k<120;k++){q=one();if(!fresh||fresh(key(q)))return q;}
  if(ok2)for(let k=0;k<60;k++){q=one();if(ok2(key(q)))return q;}
  return q;}
function size(){return GENS.length;}
W.QB={GENS,make,pickCat,key,hash,shuf,size,WORDSETS,lines:true,hl:true};
})(typeof window!=='undefined'?window:globalThis);
