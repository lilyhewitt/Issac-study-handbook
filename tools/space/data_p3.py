from lib import *

P3 = []

# ---------------- 生物星 Living and Non-living Things ----------------
T = [['Week', '1', '2', '3', '4'], ['Height of plant (cm)', '5', '8', '11', '14'], ['Length of toy car (cm)', '10', '10', '10', '10']]
JAR = 'A mouse was kept in an airtight jar with enough food and water. After some time, the mouse died.'
XY = [['', 'Needs food', 'Grows', 'Reproduces'], ['X', '✓', '✓', '✓'], ['Y', '✗', '✗', '✗']]
PL = 'Two similar plants, A and B, were given the same amount of water. A was put near a window. B was put in a dark cupboard. After a week, A was green and taller. B was yellow and weak.'
P3.append(dict(id='living', name='生物星', en='Living and Non-living Things', icon='🐭', c=['#6fe3a1', '#1f9a5a'],
  must=['Living things grow, reproduce, respond to changes, and need air, food and water to survive.', 'A seed is a living thing. It can grow into a new plant.'],
  qs=[
  pr('Ali measured a plant and a toy car every week.', tbl=T, parts=[
    mc('How much did the plant grow from week 1 to week 4?', ['9 cm', '14 cm', '5 cm', '19 cm'], '9 cm', '14 − 5 = 9 cm。'),
    op('Based on the table, which characteristic of living things does the plant show?', 1, ['Based on the table', 'characteristic'],
       'The plant {grows}. Its height increases from {5 cm} to {14 cm}.',
       [('The toy car is not alive', '题目问的是植物有哪个特征，不是问玩具车。'), ('The plant is green', '这是看到的样子，表上没有颜色。')])]),
  pr(JAR, parts=[op('Explain why the mouse died.', 2, ['Explain why'],
       'The jar was {airtight}, so no fresh {air} could enter. The mouse needs {air} to survive.',
       [('food', '题目说食物够，不是饿死的。'), ('it was sad', '这是故事里的话，不是科学原因。')],
       ev=('txt', 'airtight'), evtip='“airtight” 是密封：空气进不来。题目还说食物和水都够，所以不是饿死的。',
       score=['1 分：罐子密封，新鲜空气进不来', '1 分：老鼠需要空气才能活'])]),
  pr('Mei kept her pet hamster in a closed plastic box with food and water. The box has a lid and no holes.', note='期末 25(c) 错过', parts=[op('Without opening the lid, suggest what Mei can do to help the hamster survive longer.', 9, ['suggest', 'survive longer'],
       '{Make holes} in the lid so that {fresh air} can enter.',
       [('Give it more food', '食物本来就够了。'), ('Open the lid', '题目说不能打开盖子。')])]),
  mcq('Which one is a living thing?', ['a robot that moves', 'a fire that spreads', 'a seed', 'a cloud that moves'], 3,
      '机器人、火、云会动或变大，但不会繁殖，也不需要食物；种子会长成新植物，是生物。'),
  mcq('A snail pulls in its feelers when it is touched. Which characteristic of living things does this show?',
      ['It grows.', 'It reproduces.', 'It responds to changes.', 'It needs food.'], 3, '被碰到就缩回触角，是对变化做出反应 (responds to changes)。', note='期末 25(a)'),
  pr('The table shows three things about X and Y.', tbl=XY, parts=[op('Based on the table, state two characteristics which show that X is a living thing.', 1, ['Based on the table', 'two characteristics'],
       'X {needs food}. X {grows}.', [('X can move', '表上没有“会动”，只抄表上的词。'), ('Y is not alive', '题目问的是 X。')],
       ans='X **needs food**. X **grows** (and **reproduces**).')]),
  mcq('All living things need ___ to survive.', ['light only', 'air, food and water', 'soil and water', 'a home'], 2, '动物、植物、真菌都需要空气、食物和水。'),
  pr(PL, parts=[
    op('What is the changed variable?', 5, ['changed variable'], 'The {presence of light}.', [('amount of water', '两棵植物的水一样多，水是不变的。')], ans='The **presence of light** (whether the plant gets light).'),
    op('State one variable that was kept the same.', 5, ['kept the same'], 'The {amount of water} given to each plant.', [('presence of light', 'A 有光、B 没光，光是改变的。')],
       ans='The **amount of water** (or the type of plant, the size of the pot).'),
    op('Explain why plant B grew less.', 2, ['Explain why', 'less'], 'Plant B {did not get light}, so it {could not make} food.', [('B is yellow', '这是看到的样子，要写原因。')])]),
  ]))

