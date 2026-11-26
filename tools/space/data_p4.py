from lib import *

P4 = []

# ---------------- 大树星 Plant Systems ----------------
CL = [['Time (min)', '5', '10', '15'], ['Height of red colour (cm)', '2', '4', '6']]
CT = [['Temperature of water (°C)', '15', '25', '35'], ['Height the red colour rose (cm)', '3', '5', '8']]
P4.append(dict(id='tree', name='大树星', en='Plant Systems', icon='🌳', c=['#7fe09a', '#2c7a3c'], seg='P4',
  must=['The roots absorb water and mineral salts from the soil.', 'The stem transports water, mineral salts and food to all parts of the plant.', 'The stem holds the plant upright so that the leaves can get enough light to make food.'],
  qs=[
  pr('A celery stalk was put in red water. The height of the red colour in the stalk was measured.', tbl=CL, parts=[
    mc('What was the height of the red colour at 10 minutes?', ['4 cm', '10 cm', '2 cm', '6 cm'], '4 cm', '找 10 min 那一列。'),
    op('What is the relationship between time and the height of the red colour?', 4, ['relationship'], 'As {time} increases, the {height of the red colour} {increases}.',
       [('decreases', '2 → 4 → 6 是变高。')])]),
  pr('The stem of a plant with white flowers was put in red water. After some time, the petals of the flowers turned red.', parts=[
    op('Explain why the petals turned red.', 2, ['Explain why'], 'The stem {transports} the red {water} up to the {flowers}.',
       [('food', '运上去的是红色的水，不是食物。'), ('absorbs', '茎是运送 (transports)，吸水的是根。'), ('the flowers are thirsty', '这是日常话，不是科学原因。')],
       ev=('txt', 'red water'), evtip='红色的水在下面，花在上面：水是顺着茎从下往上运上去的。', score=['1 分：茎运送水', '1 分：把水运到花'])]),
  pr('The roots of a plant were cut off. The plant wilted.', parts=[op('Explain why the plant wilted.', 2, ['Explain why'],
       'Without roots, the plant could not {absorb} {water}, so it wilted.', [('food', '根吸的是水和矿物盐，不是食物。')])]),
  mcq('What do the roots of a plant do?', ['absorb food from the soil', 'absorb water and mineral salts', 'make food', 'take in light'], 2, '根吸水和矿物盐；食物是叶子做的。'),
  mcq('Leaves contain a green substance that ___.', ['absorbs light so that the plant can make food', 'absorbs water', 'holds the plant upright', 'stores seeds'], 1, '叶绿素吸收光，植物才能做食物。'),
  pr('Most of the leaves of plant X were removed.', parts=[op('Predict how the growth of plant X will change. Explain.', 8, ['Predict', 'Explain'],
       'Plant X will {grow less}, because with fewer leaves, {less food} is made.', [('grow more', '叶子少了，方向反了。')])]),
  mcq('The stem holds the plant upright so that ___.', ['the roots get more water', 'the leaves can get enough light to make food', 'the flowers smell nice', 'the plant can move'], 2, '直立起来，叶子才晒得到光。'),
  pr('Three similar celery stalks were put in red water at different temperatures. After 30 minutes, the height the red colour had risen was measured.', tbl=CT, parts=[
    op('What is the aim of the experiment?', 5, ['aim'], 'To find out how the {temperature of the water} affects the {height} the red colour rises.', [('type of plant', '三根都是芹菜，没有改。')]),
    op('What is the relationship between the temperature and the height of the red colour?', 4, ['relationship'], 'As the {temperature} increases, the {height of the red colour} {increases}.',
       [('decreases', '3 → 5 → 8 是变高。')]),
    op('State one variable that must be kept the same.', 5, ['kept the same'], 'The {amount of water} in each beaker.', [('temperature of the water', '温度是改变的。')],
       ans='The **amount of water** (or the length of the stalk, the time).')]),
  ]))