# ---------------- 分类星 Classification ----------------
AN = [['Animal', 'Has feathers', 'Has fur', 'Lays eggs'], ['penguin', '✓', '', '✓'], ['bat', '', '✓', ''], ['crocodile', '', '', '✓']]
HC = [['Animal', 'Has feathers', 'Has fur', 'Lays eggs'], ['hen', '✓', '', '✓'], ['cat', '', '✓', '']]
FC = [['Animal', 'Lays eggs', 'Has scales', 'Lives on land and in water'], ['frog', '✓', '', '✓'], ['crocodile', '✓', '✓', '✓']]
EF = [['Plant', 'Has seeds', 'Has spores', 'Grows on land', 'Grows in water'], ['E', '✓', '', '', '✓'], ['F', '', '✓', '✓', '']]
P3.append(dict(id='class', name='分类星', en='Classification', icon='🌼', c=['#ffd36b', '#d18b12'],
  must=['Mammals have hair or fur. They give birth to their young and feed them with milk.', 'Flowering plants reproduce by seeds. Ferns and mosses reproduce by spores.', 'An insect has six legs, three body parts and a pair of feelers.'],
  qs=[
  pr('The table shows some animals.', tbl=AN, parts=[
    mc('How many of these animals lay eggs?', ['2', '1', '3', '0'], '2', 'penguin 和 crocodile 两种。'),
    op('Which animal is a mammal? Give one reason from the table.', 1, ['mammal', 'from the table'], 'The {bat}. It {has fur}.',
       [('penguin', '企鹅有羽毛，是鸟。'), ('It can fly', '表上没有这一条，只用表上的。')])]),
  pr('The table shows two animals.', tbl=HC, note='期末 27(b) 错过', parts=[op('Based on the table, state one difference between the hen and the cat.', 3, ['difference'],
       'The hen {has feathers}, but the cat {has fur}.',
       [('Both have legs', '问的是不同点，不是相同点。'), ('The hen cannot fly', '表上没有这一条。')],
       ev=('cell', 1, 1), evtip='hen 那一行有羽毛，cat 那一行有毛：同一样东西（身上长什么），两边都写。',
       score=['1 分：企鹅和蝙蝠两边都写了，并且比的是同一样东西'])]),
  pr('Siti compared a frog and a crocodile.', tbl=FC, parts=[op('Based on the table, state one similarity between the frog and the crocodile.', 3, ['similarity'],
       '{Both} the frog and the crocodile {lay eggs}.', [('but', '问的是相同点，不用 but。'), ('have scales', '青蛙没有鳞片。')],
       ans='**Both** the frog and the crocodile **lay eggs** (or both live on land and in water).')]),
  mcq('Which animal is NOT an insect?', ['ant', 'butterfly', 'spider', 'beetle'], 3, '蜘蛛有 8 条腿；昆虫有 6 条腿、一对触角、身体分 3 段。'),
  mcq('Plant L has flowers. Plant M has fruits. Plant N reproduces by spores. Which are flowering plants?', ['L only', 'L and M only', 'M and N only', 'N only'], 2,
      '有果实的植物也是开花植物（果实是花变的）。N 用孢子繁殖，不开花。', note='期末 A4 选了 L only'),
  pr('A flow chart sorts animals A, B and C.\nDoes it have feathers? Yes → A.\nNo → Does it have scales? Yes → B. No → C.', note='期末 27(a) 错过', parts=[
    op('Based on the flow chart, state two characteristics of animal B.', 1, ['Based on the flow chart', 'two characteristics'],
       'B {does not have feathers}. B {has scales}.', [('B is a fish', '流程图上没写是鱼，只抄图上的词。'), ('B lives in water', '图上没有这一条。')])]),
  mcq('A whale gives birth to its young and feeds them with milk. It is a ___.', ['fish', 'mammal', 'reptile', 'amphibian'], 2, '生小宝宝、喂奶的是哺乳动物；鲸住在水里，但不是鱼。'),
  pr('The table shows plants E and F.', tbl=EF, parts=[
    op('Is plant E a flowering or non-flowering plant? Where does it grow?', 1, ['flowering or non-flowering', 'Where'], 'E is a {flowering} plant. It grows {in water}.',
       [('non-flowering', 'E 有种子，是开花植物。')]),
    op('Explain why F is a non-flowering plant.', 2, ['Explain why'], 'F {reproduces by spores}, not {seeds}.', [('grows on land', '长在哪里和开不开花没关系。')]),
    op('Name another plant that reproduces in the same way as F.', 1, ['same way'], 'A {fern}.', [('a rose', '玫瑰开花，用种子繁殖。'), ('a mushroom', '蘑菇是真菌，不是植物。')],
       ans='A **fern** (or moss).')]),
  ]))

# ---------------- 蘑菇星 Fungi and Bacteria ----------------
MD = [['Day', '1', '2', '3', '4'], ['Area of mould on bread (cm²)', '0', '2', '5', '9']]
BR = 'Two pieces of damp bread were left for 5 days. Bread P was in a warm room. Bread Q was in a fridge. More mould grew on P.'
WXYZ = [['Bread', 'W', 'X', 'Y', 'Z'], ['Water added (ml)', '6', '6', '2', '2'], ['Temperature (°C)', '30', '4', '30', '4']]
P3.append(dict(id='fungi', name='蘑菇星', en='Fungi and Bacteria', icon='🍄', c=['#ff8a8a', '#c43d3d'],
  must=['Fungi need moisture and warmth to grow well.', 'Fungi cannot make their own food. They absorb food from what they grow on.', 'Fungi reproduce by spores.'],
  qs=[
  pr('The area of mould on a piece of bread was measured every day.', tbl=MD, parts=[
    mc('By how much did the area of mould increase from day 2 to day 4?', ['7 cm²', '9 cm²', '4 cm²', '2 cm²'], '7 cm²', '9 − 2 = 7 cm²。'),
    op('What is the relationship between the number of days and the area of mould?', 4, ['relationship'],
       'As the {number of days} increases, the {area of mould} {increases}.', [('decreases', '霉一天比一天多：0 → 2 → 5 → 9。')])]),
  pr(BR, parts=[op('Explain why more mould grew on P.', 2, ['Explain why', 'more'],
       'Bread P was kept {warmer}. Fungi need {warmth} and {moisture} to grow well.',
       [('light', '霉长不长和光没关系。'), ('P was bigger', '两块一样大，这是自己猜的。')],
       ev=('txt', 'warm room'), evtip='P 在温暖的房间，Q 在冰箱里：两块面包只差温度。', score=['1 分：P 比较暖', '1 分：真菌需要温暖和水分'])]),
  pr('This time both pieces were in the same warm room. Bread R was dry. Bread S was damp.', parts=[op('On which bread would there be less mould? Explain.', 2, ['less', 'Explain'],
       'Bread {R}. It was {dry}, so it had less {moisture}.', [('S', 'S 是湿的，霉会更多，方向反了。'), ('warmth', '两块在同一个暖房间，温度一样。')],
       ans='Bread **R**. It was **dry**, so it had less **moisture**. Fungi need moisture to grow.')]),
  mcq('Which statements about fungi and bacteria are correct?\nA They can make their own food.\nB They can grow without sunlight.\nC Some of them are useful to us.',
      ['A and B only', 'A and C only', 'B and C only', 'A, B and C'], 3, '真菌和细菌不能自己做食物，所以 A 错。', note='期末 A7 错过'),
  mcq('A mushroom reproduces by ___.', ['seeds', 'spores', 'eggs', 'flowers'], 2, '蘑菇是真菌，用孢子繁殖。'),
  pr('A mushroom grows on a fallen log in a dark forest.', parts=[op('Explain why the mushroom does not need sunlight.', 2, ['Explain why', 'does not need'],
       'A mushroom {cannot make its own food}. It {absorbs food} from the log.', [('makes food from light', '只有植物用光做食物。'), ('it is dark', '这是题目里的情况，不是原因。')])]),
  mcq('Which is made with the help of useful bacteria?', ['yoghurt', 'plastic', 'glass', 'salt'], 1, '酸奶是细菌帮忙做的。'),
  pr('Four pieces of bread of the same size were kept for 5 days.', tbl=WXYZ, parts=[
    op('On which bread would there be the least mould? Explain.', 6, ['least', 'Explain'], 'Bread {Z}. It had the {least water} and the {lowest temperature}.',
       [('W', 'W 水最多、最暖，霉最多，方向反了。')], ans='Bread **Z**. It had the **least water** and the **lowest temperature**. Fungi need moisture and warmth to grow.'),
    op('Which two pieces should be compared to find out if the amount of water affects mould growth?', 5, ['two pieces', 'amount of water'], '{W} and {Y}.',
       [('X', 'W 和 X 的水一样多，它们改的是温度。')], ans='**W and Y** (or X and Z): only the amount of water is different.'),
    op('Name another living thing that reproduces in the same way as mould.', 1, ['same way'], 'A {mushroom}.', [('a sunflower', '向日葵用种子繁殖。')], ans='A **mushroom** (or yeast).')]),
  ]))