# ---------------- 人体星 Human Systems ----------------
P4.append(dict(id='body', name='人体星', en='Human Systems', icon='🫁', c=['#ffb3a7', '#c4563f'], seg='P4',
  must=['Digestion begins in the mouth and ends in the small intestine.', 'Digested food is absorbed into the blood in the small intestine.', 'The large intestine absorbs water from undigested food.'],
  qs=[
  pr('In an adult, the small intestine is about 6.5 m long and the large intestine is about 1.5 m long.', parts=[
    mc('How much longer is the small intestine than the large intestine?', ['5 m', '8 m', '4.5 m', '6.5 m'], '5 m', '6.5 − 1.5 = 5 m。'),
    mc('In which part is digested food absorbed into the blood?', ['small intestine', 'large intestine', 'stomach', 'gullet'], 'small intestine', '小肠把消化好的食物吸收进血液。')]),
  pr('We chew our food before we swallow it.', parts=[op('Explain why we should chew our food well.', 2, ['Explain why'],
       'Chewing breaks food into {smaller} pieces, so more surfaces are in contact with {digestive juices} and digestion is {faster}.',
       [('bigger', '嚼碎是变小。'), ('slower', '方向反了。'), ('it tastes better', '这是日常话。')], score=['1 分：变成小块', '1 分：更多表面碰到消化液，消化更快'])]),
  pr('Food passes through the gullet to the stomach.', parts=[op('Explain why food is not digested in the gullet.', 2, ['Explain why'],
       'The gullet {does not produce} digestive juices. It only {pushes} the food to the stomach.', [('it is too short', '这不是原因，要写有没有消化液。')])]),
  mcq('Digestion begins in the ___ and ends in the ___.', ['stomach, large intestine', 'mouth, small intestine', 'gullet, stomach', 'mouth, large intestine'], 2, '口腔开始，小肠结束；大肠只吸水。'),
  mcq('What does the large intestine absorb?', ['digested food', 'water from undigested food', 'saliva', 'oxygen'], 2, '大肠吸收没被消化的食物里的水。'),
  pr('Both the small intestine and the large intestine absorb something.', parts=[op('State one difference between what the small intestine and the large intestine absorb.', 3, ['difference'],
       'The small intestine absorbs {digested food}, but the large intestine absorbs {water}.', [('Both absorb water', '问的是不同点。')])]),
  mcq('The skeletal system ___.', ['digests food', 'gives our body its shape and protects important parts', 'moves blood', 'takes in air'], 2, '骨骼给身体形状，保护内脏。'),
  pr('The digestive system: P mouth → Q gullet → R stomach → S small intestine → T large intestine.', parts=[
    op('Which parts produce digestive juices?', 1, ['digestive juices'], '{P}, {R} and {S}.', [('Q', '食道不分泌消化液。'), ('T', '大肠不分泌消化液。')]),
    op('Is there more digested food in R or in S? Explain.', 2, ['more', 'Explain'], '{S}. Food is {digested more} as it moves along the system.', [('R', '食物越往后消化得越多。')]),
    op('A large part of S was removed in an operation. Predict how this affects the person.', 8, ['Predict'],
       '{Less} digested food will be {absorbed} into the blood, so the person may become {weak}.', [('More', '小肠少了，吸收的就少。')])]),
  ]))