# ---------------- 材料星 Materials ----------------
ST = [['Strip', 'A', 'B', 'C'], ['Number of weights before breaking', '8', '3', '12']]
RC = [['Material', 'P', 'Q', 'R'], ['Water that passed through (ml)', '150', '0', '80']]
TW = [['Strip', 'X', 'Y', 'Z'], ['Water left in the container (ml)', '20', '60', '5']]
BD = [['Strip', 'J', 'K', 'L'], ['How much it bent (cm)', '2', '9', '5']]
P3.append(dict(id='mat', name='材料星', en='Materials', icon='🧵', c=['#8ad7ff', '#2c86c4'],
  must=['A waterproof material does not allow water to pass through.', 'An absorbent material can soak up water. The less water left, the more water it absorbed.', 'A flexible material can bend without breaking.'],
  qs=[
  pr('Strips of the same size were hung with weights until they broke.', tbl=ST, parts=[
    mc('How many more weights could C hold than B?', ['9', '4', '15', '12'], '9', '12 − 3 = 9。'),
    op('Which strip is the strongest? Explain.', 6, ['strongest', 'Explain'], 'Strip {C}. It held the {most weights} before breaking, so it is the {strongest}.',
       [('B', 'B 拿得最少，是最不结实的，方向反了。')])]),
  pr('200 ml of water was poured onto three materials, P, Q and R. The amount of water that passed through each material was measured.', tbl=RC, note='期末 31(c) 选反了', parts=[
    op('Which material is the most suitable for making a raincoat? Explain.', 6, ['most suitable', 'raincoat'],
       'Material {Q}. {0} ml of water passed through it. It is {waterproof}, so it keeps us dry.',
       [('P', 'P 漏的水最多，方向反了。雨衣要挡水。'), ('150', '150 ml 是 P 的数字。'), ('absorbent', '“absorbent” 是吸水，吸水的布做雨衣会湿透。')],
       ans='Material **Q**. **No water** passed through Q. Q is **waterproof**, so it keeps us dry.', ev=('cell', 1, 2),
       evtip='Q 是 0 ml：一点水都没漏过去。这就是你的证据，答案里要写上这个数字。', score=['1 分：选对 Q，并写出证据（0 ml / no water）', '1 分：写出科学词 waterproof'])]),
  pr('Strips X, Y and Z were dipped into 100 ml of water each and taken out. The water left in each container was measured.', tbl=TW, parts=[
    op('Which material is the most suitable for a towel? Explain.', 6, ['most suitable', 'towel'],
       'Material {Z}. The {least water} was left, so Z {absorbed} the most water. It is {absorbent}.',
       [('Y', '剩下的水最多 = 吸得最少，方向反了。'), ('waterproof', '毛巾要吸水，不是防水。')])]),
  mcq('A material can bend without breaking. It is ___.', ['strong', 'flexible', 'waterproof', 'transparent'], 2, '能弯不断叫 flexible（柔韧）。'),
  mcq('Windows are made of glass because glass ___.', ['is strong', 'allows light to pass through', 'can float', 'is flexible'], 2, '窗户要让光进来，玻璃让光通过。'),
  pr('A cup must hold water.', parts=[op('Explain why cups are made of glass and not cloth.', 2, ['Explain why', 'not cloth'],
       'Glass is {waterproof}, so it does not {absorb} water. Cloth {absorbs} water.', [('glass is pretty', '好看不是科学原因。')])]),
  mcq('Which object will float on water?', ['an iron nail', 'a stone', 'a wooden block', 'a glass marble'], 3, '木头会浮在水上。'),
  pr('Strips of materials J, K and L were fixed at one end. The same weight was hung at the other end. How much each strip bent was measured.', tbl=BD, parts=[
    op('What is the changed variable?', 5, ['changed variable'], 'The {type of material}.', [('how much it bent', '这是量出来的结果，不是改变的。')]),
    op('State one variable that must be kept the same.', 5, ['kept the same'], 'The {length} of the strips.', [('type of material', '材料是改变的。')],
       ans='The **length** (or thickness) of the strips, or the **mass of the weight**.'),
    op('Which material is the most flexible? Explain.', 6, ['most flexible', 'Explain'], '{K}. It {bent the most}, so it is the {most flexible}.', [('J', 'J 弯得最少，方向反了。')])]),
  ]))

# ---------------- 种子星 Life Cycle of Plants ----------------
HT = [['Day', '5', '10', '15', '20'], ['Height of plant (cm)', '2', '4', '6', '8']]
SZ1 = [['Size of seed', 'small', 'medium', 'large'], ['Days taken to germinate', '6', '2', '4']]
SZ2 = [['Size of seed', 'small', 'medium', 'large'], ['Days taken to germinate', '6', '4', '2']]
CW = 'Ten seeds were put on dry cotton wool (set-up A). Ten seeds were put on wet cotton wool (set-up B). Only the seeds in B germinated.'
P3.append(dict(id='seed', name='种子星', en='Life Cycle of Plants', icon='🌱', c=['#b7f07a', '#5f9e1c'],
  must=['Seeds need water, air and warmth to germinate. They do not need light.', 'The seed leaves provide food for the seedling until it can make its own food.'],
  qs=[
  pr('The height of a plant was measured.', tbl=HT, parts=[
    mc('What was the height of the plant on day 15?', ['6 cm', '15 cm', '4 cm', '8 cm'], '6 cm', '找 Day 15 那一列。'),
    op('How did the height of the plant change?', 4, ['How', 'change'], 'As the {number of days} increases, the {height of the plant} {increases}.',
       [('decreases', '2 → 4 → 6 → 8 是变高。')])]),
  pr('Seeds of different sizes were planted. The number of days each took to germinate was recorded.', tbl=SZ1, note='期末 30(b) 错过', parts=[
    op('What can you conclude about the size of the seed and the number of days it took to germinate?', 4, ['conclude'],
       'The size of the seed {did not affect} the number of days it took to germinate.',
       [('affected', '天数没有跟着种子大小一直变多或变少。'), ('bigger seeds grow faster', '看到“大”就以为快，表上不是这样。')],
       ev=('row', 1), evtip='6 → 2 → 4：一会儿少一会儿多，没有一直变。这种就是 did not affect。')]),
  pr('This time the results were different.', tbl=SZ2, parts=[op('What is the relationship between the size of the seed and the number of days it took to germinate?', 4, ['relationship'],
       'As the {size of the seed} increases, the {number of days} it took to germinate {decreases}.', [('increases', '6 → 4 → 2 是变少。')])]),
  mcq('As a seedling grows, ___.', ['its roots become shorter', 'its seed leaves become smaller', 'its seed becomes bigger', 'it stops taking in water'], 2,
      '种子叶里的养分被小苗用掉，所以变小。', note='期末 A15'),
  mcq('Which conditions do seeds need to germinate?', ['water, air and warmth', 'light and soil', 'light only', 'soil and fertiliser'], 1, '发芽不需要光，也不需要土。'),
  pr('Seedlings from a large seed and a small seed were put in a dark cupboard. The seedling from the large seed survived longer.', note='期末 30(c) 空着', parts=[
    op('Explain why the seedling from the large seed survived longer.', 2, ['Explain why', 'longer'],
       'The large seed has more {stored food}. In the dark, the seedling {cannot make food}, so it uses the stored food.',
       [('more light', '柜子里是黑的，没有光。'), ('it is bigger', '要写“储存的食物多”，不是“大”。')])]),
  mcq('Which shows the correct order?', ['seedling → seed → adult plant', 'seed → seedling → adult plant', 'adult plant → seedling → seed', 'seed → adult plant → seedling'], 2, '种子 → 小苗 → 成株。'),
  pr(CW, parts=[
    op('What is the aim of the experiment?', 5, ['aim'], 'To find out if {water} affects the {germination} of seeds.', [('light', '两组都有光，改的是水。')]),
    op('Explain why the seeds in A did not germinate.', 2, ['Explain why'], 'Seeds need {water} to germinate. The cotton wool in A was {dry}.', [('light', '发芽不需要光。')]),
    op('Set-up B is moved into a dark cupboard. Will the seeds still germinate? Explain.', 8, ['Will', 'Explain'], '{Yes}, because seeds {do not need light} to germinate.',
       [('No', '发芽不需要光，方向反了。')])]),
  ]))