# ---------------- 气球星 Matter ----------------
P4.append(dict(id='matter', name='气球星', en='Matter', icon='🎈', c=['#ff9fd0', '#c23c86'], seg='P4',
  must=['Air has mass and occupies space.', 'Air can be compressed, but water cannot be compressed.', 'A liquid has a definite volume but no definite shape.'],
  qs=[
  pr('A measuring cylinder had 50 ml of water. A stone was lowered into it. The water level rose to 72 ml.', parts=[
    mc('What is the volume of the stone?', ['22 ml', '72 ml', '50 ml', '122 ml'], '22 ml', '72 − 50 = 22 ml。'),
    mc('Write the volume of the stone in cm³.', ['22 cm³', '2.2 cm³', '220 cm³', '72 cm³'], '22 cm³', '1 ml = 1 cm³。')]),
  pr('A flat ball weighed 586 g. After it was pumped with air, it weighed 597 g.', parts=[op('Explain why the ball became heavier.', 2, ['Explain why', 'heavier'],
       'Air has {mass}. The pumped ball has more {air}, so it is heavier.', [('volume', '“重了”说的是质量 (mass)。'), ('the ball is bigger', '这是看到的样子。')],
       ev=('txt', '597 g'), evtip='586 g → 597 g，重了 11 g：多出来的是打进去的空气。', score=['1 分：空气有质量', '1 分：球里的空气多了'])]),
  pr('A cup with a piece of paper stuck inside was pushed upside down into water. The paper stayed dry.', parts=[op('Explain why the paper stayed dry.', 2, ['Explain why'],
       'Air {occupies space}. The air in the cup {stopped} the water from entering.', [('has mass', '这里说的是空气占地方。')])]),
  mcq('Which one is matter?', ['light', 'heat', 'air', 'shadow'], 3, '空气有质量、占空间，是物质；光、热、影子不是。'),
  mcq('A 500 cm³ sealed box contains a 200 cm³ block of wood. The rest is air. What is the volume of the air?', ['200 cm³', '300 cm³', '500 cm³', '700 cm³'], 2, '500 − 200 = 300 cm³。'),
  pr('The plunger of a syringe filled with air can be pushed in. The plunger of a syringe filled with water cannot.', parts=[
    op('Explain the difference.', 3, ['difference'], 'Air {can be compressed}, but water {cannot be compressed}.', [('Air has mass', '这里比的是能不能压缩。')])]),
  mcq('A liquid has ___.', ['a definite shape and a definite volume', 'no definite shape but a definite volume', 'no definite shape and no definite volume', 'a definite shape but no definite volume'], 2, '液体体积一定，形状跟着容器变。'),
  pr('100 ml of dry sand was poured into 100 ml of water. The total volume was 160 ml.', parts=[
    mc('By how much was the total less than 200 ml?', ['40 ml', '60 ml', '160 ml', '100 ml'], '40 ml', '200 − 160 = 40 ml。'),
    op('Explain why the total volume was less than 200 ml.', 2, ['Explain why', 'less'], 'The water {filled the air spaces} between the {sand grains}.', [('the sand melted', '沙子不会化。')]),
    op('Predict the total volume if marbles were used instead of sand: less than, equal to or more than 200 ml?', 8, ['Predict'],
       'It will be {less than} 200 ml, because there are {air spaces} between the marbles too.', [('more than', '水只会填进空隙，不会变多。')])]),
  ]))

# ---------------- 光星 Light ----------------
SH = [['Sheet', 'A', 'B', 'C'], ['Light passing through (units)', '80', '0', '40']]
BW = [['Sheet', 'X', 'Y', 'Z'], ['Light passing through (units)', '80', '30', '0']]
P4.append(dict(id='light', name='光星', en='Light', icon='💡', c=['#fff07a', '#d6a800'], seg='P4',
  must=['We see an object when light from it enters our eyes.', 'Light travels in straight lines.', 'The Moon is not a source of light. It reflects light from the Sun.'],
  qs=[
  pr('A light sensor measured the amount of light passing through three sheets.', tbl=SH, parts=[
    mc('How much more light passed through A than through C?', ['40 units', '75 units', '35 units', '120 units'], '40 units', '80 − 40 = 40。'),
    mc('Which sheet is opaque?', ['B', 'A', 'C'], 'B', 'B 是 0：一点光都不通过 = 不透明（opaque）。')]),
  pr('Ali can see a book on his desk at night when the lamp is switched on.', parts=[op('Explain how Ali sees the book.', 2, ['Explain how'],
       'Light from the {lamp} is {reflected} from the book into his {eyes}.',
       [('His eyes shine on the book', '光不是从眼睛出来的，方向反了。'), ('book', '光是从灯来的。')],
       ev=('txt', 'lamp is switched on'), evtip='灯开着 = 有光源。光从灯 → 书 → 眼睛。', score=['1 分：光从灯照到书上', '1 分：书把光反射进眼睛'])]),
  pr('The lamp is switched off and the room is completely dark.', parts=[op('Explain why Ali cannot see the book.', 2, ['Explain why'],
       'There is {no light source}, so {no light} is reflected from the book into his eyes.', [('his eyes are closed', '题目没这样说。')])]),
  mcq('Which one is NOT a source of light?', ['the Sun', 'fireworks', 'the Moon', 'a lighted bulb'], 3, '月亮自己不发光，它反射太阳光。烟花是人造光源。'),
  mcq('Which shows how we see a tree in the day?', ['eye → tree', 'Sun → eye → tree', 'Sun → tree → eye', 'tree → Sun → eye'], 3, '光源 → 物体 → 眼睛。'),
  pr('A light sensor measured the light passing through three sheets.', tbl=BW, parts=[
    op('Which sheet is the most suitable for a bathroom window that lets in light but stops people from seeing in clearly? Explain.', 6, ['most suitable', 'Explain'],
       'Sheet {Y}. It allows {some light} to pass through. It is {translucent}, so people cannot see in clearly.',
       [('X', 'X 让大部分光通过，外面能看清。'), ('Z', 'Z 不透光，浴室会很黑。')])]),
  mcq('Why is the light-sensor experiment done in a dark room?', ['so it is cooler', 'so that the light measured comes only from the torch', 'so the sheets do not move', 'so we can see better'], 2, '不让别的光进来，量到的只是手电筒的光。'),
  pr('Mei lined up three cards with a hole in each. She could see the candle flame only when the holes were in a straight line.', parts=[
    op('What does this show about light?', 1, ['show'], 'Light {travels in straight lines}.', [('light can bend', '光沿直线走，不会拐弯。')]),
    op('The middle card is moved to one side. Predict what happens. Explain.', 8, ['Predict', 'Explain'], 'She {will not see} the flame, because the light is {blocked} by the card.',
       [('will see', '光被卡片挡住了。')]),
    op('State one thing she must keep the same.', 5, ['keep the same'], 'The {size of the holes}.', [('position of the middle card', '这是她改变的。')],
       ans='The **size of the holes** (or the distance between the cards).')]),
  ]))