# ---------------- 蝴蝶星 Life Cycle of Animals ----------------
LC = [['Stage', 'egg', 'larva', 'pupa', 'adult'], ['Number of days', '3', '10', '7', '14']]
MQ = [['Stage', 'egg', 'larva', 'pupa', 'adult'], ['Number of days', '2', '7', '3', '14']]
FD = [['Stage', 'A', 'B', 'C', 'D'], ['Amount of food eaten (g)', '0', '50', '0', '20']]
MW = [['Temperature (°C)', '20', '25', '30'], ['Days for eggs to become adults', '40', '32', '25']]
P3.append(dict(id='bfly', name='蝴蝶星', en='Life Cycle of Animals', icon='🦋', c=['#f6a6ff', '#a83cbf'],
  must=['The pupa does not eat and does not move about.', 'A butterfly has four stages in its life cycle. A cockroach has three stages.', 'Remove stagnant water so that mosquitoes cannot lay eggs.'],
  qs=[
  pr('The table shows the number of days a mosquito spends in each stage.', tbl=MQ, parts=[
    mc('How many days does it take from the egg to become an adult?', ['12 days', '26 days', '7 days', '14 days'], '12 days', '2 + 7 + 3 = 12。成虫那 14 天不算。'),
    mc('In which stage does it spend the most days?', ['adult', 'larva', 'pupa', 'egg'], 'adult', '14 天最多。')]),
  pr('The table shows the number of days a butterfly spends in each stage.', tbl=LC, note='期末 29(a) 错 3 小题',
     pre=pre('Based on the table, write True, False or Not possible to tell.', 7, ['True, False or Not possible to tell']), parts=[
    tf('The butterfly has four stages in its life cycle.', 'True', '表上有 egg、larva、pupa、adult 四个阶段。'),
    tf('The larva eats the most food.', 'Not possible to tell', '表上量的是天数，没有吃多少食物。'),
    tf('The pupa stage is longer than the larva stage.', 'False', '蛹 7 天，幼虫 10 天，7 < 10。')]),
  pr('A is the egg stage.', tbl=FD, note='期末 A18', parts=[op('Which stage could be the pupa? Explain.', 2, ['pupa', 'Explain'],
       'Stage {C}, because the pupa {does not eat}.', [('B', 'B 吃得最多，是幼虫。'), ('A', 'A 是卵。')],
       ans='Stage **C**, because the pupa **does not eat** (and it comes after the larva, B).')]),
  mcq('Which animal has a three-stage life cycle?', ['butterfly', 'mosquito', 'cockroach', 'beetle'], 3, '蟑螂：卵 → 若虫 → 成虫，三个阶段。'),
  mcq('Eggs take 2 days to hatch for a mosquito, 4 days for a butterfly and 18 days for a frog. All eggs were laid on day 0. What would you see on day 3?',
      ['butterfly larvae and frog eggs', 'mosquito larvae, butterfly eggs and frog eggs', 'mosquito eggs and tadpoles', 'butterfly larvae and tadpoles'], 2,
      '第 3 天：蚊子第 2 天已经孵出来了；蝴蝶要 4 天、青蛙要 18 天，还是卵。', note='期末 A20 选了 (1)'),
  pr('Think about the stages in each life cycle.', parts=[op('State one difference between the life cycle of a butterfly and that of a cockroach.', 3, ['difference'],
       'A butterfly has {four stages}, but a cockroach has {three stages}.', [('Both lay eggs', '问的是不同点。'), ('a butterfly is prettier', '好看不是科学。')])]),
  mcq('Which is the best way to stop mosquitoes from breeding at home?', ['kill the adults', 'remove stagnant water', 'close the windows', 'turn on the lights'], 2, '蚊子在积水里产卵，倒掉积水，幼虫就没地方长。'),
  pr('Mealworm eggs were kept at different temperatures.', tbl=MW, parts=[
    op('What is the relationship between the temperature and the number of days?', 4, ['relationship'], 'As the {temperature} increases, the {number of days} {decreases}.',
       [('increases', '40 → 32 → 25 是变少。')]),
    op('What is the aim of the experiment?', 5, ['aim'], 'To find out how the {temperature} affects the {number of days} for the eggs to become adults.', [('amount of food', '表里没有食物。')]),
    op('Predict the number of days at 35°C.', 8, ['Predict'], 'It will take {fewer than 25} days, because the {higher} the temperature, the fewer the days.',
       [('more than 40', '温度越高天数越少，方向反了。')], ans='It will take **fewer than 25 days**, because as the temperature increases, the number of days decreases.')]),
  ]))