# ---------------- 影子星 Shadows ----------------
SD = [['Distance between torch and toy (cm)', '10', '20', '30'], ['Height of shadow (cm)', '30', '20', '12']]
P4.append(dict(id='shadow', name='影子星', en='Shadows', icon='🔦', c=['#c9b5ff', '#5b3fc4'], seg='P4',
  must=['A shadow is formed when an opaque object blocks light.', 'The closer the object is to the light source, the bigger the shadow.', 'A translucent object forms a lighter shadow.'],
  qs=[
  pr('A torch shone on a toy. The height of its shadow on a screen was measured.', tbl=SD, parts=[
    mc('What was the height of the shadow when the toy was 20 cm from the torch?', ['20 cm', '30 cm', '12 cm', '10 cm'], '20 cm', ''),
    op('What is the relationship between the distance and the height of the shadow?', 4, ['relationship'],
       'As the {distance between the torch and the toy} increases, the {height of the shadow} {decreases}.', [('increases', '30 → 20 → 12 是变小。')])]),
  pr('A torch shines on a toy. A shadow of the toy is formed on the screen.', parts=[op('Explain how the shadow of the toy is formed.', 2, ['Explain how'],
       'Light travels in {straight lines}. The {opaque} toy {blocks} the light, so a shadow is formed.',
       [('transparent', '透明的东西不挡光。'), ('reflects', '影子是光被挡住，不是反射。'), ('the toy is dark', '这是看到的样子。')],
       ev=('txt', 'torch shines'), evtip='光从手电筒出来，沿直线走，被玩具挡住，后面就有影子。', score=['1 分：光沿直线传播', '1 分：不透光的玩具挡住了光'])]),
  pr('The toy is moved closer to the torch.', parts=[op('Predict what happens to the shadow. Explain.', 8, ['Predict', 'Explain'],
       'The shadow will become {bigger}, because the toy {blocks more light}.', [('smaller', '离光源越近，影子越大。')])]),
  mcq('When is your shadow the longest?', ['early morning', 'noon', '1 p.m.', 'when it rains'], 1, '太阳低的时候影子最长；中午最短。'),
  mcq('A translucent sheet forms a ___ shadow than an opaque sheet.', ['darker', 'lighter', 'bigger', 'sharper'], 2, '半透明的东西让一部分光通过，影子淡一些。'),
  pr('An opaque sheet and a translucent sheet were placed in front of a torch.', parts=[op('State one difference between the two shadows.', 3, ['difference'],
       'The shadow of the opaque sheet is {darker}, but the shadow of the translucent sheet is {lighter}.', [('Both are dark', '问的是不同点。')])]),
  mcq('A cone is placed with its point facing the torch. What is the shape of its shadow?', ['triangle', 'circle', 'square', 'no shadow'], 2, '从尖的那头照，看到的是圆底，影子是圆的。'),
  pr('Ravi wants to find out how the distance between the torch and a toy affects the size of the shadow.', parts=[
    op('What is the changed variable?', 5, ['changed variable'], 'The {distance between the torch and the toy}.', [('size of the shadow', '这是量出来的。')]),
    op('State one variable he must keep the same.', 5, ['keep the same'], 'The {distance between the toy and the screen}.', [('distance between the torch and the toy', '这是改变的。')],
       ans='The **distance between the toy and the screen** (or the same toy, the same torch).'),
    op('Why should he do the experiment in a dark room?', 2, ['Why'], 'So that the shadow is formed {only by light from the torch}.', [('so it is cooler', '和温度没关系。')])]),
  ]))

# ---------------- 温度星 Heat ----------------
P4.append(dict(id='temp', name='温度星', en='Heat', icon='🌡️', c=['#ff8f8f', '#b8343a'], seg='P4',
  must=['Heat is a form of energy.', 'Temperature is a measure of how hot or cold an object is.', 'A thermometer measures temperature accurately.'],
  qs=[
  pr('Two thermometers were put in water A and water B. A read 35°C. B read 60°C.', parts=[
    mc('What is the difference in temperature?', ['25°C', '95°C', '35°C', '15°C'], '25°C', '60 − 35 = 25°C。'),
    mc('Which water is hotter?', ['B', 'A'], 'B', '60°C 比 35°C 高。')]),
  pr('Mei used a thermometer to find out how hot her bath water was.', parts=[op('What is temperature?', 1, ['What is'], 'Temperature is a measure of {how hot or cold} an object is.',
       [('how much heat', '那是热，不是温度。'), ('a form of energy', '热才是能量。')], score=['1 分：how hot or cold'])]),
  pr('Heat and temperature are not the same.', parts=[op('State one difference between heat and temperature.', 3, ['difference'],
       'Heat is {a form of energy}, but temperature is a measure of {how hot or cold} an object is.', [('Both are energy', '温度不是能量。')])]),
  mcq('Which one is NOT a source of heat?', ['the Sun', 'a candle flame', 'a woollen cap', 'a lighted bulb'], 3, '毛线帽只是让热散得慢，本身不发热。'),
  mcq('Which is the correct way to use a laboratory thermometer?', ['Hold the bulb with your hand.', 'Keep the bulb fully in the liquid and wait until the red liquid stops moving.', 'Read it as soon as you put it in.', 'Put it on a solid to measure.'], 2, '泡在液体里，等红线不动再读。'),
  pr('Mei wants to find the temperature of a cup of water.', parts=[op('Explain why she should use a thermometer instead of her hand.', 2, ['Explain why'],
       'Our hand can only tell {roughly} how hot or cold the water is. A thermometer measures the temperature {accurately}.', [('hands are dirty', '这不是科学原因。')])]),
  mcq('Which thermometer can measure the temperature of the surface of a solid?', ['laboratory thermometer', 'infrared thermometer', 'a ruler', 'a measuring cylinder'], 2, '红外温度计不用碰到就能量表面温度。'),
  pr('100 ml of water at 70°C was mixed with 100 ml of water at 20°C.', parts=[
    op('Predict whether the temperature of the mixture will be lower than 20°C, between 20°C and 70°C, or higher than 70°C.', 8, ['Predict'], 'It will be {between 20°C and 70°C}.',
       [('higher than 70°C', '冷水不会让它更热。')]),
    op('Explain your answer.', 2, ['Explain'], 'Heat flows from the {hot} water to the {cold} water.', [('coldness', '“冷”不会传递。')],
       ans='Heat flows from the **hot** water to the **cold** water, so the hot water becomes cooler and the cold water becomes warmer.'),
    mc('The mixture was left in a room at 30°C for a long time. What will its temperature be?', ['30°C', '45°C', '20°C', '70°C'], '30°C', '放久了，和房间一样。')]),
  ]))

# ---------------- 热流星 Effects of Heat ----------------
HW = [['Time (min)', '0', '5', '10', '15', '20'], ['Temperature (°C)', '80', '70', '62', '56', '52']]
CP = [['Cup', 'P', 'Q', 'R'], ['Temperature after 15 min (°C)', '70', '50', '60']]
RD = [['Rod', 'Metal', 'Plastic', 'Wood'], ['Time taken for the bead to drop (min)', '2', '7', '9']]
HQ = 'Ravi poured hot water into a cup and measured its temperature every 5 minutes. The room temperature was 30°C.'
P4.append(dict(id='heat', name='热流星', en='Effects of Heat', icon='🔥', c=['#ffb36b', '#d1561a'], seg='P4',
  must=['Heat flows from a hotter object to a colder object.', 'X gains heat, so its temperature increases. X loses heat, so its temperature decreases.', 'Most things expand when they gain heat and contract when they lose heat.'],
  qs=[
  pr(HQ, tbl=HW, parts=[
    mc('What was the temperature of the water at 10 minutes?', ['62°C', '10°C', '70°C', '56°C'], '62°C', '读数要写单位 °C。'),
    mc('By how many degrees did the temperature drop in 20 minutes?', ['28°C', '52°C', '80°C', '18°C'], '28°C', '80 − 52 = 28°C。')]),
  pr('A bowl of soup at 75°C was left on a table. The room temperature was 28°C. After 30 minutes, the soup was 40°C.', parts=[op('Explain why the temperature of the soup decreased.', 2, ['Explain why', 'decreased'],
       'The hot soup {lost heat} to the {cooler} surroundings, so its temperature {decreased}.',
       [('gained heat', '温度下降是失去热。'), ('gave coldness', '“冷”不会传递。')],
       ev=('txt', '28°C'), evtip='汤 75°C，房间 28°C：汤比周围热，热从汤流到周围。', score=['1 分：汤失去热，流到更冷的周围'])]),
  pr('Mei put an ice cube in a cup and left it on the table. After a while, the ice cube melted.', parts=[op('Explain why the ice cube melted.', 2, ['Explain why'],
       'The ice cube {gained heat} from the {warmer} surroundings, so it melted.', [('lost coldness', '“冷”不会传递。'), ('lost heat', '冰化了是得到热。')])]),
  mcq('Which statement is correct?', ['Temperature is a form of energy.', 'Heat is the same as temperature.', 'Heat flows between two objects of different temperatures.', 'We can measure temperature accurately by touching an object.'], 3,
      '热才是能量；热和温度不一样；手摸不准。'),
  mcq('A metal spoon and a plastic spoon were left in the same room for a day. The metal spoon feels colder to touch. Why?',
      ['The metal spoon is at a lower temperature.', 'Metal is a better conductor of heat, so our hand loses heat to it faster.', 'The plastic spoon gives heat to our hand.', 'The metal spoon gives coldness to our hand.'], 2,
      '同一个房间，两把勺子温度一样；金属导热快，手的热流得快，所以觉得冷。'),
  pr('Ali poured the same amount of hot water at 80°C into three cups made of materials P, Q and R. After 15 minutes he measured the temperature.', tbl=CP, parts=[
    op('Which cup is the most suitable for keeping a drink hot? Explain your answer.', 6, ['most suitable', 'hot'],
       'Cup {P}. It had the {highest temperature} after 15 minutes. P is the {poorest conductor of heat}, so the drink loses heat most slowly.',
       [('Q', 'Q 温度最低，方向反了。'), ('best conductor of heat', '最导热的杯子会让饮料凉得最快。')])]),
  mcq('Gaps are left between the metal parts of a bridge. Why?', ['To let rainwater flow away.', 'To make the bridge lighter.', 'To give the metal space to expand on a hot day.', 'To let the metal lose heat faster.'], 3, '热天金属得到热会膨胀。'),
  pr('Jun stuck a bead with wax on one end of three rods made of metal, plastic and wood. He put the other end of each rod into the same beaker of hot water.', tbl=RD, parts=[
    op('What is the aim of the experiment?', 5, ['aim'], 'To find out how the {type of material} of the rod affects the {time taken} for the bead to drop.', [('amount of wax', '蜡是不变的。')]),
    op('State one variable Jun must keep the same.', 5, ['keep the same'], 'The {length} of the rods.', [('type of material', '材料是改变的。')],
       ans='The **length** (or thickness) of the rods, or the **amount of wax**.'),
    op('Compare the metal rod and the wood rod. Explain the difference in results.', 3, ['Compare', 'Explain'],
       'The bead on the metal rod dropped {faster than} the bead on the wood rod, because metal is a {better conductor of heat}.', [('slower than', '金属 2 分钟，木头 9 分钟。')])]),
  ]))