# ---------------- 磁铁星 Magnets ----------------
POS = [['Position', 'A (one end)', 'B (middle)', 'C (other end)'], ['Number of paper clips', '12', '1', '11']]
YQ = 'Ali brought the North pole of magnet X near one end of object Y. Object Y moved away from magnet X.'
DS = [['Magnet', 'J', 'K', 'L'], ['Furthest distance (cm)', '2', '6', '4']]
P3.append(dict(id='mag', name='磁铁星', en='Magnets', icon='🧲', c=['#ff9f6b', '#c25417'],
  must=['The poles of a magnet attract the most clips.', 'An object is a magnet if it repels another magnet.', 'Magnetic force can pass through non-magnetic materials such as glass.', 'A freely suspended magnet comes to rest in the North-South direction.'],
  qs=[
  pr('Mei dipped a bar magnet into a tray of paper clips and counted the clips attracted at three positions.', tbl=POS, parts=[
    mc('How many more paper clips were attracted at position A than at position B?', ['11', '13', '1', '12'], '11', '12 − 1 = 11。'),
    op('Explain why position A attracted the most paper clips.', 2, ['Explain why', 'most'], 'Position A is a {pole}. The {poles} are the {strongest} parts of a magnet.',
       [('weakest', '磁极是最强的地方，方向反了。'), ('A is at the end', '这是看到的位置，要写科学词 pole。')])]),
  pr(YQ, parts=[op('Is object Y a magnet? Explain your answer.', 2, ['Explain'], '{Yes}. Y {repelled} magnet X. Only a {magnet} can {repel} another magnet.',
       [('No', '被推开，只有磁铁才会这样。'), ('attracted', 'Y 是被推开，不是被吸过去。'), ('Y is heavy', '这是日常理由，不是科学。')],
       ev=('txt', 'moved away'), evtip='“moved away” 是被推开 (repel)。只有磁铁能推开磁铁。', score=['1 分：Yes', '1 分：只有磁铁能推开另一个磁铁'])]),
  pr('This time, object Z moved towards magnet X and stuck to it. Ali said, “Z is definitely a magnet.”', parts=[op('Do you agree? Explain your answer.', 2, ['Do you agree', 'Explain'],
       '{No}. Z could be a {magnetic object}. Magnetic objects are also {attracted} to magnets.', [('Yes', '被吸住不一定是磁铁。'), ('repelled', 'Z 是被吸过去的。')])]),
  mcq('Which object will be attracted to a magnet?', ['a copper coin', 'an aluminium can', 'a steel pin', 'a plastic ruler'], 3, '铜、铝是金属，但不是磁性材料；只有铁、钢、镍、钴会被吸。'),
  mcq('Bar P is attracted to both poles of a magnet. Bar Q is attracted to one pole and repelled by the other. Bar R is not attracted at all. Which is correct?',
      ['P magnet · Q magnetic object · R non-magnetic', 'P magnetic object · Q magnet · R non-magnetic', 'P magnet · Q magnet · R magnetic object', 'P non-magnetic · Q magnet · R magnetic object'], 2,
      '两头都被吸 = 磁性物体；会被推开 = 磁铁；不吸 = 非磁性。', note='期末 A23 选了 (3)'),
  pr('Ben tested three magnets. Each magnet attracted 5 iron nails. He measured the furthest distance from which each magnet could attract the nails.', tbl=DS, parts=[
    op('Which magnet is the strongest? Explain your answer.', 6, ['strongest', 'Explain'], 'Magnet {K}. It attracted the nails from the {furthest} distance, so it is the {strongest}.',
       [('J', 'J 的距离最近，方向反了。'), ('weakest', '题目问最强的。')])]),
  mcq('A bar magnet is hung freely by a string. After it stops moving, which direction does it point?', ['towards a metal', 'towards the sunlight', 'East–West', 'North–South'], 4, '自由悬挂的磁铁停下来指南北。'),
  pr('Siti put a steel ball at the bottom of a tank of water. She moved a magnet slowly up the outside of the tank. The steel ball moved up together with the magnet.', parts=[
    op('Is the tank made of a magnetic or a non-magnetic material?', 1, ['magnetic or a non-magnetic'], 'The tank is made of a {non-magnetic} material.',
       [('magnetic', '磁力穿过缸吸住了钢球，缸是非磁性的。')]),
    op('Explain why the steel ball moved up.', 2, ['Explain why'], 'The {magnetic force} passes through the tank. The magnet {attracts} the steel ball.', [('repels', '钢球跟着磁铁走，是被吸。')]),
    op('Siti replaced the steel ball with an aluminium ball. What would she observe? Explain.', 8, ['What would', 'Explain'],
       'The aluminium ball {will not move}, because aluminium is {non-magnetic}.', [('will move up', '铝不会被磁铁吸。')])]),
  ]))