# ---------------- 陨石带 2 ----------------
P4.append(dict(id='met2', name='陨石带 2', en='Meteor Belt 2', icon='☄️', c=['#9aa0b5', '#4b5168'], seg='P4', meteor=True, must=[],
  qs=[
  pr('A metal pot has a plastic handle.', parts=[op('Explain why the handle is made of plastic.', 2, ['Explain why'], 'Plastic is a {poor conductor of heat}, so the handle does not get {hot} quickly.')]),
  pr('Iced water was poured into cups J, K and L. The temperature was measured after 20 minutes.', tbl=[['Cup', 'J', 'K', 'L'], ['Temperature after 20 min (°C)', '12', '20', '8']], parts=[
    op('Which cup is the best for keeping a drink cold? Explain.', 6, ['best', 'Explain'], 'Cup {L}. It had the {lowest temperature}, so L is the {poorest conductor of heat}.')]),
  pr('A dented ping pong ball was put into hot water. It became round again.', parts=[op('Explain why the ball became round again.', 2, ['Explain why'],
       'The air inside {gains heat} from the hot water and {expands}, pushing the dent out.')]),
  pr('A toy was placed at different distances from a torch.', tbl=[['Distance (cm)', '10', '20', '30'], ['Height of shadow (cm)', '24', '16', '10']], parts=[
    op('Predict the height of the shadow at 40 cm: more or less than 10 cm?', 8, ['Predict'], 'It will be {less than 10 cm}, because as the distance increases, the shadow becomes {shorter}.')]),
  pr('A thermometer in the garden showed 34°C at 2 p.m. and 27°C at 8 p.m.', parts=[
    mc('By how many degrees did the temperature fall?', ['7°C', '61°C', '27°C', '6°C'], '7°C', '34 − 27 = 7°C。读数要写单位。')]),
  pr('Food passes through the gullet and the small intestine.', parts=[op('State one difference between the small intestine and the gullet.', 3, ['difference'],
       'The small intestine {produces digestive juices}, but the gullet {does not}.')]),
  ]))