# ---------------- 电磁铁星 Making and Using Magnets ----------------
BT = [['Number of batteries', '1', '2', '3'], ['Number of clips attracted', '4', '7', '10']]
CO = [['Number of coils', '10', '20', '30'], ['Number of clips attracted', '2', '4', '6']]
P3.append(dict(id='emag', name='电磁铁星', en='Making and Using Magnets', icon='⚡', c=['#ffe066', '#c49a00'],
  must=['More batteries or more coils of wire make an electromagnet stronger.', 'Copper is a non-magnetic material, so it cannot be magnetised.', 'An electromagnet loses its magnetism when the switch is off.'],
  qs=[
  pr('An electromagnet was made with an iron nail.', tbl=BT, parts=[
    mc('How many more clips were attracted with 3 batteries than with 1 battery?', ['6', '3', '10', '14'], '6', '10 − 4 = 6。'),
    mc('Predict the number of clips with 4 batteries.', ['13', '11', '10', '16'], '13', '每多一个电池多 3 个：10 + 3 = 13。')]),
  pr('Different numbers of coils of wire were wound around an iron nail.', tbl=CO, parts=[
    op('What is the relationship between the number of coils and the number of clips attracted?', 4, ['relationship'],
       'As the {number of coils} increases, the {number of clips attracted} {increases}.',
       [('decreases', '2 → 4 → 6 是变多。'), ('number of batteries', '这个实验改的是线圈数。')],
       ev=('row', 1), evtip='2 → 4 → 6：线圈越多，吸的夹子越多。', score=['1 分：两样东西都写了，方向对'])]),
  pr('The iron nail was replaced with a copper nail. It attracted 0 clips.', note='期末 33(b) 空着', parts=[op('Explain why the copper nail attracted no clips.', 2, ['Explain why'],
       'Copper is a {non-magnetic} material, so it {cannot be magnetised}.', [('the battery is flat', '题目没说电池没电。')])]),
  mcq('Which will make an electromagnet stronger?\nA more batteries\nB more coils of wire\nC a longer nail with the same coils', ['A only', 'A and B only', 'B and C only', 'A, B and C'], 2, '电池多、线圈多都会更强；钉子长了线圈不变，不会更强。'),
  mcq('Set-up A: 1 battery, 10 coils. Set-up B: 2 batteries, 20 coils. Set-up C: 2 batteries, 10 coils. Arrange them from the weakest to the strongest.',
      ['A, B, C', 'A, C, B', 'B, C, A', 'C, A, B'], 2, 'A 最少，C 电池多了，B 电池和线圈都多。', note='期末 A24'),
  pr('A magnetic separator has a magnet inside drum X. Mixed materials move along a belt over the drum. Some fall into container P and some into container Q.', note='期末 34 写了“P 最深”', parts=[
    op('Explain why magnetic materials fall into container Q but non-magnetic materials fall into container P.', 2, ['Explain why', 'but'],
       'Drum X is a {magnet}. It {attracts} the magnetic materials, so they fall into Q. Non-magnetic materials are {not attracted}, so they fall into P.',
       [('P is darker', '这是看到的样子。'), ('repels', '磁铁不会推开没有磁性的东西。')])]),
  mcq('When the switch of an electromagnet is turned off, the iron nail ___.', ['becomes stronger', 'loses its magnetism', 'becomes copper', 'repels all metals'], 2, '断电就没有磁性了。'),
  pr('Jeff wanted to find out if the number of batteries affects the strength of an electromagnet.', parts=[
    op('Which variable is changed and which is measured?', 5, ['changed', 'measured'], 'Changed: the {number of batteries}. Measured: the {number of clips attracted}.',
       [('number of coils', '这个实验线圈不变。')]),
    op('Besides adding batteries, suggest another way to make the electromagnet stronger.', 9, ['suggest', 'stronger'],
       '{Increase the number of coils} of wire, so that the electromagnet becomes {stronger}.', [('use a copper rod', '铜不能被磁化。')]),
    op('Jeff used a wooden rod instead of an iron rod. Predict what he would see. Explain.', 8, ['Predict', 'Explain'], 'It {will not attract} any clips, because wood is {non-magnetic}.',
       [('will attract more', '木头不能被磁化。')])]),
  ]))

# ---------------- 陨石带 1 ----------------
P3.append(dict(id='met1', name='陨石带 1', en='Meteor Belt 1', icon='☄️', c=['#9aa0b5', '#4b5168'], meteor=True, must=[],
  qs=[
  pr('Bar G is attracted to both poles of a magnet.', parts=[op('Is G a magnet? Explain.', 2, ['Explain'],
       '{No}. G is a {magnetic object}. If G were a magnet, one end would {repel} the magnet.')]),
  pr('Water was poured onto materials X, Y and Z.', tbl=[['Material', 'X', 'Y', 'Z'], ['Water passed through (ml)', '70', '0', '30']], parts=[
    op('Which material is the most suitable for making a tent? Explain.', 6, ['most suitable', 'Explain'], 'Material {Y}. {No water} passed through it. It is {waterproof}, so the people inside stay dry.')]),
  pr('The table shows the number of days insect K spends in each stage.', tbl=[['Stage', 'egg', 'larva', 'pupa', 'adult'], ['Number of days', '4', '12', '6', '20']], parts=[
    tf('Insect K lays more eggs than a butterfly.', 'Not possible to tell', '表上只有天数，没有产卵数量。')]),
  pr('A frog has moist skin. A lizard has dry, scaly skin.', parts=[op('State one difference between a frog and a lizard.', 3, ['difference'], 'A frog has {moist skin}, but a lizard has {dry, scaly skin}.')]),
  pr('Bread kept in a warm, damp place grew mould faster than bread kept in a fridge.', parts=[op('Explain why.', 2, ['Explain why'], 'Fungi need {warmth} and {moisture} to grow. The fridge is {cold}.')]),
  pr('An iron rod was stroked with a magnet.', tbl=[['Number of strokes', '0', '10', '20', '30'], ['Number of pins attracted', '0', '3', '5', '7']], parts=[
    op('What is the relationship between the number of strokes and the number of pins attracted?', 4, ['relationship'], 'As the {number of strokes} increases, the {number of pins attracted} {increases}.')]),
  ]))
